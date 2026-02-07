import requests
import sys

# BASE_URL = "http://localhost:8000/api"
BASE_URL = "https://mehwishsheikh15-todo-app.hf.space/api"

def test_register():
    print(f"Testing Registration against {BASE_URL}...")
    email = "testuser_debug_2@example.com"
    password = "password123"
    payload = {
        "email": email,
        "password": password,
        "display_name": "Debug User"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        if response.status_code == 200:
            return email, password
        elif response.status_code == 400 and "already registered" in response.text:
             print("User already exists, proceeding to login...")
             return email, password
        else:
            return None, None
    except Exception as e:
        print(f"Registration Request Failed: {e}")
        return None, None

def test_login(email, password):
    print(f"\nTesting Login for {email}...")
    # The frontend uses URLSearchParams, which sends as application/x-www-form-urlencoded
    # requests.post with data=dict does exactly that.
    payload = {
        "username": email,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            token = response.json().get("access_token")
            print(f"Login Successful! Token: {token[:20]}...")
            return token
        return None
    except Exception as e:
        print(f"Login Request Failed: {e}")
        return None

def test_protected_route(token):
    print("\nTesting Protected Route (Me)...")
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Protected Route Request Failed: {e}")

if __name__ == "__main__":
    email, password = test_register()
    if email and password:
        token = test_login(email, password)
        if token:
            test_protected_route(token)
