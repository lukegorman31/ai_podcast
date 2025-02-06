from fastapi import FastAPI
from pydantic import BaseModel
from api_scrape import fetch_news_summaries  # Import scraper function
from llm import generate_podcast_script_with_openai  # Import LLM function
from fastapi.middleware.cors import CORSMiddleware
import logging

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

    # Fetch news summaries instead of full articles
    summaries = fetch_news_summaries(topic)
    logging.info(f"Fetched summaries: {summaries}")

    if not summaries:
        logging.error("Failed to fetch news summaries")
        return {"error": "Failed to fetch news summaries"}

    # Generate podcast script from summaries
    podcast_script = generate_podcast_script_with_openai("\n".join(summaries))
    logging.info(f"Generated podcast script: {podcast_script}")

    if "Error" in podcast_script:
        logging.error(podcast_script)
        return {"error": podcast_script}

    return {"message": "Podcast generated successfully", "podcast_script": podcast_script}


# Run the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
