import React, { useState } from 'react';
import { Mic, Radio, Sparkles, Lock, Crown } from 'lucide-react';

function App() {
  const [topic, setTopic] = useState("");
  const [podcastScript, setPodcastScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="flex items-center justify-center mb-8">
              <Lock className="w-8 h-8 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Login</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-indigo-600 text-white rounded-lg py-2 px-4 hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center mb-12">
            <div className="flex items-center">
              <Radio className="w-8 h-8 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold text-gray-800">The Daily Commute</span>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </nav>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your AI News Podcast Generator
              </h1>
              <p className="text-lg text-gray-600">
                Enter a topic and let AI create your personalized news podcast
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  maxLength={25}
                  placeholder="Enter your podcast topic..."
                  className="w-full px-6 py-4 text-lg rounded-full border-2 border-indigo-200 focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className={`absolute right-6 top-1/2 -translate-y-1/2 ${
                  topic.length > 25 ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {topic.length}/25
                </span>
              </div>
              <button
                type="submit"
                disabled={loading || topic.length > 25}
                className={`mt-4 w-full rounded-full py-4 px-8 flex items-center justify-center transition-colors ${
                  loading || topic.length > 25
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Mic className="w-5 h-5 mr-2" />
                {loading ? "Generating..." : "Generate Podcast"}
              </button>
              {message && (
                <p className={`mt-4 text-center ${
                  message.includes('❌') ? 'text-red-500' : 'text-green-500'
                }`}>
                  {message}
                </p>
              )}
            </form>

            {(podcastScript || audioUrl) && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                  Generated Podcast
                </h2>
                {podcastScript && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Script Preview</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700 whitespace-pre-wrap">{podcastScript}</p>
                    </div>
                  </div>
                )}
                {audioUrl && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Listen Now</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <audio controls className="w-full">
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Free</h3>
                </div>
                <p className="text-3xl font-bold mb-4">$0<span className="text-lg text-gray-600">/mo</span></p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>1 podcast per day</li>
                  <li>Includes ads</li>
                  <li>Basic quality audio</li>
                </ul>
                <button className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-200 transition-colors">
                  Current Plan
                </button>
              </div>
              <div className="bg-indigo-600 rounded-xl shadow-lg p-6 transform scale-105">
                <div className="flex items-center mb-4">
                  <Crown className="w-6 h-6 text-yellow-400 mr-2" />
                  <h3 className="text-xl font-bold text-white">Premium</h3>
                </div>
                <p className="text-3xl font-bold text-white mb-4">$4.99<span className="text-lg opacity-75">/mo</span></p>
                <ul className="space-y-2 text-white opacity-90 mb-6">
                  <li>Unlimited podcasts</li>
                  <li>Ad-free experience</li>
                  <li>High-quality audio</li>
                  <li>Weekly news digest</li>
                </ul>
                <button className="w-full bg-white text-indigo-600 rounded-lg py-2 px-4 hover:bg-gray-100 transition-colors">
                  Upgrade Now
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Enterprise</h3>
                </div>
                <p className="text-3xl font-bold mb-4">Custom</p>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>Custom integration</li>
                  <li>API access</li>
                  <li>Dedicated support</li>
                  <li>Custom voice options</li>
                </ul>
                <button className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-200 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-indigo-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Enter Topic</h3>
                  <p className="text-gray-600">Choose any news topic you're interested in</p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">AI Processing</h3>
                  <p className="text-gray-600">Our AI generates a custom podcast script</p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-indigo-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Listen</h3>
                  <p className="text-gray-600">Enjoy your personalized news podcast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;