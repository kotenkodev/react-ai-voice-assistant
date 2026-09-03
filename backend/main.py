from functions.openai_requests import get_chat_response
from fastapi import HTTPException
from fastapi import File
from fastapi import UploadFile
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
from dotenv import load_dotenv

from functions.openai_requests import convert_audio_to_text

load_dotenv()

app = FastAPI()

cors = config("CORS", default="http://localhost:5173")

origins = [
    cors,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/health')
async def root():
    return {"message": "I'm alive"}

@app.get('/post-audio-get/')
async def get_audio():

    audio_input = open('voice-snippet.mp3', 'rb')

    message_decoded = convert_audio_to_text(audio_input)

    if not message_decoded:
        return HTTPException(status_code=400, detail="Failed to decode audio")

    chat_response = get_chat_response(message_decoded)

    return {"message": chat_response}