import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient'; // Import your Supabase client

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setLoading(false);
        if (session) {
          const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setUser(profile);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  },);

  const value = { session, user, loading }; // Make user available in context

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};