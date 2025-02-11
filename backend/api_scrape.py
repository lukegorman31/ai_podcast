import requests
import logging
from dotenv import load_dotenv
import os

load_dotenv()

rapid_api_key = os.getenv("RAPID_API_KEY")

API_URL = "https://news67.p.rapidapi.com/v2/topic-search"
HEADERS = {
    "x-rapidapi-key": rapid_api_key,
    "x-rapidapi-host": "news67.p.rapidapi.com"
}

def fetch_news_summaries(topic, batch_size=7):
    """Fetches news summaries using the News67 API"""
    querystring = {
        "batchSize": str(batch_size),
        "languages": "en",
        "search": topic
    }

    try:
        response = requests.get(API_URL, headers=HEADERS, params=querystring)
        logging.info(f"API response status code: {response.status_code}")
        logging.info(f"API response text: {response.text}")
        
        response_data = response.json()
        
        if "news" not in response_data:
            logging.error("Error: No news data found in API response")
            return []

        summaries = [news_item.get("Summary", "No summary available") for news_item in response_data["news"]]
        return summaries
    
    except Exception as e:
        logging.error(f"Error fetching news: {e}")
        return []

