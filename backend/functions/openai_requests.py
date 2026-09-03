from functions.database import get_recent_messages
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

def get_chat_response(message_input):
    messages = get_recent_messages()

    user_message = {"role": "user", "content": message_input}
    messages.append(user_message)

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=messages,
            temperature=0.7,
            stream=True,
        )

        assistant_response = ""
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                assistant_response += chunk.choices[0].delta.content

        return assistant_response
    except Exception as e:
        print(e)
        return "Something went wrong"