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
          src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2&t=1" 
          alt="Profile" 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
          role="menu"
        >
          {/* User info header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
            <div className="flex items-center">
              <div className="mr-3">
                <img 
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2&t=1" 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              </div>
              <div>
                <p className="font-semibold text-base font-lexend">AdminUIUX</p>
                <p className="flex items-center text-sm font-opensans">
                  <span className="mr-1">$1100.00</span>
                  <span className="text-xs opacity-75">Balance</span>
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-5 h-5 mr-3 text-gray-500" />
              <span className="font-lexend">My Profile</span>
            </Link>

            <Link 
              to="/app/dashboard" 
              className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <Layout className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-lexend">Dashboard</span>
                </div>
                <div className="flex">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                    9+
                  </div>
                </div>
              </div>
            </Link>

            <Link 
              to="/app/earning" 
              className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
              <span className="font-lexend">Earning</span>
            </Link>

            <Link 
              to="/app/subscription"
              className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <Gift className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-lexend">My Subscription</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 text-xs mr-2">Upgrade</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </Link>
            
            {/* Language dropdown */}
            <div className="relative">
              <button 
                className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLanguageOpen(!isLanguageOpen);
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    <span className="w-5 h-5 mr-3 flex items-center justify-center text-gray-500">🌐</span>
                    <span className="font-lexend">Language</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-xs mr-2">{currentLanguage}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </button>
            </div>

            <Link 
              to="/app/settings"
              className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <span className="font-lexend">Account Setting</span>
            </Link>

            <button 
              className="flex items-center px-4 py-3 hover:bg-red-50 transition-colors w-full text-red-600 mt-2 border-t border-gray-100"
              onClick={handleSignOut}
            >
              <Power className="w-5 h-5 mr-3" />
              <span className="font-lexend">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;