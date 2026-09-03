from functions.text_to_speech import convert_text_to_speech
from functions.database import reset_messages
from functions.database import store_messages
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


@app.get('/reset')
async def reset_conversation():
    reset_messages()
    return {"message": "Conversation reset"}

@app.get('/post-audio-get/')
async def get_audio():

    audio_input = open('voice-snippet.mp3', 'rb')

    message_decoded = convert_audio_to_text(audio_input)

    if not message_decoded:
        return HTTPException(status_code=400, detail="Failed to decode audio")

    chat_response = get_chat_response(message_decoded)

    if not chat_response:
        return HTTPException(status_code=400, detail="Failed to get chat response")

    store_messages(message_decoded, chat_response)

    audio_output = convert_text_to_speech(chat_response)

    if not audio_output:
        return HTTPException(status_code=400, detail="Failed to convert text to speech")

    def iterfile():
        yield audio_output

    return StreamingResponse(iterfile(), media_type="audio/mpeg")