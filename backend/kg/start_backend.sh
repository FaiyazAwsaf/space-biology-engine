#!/bin/bash

# Space Biology Engine - Backend Startup Script
# This script starts the FastAPI backend server for local development

echo "🚀 Starting Space Biology Engine Backend..."
echo "📍 Location: $(pwd)"

# Check if we're in the right directory
if [ ! -f "hybrid_api.py" ]; then
    echo "❌ Error: hybrid_api.py not found. Please run this script from the backend/kg directory."
    exit 1
fi

# Check if Python dependencies are installed
echo "🔍 Checking Python dependencies..."
python3 -c "import fastapi, chromadb, networkx, sentence_transformers, transformers" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Some Python dependencies may be missing."
    echo "💡 Make sure you have installed: fastapi, chromadb, networkx, sentence-transformers, transformers"
    echo "📦 You can install them with: pip install fastapi[all] chromadb networkx sentence-transformers transformers"
    echo ""
fi

# Set environment variables if not set
export GEMINI_API_KEY=${GEMINI_API_KEY:-"your-gemini-api-key-here"}

# Start the FastAPI server
echo "🔧 Starting FastAPI server on http://localhost:8000"
echo "📚 API Documentation will be available at http://localhost:8000/docs"
echo "🔍 Health check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run the server with auto-reload for development
uvicorn hybrid_api:app --host 0.0.0.0 --port 8000 --reload --log-level info