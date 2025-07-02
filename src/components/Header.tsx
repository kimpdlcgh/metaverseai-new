import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, Menu, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AvatarMenu from './AvatarMenu';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, pageTitle = 'Dashboard' }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b sticky top-0 z-50 h-16`}>
      <div className="w-full px-4 sm:px-6 h-full">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Mobile Menu Button */}
          <button
            id="menu-button"
            onClick={toggleSidebar}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors sm:hidden`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-blue-600 mr-3"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold font-lexend leading-tight">InvestmentUX</h1>
              <div className="hidden sm:flex items-center text-xs text-gray-500">
                <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                  <Home className="w-3 h-3 inline mr-1" />
                  <span>Home</span>
                </Link>
                {pageTitle && (
                  <>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-600">{pageTitle}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            <Link to="/dashboard" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend`}>
              Dashboard
            </Link>
            <Link to="/app/portfolio" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend`}>
              Portfolio
            </Link>
            <Link to="/app/transactions" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend`}>
              Transaction
            </Link>
            <Link to="/app/earning" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend`}>
              Earning
            </Link>
            <Link to="/app/news" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend`}>
              News
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors hidden sm:block`}>
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <div className="relative">
              <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">9</span>
              </button>
            </div>

            <AvatarMenu onSignOut={handleSignOut} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
