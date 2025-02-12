from google.cloud import texttospeech
from google.cloud import texttospeech_v1beta1 as texttospeech
import os
from dotenv import load_dotenv

load_dotenv(
    dotenv_path=".env"
)  # Load environment variables from .env

def text_to_speech(podcast_script):
    """Converts text to speech and saves as an MP3 file"""
    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=podcast_script)

    voice = texttospeech.VoiceSelectionParams(
        language_code="en-us",
        name="en-US-Chirp-HD-F", 
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        effects_profile_id=["headphone-class-device"],  # Optional
    )

    try:
        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        file_path = "output.mp3"
        with open(file_path, "wb") as out:
            out.write(response.audio_content)

        return file_path  # Return file path to be served in API
    except Exception as e:
        print(f"Error during TTS: {e}")  # Log the error
        return None # Or raise the exception, depending on your error handling
