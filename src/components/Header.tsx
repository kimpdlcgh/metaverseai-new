import React from 'react';
import { Search, Sun, Moon, Bell, Menu, Home, Globe } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AvatarMenu from './AvatarMenu';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, pageTitle = 'Dashboard' }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN - English');
  const isDarkMode = theme === 'dark';

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'FR', name: 'French' },
    { code: 'CH', name: 'Chinese' },
    { code: 'HI', name: 'Hindi' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLanguageSelect = (code: string, name: string) => {
    setCurrentLanguage(`${code} - ${name}`);
    setShowLanguages(false);
    // Future language switching implementation would go here
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} shadow-sm border-b z-50 h-16 w-full`}>
      <div className="w-full px-4 sm:px-6 h-full transition-colors">
        <div className="flex justify-between items-center h-full">
          {/* Mobile Menu Button */}
          <button
            id="menu-button"
            onClick={toggleSidebar}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'} transition-colors sm:hidden`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <img 
              src={isDarkMode ? "/metaverselogo1.svg" : "/metaverseailogo.svg"}
              alt="MetaverseAI Logo" 
              className="h-10 mr-2 object-contain"
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
            
            {/* Language selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLanguages(!showLanguages)}
                className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'} transition-colors flex items-center`}
                aria-label="Select Language"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {showLanguages && (
                <div className="absolute right-0 mt-2 py-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code, lang.name)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        currentLanguage === `${lang.code} - ${lang.name}` ? 'bg-blue-600 text-white' : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {lang.code} - {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </button>

            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <div className="relative">
              <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">9</span>
              </button>
            </div>
            
            {/* Pass current language state to AvatarMenu */}
            <AvatarMenu 
              onSignOut={handleSignOut} 
              currentLanguage={currentLanguage} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
