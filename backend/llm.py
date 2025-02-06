import requests
import openai


openai.api_key = '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'

def generate_podcast_script_with_openai(topic: str):
    try:
        prompt = f"Create a 5-minute news podcast script on the following topic: {topic}. Imagine it is for a busy person on their commute to work who wants a breif. Focus on providing valuable insights and predictions. You are an expert in this field and are providing expert commentary on the topic to regular listeners who are also engaged on this topic."

        # OpenAI API call to generate a podcast script
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # You can use gpt-3.5-turbo or gpt-4 depending on your needs
            messages=[
                {"role": "system", "content": "You are a podcast script generator."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,  # Adjust based on your desired output length
            temperature=0.7  # Controls the creativity of the responses
        )

        podcast_script = response.choices[0].message.content

        return podcast_script

    except Exception as e:
        return f"Error generating podcast script: {e}"




