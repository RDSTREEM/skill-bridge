

from pyrogram import Client, filters
import requests
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
BACKEND_URL = os.getenv('BACKEND_URL')

from pyrogram.types import InlineKeyboardMarkup, InlineKeyboardButton

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
        help_text = (
            "Welcome, {name}! Your account is now linked.\n\n"
            "Available commands:\n"
            "/challenge [name] - View a challenge overview or FAQ\n"
            "/help - Show this help message\n"
        ).format(name=user.first_name)
        message.reply(help_text)

    @app.on_message(filters.command("challenge"))
    def challenge_handler(client, message):
        args = message.text.split(maxsplit=1)
        if len(args) < 2:
            message.reply("Usage: /challenge [challenge_name]")
            return
        challenge_name = args[1]
        resp = requests.get(f"{BACKEND_URL}/api/telegram/challenge-info", params={"name": challenge_name})
        if resp.status_code != 200:
            message.reply("Challenge not found.")
            return
        data = resp.json()
        buttons = [
            [InlineKeyboardButton("Overview", callback_data=f"overview_{challenge_name}")],
        ]
        if data.get('faq'):
            buttons.append([InlineKeyboardButton("FAQ", callback_data=f"faqmenu_{challenge_name}")])
        message.reply(
            f"What would you like to see for '{data['title']}'?",
            reply_markup=InlineKeyboardMarkup(buttons)
        )

    @app.on_callback_query(filters.regex(r"^overview_(.+)$"))
    def overview_callback(client, callback_query):
        challenge_name = callback_query.data.split('_', 1)[1]
        resp = requests.get(f"{BACKEND_URL}/api/telegram/challenge-info", params={"name": challenge_name})
        if resp.status_code != 200:
            callback_query.answer("Failed to fetch challenge info.", show_alert=True)
            return
        data = resp.json()
        text = f"Challenge: {data['title']}\nSubmission Deadline: {data['submissionDeadline']}\nRules: {data['rules']}\nPrizes: {data.get('prizes','')}"
        callback_query.edit_message_text(text)

    @app.on_callback_query(filters.regex(r"^faqmenu_(.+)$"))
    def faq_menu_callback(client, callback_query):
        challenge_name = callback_query.data.split('_', 1)[1]
        resp = requests.get(f"{BACKEND_URL}/api/telegram/challenge-info", params={"name": challenge_name})
        if resp.status_code != 200:
            callback_query.answer("Failed to fetch FAQ.", show_alert=True)
            return
        data = resp.json()
        faq = data.get('faq', [])
        if not faq:
            callback_query.edit_message_text("No FAQ available for this challenge.")
            return
        buttons = [[InlineKeyboardButton(q['question'], callback_data=f"faq_{challenge_name}_{i}")] for i, q in enumerate(faq)]
        callback_query.edit_message_text(
            f"FAQ for {data['title']} (select a question):",
            reply_markup=InlineKeyboardMarkup(buttons)
        )

    @app.on_callback_query(filters.regex(r"^faq_(.+)_(\d+)$"))
    def faq_callback(client, callback_query):
        parts = callback_query.data.split('_')
        challenge_name = parts[1]
        index = int(parts[2])
        resp = requests.get(f"{BACKEND_URL}/api/telegram/challenge-info", params={"name": challenge_name})
        if resp.status_code != 200:
            callback_query.answer("Failed to fetch answer.", show_alert=True)
            return
        data = resp.json()
        faq = data.get('faq', [])
        if index >= len(faq):
            callback_query.answer("Invalid question.", show_alert=True)
            return
        answer = faq[index]['answer']
        # Navigation buttons
        nav_buttons = []
        if index > 0:
            nav_buttons.append(InlineKeyboardButton("< Previous", callback_data=f"faq_{challenge_name}_{index-1}"))
        nav_buttons.append(InlineKeyboardButton("Back to FAQ", callback_data=f"faqmenu_{challenge_name}"))
        if index < len(faq) - 1:
            nav_buttons.append(InlineKeyboardButton("Next >", callback_data=f"faq_{challenge_name}_{index+1}"))
        callback_query.edit_message_text(
            f"Q: {faq[index]['question']}\nA: {answer}",
            reply_markup=InlineKeyboardMarkup([nav_buttons])
        )
