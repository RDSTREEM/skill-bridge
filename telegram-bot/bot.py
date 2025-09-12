from telegram.ext import Application
from config import BOT_TOKEN

from handlers.start import start_handler
from handlers.challenge import challenge_handler, faq_callback_handler
from handlers.help import help_handler

app = Application.builder().token(BOT_TOKEN).build()


app.add_handler(start_handler)
app.add_handler(challenge_handler)
app.add_handler(faq_callback_handler)
app.add_handler(help_handler)

if __name__ == "__main__":
    app.run_polling()
