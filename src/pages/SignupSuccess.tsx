import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Wallet, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SignupSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleInvestmentClick = () => {
    navigate('/onboarding');
  };

  const handleBrokerClick = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Congratulations */}
      <div className="w-full lg:flex-1 flex flex-col justify-center py-8 px-6 sm:py-12 sm:px-8 md:py-16 md:px-12 lg:px-16">
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Congratulations
          </h1>
          
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <p className="text-gray-600 text-base sm:text-lg">
              You come so far and ready!
            </p>
          </div>

          {/* Choice Cards */}
          <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div 
              onClick={handleInvestmentClick}
              className="flex items-center p-4 sm:p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleInvestmentClick();
                }
              }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Are you a Investment?</h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Small investment with 1-5 staff</p>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
            </div>

            <div 
              onClick={handleBrokerClick}
              className="flex items-center p-4 sm:p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBrokerClick();
                }
              }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Are you a Broker?</h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Broker with 5+ staff</p>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
            </div>
          </div>

          {/* Continue Button */}
          <div className="w-full">
            <Link to="/onboarding" className="block w-full">
              <Button className="w-full sm:w-auto sm:min-w-48 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Continue to Setup
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Investment Dashboard Preview */}
      <div className="w-full lg:flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 relative overflow-hidden min-h-96 lg:min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full blur-2xl sm:blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-24 h-24 sm:w-40 sm:h-40 bg-white rounded-full blur-2xl sm:blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-sm sm:max-w-md">
          {/* Dashboard Cards */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Wallet Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-600">My Wallet</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <span>USD</span>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 ml-2 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">$ 1152.25k</h2>
                <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                  Total net revenue is $ 756.83 • <span className="text-green-500">11.5%</span> increased in last week
                </p>
              </div>

              {/* Chart Bars */}
              <div className="flex items-end space-x-1 sm:space-x-2 h-12 sm:h-16 mb-3 sm:mb-4">
                <div className="w-3 sm:w-4 bg-blue-200 rounded-t" style={{ height: '30%' }}></div>
                <div className="w-3 sm:w-4 bg-blue-400 rounded-t" style={{ height: '60%' }}></div>
                <div className="w-3 sm:w-4 bg-blue-600 rounded-t" style={{ height: '100%' }}></div>
                <div className="w-3 sm:w-4 bg-blue-300 rounded-t" style={{ height: '45%' }}></div>
                <div className="w-3 sm:w-4 bg-blue-500 rounded-t" style={{ height: '80%' }}></div>
                <div className="w-3 sm:w-4 bg-blue-200 rounded-t" style={{ height: '25%' }}></div>
              </div>
            </div>

            {/* Investment Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mr-2 sm:mr-3 flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 mr-2">GS SEC</span>
                    <span className="text-xs text-gray-500">Place Buy</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">New GS 2025</h3>
                  <p className="text-xs text-gray-500">on Thu, 1 Aug 2024</p>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs sm:text-sm font-bold">C</span>
                </div>
                <span className="text-base sm:text-lg font-bold text-gray-900">$ 22500.00</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Zero Zeno Home</p>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>2 months</span>
                <span>22 months</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-2">
                <div className="bg-green-500 h-1.5 sm:h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">$ 165.52k</span>
                <span className="text-xs text-green-500">▲ 25.30%</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Create and Manage your Investment appointments easily at your own very personalized space.
            </h2>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">
              You are at the best Adminuiux Investment UX HTML template demo preview
            </p>
          </div>
        </div>

        {/* Bottom Right Logo */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};