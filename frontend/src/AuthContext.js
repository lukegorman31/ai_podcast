// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient'; // Import your Supabase client

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the initial session (if any)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Initial loading is done
      if (session) {
        fetchUserProfile(session.user.id); // Fetch profile immediately if logged in
      }
    });

    // Subscribe to authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setLoading(false); // Set loading to false after auth change
        if (session) {
          fetchUserProfile(session.user.id); // Fetch profile on login
        } else {
          setUser(null); // Clear user on logout
        }
      }
    );

    // Unsubscribe on unmount
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      // Consider setting an error state here for UI feedback
    } else {
      setUser(profile); // Set the user state with profile data
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      // Optionally, display an error message to the user using a state variable
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut, // Expose the signOut function
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only when loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};