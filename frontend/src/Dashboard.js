import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Settings, LogOut, Mic, RefreshCw } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [podcastScript, setPodcastScript] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState('daily');

  useEffect(() => {
    const fetchUserProfile = async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setUserProfile(data);
        if (data) setSubscriptionType(data.subscription_type || 'daily');
      }
    };

    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) fetchUserProfile(session.user.id);
    };
    
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleGeneratePodcast = async () => {
    if (!topic.trim()) {
      setMessage("❌ Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/generate_podcast?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();
      setPodcastScript(data.podcast_script);
      setAudioUrl(data.audio_url);
      setMessage("✅ Podcast generated successfully!");
    } catch (error) {
      console.error("Error generating podcast:", error);
      setMessage("❌ Failed to generate podcast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {}}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Subscription Plan</h3>
          <select
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="daily">Daily Plan</option>
            <option value="weekly">Weekly Plan</option>
          </select>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Podcasts Generated</h3>
          <p className="text-3xl font-bold text-indigo-600">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Next Available</h3>
          <p className="text-3xl font-bold text-green-600">Now</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate New Podcast</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your podcast topic..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleGeneratePodcast}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Mic className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Generating...' : 'Generate Podcast'}
          </button>
        </div>
        {message && (
          <p className={`mt-4 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>

      {(podcastScript || audioUrl) && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Podcast</h2>
          {podcastScript && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Script</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap">{podcastScript}</pre>
              </div>
            </div>
          )}
          {audioUrl && (
            <div>
              <h3 className="text-lg font-medium mb-2">Audio</h3>
              <audio src={audioUrl} controls className="w-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;