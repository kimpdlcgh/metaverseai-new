import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { SignupSuccess } from './pages/SignupSuccess';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import { InvestorOnboardingFlow } from './components/investor/InvestorOnboardingFlow';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { OnboardingLayout } from './pages/onboarding/OnboardingLayout';
import { Step1Profile } from './pages/onboarding/Step1Profile';
import { Step2Address } from './pages/onboarding/Step2Address';
import { Step3Goals } from './pages/onboarding/Step3Goals';
import Transactions from './pages/Transactions';
import Wallet from './pages/Wallet';
import MyGoals from './pages/MyGoals';
import Settings from './pages/Settings';
import Users from './pages/settings/Users';
import Timing from './pages/settings/Timing';
import Payments from './pages/settings/Payments';
import Contact from './pages/settings/Contact';
import Earning from './pages/Earning';
import Subscription from './pages/Subscription';
import MainLayout from './layouts/MainLayout';
import News from './pages/News';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup-success" element={
                  <ProtectedRoute requireOnboardingComplete={false}>
                    <SignupSuccess />
                  </ProtectedRoute>
                } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainLayout>
                    <UserProfile />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <MainLayout>
                    <EditProfile />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <InvestorOnboardingFlow />
                </ProtectedRoute>
              }/>
            
              {/* General User Onboarding Routes */}
              <Route path="/user-onboarding" element={
                <ProtectedRoute>
                  <Navigate to="/user-onboarding/step1" replace />
                </ProtectedRoute>
              }/>
              
              <Route path="/user-onboarding/step1" element={
                <ProtectedRoute>
                  <Step1Profile />
                </ProtectedRoute>
              }/>
              
              <Route path="/user-onboarding/step2" element={
                <ProtectedRoute>
                  <Step2Address />
                </ProtectedRoute>
              }/>
              
              <Route path="/user-onboarding/step3" element={
                <ProtectedRoute>
                  <Step3Goals />
                </ProtectedRoute>
              }/>

            <Route path="/dashboard" element={
              <ProtectedRoute requireOnboardingComplete={true}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/app/portfolio" element={
              <ProtectedRoute requireOnboardingComplete={true}>
                  <MainLayout>
                    <Portfolio />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/transactions" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Transactions />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/wallet" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Wallet />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/goals" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MyGoals />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/settings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/settings/users" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Users />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/settings/timing" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Timing />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/settings/payments" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Payments />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/settings/contact" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Contact />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/earning" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Earning />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/subscription" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Subscription isDarkMode={false} />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/app/news" element={
                <ProtectedRoute>
                  <MainLayout>
                    <News />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
