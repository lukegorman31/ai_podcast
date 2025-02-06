from gtts import gTTS
import uuid
import os

def text_to_speech(text: str):
    # Convert the text to speech and save it as an audio file
    tts = gTTS(text)
    file_name = f"podcast_{uuid.uuid4()}.mp3"
    tts.save(file_name)
    
    return file_name  # You can change this to return a URL or path if you're storing it on a server
