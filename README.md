# AI Daily Commute Podcast Generator

An automated podcast generation system that creates personalized news podcasts based on user-specified topics. Perfect for staying informed during your daily commute.


Version 01

![Screenshot 2025-02-07 at 14 20 22](https://github.com/user-attachments/assets/828505e3-0406-44c2-aabe-5a001fbdf76c)


## Features

- Real-time news fetching using News67 API
- AI-powered podcast script generation using OpenAI GPT-3.5
- Text-to-speech conversion using Google Cloud TTS
- User-friendly web interface
- Instant audio playback

## Tech Stack

### Backend
- FastAPI (Python)
- OpenAI GPT-3.5
- Google Cloud Text-to-Speech
- News67 API for news aggregation

### Frontend
- React.js
- CSS for styling

## Setup

1. Clone the repository

2. Install backend dependencies:

``` bash
cd backend

python -m venv podcast_venv

source podcast_venv/bin/activate # On Windows: podcast_venv\Scripts\activate


pip install -r requirements.txt
```


3. Set up environment variables:

Create a `.env` file in the backend directory with:

``` 
RAPID_API_KEY=your_news67_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_cloud_credentials.json
```

4. Install frontend dependencies:

``` bash
cd frontend_pod
npm install
```

---

## Running the Application

1. Start the backend server:

``` bash
cd backend
uvicorn main:app --reload

```


2. Start the frontend development server:

``` bash
cd frontend_pod
npm start
```


3. Access the application at `http://localhost:3000`

## How It Works

1. **News Fetching**: The system fetches relevant news articles based on the user's topic using the News67 API.
   - Reference: `backend/api_scrape.py` [lines 16-40]

2. **Script Generation**: OpenAI's GPT-3.5 processes the news articles and generates a coherent podcast script.
   - Reference: `backend/llm.py` [lines 10-27]

3. **Audio Generation**: The script is converted to natural-sounding speech using Google Cloud TTS.
   - Reference: `backend/tts.py` [lines 7-33]

4. **Delivery**: The generated audio is served to the user through the web interface.
   - Reference: `backend/main.py` [lines 29-56]

## Usage Limitations

- Topic input is limited to 25 characters
- Audio generation typically takes 15-30 seconds
- Free tier API limits apply

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
