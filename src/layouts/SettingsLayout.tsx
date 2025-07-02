import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { 
  TrendingUp, 
  User, 
  LogOut, 
  Settings, 
  Clock, 
  Camera,
  DollarSign,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      {/* Mobile Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b sticky top-0 z-50`}>
        <div className="w-full px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              id="menu-button"
              onClick={toggleSidebar}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors sm:hidden`}
            >
              <TrendingUp className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-2 sm:mr-3" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold">InvestmentUX</h1>
                <p className="text-xs text-gray-500 hidden sm:block">AdminUIUX HTML template</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <a href="/dashboard" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Dashboard</a>
              <a href="/app/portfolio" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Portfolio</a>
              <a href="/app/transactions" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Transaction</a>
              <a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>News</a>
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                {isDarkMode ? <span className="w-5 h-5">☀️</span> : <span className="w-5 h-5">🌙</span>}
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-xs sm:text-sm text-right hidden md:block">
                  <div className="font-medium truncate max-w-32">{user?.email}</div>
                  <div className="text-gray-500">$1,100.00</div>
                </div>
                <img 
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" 
                  alt="Profile" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                <button className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside 
          id="mobile-sidebar"
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            sm:translate-x-0 
            fixed sm:sticky 
            top-0 sm:top-16 
            left-0 
            w-64 sm:w-64 
            h-screen sm:h-[calc(100vh-4rem)] 
            ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
            border-r 
            transition-transform duration-300 ease-in-out 
            z-50 sm:z-auto 
            flex flex-col
            overflow-y-auto
          `}
        >
          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-6">
              <h6 className="text-sm font-medium mb-4">Main Menu</h6>
              <div className="text-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" 
                  alt="Profile" 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h5 className="font-medium">AdminUIUX</h5>
                <p className="text-sm text-gray-500">Investment UI Kit</p>
              </div>
            </div>

            <nav className="space-y-2 flex-1">
              <a href="/dashboard" className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors touch-manipulation`}>
                <TrendingUp className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a href="/app/wallet" className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors touch-manipulation`}>
                <TrendingUp className="w-5 h-5" />
                <span>Wallet</span>
              </a>
              <a href="/app/goals" className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors touch-manipulation`}>
                <TrendingUp className="w-5 h-5" />
                <span>My Goals</span>
              </a>
              <a href="#" className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors touch-manipulation`}>
                <TrendingUp className="w-5 h-5" />
                <span>My Loans</span>
              </a>
              <a href="/app/portfolio" className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors touch-manipulation`}>
                <TrendingUp className="w-5 h-5" />
                <span>Portfolio</span>
              </a>
              <a href="/app/transactions" className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors touch-manipulation`}>
                <TrendingUp className="w-5 h-5" />
                <span>Transactions</span>
              </a>
              <a href="/app/settings" className="flex items-center space-x-3 px-3 py-3 bg-blue-600 text-white rounded-lg touch-manipulation">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          <div className="container mt-4">
            <div className="row">
              <div className="col-12 col-md-4 col-lg-4 col-xl-3">
                <div className="position-sticky" style={{ top: '5.5rem' }}>
                  <div className="card bg-white rounded-lg shadow-sm mb-4">
                    <div className="card-body">
                      <ul className="nav nav-pills flex-column">
                        <li className="nav-item">
                          <NavLink 
                            to="/app/settings" 
                            className={({ isActive }) => 
                              `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
                            }
                            end
                          >
                            <div className="w-7 h-7 flex items-center justify-center mr-3">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium mb-0">My Profile</p>
                              <p className="text-xs opacity-75">Basic Details</p>
                            </div>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink 
                            to="/app/settings/users" 
                            className={({ isActive }) => 
                              `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
                            }
                          >
                            <div className="w-7 h-7 flex items-center justify-center mr-3">
                              <span className="text-xl">👥</span>
                            </div>
                            <div>
                              <p className="font-medium mb-0">Users</p>
                              <p className="text-xs opacity-75">Roles, Permission, Access</p>
                            </div>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink 
                            to="/app/settings/timing" 
                            className={({ isActive }) => 
                              `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
                            }
                          >
                            <div className="w-7 h-7 flex items-center justify-center mr-3">
                              <Clock className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium mb-0">Timing</p>
                              <p className="text-xs opacity-75">Business hours, Emergency</p>
                            </div>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink 
                            to="/app/settings/payments" 
                            className={({ isActive }) => 
                              `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
                            }
                          >
                            <div className="w-7 h-7 flex items-center justify-center mr-3">
                              <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium mb-0">Payment</p>
                              <p className="text-xs opacity-75">Online, Devices, Cash</p>
                            </div>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink 
                            to="/app/settings/contact" 
                            className={({ isActive }) => 
                              `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
                            }
                          >
                            <div className="w-7 h-7 flex items-center justify-center mr-3">
                              <LifeBuoy className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium mb-0">Contact</p>
                              <p className="text-xs opacity-75">Support, Call, Chat, email</p>
                            </div>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                {children}
              </div>
            </div>
          </div>
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