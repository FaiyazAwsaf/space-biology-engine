"""
Minimal FastAPI server for testing backend connectivity
This version loads without ML dependencies for quick testing
"""

import os
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')

# Initialize FastAPI app
app = FastAPI(title="Space Biology Engine - Health Check", version="1.0.0")

# Add CORS middleware
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

# Request/Response models
class QueryRequest(BaseModel):
    question: str
    filters: dict = None

class ApiResponse(BaseModel):
    answer: str
    source_type: str
    confidence_warning: bool
    citations: list = []
    knowledge_graph_data: dict = {}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Space Biology Engine API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "components": {
            "fastapi": True,
            "cors": True,
            "api_key_configured": bool(GEMINI_API_KEY),
            "ml_models": False,  # Not loaded in this minimal version
        },
        "note": "This is the minimal version for testing connectivity"
    }

@app.get("/domains")
async def get_available_domains():
    """Get list of available research domains"""
    return {
        "domains": ["bone", "immune", "neuro", "plants", "microbiome", "methods"]
    }

@app.post("/ask")
async def query_knowledge_base(request: QueryRequest):
    """Mock query endpoint for testing"""
    return ApiResponse(
        answer=f"This is a test response for: {request.question}. The full ML pipeline is not loaded in this minimal version. Please use the full hybrid_api.py for real responses.",
        source_type="Test Response",
        confidence_warning=True,
        citations=[],
        knowledge_graph_data={}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)