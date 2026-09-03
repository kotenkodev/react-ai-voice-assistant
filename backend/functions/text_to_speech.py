import requests
from decouple import config

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

def convert_text_to_speech(message):
    body = {
        "text": message,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
        }
    }
    
    # voice_rachel = "21m00Tcm4TlvDqq8ikWAM" (legacy ID not in modern accounts)
    # Available in your account: 'EXAVITQu4vr4xnSDxMaL' (Sarah), 'JBFqnCBsd6RMkjVDRZzb' (George/John)
    voice_id = "EXAVITQu4vr4xnSDxMaL"

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVEN_LABS_API_KEY,
    }
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    try:
        response = requests.post(
            endpoint,
            json=body,
            headers=headers,
            timeout=30,
        )

        if response.status_code == 200:
            return response.content
        else:
            print(f"ElevenLabs error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(e)
        return None

