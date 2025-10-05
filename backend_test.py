#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Asteria Local
Tests all core endpoints with various scenarios including success cases, error handling, and data validation.
"""

import requests
import json
import time
from typing import Dict, List, Any
from datetime import datetime

# Configuration
BASE_URL = "https://asteria-local.preview.emergentagent.com/api"
TIMEOUT = 30

class AsteriaAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    def log_test(self, test_name: str, passed: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        self.total_tests += 1
        if passed:
            self.passed_tests += 1
            status = "✅ PASS"
        else:
            self.failed_tests += 1
            status = "❌ FAIL"
            
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        
        if response_data and not passed:
            result["response_data"] = response_data
            
        self.test_results.append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not passed:
            print(f"   Response: {response_data}")
        print()

    def test_health_check(self):
        """Test the health check endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "status" in data:
                    self.log_test("Health Check", True, f"API is healthy: {data['message']}")
                    return True
                else:
                    self.log_test("Health Check", False, "Missing required fields in response", data)
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
        
        return False

    def test_categories_endpoint(self):
        """Test categories endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/categories/")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check first category structure
                        category = data[0]
                        required_fields = ["id", "name", "slug", "icon", "business_count"]
                        missing_fields = [field for field in required_fields if field not in category]
                        
                        if not missing_fields:
                            # Check if business_count is present and numeric
                            if isinstance(category.get("business_count"), int):
                                self.log_test("Categories Endpoint", True, 
                                            f"Found {len(data)} categories with proper structure")
                                return data
                            else:
                                self.log_test("Categories Endpoint", False, 
                                            "business_count field is not numeric", category)
                        else:
                            self.log_test("Categories Endpoint", False, 
                                        f"Missing fields: {missing_fields}", category)
                    else:
                        self.log_test("Categories Endpoint", False, "No categories returned")
                else:
                    self.log_test("Categories Endpoint", False, "Response is not a list", data)
            else:
                self.log_test("Categories Endpoint", False, f"Status code: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Categories Endpoint", False, f"Exception: {str(e)}")
        
        return None

    def test_featured_businesses(self):
        """Test featured businesses endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/businesses/featured/")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check first business structure
                        business = data[0]
                        required_fields = ["id", "name", "category", "address", "phone", "rating_average"]
                        missing_fields = [field for field in required_fields if field not in business]
                        
                        if not missing_fields:
                            # Check if featured businesses are properly sorted
                            featured_positions = [b.get("featured_position") for b in data if b.get("featured_position")]
                            if featured_positions:
                                is_sorted = featured_positions == sorted(featured_positions)
                                self.log_test("Featured Businesses", True, 
                                            f"Found {len(data)} featured businesses, sorted: {is_sorted}")
                            else:
                                self.log_test("Featured Businesses", True, 
                                            f"Found {len(data)} featured businesses")
                            return data
                        else:
                            self.log_test("Featured Businesses", False, 
                                        f"Missing fields: {missing_fields}", business)
                    else:
                        self.log_test("Featured Businesses", False, "No featured businesses returned")
                else:
                    self.log_test("Featured Businesses", False, "Response is not a list", data)
            else:
                self.log_test("Featured Businesses", False, f"Status code: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Featured Businesses", False, f"Exception: {str(e)}")
        
        return None

    def test_businesses_endpoint(self):
        """Test businesses endpoint with various filters"""
        # Test basic businesses endpoint
        try:
            response = self.session.get(f"{BASE_URL}/businesses/")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Businesses Endpoint - Basic", True, 
                                f"Found {len(data)} businesses")
                    
                    # Test with pagination
                    response_paginated = self.session.get(f"{BASE_URL}/businesses/?limit=5&skip=0")
                    if response_paginated.status_code == 200:
                        paginated_data = response_paginated.json()
                        if len(paginated_data) <= 5:
                            self.log_test("Businesses Endpoint - Pagination", True, 
                                        f"Pagination working: {len(paginated_data)} results")
                        else:
                            self.log_test("Businesses Endpoint - Pagination", False, 
                                        f"Pagination not working: got {len(paginated_data)} results, expected ≤5")
                    
                    # Test with category filter (if we have categories)
                    if data:
                        first_business_category = data[0].get("category")
                        if first_business_category:
                            response_filtered = self.session.get(f"{BASE_URL}/businesses/?category={first_business_category}")
                            if response_filtered.status_code == 200:
                                filtered_data = response_filtered.json()
                                self.log_test("Businesses Endpoint - Category Filter", True, 
                                            f"Category filter working: {len(filtered_data)} results for '{first_business_category}'")
                            else:
                                self.log_test("Businesses Endpoint - Category Filter", False, 
                                            f"Category filter failed: {response_filtered.status_code}")
                    
                    # Test with city filter
                    if data:
                        first_business_city = data[0].get("address", {}).get("city")
                        if first_business_city:
                            response_city = self.session.get(f"{BASE_URL}/businesses/?city={first_business_city}")
                            if response_city.status_code == 200:
                                city_data = response_city.json()
                                self.log_test("Businesses Endpoint - City Filter", True, 
                                            f"City filter working: {len(city_data)} results for '{first_business_city}'")
                            else:
                                self.log_test("Businesses Endpoint - City Filter", False, 
                                            f"City filter failed: {response_city.status_code}")
                    
                    # Test search functionality
                    if data:
                        first_business_name = data[0].get("name", "").split()[0]  # Get first word
                        if first_business_name:
                            response_search = self.session.get(f"{BASE_URL}/businesses/?search={first_business_name}")
                            if response_search.status_code == 200:
                                search_data = response_search.json()
                                self.log_test("Businesses Endpoint - Search", True, 
                                            f"Search working: {len(search_data)} results for '{first_business_name}'")
                            else:
                                self.log_test("Businesses Endpoint - Search", False, 
                                            f"Search failed: {response_search.status_code}")
                    
                    return data
                else:
                    self.log_test("Businesses Endpoint - Basic", False, "Response is not a list", data)
            else:
                self.log_test("Businesses Endpoint - Basic", False, f"Status code: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Businesses Endpoint - Basic", False, f"Exception: {str(e)}")
        
        return None

    def test_map_pins_endpoint(self):
        """Test map pins endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/map/pins/")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if pins have coordinates
                        pin = data[0]
                        if "coordinates" in pin or ("lat" in pin and "lng" in pin):
                            self.log_test("Map Pins Endpoint", True, 
                                        f"Found {len(data)} map pins with coordinates")
                            return data
                        else:
                            self.log_test("Map Pins Endpoint", False, 
                                        "Map pins missing coordinate data", pin)
                    else:
                        self.log_test("Map Pins Endpoint", False, "No map pins returned")
                else:
                    self.log_test("Map Pins Endpoint", False, "Response is not a list", data)
            else:
                self.log_test("Map Pins Endpoint", False, f"Status code: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Map Pins Endpoint", False, f"Exception: {str(e)}")
        
        return None

    def test_stats_endpoint(self):
        """Test platform statistics endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/stats/")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_businesses", "total_reviews", "total_cities"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Validate expected values based on review request
                    expected_businesses = 8
                    expected_reviews = 2
                    expected_cities = 3
                    
                    issues = []
                    if data["total_businesses"] != expected_businesses:
                        issues.append(f"Expected {expected_businesses} businesses, got {data['total_businesses']}")
                    if data["total_reviews"] != expected_reviews:
                        issues.append(f"Expected {expected_reviews} reviews, got {data['total_reviews']}")
                    if data["total_cities"] != expected_cities:
                        issues.append(f"Expected {expected_cities} cities, got {data['total_cities']}")
                    
                    if not issues:
                        self.log_test("Stats Endpoint", True, 
                                    f"Stats match expected values: {data['total_businesses']} businesses, {data['total_reviews']} reviews, {data['total_cities']} cities")
                    else:
                        self.log_test("Stats Endpoint", False, 
                                    f"Stats mismatch: {'; '.join(issues)}", data)
                    return data
                else:
                    self.log_test("Stats Endpoint", False, 
                                f"Missing fields: {missing_fields}", data)
            else:
                self.log_test("Stats Endpoint", False, f"Status code: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Stats Endpoint", False, f"Exception: {str(e)}")
        
        return None

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        # Test invalid business ID
        try:
            response = self.session.get(f"{BASE_URL}/businesses/invalid_id")
            if response.status_code == 404:
                self.log_test("Error Handling - Invalid Business ID", True, "Correctly returns 404 for invalid business ID")
            else:
                self.log_test("Error Handling - Invalid Business ID", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Business ID", False, f"Exception: {str(e)}")

        # Test invalid category slug
        try:
            response = self.session.get(f"{BASE_URL}/categories/invalid_category")
            if response.status_code == 404:
                self.log_test("Error Handling - Invalid Category", True, "Correctly returns 404 for invalid category")
            else:
                self.log_test("Error Handling - Invalid Category", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Category", False, f"Exception: {str(e)}")

        # Test invalid pagination parameters
        try:
            response = self.session.get(f"{BASE_URL}/businesses/?limit=1000")  # Over limit
            if response.status_code == 422:  # Validation error
                self.log_test("Error Handling - Invalid Pagination", True, "Correctly validates pagination limits")
            elif response.status_code == 200:
                data = response.json()
                if len(data) <= 100:  # Should be capped at 100
                    self.log_test("Error Handling - Invalid Pagination", True, "Pagination limit enforced")
                else:
                    self.log_test("Error Handling - Invalid Pagination", False, f"Pagination limit not enforced: got {len(data)} results")
            else:
                self.log_test("Error Handling - Invalid Pagination", False, f"Unexpected status code: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Pagination", False, f"Exception: {str(e)}")

    def test_cors_and_headers(self):
        """Test CORS headers and response format"""
        try:
            response = self.session.get(f"{BASE_URL}/")
            
            # Check CORS headers
            cors_headers = {
                "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
                "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
                "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers")
            }
            
            if cors_headers["Access-Control-Allow-Origin"]:
                self.log_test("CORS Headers", True, f"CORS configured: {cors_headers}")
            else:
                self.log_test("CORS Headers", False, "CORS headers missing", cors_headers)
            
            # Check content type
            content_type = response.headers.get("Content-Type", "")
            if "application/json" in content_type:
                self.log_test("Response Headers - Content Type", True, f"Correct content type: {content_type}")
            else:
                self.log_test("Response Headers - Content Type", False, f"Incorrect content type: {content_type}")
                
        except Exception as e:
            self.log_test("CORS and Headers", False, f"Exception: {str(e)}")

    def test_performance(self):
        """Test API response times"""
        endpoints = [
            ("/", "Health Check"),
            ("/categories/", "Categories"),
            ("/businesses/featured/", "Featured Businesses"),
            ("/businesses/", "Businesses"),
            ("/map/pins/", "Map Pins"),
            ("/stats/", "Stats")
        ]
        
        for endpoint, name in endpoints:
            try:
                start_time = time.time()
                response = self.session.get(f"{BASE_URL}{endpoint}")
                end_time = time.time()
                
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                
                if response.status_code == 200 and response_time < 5000:  # 5 seconds threshold
                    self.log_test(f"Performance - {name}", True, f"Response time: {response_time:.2f}ms")
                elif response.status_code == 200:
                    self.log_test(f"Performance - {name}", False, f"Slow response time: {response_time:.2f}ms")
                else:
                    self.log_test(f"Performance - {name}", False, f"Failed request: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Performance - {name}", False, f"Exception: {str(e)}")

    def test_data_consistency(self):
        """Test data consistency between endpoints"""
        try:
            # Get categories and businesses
            categories_response = self.session.get(f"{BASE_URL}/categories/")
            businesses_response = self.session.get(f"{BASE_URL}/businesses/")
            stats_response = self.session.get(f"{BASE_URL}/stats/")
            
            if all(r.status_code == 200 for r in [categories_response, businesses_response, stats_response]):
                categories = categories_response.json()
                businesses = businesses_response.json()
                stats = stats_response.json()
                
                # Check if business count in categories matches actual businesses
                total_business_count = sum(cat.get("business_count", 0) for cat in categories)
                actual_businesses = len(businesses)
                stats_businesses = stats.get("total_businesses", 0)
                
                consistency_issues = []
                
                if total_business_count != actual_businesses:
                    consistency_issues.append(f"Category business counts ({total_business_count}) don't match actual businesses ({actual_businesses})")
                
                if stats_businesses != actual_businesses:
                    consistency_issues.append(f"Stats businesses ({stats_businesses}) don't match actual businesses ({actual_businesses})")
                
                if not consistency_issues:
                    self.log_test("Data Consistency", True, f"Data is consistent across endpoints: {actual_businesses} businesses")
                else:
                    self.log_test("Data Consistency", False, "; ".join(consistency_issues))
                    
            else:
                self.log_test("Data Consistency", False, "Could not fetch all required endpoints for consistency check")
                
        except Exception as e:
            self.log_test("Data Consistency", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all tests and generate report"""
        print("🚀 Starting Asteria Local API Tests")
        print(f"Testing against: {BASE_URL}")
        print("=" * 60)
        
        # Core functionality tests
        self.test_health_check()
        self.test_categories_endpoint()
        self.test_featured_businesses()
        self.test_businesses_endpoint()
        self.test_map_pins_endpoint()
        self.test_stats_endpoint()
        
        # Additional tests
        self.test_error_handling()
        self.test_cors_and_headers()
        self.test_performance()
        self.test_data_consistency()
        
        # Generate summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests} ✅")
        print(f"Failed: {self.failed_tests} ❌")
        print(f"Success Rate: {(self.passed_tests/self.total_tests*100):.1f}%")
        
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if "❌ FAIL" in result["status"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)
        return self.test_results

if __name__ == "__main__":
    tester = AsteriaAPITester()
    results = tester.run_all_tests()