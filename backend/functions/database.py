import json
import os
import random

def get_recent_messages():
    file_name = "stored_data.json"
    learn_instruction = {
        "role": "system",
        "content": "You are interviewing the user for a job as a retail assisant. Ask short questions that are releveant to the junior position. Your name is John. The user is called Bob. Keep your answers to under 30 words."
    }

    messages = []

    x = random.uniform(0, 1)

    if x < 0.5:
        learn_instruction["content"] = learn_instruction["content"] + " Your response will include some dry humour"
    else:
        learn_instruction["content"] = learn_instruction["content"] + " Your response will be very enthusiastic and outgoing."

    messages.append(learn_instruction)

    try:
        with open(file_name, 'r') as user_file:
            data = json.load(user_file)
            
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)
    except Exception as e:
        print(e)
        
    return messages
        