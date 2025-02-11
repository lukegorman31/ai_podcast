import React from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function AudioPlayer({ title, description }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors">
          <Play className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-indigo-600 rounded-full"></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>1:23</span>
          <span>3:45</span>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ title, price, features, isPopular }) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg ${isPopular ? 'ring-2 ring-indigo-600' : ''}`}>
      <div className="flex justify-between items-baseline">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-500">{price}</p>
        </div>
        {isPopular && (
          <span className="inline-flex px-4 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
            Popular
          </span>
        )}
      </div>
      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="ml-3 text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`mt-8 w-full py-3 px-4 rounded-lg font-medium ${
        isPopular
          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      } transition-colors`}>
        Get started
      </button>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleStartCreating = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  // --- Data (Now defined within the component) ---
  const samplePodcasts = [
    {
      title: "Tech Trends 2025",
      description: "Exploring the future of technology and its impact on society",
    },
    {
      title: "AI Revolution",
      description: "Understanding the latest developments in artificial intelligence",
    },
    {
      title: "Future of Work",
      description: "How remote work is reshaping the global workforce",
    },
  ];

  const pricingPlans = [
    {
      title: "Basic",
      price: "Free",
      features: [
        "1 podcast per week",
        "Basic audio quality",
        "Standard topics",
        "Email support",
      ],
    },
    {
      title: "Pro",
      price: "$9/month",
      features: [
        "Daily podcasts",
        "Premium audio quality",
        "Custom topics",
        "Priority support",
        "Advanced analytics",
      ],
      isPopular: true,
    },
  ];
  // --- End of Data ---

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Your Personal AI Podcast Generator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Transform any topic into an engaging podcast with the power of AI. Perfect for commutes, learning, or staying informed.
        </p>
        <button
          onClick={handleStartCreating}
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Start Creating
        </button>
      </div>

      {/* Sample Podcasts */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Podcasts
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {samplePodcasts.map((podcast, index) => (
            <AudioPlayer key={index} {...podcast} />
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Simple, Transparent Pricing
        </h2>
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;