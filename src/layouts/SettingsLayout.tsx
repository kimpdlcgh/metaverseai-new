import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Clock, 
  DollarSign,
  LifeBuoy,
} from 'lucide-react';
import MainLayout from './MainLayout';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <MainLayout>
      <div className="container p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/4">
                <div className="sticky top-0 pt-4">
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
              <div className="w-full lg:w-3/4">
                {children}
              </div>
            </div>
      </div>
    </MainLayout>
  );
}