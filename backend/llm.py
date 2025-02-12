import requests
import openai
from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_podcast_script_with_openai(topic: str):
    try:
        prompt = f"Your name is Zoe. And this is the Daily Commute Podcast! Create a 5-minute news podcast script on the following topic: {topic}.\
              Imagine it is for a busy person on their commute to work who wants a breif on the daily news regarding the topic. \
              You can be creative and add some small humor or personal touch to the script.Ignore any intro music or naming queues. Imagine you are a podcaster broadcasting to your 10,000 user base." 
            

        # OpenAI API call to generate a podcast script
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # You can use gpt-3.5-turbo or gpt-4 depending on your needs
            messages=[
                {"role": "system", "content": "You are a 5 minute news script generator be creative and informative. Ignore any music and naming queues, just produce a high quality script."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,  # Adjust based on your desired output length
            temperature=0.4  # Controls the creativity of the responses
        )

        podcast_script = response.choices[0].message.content

        return podcast_script

    except Exception as e:
        return f"Error generating podcast script: {e}"




