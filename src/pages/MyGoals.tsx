import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  User, 
  LogOut, 
  Home,
  Car,
  Flag,
  Calendar,
  DollarSign,
  Edit,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

interface MyGoalsProps {
  isDarkMode?: boolean;
}

interface Goal {
  id: string;
  name: string;
  type: string;
  icon: 'home' | 'car';
  target: number;
  duration: string;
  endDate: string;
  achieved: number;
  percentComplete: number;
  depositAmount: number;
  depositFrequency: string;
  background?: string;
  color?: string;
}

export default function MyGoals({ isDarkMode = false }: MyGoalsProps) {
  const { user } = useAuth();
  
  // Debug text
  const [totalGrowth, setTotalGrowth] = useState(7450);
  const [goalsCompletingSoon, setGoalsCompletingSoon] = useState(1);
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Sweet Home',
      type: 'Life Goal',
      icon: 'home',
      target: 22500.00,
      duration: '22 months',
      endDate: '22-09-2027',
      achieved: 2250.00,
      percentComplete: 10,
      depositAmount: 500.00,
      depositFrequency: 'every 1st day of month',
      color: 'bg-green-500'
    },
    {
      id: '2',
      name: 'Dream Car',
      type: 'Life Goal',
      icon: 'car',
      target: 10500.00,
      duration: '12 months',
      endDate: '19-10-2025',
      achieved: 5250.00,
      percentComplete: 50,
      depositAmount: 1050.00,
      depositFrequency: 'every 15th day of month',
      background: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      color: 'bg-blue-600'
    }
  ]);

  return (
    <div>
      {/* Debug text */}
      <div>My Goals Loaded</div>
      
      {/* Breadcrumb */}
          <div className="container-fluid mt-4">
            <div className="flex flex-wrap items-center">
              <div className="w-full sm:flex-1">
                <nav aria-label="breadcrumb" className="mb-2">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                    <li className="breadcrumb-item active" aria-current="page">My Goals</li>
                  </ol>
                </nav>
                <h5>My Goals</h5>
              </div>
              <div className="w-full sm:w-auto text-end py-3 py-sm-0">
                <a href="#" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Create Goal</span>
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Primary goal */}
              <div className="col-span-1 lg:col-span-12 xl:col-span-4">
                <div className="bg-blue-600 text-white rounded-lg p-6 shadow-sm relative overflow-hidden h-full">
                  <div className="absolute inset-0 opacity-25">
                    <img 
                      src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 flex flex-col justify-center h-full py-4">
                    <h2 className="text-xl font-normal mb-4">Your goals saving has been grown by</h2>
                    <h1 className="text-4xl font-bold mb-3">${totalGrowth.toLocaleString()}</h1>
                    <p className="opacity-90">{goalsCompletingSoon} goal will be completed soon</p>
                  </div>
                </div>
              </div>

              {/* Goals */}
              {goals.map((goal, index) => (
                <div key={index} className="col-span-1 lg:col-span-6 xl:col-span-4">
                  {index === 1 ? (
                    // Second goal with background image
                    <div className="bg-blue-600 text-white rounded-lg shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 opacity-25">
                        {goal.background && (
                          <img 
                            src={goal.background} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-6 relative z-10">
                        <div className="flex items-center mb-3">
                          <div className={`w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3`}>
                            {goal.icon === 'home' ? <Home className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{goal.name}</h4>
                            <p className="text-sm opacity-75">{goal.type}</p>
                          </div>
                        </div>
                        <div className="text-center my-6">
                          <div className="w-32 h-32 mx-auto mb-3 relative">
                            {/* Placeholder for progress circle */}
                            <div className="w-full h-full rounded-full border-4 border-white border-opacity-30 flex items-center justify-center">
                              <div 
                                className="absolute inset-0 rounded-full border-4 border-white" 
                                style={{ 
                                  clipPath: `polygon(50% 50%, 0 0, ${goal.percentComplete > 12 ? '100%' : '0'} 0, ${goal.percentComplete > 37 ? '100%' : '0'} 100%, ${goal.percentComplete > 62 ? '0' : '0'} 100%)`,
                                  opacity: 0.8
                                }}
                              ></div>
                              <span className="text-xl font-bold">{goal.percentComplete}%</span>
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold">${goal.target.toLocaleString()}</h2>
                          <p>{goal.duration}</p>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50">+ Add Money</button>
                          <button className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10">
                            <TrendingUp className="w-4 h-4 inline mr-2" /> Withdraw
                          </button>
                        </div>
                      </div>
                      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg mt-0`}>
                        <div className="p-4">
                          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 mb-3`}>
                            <div className="flex items-center">
                              <div className="text-red-500 text-3xl mr-3">🎯</div>
                              <p className="text-gray-600">Your target for sweet home is {goal.percentComplete}% completed in 6 months</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Flag className="w-5 h-5 mr-3 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Achieved</p>
                                <p>${goal.achieved.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Duration</p>
                                <p>{goal.endDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Deposit</p>
                                  <p>${goal.depositAmount.toLocaleString()} {goal.depositFrequency}</p>
                                </div>
                              </div>
                              <button className="p-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // First goal with standard layout
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <div className={`w-12 h-12 ${goal.color || 'bg-blue-500'} text-white rounded-lg flex items-center justify-center mr-3`}>
                            {goal.icon === 'home' ? <Home className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{goal.name}</h4>
                            <p className="text-sm text-gray-500">{goal.type}</p>
                          </div>
                        </div>
                        <div className="text-center my-6">
                          <div className="w-32 h-32 mx-auto mb-3 relative">
                            {/* Placeholder for progress circle */}
                            <div className="w-full h-full rounded-full border-4 border-gray-200 flex items-center justify-center">
                              <div 
                                className={`absolute inset-0 rounded-full border-4 ${goal.color || 'border-blue-500'}`} 
                                style={{ 
                                  clipPath: `polygon(50% 50%, 0 0, ${goal.percentComplete > 12 ? '100%' : '0'} 0, ${goal.percentComplete > 37 ? '100%' : '0'} 100%, ${goal.percentComplete > 62 ? '0' : '0'} 100%)`,
                                }}
                              ></div>
                              <span className="text-xl font-bold">{goal.percentComplete}%</span>
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold">${goal.target.toLocaleString()}</h2>
                          <p className="text-gray-500">{goal.duration}</p>
                        </div>
                        <div className="flex justify-center space-x-4 mb-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Add Money</button>
                          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                            <TrendingUp className="w-4 h-4 inline mr-2" /> Withdraw
                          </button>
                        </div>
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                          <div className="flex items-center">
                            <div className="text-red-500 text-3xl mr-3">🎯</div>
                            <p className="text-gray-600">Your target for sweet home is {goal.percentComplete}% completed in 2 months</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Flag className="w-5 h-5 mr-3 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Achieved</p>
                              <p>${goal.achieved.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Duration</p>
                              <p>{goal.endDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Deposit</p>
                                <p>${goal.depositAmount.toLocaleString()} {goal.depositFrequency}</p>
                              </div>
                            </div>
                            <button className="p-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
    </div>
  );
}