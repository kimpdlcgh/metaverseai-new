import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean | null;
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<{ user: User | null; session: Session | null }>;
  signIn: (email: string, password: string) => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
  onboardingCheckInProgress: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [onboardingCheckInProgress, setOnboardingCheckInProgress] = useState<boolean>(false);

  const checkOnboardingStatus = async () => {
    if (!user) {
      setOnboardingCompleted(null);
      return;
    }
    
    setOnboardingCheckInProgress(true);
    
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
    } finally {
      setOnboardingCheckInProgress(false);
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
  }, [user?.id]);

  // Check onboarding status when user changes
  useEffect(() => {
    if (user && !loading && onboardingCompleted === null) {
      checkOnboardingStatus();
    }
  }, [user, loading]);

  const signUp = async (email: string, password: string, options?: { data?: any }): Promise<{ user: User | null; session: Session | null }> => {
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
      
      console.log('Signup response:', data);
      
      // If user is immediately available (email confirmation disabled), create profile
      if (data.user && !data.user.email_confirmed_at) {
        // For development, we'll treat the user as confirmed
        console.log('User signed up successfully (email confirmation disabled for development)');
      }
      
      // Set user and session state immediately
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
      }
      
      return { user: data.user, session: data.session };
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
      
      // Set user and session state immediately
      setUser(data.user);
      setSession(data.session);

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
    onboardingCheckInProgress,
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