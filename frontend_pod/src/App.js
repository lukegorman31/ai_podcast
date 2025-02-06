import React, { useState } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [podcastScript, setPodcastScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setAudioUrl("");

    // Check if topic is too long
    if (topic.length > 25) {
      setMessage("⚠️ Topic too long! Please enter a topic under 25 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/generate_podcast?topic=${encodeURIComponent(topic)}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Error generating podcast.");

      const data = await response.json();

      if (data.podcast_script && data.audio_url) {
        setPodcastScript(data.podcast_script);
        setAudioUrl(data.audio_url);
        setMessage("✅ Podcast generated successfully!");
      } else {
        setMessage("❌ Failed to generate podcast.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const charLimit = 25;

  return (
    <div>
      <h1>The Daily Commute Podcast</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter News Topic for the Podcast:
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading || topic.length > charLimit}>
          {loading ? "Generating..." : "Generate Podcast"}
        </button>
      </form>

      <p>{topic.length} / {charLimit} characters used</p>

      {message && <p style={{ color: topic.length > 25 ? "red" : "green" }}>{message}</p>}

      {podcastScript && (
        <div>
          <h3>Generated Podcast Script:</h3>
          <textarea value={podcastScript} readOnly rows={10} cols={50} />
        </div>
      )}

      {audioUrl && (
        <div>
          <h3>Listen to the Podcast:</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
        {/* How It Works Section */}
        <div className="how-it-works">
        <h2>How It Works</h2>
        <p>Enter a topic of interest which is less than 25 charatcters in length. Next, simply click "Generate Podcast" to receive a news summary tailored for your daily commute. Our AI-powered system fetches the latest news, converts it into a digestible podcast, and delivers it in seconds.</p>
      </div>

      {/* Pricing Section */}
      <div className="pricing">
        <h2>Pricing Plans</h2>
        <div className="pricing-options">
          <div className="pricing-card free">
            <h3>Free Plan</h3>
            <p>✅ 1 podcast per day</p>
            <p>📢 Includes ads</p>
            <p>💰 $0/month</p>
          </div>
          <div className="pricing-card premium">
            <h3>Premium Plan</h3>
            <p>✅ 1 podcast per day</p>
            <p>✨ No ads & high-quality audio</p>
            <p>📅 Bonus Weekly Friday Review</p>
            <p>💰 $4.99/month</p>
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
