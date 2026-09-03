# FastAPI AI Voice Assistant Backend

High-performance Python backend powering John's AI Voice Companion. Built with **FastAPI**, **Groq Whisper**, **Groq Chat Completion**, and **ElevenLabs**.

---

## Endpoints

| Method | Endpoint      | Description                                                                                                                                   |
| ------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/health`     | Healthcheck endpoint returning `{ "message": "I'm alive" }`.                                                                                  |
| `POST` | `/post-audio` | Accepts multipart audio recording, transcribes via Groq Whisper, queries LLM, generates speech via ElevenLabs, and streams back `audio/mpeg`. |
| `GET`  | `/reset`      | Resets conversation memory in `stored_data.json` to an empty state `[]`.                                                                      |

---

## Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
GROQ_API_KEY=gsk_...
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
CORS=http://localhost:5173
```

- **`GROQ_API_KEY`**: Your API key from [Groq Console](https://console.groq.com/).
- **`ELEVENLABS_API_KEY`**: Your API key from [ElevenLabs](https://elevenlabs.io/).
- **`ELEVENLABS_VOICE_ID`**: ID of the voice to use (e.g., `21m00Tcm4TlvDq8ikWAM` for Rachel/John voice preset).
- **`CORS`**: Allowed origin for frontend requests (defaults to `http://localhost:5173`).

---

## Installation & Running

### Using standard venv

```bash
# 1. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate   # Windows
source venv/bin/activate  # macOS / Linux

# 2. Install dependencies
pip install fastapi uvicorn openai python-decouple python-dotenv requests

# 3. Start development server
uvicorn main:app --reload
```

### Using uv

```bash
uv sync
uv run uvicorn main:app --reload
```

Server runs at `http://localhost:8000`. Interactive Swagger API docs are accessible at `http://localhost:8000/docs`.

---

## Internal Modules

- **`functions/openai_requests.py`**:
  - `convert_audio_to_text(audio_file)`: Transcribes uploaded audio files using Groq's `whisper-large-v3`.
  - `get_chat_response(message_input)`: Generates contextual assistant replies using Groq chat completions.
- **`functions/text_to_speech.py`**:
  - `convert_text_to_speech(message)`: Calls ElevenLabs `/v1/text-to-speech/{voice_id}` and streams raw audio bytes.
- **`functions/database.py`**:
  - `get_recent_messages()`: Retrieves recent conversation history and applies the system interviewer persona.
  - `store_messages(user_msg, bot_msg)`: Appends user and assistant dialogue to `stored_data.json`.
  - `reset_messages()`: Safely clears conversation memory without crashing on empty files.
