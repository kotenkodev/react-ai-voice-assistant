from fastapi import File
from fastapi import UploadFile
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
from openai import OpenAI
from dotenv import load_dotenv

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

@app.post('/post-audio/')
async def post_audio(file: UploadFile = File(...)):
    return {"message": "Audio received"}