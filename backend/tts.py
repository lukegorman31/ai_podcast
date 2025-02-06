from google.cloud import texttospeech
import os

# Set up Google credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/lukegorman/Desktop/llm_podcast_project/tts-podcast-450113-a3c80458dc33.json"

def text_to_speech(podcast_script):
    """Converts text to speech and saves as an MP3 file"""
    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=podcast_script)

    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name="en-US-Wavenet-D",
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        effects_profile_id=["handset-class-device"],
        speaking_rate=1.0,
        pitch=1
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    file_path = "output.mp3"
    with open(file_path, "wb") as out:
        out.write(response.audio_content)

    return file_path  # Return file path to be served in API


