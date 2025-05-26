import requests
data = [
  {
    "timestamp": "2025-05-19T09:05:00Z",
    "cpu": 58.3,
    "ram": 64.9,
    "disk": 83.1,
    "app": 41.2
  },
  {
    "timestamp": "2025-05-19T09:10:00Z",
    "cpu": 62.7,
    "ram": 67.4,
    "disk": 82.9,
    "app": 42.8
  },
  {
    "timestamp": "2025-05-19T09:15:00Z",
    "cpu": 60.1,
    "ram": 65.7,
    "disk": 81.8,
    "app": 40.3
  },
  {
    "timestamp": "2025-05-19T09:20:00Z",
    "cpu": 63.9,
    "ram": 68.5,
    "disk": 84.0,
    "app": 43.7
  },
  {
    "timestamp": "2025-05-19T09:25:00Z",
    "cpu": 59.4,
    "ram": 66.0,
    "disk": 83.5,
    "app": 38.9
  },
  {
    "timestamp": "2025-05-19T09:30:00Z",
    "cpu": 64.5,
    "ram": 67.9,
    "disk": 82.1,
    "app": 45.0
  },
  {
    "timestamp": "2025-05-19T09:35:00Z",
    "cpu": 57.8,
    "ram": 63.5,
    "disk": 81.2,
    "app": 37.6
  },
  {
    "timestamp": "2025-05-19T09:40:00Z",
    "cpu": 61.9,
    "ram": 65.3,
    "disk": 84.2,
    "app": 40.7
  },
  {
    "timestamp": "2025-05-19T09:45:00Z",
    "cpu": 60.6,
    "ram": 64.8,
    "disk": 83.9,
    "app": 39.2
  },
  {
    "timestamp": "2025-05-19T09:50:00Z",
    "cpu": 62.3,
    "ram": 66.6,
    "disk": 82.7,
    "app": 41.5
  }
]
headers = {
    "Authorization": "Bearer ZAduRjdeyXUEauPoTYMxpNvsAXGDMG" 
}
for entry in data:
    response = requests.get("http://127.0.0.1:8000/server/1/use/", headers=headers)
    print(response.status_code, response.text)