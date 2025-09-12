
from pyrogram import Client, filters

def register_handlers(app):
    @app.on_message(filters.command("help"))
    def help_handler(client, message):
        help_text = (
            "Skill-Bridge Bot Commands:\n"
            "/start - Link your Telegram account\n"
            "/challenge [name] - Get info about a challenge\n"
            "/help - Show this help message\n"
        )
        message.reply(help_text)