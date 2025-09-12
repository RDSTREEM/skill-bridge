

from pyrogram import Client
from config import API_ID, API_HASH, BOT_TOKEN
import handlers.pyro_start as pyro_start
import handlers.pyro_challenge as pyro_challenge
import handlers.pyro_help as pyro_help

def main():
    app = Client(
        "skillbridgebot",
        api_id=API_ID,
        api_hash=API_HASH,
        bot_token=BOT_TOKEN,
    )
    pyro_start.register_handlers(app)
    pyro_challenge.register_handlers(app)
    pyro_help.register_handlers(app)
    app.run()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Bot failed to start: {e}")
