import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Target, 
  Building, 
  Search, 
  BarChart, 
  BarChart3,
  Calculator, 
  Layers, 
  Users, 
  Settings,
  X,
  DollarSign,
  Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, isDarkMode }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
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
      {/* Mobile sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 sm:hidden">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
          <span className="font-bold">Menu</span>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-6">
          <h6 className="text-sm font-medium mb-4">Main Menu</h6>
          <div className="text-center mb-4">
            <img 
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Profile" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <h5 className="font-medium">{user?.email?.split('@')[0] || 'User'}</h5>
            <p className="text-sm text-gray-500">{user?.email || 'Investment Platform'}</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { path: "/dashboard", icon: <TrendingUp className="w-5 h-5" />, label: "Dashboard" },
            { path: "/app/wallet", icon: <Wallet className="w-5 h-5" />, label: "Wallet" },
            { path: "/app/goals", icon: <Target className="w-5 h-5" />, label: "My Goals" },
            { path: "/app/portfolio", icon: <BarChart3 className="w-5 h-5" />, label: "Portfolio" },
            { path: "/app/transactions", icon: <TrendingUp className="w-5 h-5" />, label: "Transactions" },
            { path: "/app/subscription", icon: <Gift className="w-5 h-5" />, label: "Subscription" },
            { path: "/app/earning", icon: <DollarSign className="w-5 h-5" />, label: "Earning" },
            { path: "/app/news", icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                <path d="M18 14h-8"></path>
                <path d="M15 18h-5"></path>
                <path d="M10 6h8v4h-8V6Z"></path>
              </svg>
            ), label: "News" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-lg ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : `${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-inherit`
                } transition-colors touch-manipulation`
              }
              end={item.path === "/dashboard"}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom navigation items */}
        <div className="mt-auto space-y-2">
          {[
            { path: "/profile", icon: <Users className="w-5 h-5" />, label: "My Profile" },
            { path: "/app/settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-lg ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : `${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-inherit`
                } transition-colors touch-manipulation`
              }
              end={item.path === "/profile"}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;