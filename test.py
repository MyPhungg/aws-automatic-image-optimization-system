import urllib.request
import json
req = urllib.request.Request(
    'https://4mirtuwkba.execute-api.us-east-1.amazonaws.com/prod/upload',
    data=b'{"userId": "test", "files": [{"fileName": "test.jpg", "contentType": "image/jpeg", "size": 1234}]}',
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
