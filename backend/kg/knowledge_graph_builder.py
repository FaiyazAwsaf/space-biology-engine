import os
import json
import re
import networkx as nx
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification

# --- Configuration ---
MODEL_DIR = r"C:\Users\Sameer Roy\Desktop\nsac\models\models\ner_v1_15papers"
INPUT_CHUNKS_FILE = 'pone.0104830_LS_Tasks.json'
OUTPUT_GRAPH_FILE = 'knowledge_graph.json'
OUTPUT_GRAPH_GML = 'knowledge_graph.gml' # Alternative format for visualization tools

# --- Helper Functions ---

def load_text_chunks(file_path):
    """Loads all text chunks from the unified JSON file."""
    if not os.path.exists(file_path):
        print(f"FATAL ERROR: Input chunk file not found at '{file_path}'. Ensure it contains all 70 papers.")
        return []
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def clean_entity_name(name):
    """Basic cleaning for entities to ensure consistency."""
    return re.sub(r'[^a-zA-Z0-9\s-]', '', name).strip().lower()

# --- Main Graph Construction ---

def build_knowledge_graph():
    print("--- Phase II, Step 5: Knowledge Graph Builder Started ---")

    # 1. Load Trained NER Pipeline
    if not os.path.exists(MODEL_DIR):
        print(f"FATAL ERROR: NER model not found at {MODEL_DIR}. Ensure training is complete.")
        return

    # Load the NER pipeline using the fine-tuned model
    # The pipeline automatically handles tokenization and label mapping
    try:
        ner_pipeline = pipeline("ner", model=MODEL_DIR, tokenizer=MODEL_DIR)
        print("NER Model loaded successfully.")
    except Exception as e:
        print(f"FATAL ERROR loading NER pipeline: {e}")
        return

    # 2. Load Input Data
    all_chunks = load_text_chunks(INPUT_CHUNKS_FILE)
    if not all_chunks:
        return

    # 3. Initialize Graph and Entity Tracking
    G = nx.Graph()
    # Stores clean_name -> actual_name mapping for consistent visualization
    entity_map = {} 
    
    # 4. Process Chunks and Extract Entities
    print(f"Processing {len(all_chunks)} text chunks to extract entities...")
    
    for chunk in all_chunks:
        text = chunk.get('text', '')
        metadata = chunk.get('metadata', {})
        document_id = metadata.get('document_filename', 'UNKNOWN')
        
        if not text:
            continue
            
        # Run NER inference on the text chunk
        try:
            results = ner_pipeline(text)
        except Exception as e:
            # Skip chunks that cause inference errors (usually due to length)
            # This is a common issue; use longer sequence length if available.
            print(f"Skipping chunk from {document_id} due to inference error: {e}")
            continue

        current_chunk_entities = []
        
        # Consolidate tokens into full entities (the NER pipeline does most of this)
        for entity in results:
            entity_type = entity['entity'].split('-')[-1] # Extracts 'Methodology' from 'B-Methodology'
            entity_name = entity['word'].strip()
            clean_name = clean_entity_name(entity_name)

            # Ensure we only track defined types and that the name is meaningful
            if entity_type in ["Methodology", "Dataset", "Key_Finding", "Tool_Library"] and len(clean_name) > 2:
                current_chunk_entities.append((clean_name, entity_type))
                entity_map[clean_name] = entity_name
                
                # Add Node if it doesn't exist
                if not G.has_node(clean_name):
                    G.add_node(clean_name, label=entity_name, type=entity_type, papers=[document_id])
                elif document_id not in G.nodes[clean_name].get('papers', []):
                    G.nodes[clean_name]['papers'].append(document_id)

        # 5. Connect Entities (Create Edges/Relationships)
        # We create a simple edge between every pair of entities found in the same chunk.
        
        for i in range(len(current_chunk_entities)):
            for j in range(i + 1, len(current_chunk_entities)):
                source_clean_name, source_type = current_chunk_entities[i]
                target_clean_name, target_type = current_chunk_entities[j]
                
                # Use a specific edge label based on the entity types for better meaning
                edge_label = f"{source_type}_links_{target_type}"

                if G.has_edge(source_clean_name, target_clean_name):
                    # Increment weight/count if the edge already exists
                    G[source_clean_name][target_clean_name]['weight'] += 1
                else:
                    # Create a new edge
                    G.add_edge(source_clean_name, target_clean_name, 
                               label=edge_label, 
                               weight=1, 
                               source_doc=document_id)

    # 6. Save the Graph
    print(f"Graph construction complete. Nodes: {G.number_of_nodes()}, Edges: {G.number_of_edges()}")
    
    # Save as JSON (Node-Link format) for easy loading in FastAPI
    graph_data = nx.node_link_data(G)
    with open(OUTPUT_GRAPH_FILE, 'w') as f:
        json.dump(graph_data, f, indent=2)
    print(f"✅ Knowledge Graph (JSON) saved to: {OUTPUT_GRAPH_FILE}")
    
    # Optional: Save in GML format for external graph visualization tools
    nx.write_gml(G, OUTPUT_GRAPH_GML)
    print(f"✅ Knowledge Graph (GML) saved to: {OUTPUT_GRAPH_GML}")


if __name__ == '__main__':
    build_knowledge_graph()

