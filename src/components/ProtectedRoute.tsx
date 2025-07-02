import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboardingComplete = false,
  redirectTo = '/login'
}) => {
  const { user, loading, onboardingCompleted, onboardingCheckInProgress } = useAuth();

  // Loading states - both auth loading and onboarding status loading
  if (loading || onboardingCheckInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If onboarding status is still loading, show loading spinner
  if (onboardingCompleted === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  // If accessing onboarding route but already completed, redirect to dashboard
  if (window.location.pathname === '/onboarding' && onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  // If accessing dashboard but onboarding not completed, redirect to onboarding
  if (requireOnboardingComplete && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace state={{ from: window.location.pathname }} />;
  }

  return <>{children}</>;
};