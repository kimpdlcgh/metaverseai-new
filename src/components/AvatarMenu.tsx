import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Layout, DollarSign, Gift, Settings, Power, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface AvatarMenuProps {
  onSignOut: () => Promise<void>;
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ onSignOut }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN - English');
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        avatarRef.current && 
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSignOut = async () => {
    await onSignOut();
    setIsOpen(false);
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    setIsLanguageOpen(false);
  };

  return (
    <div className="relative">
      {/* Avatar trigger */}
      <div 
        ref={avatarRef}
        className="flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="text-xs sm:text-sm text-right hidden md:block mr-2">
          <div className="font-medium truncate max-w-32">{user?.email}</div>
          <div className="text-gray-500">$1,100.00</div>
        </div>
        <img 
          src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Profile" 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
          role="menu"
        >
          {/* User info header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center">
              <div className="mr-3">
                <img 
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
              </div>
              <div>
                <p className="font-medium">AdminUIUX</p>
                <p className="flex items-center text-sm">
                  <span className="mr-1">$1100.00</span>
                  <span className="text-xs opacity-75">Balance</span>
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <NavLink 
              to="/profile" 
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-5 h-5 mr-3 text-gray-500" />
              <span>My Profile</span>
            </NavLink>

            <NavLink 
              to="/app/dashboard" 
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <Layout className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Dashboard</span>
                </div>
                <div className="flex">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                    9+
                  </div>
                </div>
              </div>
            </NavLink>

            <NavLink 
              to="/app/portfolio" 
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Portfolio</span>
                </div>
              </div>
            </NavLink>

            <NavLink 
              to="/app/transactions" 
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Transactions</span>
                </div>
              </div>
            </NavLink>

            <NavLink 
              to="/app/earning" 
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
              <span>Earning</span>
            </NavLink>

            <NavLink 
              to="/app/subscription"
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <Gift className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Subscription</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 text-xs mr-2">Upgrade</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </NavLink>
            
            <NavLink 
              to="/app/news"
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 text-gray-500">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                    <path d="M18 14h-8"></path>
                    <path d="M15 18h-5"></path>
                    <path d="M10 6h8v4h-8V6Z"></path>
                  </svg>
                  <span>News</span>
                </div>
              </div>
            </NavLink>

            {/* Language dropdown */}
            <div className="relative">
              <button 
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLanguageOpen(!isLanguageOpen);
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    <span className="w-5 h-5 mr-3 flex items-center justify-center text-gray-500">🌐</span>
                    <span>Language</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-xs mr-2">{currentLanguage}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </button>
            </div>

            <NavLink 
              to="/app/settings"
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <span>Account Setting</span>
            </NavLink>

            <button 
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors w-full text-red-600"
              onClick={handleSignOut}
            >
              <Power className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;