from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from api_scrape import fetch_news_summaries
from llm import generate_podcast_script_with_openai
from tts import text_to_speech
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Logging ---
logging.basicConfig(level=logging.INFO)

# --- Pydantic Model ---
class TopicRequest(BaseModel):
    topic: str

@app.get("/generate_podcast")
async def generate_podcast_endpoint(topic: str):
    logging.info(f"Received request to generate podcast for topic: {topic}")

    try:
        summaries = fetch_news_summaries(topic)
        logging.info(f"Fetched summaries: {summaries}")

        if not summaries:
            raise HTTPException(status_code=400, detail="Failed to fetch news summaries")

        podcast_script = generate_podcast_script_with_openai("\n".join(summaries))
        logging.info(f"Generated podcast script: {podcast_script}")

        if "Error" in podcast_script:
            raise HTTPException(status_code=500, detail=podcast_script)

        audio_file_path = text_to_speech(podcast_script)
        if audio_file_path is None:
            raise HTTPException(status_code=500, detail="Failed to generate audio")


        return {
            "message": "Podcast generated successfully",
            "podcast_script": podcast_script,  # Consider removing long scripts
            "audio_url": f"http://127.0.0.1:8000/audio"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception("An unexpected error occurred")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audio")
async def get_audio():
    audio_file_path = "output.mp3"
    if not os.path.exists(audio_file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(audio_file_path, media_type="audio/mpeg", filename="podcast.mp3")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)