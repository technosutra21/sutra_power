#!/usr/bin/env python3
"""
Backend API Testing Script for Buddhist Character App
Tests FastAPI backend functionality, database operations, and CORS configuration
"""

import requests
import json
import sys
from datetime import datetime
import time

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

class BackendTester:
    def __init__(self):
        self.backend_url = get_backend_url()
        if not self.backend_url:
            print("❌ Could not get backend URL from frontend/.env")
            sys.exit(1)
        
        self.api_base = f"{self.backend_url}/api"
        self.session = requests.Session()
        self.test_results = []
        
        print(f"🔗 Testing backend at: {self.api_base}")
        print("=" * 60)

    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'details': details
        })

    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        print("\n🔍 Testing Basic API Connectivity...")
        
        try:
            response = self.session.get(f"{self.api_base}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.log_result("Basic Connectivity", True, "API root endpoint responding correctly")
                    return True
                else:
                    self.log_result("Basic Connectivity", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Basic Connectivity", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Basic Connectivity", False, f"Connection error: {str(e)}")
            return False

    def test_cors_configuration(self):
        """Test CORS configuration"""
        print("\n🔍 Testing CORS Configuration...")
        
        try:
            # Test preflight request
            headers = {
                'Origin': 'https://example.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = self.session.options(f"{self.api_base}/status", headers=headers, timeout=10)
            
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if cors_headers['Access-Control-Allow-Origin'] == '*':
                self.log_result("CORS Configuration", True, "CORS properly configured with wildcard origin")
                return True
            else:
                self.log_result("CORS Configuration", False, f"CORS headers: {cors_headers}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("CORS Configuration", False, f"CORS test error: {str(e)}")
            return False

    def test_status_post_endpoint(self):
        """Test POST /api/status endpoint"""
        print("\n🔍 Testing POST /api/status endpoint...")
        
        try:
            test_data = {
                "client_name": "Buddhist_Character_App_Test"
            }
            
            response = self.session.post(
                f"{self.api_base}/status",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'client_name', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['client_name'] == test_data['client_name']:
                        self.log_result("POST Status", True, "Status check created successfully", f"ID: {data['id']}")
                        return data['id']  # Return ID for cleanup
                    else:
                        self.log_result("POST Status", False, f"Client name mismatch: {data['client_name']}")
                        return None
                else:
                    self.log_result("POST Status", False, f"Missing required fields in response: {data}")
                    return None
            else:
                self.log_result("POST Status", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_result("POST Status", False, f"Request error: {str(e)}")
            return None

    def test_status_get_endpoint(self):
        """Test GET /api/status endpoint"""
        print("\n🔍 Testing GET /api/status endpoint...")
        
        try:
            response = self.session.get(f"{self.api_base}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if our test record exists
                        test_records = [item for item in data if item.get('client_name') == 'Buddhist_Character_App_Test']
                        if test_records:
                            self.log_result("GET Status", True, f"Retrieved {len(data)} status checks, including test record")
                            return True
                        else:
                            self.log_result("GET Status", True, f"Retrieved {len(data)} status checks (test record not found)")
                            return True
                    else:
                        self.log_result("GET Status", True, "Retrieved empty status checks list")
                        return True
                else:
                    self.log_result("GET Status", False, f"Expected list, got: {type(data)}")
                    return False
            else:
                self.log_result("GET Status", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("GET Status", False, f"Request error: {str(e)}")
            return False

    def test_database_persistence(self):
        """Test database persistence by creating and retrieving data"""
        print("\n🔍 Testing Database Persistence...")
        
        # Create a unique test record
        timestamp = datetime.now().isoformat()
        test_client_name = f"DB_Test_{timestamp}"
        
        try:
            # Create record
            create_data = {"client_name": test_client_name}
            create_response = self.session.post(
                f"{self.api_base}/status",
                json=create_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if create_response.status_code != 200:
                self.log_result("Database Persistence", False, f"Failed to create test record: {create_response.status_code}")
                return False
            
            created_record = create_response.json()
            record_id = created_record.get('id')
            
            # Wait a moment for database write
            time.sleep(1)
            
            # Retrieve records
            get_response = self.session.get(f"{self.api_base}/status", timeout=10)
            
            if get_response.status_code != 200:
                self.log_result("Database Persistence", False, f"Failed to retrieve records: {get_response.status_code}")
                return False
            
            records = get_response.json()
            
            # Check if our record exists
            found_record = None
            for record in records:
                if record.get('id') == record_id:
                    found_record = record
                    break
            
            if found_record:
                self.log_result("Database Persistence", True, f"Record persisted successfully (ID: {record_id})")
                return True
            else:
                self.log_result("Database Persistence", False, f"Created record not found in database (ID: {record_id})")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Database Persistence", False, f"Database test error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for Buddhist Character App")
        print(f"⏰ Test started at: {datetime.now().isoformat()}")
        
        # Test basic connectivity first
        if not self.test_basic_connectivity():
            print("\n❌ Basic connectivity failed. Stopping tests.")
            return self.generate_summary()
        
        # Run other tests
        self.test_cors_configuration()
        self.test_status_post_endpoint()
        self.test_status_get_endpoint()
        self.test_database_persistence()
        
        return self.generate_summary()

    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%" if total_tests > 0 else "No tests run")
        
        if failed_tests > 0:
            print("\n🔍 Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['message']}")
        
        # Return overall success status
        return failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    print(f"\n🏁 Backend testing completed. Overall result: {'✅ SUCCESS' if success else '❌ FAILURE'}")
    sys.exit(0 if success else 1)