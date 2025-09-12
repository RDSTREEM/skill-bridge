from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import CommandHandler, CallbackQueryHandler, ContextTypes
import requests
from config import BACKEND_URL

async def challenge(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Usage: /challenge [challenge_name]")
        return
    challenge_name = ' '.join(context.args)
    resp = requests.get(f"{BACKEND_URL}/api/telegram/challenge-info", params={"name": challenge_name})
    if resp.status_code != 200:
        await update.message.reply_text("Challenge not found.")
        return
    data = resp.json()
    # Send challenge info
    await update.message.reply_text(
        f"Challenge: {data['title']}\nSubmission Deadline: {data['submissionDeadline']}\nRules: {data['rules']}\nPrizes: {data['prizes']}"
    )
    # Send FAQ as buttons
    if data.get('faq'):
        keyboard = [
            [InlineKeyboardButton(q['question'], callback_data=f"faq_{i}")]
            for i, q in enumerate(data['faq'])
        ]
        context.user_data['faq'] = data['faq']
        await update.message.reply_text('FAQ:', reply_markup=InlineKeyboardMarkup(keyboard))

async def faq_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    faq_index = int(query.data.split('_')[1])
    faq = context.user_data.get('faq', [])
    if 0 <= faq_index < len(faq):
        answer = faq[faq_index]['answer']
        await query.answer()
        await query.edit_message_text(answer)
    else:
        await query.answer("No answer found.", show_alert=True)

challenge_handler = CommandHandler("challenge", challenge)
faq_callback_handler = CallbackQueryHandler(faq_callback, pattern=r"^faq_\d+$")
