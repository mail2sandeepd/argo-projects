import requests
import time
import threading
import argparse
from concurrent.futures import ThreadPoolExecutor
import sys

def make_request(url):
    try:
        response = requests.get(url)
        return response.status_code
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return 500

def load_test(url, num_requests, concurrent_users, duration):
    print(f"Starting load test on {url}")
    print(f"Number of requests per user: {num_requests}")
    print(f"Number of concurrent users: {concurrent_users}")
    print(f"Test duration: {duration} seconds")
    
    start_time = time.time()
    request_count = 0
    success_count = 0
    
    def user_session():
        nonlocal request_count, success_count
        end_time = start_time + duration
        
        while time.time() < end_time and request_count < num_requests:
            status_code = make_request(url)
            request_count += 1
            if status_code == 200:
                success_count += 1
            
            # Add some think time between requests (100ms)
            time.sleep(0.1)
    
    # Create thread pool for concurrent users
    with ThreadPoolExecutor(max_workers=concurrent_users) as executor:
        futures = [executor.submit(user_session) for _ in range(concurrent_users)]
        
        # Wait for all futures to complete or timeout
        while time.time() - start_time < duration and request_count < num_requests:
            time.sleep(1)
            print(f"\rRequests: {request_count}, Successful: {success_count}, "
                  f"Time elapsed: {int(time.time() - start_time)}s", end='')
            sys.stdout.flush()
    
    total_time = time.time() - start_time
    print("\n\nTest completed!")
    print(f"Total requests: {request_count}")
    print(f"Successful requests: {success_count}")
    print(f"Failed requests: {request_count - success_count}")
    print(f"Success rate: {(success_count/request_count)*100:.2f}%")
    print(f"Total time: {total_time:.2f} seconds")
    print(f"Requests per second: {request_count/total_time:.2f}")

def main():
    parser = argparse.ArgumentParser(description='Load Testing Tool')
    parser.add_argument('--url', required=True, help='Target URL to test')
    parser.add_argument('--requests', type=int, default=1000,
                      help='Number of requests to make (default: 1000)')
    parser.add_argument('--users', type=int, default=10,
                      help='Number of concurrent users (default: 10)')
    parser.add_argument('--duration', type=int, default=300,
                      help='Test duration in seconds (default: 300)')
    
    args = parser.parse_args()
    
    load_test(args.url, args.requests, args.users, args.duration)

if __name__ == "__main__":
    main()
