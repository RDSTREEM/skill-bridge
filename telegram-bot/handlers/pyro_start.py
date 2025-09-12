
from pyrogram import Client, filters
import requests
from config import BACKEND_URL

def register_handlers(app):
    @app.on_message(filters.command("start"))
    def start_handler(client, message):
        user = message.from_user
        requests.post(f"{BACKEND_URL}/api/telegram/register", json={
            "telegram_id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })
        message.reply(f"Welcome, {user.first_name}! Your account is now linked.")
