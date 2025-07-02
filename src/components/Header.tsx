import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, Menu, Home } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
          <Link to="/dashboard" className="flex items-center">
            <img
              src="/metaverseai.logo.png"
              alt="MetaverseAI Logo"
              className="h-10 mr-2"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            <NavLink to="/dashboard" className={({ isActive }) => `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend ${isActive ? 'font-medium text-blue-600' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/app/portfolio" className={({ isActive }) => `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend ${isActive ? 'font-medium text-blue-600' : ''}`}>
              Portfolio
            </NavLink>
            <NavLink to="/app/transactions" className={({ isActive }) => `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend ${isActive ? 'font-medium text-blue-600' : ''}`}>
              Transaction
            </NavLink>
            <NavLink to="/app/earning" className={({ isActive }) => `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend ${isActive ? 'font-medium text-blue-600' : ''}`}>
              Earning
            </NavLink>
            <NavLink to="/app/news" className={({ isActive }) => `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-lexend ${isActive ? 'font-medium text-blue-600' : ''}`}>
              News
            </NavLink>
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
