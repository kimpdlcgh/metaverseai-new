import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, User, LogOut, DollarSign, Target, Clock, Shield, Wallet, BarChart3, Calendar, Percent, HashIcon as CashStack, UserCheck, Tags, ShieldCheck, Building, Home, Car, Send, Award, ArrowUp, ArrowDown, MoreHorizontal, RefreshCw, Search, Settings, Users, Gift, Bell, Grid3X3, Sun, Moon, Menu, AlertTriangle, Calculator, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

interface DashboardProps {
  isDarkMode?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isDarkMode = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sample data for the dashboard
  const portfolioData = {
    totalProfit: 13200,
    bestProfit: 8340,
    topLoser: -5150,
    currentValue: 65520,
    profitRevenue: 15510,
    investment: 45000,
    walletBalance: 1152250
  };

  const marketUpdates = [
    { name: "GIFTS NIFTYS", value: 24806.00, change: 1.40, trend: "up" },
    { name: "Nikkies 2250", value: 41118.13, change: 0.40, trend: "up" },
    { name: "JOHN DOUES", value: 30006.00, change: -0.40, trend: "down" },
    { name: "Adminuiux Love", value: 90105.00, change: 1.40, trend: "up" }
  ];

  const investmentCategories = [
    { name: "Share Holdings", value: 165520, percentage: 25.30, color: "bg-green-500" },
    { name: "Mutual Funds", value: 265850, percentage: 21.42, color: "bg-yellow-500" },
    { name: "Bank Bonds", value: 356260, percentage: 20.18, color: "bg-orange-500" },
    { name: "Gov. Securities", value: 18565, percentage: 15.65, color: "bg-purple-500" },
    { name: "Fixed Deposit", value: 190450, percentage: 18.50, color: "bg-gray-500" }
  ];

  const investmentOptions = [
    { title: "Company Shares", icon: Building, href: "/company-shares" },
    { title: "Mutual Funds", icon: Calendar, href: "/mutual-funds" },
    { title: "Fixed Deposits", icon: Percent, href: "/fixed-deposits" },
    { title: "Investment Plans", icon: CashStack, href: "/investment-plans" },
    { title: "Retirement Plans", icon: UserCheck, href: "/retirement-plans" },
    { title: "Tax Saving", icon: Tags, href: "/tax-saving" },
    { title: "Guaranteed Return", icon: ShieldCheck, href: "/guaranteed-return" },
    { title: "Gov. Securities", icon: Building, href: "/government-securities" }
  ];

  const goals = [
    {
      title: "Sweet Home",
      target: 22500,
      progress: 10,
      timeLeft: "22 months",
      timeSpent: "2 months",
      icon: Home,
      color: "bg-green-500"
    },
    {
      title: "Car",
      target: 10500,
      progress: 30,
      timeLeft: "9 months",
      timeSpent: "3 months",
      icon: Car,
      color: "bg-blue-500"
    }
  ];

  const holdings = [
    {
      company: "Jintudal",
      price: 100.45,
      ltp: 152,
      units: 102,
      invested: 1400.45,
      profit: 305.5,
      profitPercent: 25.30,
      trend: "Bullish",
      change: 1.24,
      hasEvent: true
    },
    {
      company: "Ciplasc",
      price: 520.45,
      ltp: 521.05,
      units: 50,
      invested: 1520.45,
      profit: 408.65,
      profitPercent: 15.40,
      trend: "Bearish",
      change: -0.85,
      hasEvent: false
    },
    {
      company: "Trisha LLC",
      price: 856.45,
      ltp: 856.55,
      units: 20,
      invested: 2050.00,
      profit: 685.00,
      profitPercent: 35.15,
      trend: "Bullish",
      change: 1.03,
      hasEvent: false
    }
  ];

  return (
    <div>
      <div className="w-full max-w-none p-4 sm:p-6 space-y-4 sm:space-y-6 md:space-y-8">
            {/* Welcome Section */}
            <div className="w-full">
              <div className="flex flex-col space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg text-gray-500 mb-1">Good Morning,</h3>
                  <h1 className="text-2xl sm:text-3xl font-bold">Investor</h1>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm w-full`}>
                    <p className="text-sm text-gray-500 mb-1">Total Profit</p>
                    <h4 className="text-lg sm:text-xl font-bold mb-2">${portfolioData.totalProfit.toLocaleString()}</h4>
                    <span className="inline-flex items-center text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      28.50%
                    </span>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm w-full`}>
                    <p className="text-sm text-gray-500 mb-1">Best Profit</p>
                    <h4 className="text-lg sm:text-xl font-bold mb-2">${portfolioData.bestProfit.toLocaleString()}</h4>
                    <span className="inline-flex items-center text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      54.35%
                    </span>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm w-full sm:col-span-2 lg:col-span-1`}>
                    <p className="text-sm text-gray-500 mb-1">Top Loser</p>
                    <h4 className="text-lg sm:text-xl font-bold mb-2">-${Math.abs(portfolioData.topLoser).toLocaleString()}</h4>
                    <span className="inline-flex items-center text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                      <ArrowDown className="w-3 h-3 mr-1" />
                      18.25%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Growth and Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Portfolio Growth Card */}
              <div className="w-full lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden w-full">
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src="[IMG_PLACEHOLDER_400px_x_300px]" 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-lg sm:text-xl font-normal mb-4">Your portfolio value has been grown by</h2>
                    <h1 className="text-2xl sm:text-4xl font-bold mb-2">$7.52k</h1>
                    <p className="opacity-90">In last 7 days</p>
                  </div>
                </div>
              </div>

              {/* Summary and Chart */}
              <div className="w-full lg:col-span-2">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm w-full`}>
                  <div className="grid grid-cols-1 xl:grid-cols-2">
                    {/* Summary Cards */}
                    <div className="p-4 sm:p-6 w-full">
                      <h6 className="font-medium mb-4">Summary</h6>
                      
                      <div className="space-y-4 w-full">
                        <div className="bg-blue-600 rounded-lg p-4 text-white w-full">
                          <p className="text-sm opacity-90 mb-1">Current Value</p>
                          <h4 className="text-lg sm:text-xl font-medium">
                            ${portfolioData.currentValue.toLocaleString()}
                            <span className="text-sm ml-2">
                              <ArrowUp className="w-3 h-3 inline mr-1" />
                              18.5%
                            </span>
                          </h4>
                        </div>
                        
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4 w-full`}>
                          <p className="text-sm text-gray-500 mb-1">Profit Revenue</p>
                          <h4 className="text-lg sm:text-xl font-medium">
                            ${portfolioData.profitRevenue.toLocaleString()}
                            <span className="text-sm text-green-600 ml-2">
                              <ArrowUp className="w-3 h-3 inline mr-1" />
                              11.5%
                            </span>
                          </h4>
                        </div>
                        
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4 w-full`}>
                          <p className="text-sm text-gray-500 mb-1">Investment</p>
                          <h4 className="text-lg sm:text-xl font-medium">${portfolioData.investment.toLocaleString()}</h4>
                        </div>
                      </div>
                    </div>

                    {/* Chart Section */}
                    <div className="p-4 sm:p-6 w-full">
                      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded touch-manipulation">1W</button>
                          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:bg-gray-100 rounded touch-manipulation">1D</button>
                          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:bg-gray-100 rounded touch-manipulation">1M</button>
                          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:bg-gray-100 rounded touch-manipulation">1Y</button>
                          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:bg-gray-100 rounded touch-manipulation">All</button>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded touch-manipulation">
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center w-full">
                        <div className="text-center text-gray-500">
                          <BarChart3 className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-xs sm:text-sm">Chart Placeholder</p>
                          <p className="text-xs">Portfolio Performance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Updates */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h6 className="font-medium">Updates:</h6>
                  <p className="text-sm text-gray-500">Today <span className="text-red-500">Live</span></p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg touch-manipulation">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-2 w-full">
                {marketUpdates.map((update, index) => (
                  <div key={index} className="flex-shrink-0 min-w-40 sm:min-w-48">
                    <h6 className={`font-medium text-sm sm:text-base ${update.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {update.value.toLocaleString()}
                    </h6>
                    <p className="text-xs sm:text-sm">
                      <span className="text-gray-500">{update.name}:</span>
                      <span className={`ml-1 ${update.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {update.trend === 'up' ? '▲' : '▼'} {Math.abs(update.change)}%
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Categories and Wallet */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Investment Categories */}
              <div className="w-full xl:col-span-2">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm w-full`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Doughnut Chart */}
                    <div className="p-4 sm:p-6 w-full">
                      <h6 className="font-medium mb-4">Investment Categories</h6>
                      <div className="relative flex items-center justify-center mb-4">
                        <div className="absolute text-center">
                          <h4 className="text-lg sm:text-xl font-bold">$1,165.30k</h4>
                          <p className="text-xs sm:text-sm text-gray-500">Portfolio Value</p>
                        </div>
                        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 via-purple-400 to-gray-400 flex items-center justify-center">
                          <div className={`w-20 h-20 sm:w-32 sm:h-32 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}></div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        You have invested in different types of categories shown as above and summary of each category.
                      </p>
                    </div>

                    {/* Category Details */}
                    <div className="p-4 sm:p-6 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {investmentCategories.map((category, index) => (
                          <div key={index} className="mb-4 w-full">
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center">
                              <span className={`w-3 h-3 rounded mr-2 ${category.color}`}></span>
                              {category.name}
                            </p>
                            <h4 className="font-medium text-sm sm:text-base">
                              ${category.value.toLocaleString()}
                              <br />
                              <span className="text-xs sm:text-sm text-green-600 font-normal">
                                <ArrowUp className="w-3 h-3 inline mr-1" />
                                {category.percentage}%
                              </span>
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div className="w-full xl:col-span-1">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm h-full w-full`}>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <h6 className="font-medium text-sm sm:text-base">My Wallet</h6>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select className="text-xs sm:text-sm border rounded px-2 py-1">
                          <option>USD</option>
                          <option>CAD</option>
                          <option>AUD</option>
                        </select>
                        <button className="p-1 hover:bg-gray-100 rounded touch-manipulation">
                          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-medium mb-2">${portfolioData.walletBalance.toLocaleString()}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                      Total net revenue is $756.83 
                      <span className="text-green-600 ml-1">
                        <ArrowUp className="w-3 h-3 inline mr-1" />
                        11.5%
                      </span> 
                      increased in last week
                    </p>

                    {/* Mini Chart */}
                    <div className="h-16 sm:h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center w-full">
                      <div className="text-center text-blue-600">
                        <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1" />
                        <p className="text-xs">Chart</p>
                      </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-3 sm:p-4 w-full`}>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Top performing investment is <strong className="text-blue-600">Share Holdings</strong>
                      </p>
                      <h4 className="font-medium text-sm sm:text-base">
                        $165.52k 
                        <span className="text-xs sm:text-sm text-green-600 ml-2">
                          <ArrowUp className="w-3 h-3 inline mr-1" />
                          25.30%
                        </span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Options */}
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                {investmentOptions.map((option, index) => (
                  <a
                    key={index}
                    href={option.href}
                    className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-xl p-3 sm:p-4 text-center shadow-sm transition-colors group w-full touch-manipulation`}
                  >
                    <option.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-xs sm:text-sm text-gray-600 leading-tight">{option.title}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Goals and Additional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Goals */}
              {goals.map((goal, index) => (
                <div key={index} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 sm:p-6 w-full`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${goal.color} text-white rounded-lg flex items-center justify-center mr-3 sm:mr-4`}>
                      <goal.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold">${goal.target.toLocaleString()}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">Goal: {goal.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2">
                    <span>{goal.timeSpent}</span>
                    <span>{goal.timeLeft}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${goal.color.replace('bg-', 'bg-')}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>{goal.progress}%</span>
                    <span>{100 - goal.progress}%</span>
                  </div>
                </div>
              ))}

              {/* Referral Card */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 sm:p-6 w-full`}>
                <div className="flex items-center">
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-bold mb-2">Refer friends & earn</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                      Ask your friend to join us & earn 10% of profit they made first time.
                    </p>
                    <Button size="sm" variant="outline" className="touch-manipulation">
                      Invite to Join
                    </Button>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center ml-4">
                    <Send className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
              </div>

              {/* G-SEC Bid Card */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 sm:p-6 border border-blue-200 w-full`}>
                <div className="flex items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden mr-3 sm:mr-4">
                    <img 
                      src="[IMG_PLACEHOLDER_80px_x_80px]" 
                      alt="G-SEC" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">G-SEC</span>
                      <Button size="sm" variant="outline" className="touch-manipulation">Place Bid</Button>
                    </div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">New GS 2025</h4>
                    <p className="text-xs text-gray-500 mb-1">
                      <span>Ends on</span> Thu, 1 Aug 2024
                    </p>
                    <p className="text-xs text-gray-500">
                      <span>Indicative Yield*</span> 7.05%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fund Offer */}
            <div className="w-full">
              <div className="bg-blue-600 text-white rounded-2xl p-4 sm:p-6 w-full">
                <h2 className="text-xl sm:text-2xl font-medium mb-4">Adminuiux Innovation and tech Fund</h2>
                <h4 className="text-lg sm:text-xl mb-1">$15.52</h4>
                <p className="opacity-75 mb-4">Current Nav (Today)</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div>
                    <h5 className="text-base sm:text-lg mb-1">21</h5>
                    <p className="text-xs sm:text-sm opacity-75">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Risk
                    </p>
                  </div>
                  <div>
                    <h5 className="text-base sm:text-lg mb-1">15.25%</h5>
                    <p className="text-xs sm:text-sm opacity-75">
                      <BarChart3 className="w-3 h-3 inline mr-1" />
                      CAGR
                    </p>
                  </div>
                  <div>
                    <h5 className="text-base sm:text-lg mb-1">0.5%</h5>
                    <p className="text-xs sm:text-sm opacity-75">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      Exit Load
                    </p>
                  </div>
                  <div>
                    <h5 className="text-base sm:text-lg mb-1">0.25%</h5>
                    <p className="text-xs sm:text-sm opacity-75">
                      <DollarSign className="w-3 h-3 inline mr-1" />
                      Expense Ratio
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" className="touch-manipulation">Buy</Button>
                    <Button variant="secondary" size="sm" className="touch-manipulation">SIP</Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white touch-manipulation">Details</Button>
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm w-full`}>
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h6 className="font-medium">Market with Technical Trend</h6>
                  <div className="flex items-center space-x-4">
                    <select className="text-sm border rounded px-3 py-1">
                      <option>All Trend</option>
                      <option>Bullish</option>
                      <option>Bearish</option>
                    </select>
                    <button className="p-2 hover:bg-gray-100 rounded touch-manipulation">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="text-left p-3 sm:p-4 font-medium text-xs sm:text-sm">Company</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-xs sm:text-sm">Price</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-xs sm:text-sm hidden sm:table-cell">Holding</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-xs sm:text-sm hidden md:table-cell">Profit/Loss</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-xs sm:text-sm hidden lg:table-cell">Today's Trend</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-xs sm:text-sm">% Change</th>
                      <th className="text-left p-3 sm:p-4 font-medium text-xs sm:text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding, index) => (
                      <tr key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <td className="p-3 sm:p-4">
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{holding.company}</p>
                            {holding.hasEvent && (
                              <p className="text-xs text-blue-600">
                                <Award className="w-3 h-3 inline mr-1" />
                                Event
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div>
                            <p className="font-medium text-xs sm:text-sm">${holding.price}</p>
                            <p className="text-xs text-gray-500">LTP: {holding.ltp}</p>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 hidden sm:table-cell">
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{holding.units} units</p>
                            <p className="text-xs text-gray-500">Invested: ${holding.invested}</p>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 hidden md:table-cell">
                          <div>
                            <p className="font-medium text-green-600 text-xs sm:text-sm">
                              <ArrowUp className="w-3 h-3 inline mr-1" />
                              {holding.profitPercent}%
                            </p>
                            <p className="text-xs text-gray-500">Profit: ${holding.profit}</p>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 hidden lg:table-cell">
                          <p className={`font-medium text-xs sm:text-sm ${holding.trend === 'Bullish' ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.trend === 'Bullish' ? '📈' : '📉'} {holding.trend}
                          </p>
                        </td>
                        <td className="p-3 sm:p-4">
                          <p className={`font-medium text-xs sm:text-sm ${holding.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.change > 0 ? <ArrowUp className="w-3 h-3 inline mr-1" /> : <ArrowDown className="w-3 h-3 inline mr-1" />}
                            {Math.abs(holding.change)}%
                          </p>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-1 touch-manipulation">
                              Buy
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 text-xs px-2 py-1 touch-manipulation">
                              Sell
                            </Button>
                            <button className="p-1 hover:bg-gray-100 rounded touch-manipulation">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
    </div>
  );
};