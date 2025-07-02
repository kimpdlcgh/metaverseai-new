import React, { useState, useEffect, cloneElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  Menu, 
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode; 
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    // Use location instead of window.location for React Router integration
    const currentPath = location.pathname;
    
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate, location]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (isSidebarOpen && sidebar && !sidebar.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    // Use layout effect to get current page title from the route
    const currentPath = window.location.pathname;
    if (currentPath.includes('dashboard')) setPageTitle('Dashboard');
    else if (currentPath.includes('portfolio')) setPageTitle('Portfolio');
    else if (currentPath.includes('transactions')) setPageTitle('Transactions');
    else if (currentPath.includes('wallet')) setPageTitle('Wallet');
    else if (currentPath.includes('goals')) setPageTitle('My Goals');
    else if (currentPath.includes('subscription')) setPageTitle('Subscription');
    else if (currentPath.includes('earning')) setPageTitle('Earning');
    else if (currentPath.includes('news')) setPageTitle('News');
    else if (currentPath.includes('settings')) setPageTitle('Settings');
    else if (currentPath.includes('profile')) setPageTitle('Profile');

   document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, navigate]);

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-50 text-gray-900'} transition-colors duration-200 font-opensans overflow-hidden`}>
      {/* Fixed Header */}
      <div className="flex-none">
        <Header toggleSidebar={toggleSidebar} pageTitle={pageTitle} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Fixed Sidebar */}
        <div className="flex-none sm:relative">
          <Sidebar isSidebarOpen={isSidebarOpen} isDarkMode={isDarkMode} />
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 overflow-y-auto overflow-x-hidden relative">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return cloneElement(child, { isDarkMode });
            }
            return child;
          })}
          
          {/* Footer */}
          <footer className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
            <div className="w-full px-4 sm:px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500 text-center md:text-left">
                  Copyright @2024, Creatively designed by 
                  <a href="#" className="text-blue-600 hover:underline ml-1">MetaverseAI</a>
                </span>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 touch-manipulation">Help</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 touch-manipulation">Terms of Use</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 touch-manipulation">Privacy Policy</a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}