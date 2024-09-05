import requests
import os
import sys
import json

url = 'https://youngsparks.sharepoint.com/:u:/s/YoungSparksklant/EfaANmPQWrJPhArpcb19-v4BCK8VIpXoxhWWrfsIw23Vdg?e=z0HuJn&download=1'
filename = 'taken.json'

def get_script_directory():
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    else:
        return os.path.dirname(os.path.abspath(__file__))

script_dir = get_script_directory()
json_path = os.path.join(script_dir, filename)

response = requests.get(url)
if response.status_code == 200:
    with open(json_path, 'w') as file:
        json.dump(response.json(), file, indent=4)
else:
    print("Failed to download the file.")