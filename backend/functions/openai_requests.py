from decouple import config
from openai import OpenAI

client = OpenAI(
    api_key=config("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

def convert_audio_to_text(audio_file):
    try:
        transcript = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=audio_file,
            response_format="text",
        )
        return transcript
    except Exception as e:
        print(e)
        return None
