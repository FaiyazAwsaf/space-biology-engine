#!/usr/bin/env python3
"""
Space Biology Engine - Integration Test Script
Tests the connection between frontend and backend
"""

import requests
import time
import json

def test_backend_health():
    """Test if backend is running and healthy"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend Health Check Passed")
            print(f"   Status: {data.get('status')}")
            print(f"   Components: {data.get('components')}")
            return True
        else:
            print(f"❌ Backend Health Check Failed: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend Health Check Failed: {e}")
        return False

def test_domains_endpoint():
    """Test domains endpoint"""
    try:
        response = requests.get("http://localhost:8000/domains", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Domains Endpoint Working")
            print(f"   Available domains: {data.get('domains')}")
            return True
        else:
            print(f"❌ Domains Endpoint Failed: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Domains Endpoint Failed: {e}")
        return False

def test_query_endpoint():
    """Test query endpoint with sample question"""
    try:
        test_query = {
            "question": "What are the effects of microgravity on bone density?",
            "filters": {
                "organism": ["human"],
                "tissueSystem": ["bone"]
            }
        }
        
        response = requests.post(
            "http://localhost:8000/query",
            json=test_query,
            timeout=30  # Longer timeout for AI processing
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Query Endpoint Working")
            print(f"   Answer length: {len(data.get('answer', ''))}")
            print(f"   Source type: {data.get('source_type')}")
            print(f"   Citations: {len(data.get('citations', []))}")
            print(f"   Confidence warning: {data.get('confidence_warning')}")
            return True
        else:
            print(f"❌ Query Endpoint Failed: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Query Endpoint Failed: {e}")
        return False

def main():
    """Run all integration tests"""
    print("🧪 Space Biology Engine - Integration Tests")
    print("=" * 50)
    
    # Test 1: Backend Health
    print("\n1. Testing Backend Health...")
    health_ok = test_backend_health()
    
    if not health_ok:
        print("\n❌ Backend is not running. Please start it first:")
        print("   cd backend/kg")
        print("   ./start_backend.sh")
        return
    
    # Test 2: Domains Endpoint
    print("\n2. Testing Domains Endpoint...")
    domains_ok = test_domains_endpoint()
    
    # Test 3: Query Endpoint
    print("\n3. Testing Query Endpoint...")
    query_ok = test_query_endpoint()
    
    # Summary
    print("\n" + "=" * 50)
    print("🏁 Integration Test Summary:")
    print(f"   Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"   Domains: {'✅ PASS' if domains_ok else '❌ FAIL'}")
    print(f"   Query: {'✅ PASS' if query_ok else '❌ FAIL'}")
    
    if all([health_ok, domains_ok, query_ok]):
        print("\n🎉 All tests passed! Your backend is ready for integration.")
    else:
        print("\n⚠️  Some tests failed. Check the backend configuration.")

if __name__ == "__main__":
    main()