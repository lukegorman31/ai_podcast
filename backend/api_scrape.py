import requests
import logging

API_URL = "https://news67.p.rapidapi.com/v2/topic-search"
HEADERS = {
    "x-rapidapi-key": "d4a64e4ba2mshe7795420c303702p1b42d8jsnf933d4d02161",
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

# Test the function
if __name__ == "__main__":
    topic = "Altcoins for 2025"
    summaries = fetch_news_summaries(topic)
    print(summaries)
