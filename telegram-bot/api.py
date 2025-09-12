import requests
from config import BACKEND_URL

def register_telegram_user(user):
    return requests.post(f"{BACKEND_URL}/api/telegram/register", json=user)

def get_challenge_info(name):
    resp = requests.get(f"{BACKEND_URL}/api/telegram/challenge-info", params={"name": name})
    if resp.status_code == 200:
        return resp.json()
    return None
