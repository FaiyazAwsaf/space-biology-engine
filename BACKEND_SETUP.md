# 🚀 Backend Integration Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd backend
pip3 install -r requirements.txt
```

### Step 2: Configure API Key

```bash
# Edit backend/.env and add your Gemini API key:
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

### Step 3: Start Backend Server

```bash
cd backend/kg
./start_backend.sh
# OR manually: uvicorn hybrid_api:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Test API

```bash
# In another terminal:
python3 test_integration.py
```

### Step 5: Start Frontend

```bash
cd frontend
npm run dev
```

## 🔧 Backend Architecture

Your backend includes:

- **FastAPI Server**: REST API with async processing
- **CORS Enabled**: Allows frontend requests from localhost and production
- **Named Entity Recognition**: DistilBERT model for research entity extraction
- **RAG System**: ChromaDB vector database with research papers
- **Knowledge Graph**: NetworkX graph with 1.6M+ research relationships
- **Gemini Integration**: AI-powered response generation

## 📡 API Endpoints

### Health Check

```bash
GET http://localhost:8000/health
# Returns: server status, component health, API key status
```

### Available Domains

```bash
GET http://localhost:8000/domains
# Returns: ["bone", "immune", "neuro", "plants", "microbiome", "methods"]
```

### Query Research

```bash
POST http://localhost:8000/query
Content-Type: application/json

{
  "question": "What are the effects of microgravity on bone density?",
  "filters": {
    "organism": ["human"],
    "tissueSystem": ["bone"]
  }
}
```

## 🔍 Component Status

Check what's loaded:

- **NER Model**: `../models/models/ner_v1_15papers/` (254MB)
- **Knowledge Graph**: `knowledge_graph.json` (39MB)
- **Vector Database**: `chroma_db/` (ChromaDB collection)
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2

## 🐛 Troubleshooting

### If Backend Won't Start:

1. **Check Python Version**: Requires Python 3.8+
2. **Install Dependencies**: `pip3 install -r requirements.txt`
3. **Check Paths**: Model files should be in `backend/models/`
4. **API Key**: Must set `GEMINI_API_KEY` in `.env`

### If API Calls Fail:

1. **CORS Issues**: Check browser console for CORS errors
2. **Port Conflicts**: Backend runs on :8000, frontend on :5173
3. **Network**: Ensure both services are running

### If Responses Are Slow:

- **First Query**: NER model loads on first request (~30 seconds)
- **Subsequent**: Should be 5-7 seconds as configured
- **Large Models**: ChromaDB and transformers are memory-intensive

## 📊 Performance Notes

- **Memory Usage**: ~2-4GB RAM for full ML pipeline
- **Disk Space**: 1.5GB for models + knowledge graphs (via Git LFS)
- **First Startup**: 1-2 minutes to load all models
- **Query Time**: 5-7 seconds (includes artificial delay)

## 🎯 Integration Testing

The `test_integration.py` script verifies:

1. ✅ Backend health and component loading
2. ✅ Available domains endpoint
3. ✅ Full query pipeline with sample question
4. ✅ Response formatting and error handling

Run it to ensure everything works before frontend testing!
