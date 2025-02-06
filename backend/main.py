from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from api_scrape import fetch_news_summaries  # Import scraper function
from llm import generate_podcast_script_with_openai  # Import LLM function
from tts import text_to_speech  # Import TTS function
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

app = FastAPI()

# Middleware to handle CORS issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Define request model
class TopicRequest(BaseModel):
    topic: str

@app.get("/generate_podcast")
def generate_podcast_endpoint(topic: str):
    logging.info(f"Received request to generate podcast for topic: {topic}")

    # Fetch news summaries
    summaries = fetch_news_summaries(topic)
    logging.info(f"Fetched summaries: {summaries}")

    if not summaries:
        logging.error("Failed to fetch news summaries")
        return JSONResponse(content={"error": "Failed to fetch news summaries"}, status_code=400)

    # Generate podcast script
    podcast_script = generate_podcast_script_with_openai("\n".join(summaries))
    logging.info(f"Generated podcast script: {podcast_script}")

    if "Error" in podcast_script:
        logging.error(podcast_script)
        return JSONResponse(content={"error": podcast_script}, status_code=500)

    # Convert script to audio
    audio_file_path = text_to_speech(podcast_script)
    
    return {
        "message": "Podcast generated successfully",
        "podcast_script": podcast_script,
        "audio_url": f"http://127.0.0.1:8000/audio"
    }

@app.get("/audio")
def get_audio():
    """Serves the generated podcast audio file."""
    audio_file_path = "output.mp3"

    if not os.path.exists(audio_file_path):
        return JSONResponse(content={"error": "Audio file not found"}, status_code=404)

    return FileResponse(audio_file_path, media_type="audio/mpeg", filename="podcast.mp3")

# Run the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
