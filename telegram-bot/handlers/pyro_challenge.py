
from pyrogram import Client, filters
from pyrogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import requests
from config import BACKEND_URL

def register_handlers(app):
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
        text = f"Challenge: {data['title']}\nSubmission Deadline: {data['submissionDeadline']}\nRules: {data['rules']}\nPrizes: {data.get('prizes','')}"
        message.reply(text)
        if data.get('faq'):
            buttons = [[InlineKeyboardButton(q['question'], callback_data=f"faq_{i}")] for i, q in enumerate(data['faq'])]
            message.reply("FAQ:", reply_markup=InlineKeyboardMarkup(buttons))

    @app.on_callback_query(filters.regex(r"^faq_\d+$"))
    def faq_callback(client, callback_query):
        index = int(callback_query.data.split('_')[1])
        # Ideally, fetch FAQ from backend or cache; here, just a placeholder
        callback_query.answer()
        callback_query.edit_message_text(f"Answer for question {index+1} (fetch from backend)")
