from telegram import Update
from telegram.ext import CommandHandler, ContextTypes

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "/start - Register your account\n"
        "/challenge [name] - Get info and FAQ for a challenge\n"
        "/help - Show this help message"
    )

help_handler = CommandHandler("help", help_command)
