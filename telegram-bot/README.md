# Skill-Bridge Telegram Bot

This bot connects students and mentors to the Skill-Bridge platform via Telegram.

## Features
- Student registration and account linking
- Challenge info and FAQ browsing
- Interactive FAQ (inline buttons)
- Mentor FAQ management (via web dashboard)

## Structure
- `bot.py`: Main bot logic and command handlers
- `handlers/`: Modular command and callback handlers
- `api.py`: Functions for backend API communication
- `config.py`: Bot configuration (token, backend URL)
- `requirements.txt`: Python dependencies

## Setup
1. Copy your bot token to `config.py`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the bot: `python bot.py`
