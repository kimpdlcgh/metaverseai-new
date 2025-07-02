import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean | null;
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  const checkOnboardingStatus = async () => {
    if (!user) {
      setOnboardingCompleted(null);
      return;
    }

    try {
      // Check if user has completed investor onboarding
      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('investor_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (investorError) {
        console.error('Error checking investor profile:', investorError);
        setOnboardingCompleted(false);
        return;
      }

      if (!investor) {
        setOnboardingCompleted(false);
        return;
      }

      // Check if investment profile is completed
      const { data: investmentProfile, error: profileError } = await supabase
        .from('investment_profiles')
        .select('profile_id')
        .eq('investor_id', investor.investor_id)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking investment profile:', profileError);
        setOnboardingCompleted(false);
        return;
      }

      // Onboarding is completed if investment profile exists
      setOnboardingCompleted(!!investmentProfile);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setOnboardingCompleted(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Reset onboarding status when user changes
      if (event === 'SIGNED_OUT') {
        setOnboardingCompleted(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check onboarding status when user changes
  useEffect(() => {
    if (user && !loading) {
      checkOnboardingStatus();
    }
  }, [user, loading]);

  const signUp = async (email: string, password: string, options?: { data?: any }) => {
    try {
      // Sign up with email confirmation disabled for development
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          ...options,
          emailRedirectTo: undefined, // Disable email confirmation
        }
      });

      if (error) {
        throw error;
      }

      // If user is immediately available (email confirmation disabled), create profile
      if (data.user && !data.user.email_confirmed_at) {
        // For development, we'll treat the user as confirmed
        console.log('User signed up successfully (email confirmation disabled for development)');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    onboardingCompleted,
    signUp,
    signIn,
    signOut,
    checkOnboardingStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}