// App.js (Complete)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import { AuthProvider, useAuth } from './AuthContext'; // Import AuthProvider

function App() {
  const { session, signOut } = useAuth();

  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Router>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                    Daily Commute Pod
                  </span>
                </Link>

                <div className="flex items-center space-x-4">
                  {/* Dashboard Link (Always visible) */}
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Dashboard
                  </Link>

                  {/* Sign In / Sign Out Button (Conditional) */}
                  {!session ? (
                    <Link
                      to="/auth"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Sign In
                    </Link>
                  ) : (
                    <button
                      onClick={signOut}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/auth" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;