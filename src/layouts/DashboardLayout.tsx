import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Menu, X } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <Sidebar isSidebarOpen={isSidebarOpen} isDarkMode={isDarkMode} />

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-auto`}>
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500 text-center md:text-left">
              Copyright @2024, Creatively designed by 
              <a href="#" className="text-blue-600 hover:underline ml-1">InvestmentUX - Adminuiux</a> 
              on Earth ❤️
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
    </div>
  );
}