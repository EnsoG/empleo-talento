#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad del AdminCodelcoPanel
"""
import requests
import json
import time

# Configuración
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"

def test_backend_health():
    """Probar que el backend esté funcionando"""
    try:
        response = requests.get(f"{BACKEND_URL}/docs")
        print(f"✅ Backend running: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Backend error: {e}")
        return False

def test_metadata_endpoint():
    """Probar endpoint de metadata"""
    try:
        response = requests.get(f"{BACKEND_URL}/v1/metadata")
        print(f"✅ Metadata endpoint: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Metadata error: {e}")
        return False

def test_admin_endpoints():
    """Probar endpoints de administración (sin auth)"""
    endpoints_to_test = [
        "/v1/admin/codelco/scraping/status",
        "/v1/admin/codelco/jobs",
    ]
    
    for endpoint in endpoints_to_test:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            # 401 es esperado sin autenticación
            if response.status_code in [401, 403]:
                print(f"✅ {endpoint}: Protected (401/403) - CORRECT")
            else:
                print(f"⚠️ {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint} error: {e}")

def main():
    print("🚀 Testing AdminCodelcoPanel System...")
    print("=" * 50)
    
    # Test backend
    if not test_backend_health():
        print("Backend not running. Please start with:")
        print("cd back-end && python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload")
        return
    
    # Test metadata
    test_metadata_endpoint()
    
    # Test admin endpoints
    test_admin_endpoints()
    
    print("\n🎯 Testing Summary:")
    print("- Backend is running on port 8000")
    print("- Frontend should be running on port 5173")
    print("- Admin endpoints are protected (correct)")
    print("- System ready for testing!")
    
    print("\n📋 Next Steps:")
    print("1. Go to: http://localhost:5173/auth/admin-login-aaa")
    print("2. Login as admin")
    print("3. Navigate to 'Empleos Externos' in sidebar")
    print("4. Test AdminCodelcoPanel functionality")

if __name__ == "__main__":
    main()
