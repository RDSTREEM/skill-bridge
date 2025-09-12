from telegram import Update
from telegram.ext import CommandHandler, ContextTypes
import requests
from config import BACKEND_URL

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    # Register user with backend
    requests.post(f"{BACKEND_URL}/api/telegram/register", json={
        "telegram_id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
    })
    await update.message.reply_text(f"Welcome, {user.first_name}! Your account is now linked.")

start_handler = CommandHandler("start", start)
