import os
import json
import asyncio
import networkx as nx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import re
import requests
import time
from contextlib import asynccontextmanager # 💡 Added for Lifespan Events
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Configuration ---

# Use relative paths for Linux environment
MODEL_DIR = '../models/models/ner_v1_15papers'
KG_FILE = 'knowledge_graph.json'
CHROMA_DB_DIR = 'chroma_db'
COLLECTION_NAME = 'nasa_papers_collection'
EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash-latest')
API_KEY = os.getenv('GEMINI_API_KEY', '')

# --- Global Components ---
# app initialization is now at the end of the setup block
ner_pipeline = None
kg_graph = None
chroma_collection = None
embedding_function = None

# --- API Data Models ---

class Query(BaseModel):
    """User input model for the /ask endpoint."""
    question: str
    filters: dict = {} # e.g., {"entity_type": ["Methodology", "Dataset"]}

class Citation(BaseModel):
    """Output model for a single citation/evidence card."""
    source: str
    filename: str
    chunk_index: int
    text: str

class ApiResponse(BaseModel):
    """The complete structured API response."""
    answer: str
    source_type: str # e.g., "Internal Research Papers RAG" or "General Knowledge Model"
    confidence_warning: bool
    citations: list[Citation]
    knowledge_graph_data: dict # Data structure for front-end visualization (optional)

# --- Initialization & Setup (Happens once on startup) ---

def load_knowledge_graph():
    """Loads the NetworkX Knowledge Graph from JSON."""
    if not os.path.exists(KG_FILE):
        print(f"KG File not found at {KG_FILE}. Filtering will be disabled.")
        return nx.Graph()
    try:
        with open(KG_FILE, 'r') as f:
            data = json.load(f)
        return nx.node_link_data(data)
    except Exception as e:
        print(f"Error loading KG: {e}")
        return nx.Graph()

def load_rag_components():
    """Loads the ChromaDB client and embedding model."""
    global chroma_collection, embedding_function
    try:
        client = PersistentClient(path=CHROMA_DB_DIR)
        embedding_function_st = SentenceTransformer(EMBEDDING_MODEL)
        
        # Define a lambda wrapper for ChromaDB's use
        def chroma_embed_func(texts):
            return embedding_function_st.encode(texts).tolist()

        chroma_collection = client.get_collection(
            name=COLLECTION_NAME,
            embedding_function=chroma_embed_func # Use the loaded ST model
        )
        print("ChromaDB collection loaded successfully.")
    except Exception as e:
        print(f"Error loading ChromaDB or Sentence Transformer: {e}")
        chroma_collection = None

def load_ner_model():
    """Loads the fine-tuned NER model for routing."""
    global ner_pipeline
    if not os.path.exists(MODEL_DIR):
        print(f"FATAL: NER model not found at {MODEL_DIR}. Routing/Filtering will be impaired.")
        return
    try:
        # Load pipeline using the fine-tuned model path
        ner_pipeline = pipeline("ner", model=MODEL_DIR, tokenizer=MODEL_DIR)
        print(f"NER Pipeline loaded from {MODEL_DIR}.")
    except Exception as e:
        print(f"Error loading NER model: {e}")
        ner_pipeline = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the API.
    Replaces the deprecated @app.on_event("startup") decorator.
    """
    global kg_graph
    
    # --- Startup Logic (Runs before the application starts accepting requests) ---
    print("Starting API startup process (Loading NER, RAG, and KG)...")
    
    # Use concurrent execution for faster startup
    await asyncio.gather(
        asyncio.to_thread(load_ner_model),
        asyncio.to_thread(load_rag_components)
    )
    kg_graph = load_knowledge_graph()
    print("API startup complete.")
    
    yield # API is ready to receive requests
    
    # --- Shutdown Logic (Runs after the application exits) ---
    print("API shutdown completed.")

# Initialize the FastAPI app, passing the new lifespan function
app = FastAPI(title="Hybrid RAG Knowledge API", version="1.0.0", lifespan=lifespan)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "https://space-biology-engine.vercel.app",  # Production domain
        "https://*.vercel.app",   # Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# --- Core Logic ---

def gemini_api_call_with_retry(payload):
    """
    Handles POST request to Gemini API with exponential backoff.
    """
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={API_KEY}"
    max_retries = 5
    delay = 1

    for attempt in range(max_retries):
        try:
            response = requests.post(
                api_url, 
                headers={'Content-Type': 'application/json'}, 
                data=json.dumps(payload)
            )
            response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
            return response.json()

        except requests.exceptions.RequestException as e:
            if attempt < max_retries - 1:
                # Retry on connection error or rate limit (status code check simplified by raise_for_status)
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                # If all retries fail, raise an HTTPException
                raise HTTPException(status_code=500, detail=f"Gemini API request failed after {max_retries} attempts: {e}")
    
    return None # Should be unreachable

def get_ner_entities(text: str) -> list[str]:
    """Extracts NER entities and returns their clean names."""
    if not ner_pipeline:
        return []
    
    results = ner_pipeline(text)
    entities = set()
    for entity in results:
        # Extract the full entity name (e.g., 'Transformer model')
        entity_name = entity['word'].strip()
        # Clean the name for mapping to KG (e.g., 'transformer model')
        clean_name = re.sub(r'[^a-zA-Z0-9\s-]', '', entity_name).strip().lower()
        if len(clean_name) > 2:
            entities.add(clean_name)
    return list(entities)

# --- The Main Endpoint ---

@app.post("/ask", response_model=ApiResponse)
async def ask_question(query: Query):
    """
    Handles a user query, routing it through RAG if domain-specific, 
    or using the general LLM model if not.
    """
    question = query.question
    
    # 1. QUESTION CLASSIFICATION / ROUTING
    domain_entities = get_ner_entities(question)
    is_domain_query = bool(domain_entities) or bool(query.filters)
    
    # Initialize response components
    source_type = "General Knowledge Model"
    confidence_warning = False
    rag_context = ""
    citations_data = []
    
    # 2. RAG RETRIEVAL PATH (If domain-specific or filtered)
    if is_domain_query and chroma_collection:
        source_type = "Internal Research Papers RAG"
        
        # FUTURE IMPLEMENTATION: Apply KG filtering here using query.filters 
        
        # Retrieve context from ChromaDB
        results = chroma_collection.query(
            query_texts=[question],
            n_results=5, # Retrieve top 5 chunks
            include=['documents', 'metadatas']
        )
        
        # 3. CONTEXT CONSTRUCTION
        context_list = []
        
        if results and results.get('documents'):
            for i in range(len(results['documents'][0])):
                doc = results['documents'][0][i]
                meta = results['metadatas'][0][i]
                
                # Format context for the LLM: include citation marker
                citation_marker = f"[ID {i+1}]"
                
                context_list.append(f"Document Chunk {citation_marker}: {doc}")
                
                # Store citation data for post-processing
                citations_data.append(Citation(
                    source=f"Citation {i+1}",
                    filename=meta.get('document_filename', 'N/A'),
                    chunk_index=meta.get('chunk_index', -1),
                    text=doc
                ))
            
            rag_context = "\n---\n".join(context_list)
        
        if not rag_context:
            # If RAG path was attempted but failed to find relevant results, switch to general mode
            is_domain_query = False
            confidence_warning = True # Low confidence fallback
            source_type = "General Knowledge Model (RAG Failed)"

    # 4. LLM GENERATION PAYLOAD

    if is_domain_query:
        # RAG prompt (high confidence expectation)
        system_prompt = (
            "You are a NASA Research Analyst. Answer the user's question using ONLY the context provided in the 'Document Chunks'. "
            "For every sentence you generate that uses a piece of evidence, you MUST append the corresponding citation marker (e.g., [ID 1], [ID 3]) to the end of the sentence. "
            "If the context does not contain the answer, state that clearly."
        )
        user_query = f"Question: {question}\n\nContext:\n{rag_context}"
        tools_setting = [] # Do not use search grounding for RAG
    else:
        # General knowledge prompt (low confidence warning)
        system_prompt = (
            "You are a helpful assistant. Answer the user's question. Since you are using general knowledge, your answer should be treated with low confidence regarding specific research data."
        )
        user_query = question
        confidence_warning = True
        tools_setting = [{"google_search": {}}] # Use search grounding for general Q&A

    payload = {
        "contents": [{"parts": [{"text": user_query}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "tools": tools_setting
    }

    # 5. Call Gemini API
    try:
        llm_response = gemini_api_call_with_retry(payload)
        answer_text = llm_response.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'Error: No response from LLM.')
    except HTTPException as e:
        answer_text = f"API Error: {e.detail}"
        confidence_warning = True
        source_type = "LLM API Failure"
    
    # 6. Post-Process and Finalize Response
    
    # Extract KG data for the frontend dashboard/filtering sidebar
    kg_output = {}
    if kg_graph:
        for entity_name in domain_entities:
            # Look up related nodes in the graph for visualization/suggestions
            if kg_graph.has_node(entity_name):
                # Simple lookup: returns the node attributes and immediate neighbors
                kg_output[entity_name] = {
                    "type": kg_graph.nodes[entity_name].get('type'),
                    "papers": kg_graph.nodes[entity_name].get('papers', []),
                    "neighbors_count": len(list(kg_graph.neighbors(entity_name)))
                }

    return ApiResponse(
        answer=answer_text,
        source_type=source_type,
        confidence_warning=confidence_warning,
        citations=citations_data,
        knowledge_graph_data=kg_output
        )   

@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "components": {
            "ner_model": ner_pipeline is not None,
            "rag_system": chroma_collection is not None,
            "knowledge_graph": kg_graph is not None,
            "gemini_api_key": bool(API_KEY),
        }
    }

@app.get("/domains")
async def get_available_domains():
    """Get list of available research domains"""
    return {
        "domains": ["bone", "immune", "neuro", "plants", "microbiome", "methods"]
    }
