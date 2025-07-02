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

  // Sample data for the dashboard
  const portfolioData = {
    totalProfit: 13.20,
    bestProfit: 8.34,
    topLoser: -5.15,
    currentValue: 65.52,
    profitRevenue: 15.51,
    investment: 45.00,
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
      <div className="w-full max-w-none p-4 sm:p-6 space-y-6 bg-slate-100 min-h-screen">
            {/* Welcome & Stats Section */}
            <div className="w-full mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="lg:col-span-3">
                  <h3 className="text-base text-gray-500 mb-0">Good Morning,</h3>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Investor</h1>
                </div>
                
                {/* Stats Cards */}
                <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm w-full">
                    <p className="text-sm text-gray-500 mb-1">Total Profit</p>
                    <h4 className="text-xl sm:text-2xl font-bold mb-1">${portfolioData.totalProfit}k</h4>
                    <span className="inline-flex items-center text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      28.50%
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm w-full">
                    <p className="text-sm text-gray-500 mb-1">Best Profit</p>
                    <h4 className="text-xl sm:text-2xl font-bold mb-1">${portfolioData.bestProfit}k</h4>
                    <span className="inline-flex items-center text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      54.35%
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm w-full">
                    <p className="text-sm text-gray-500 mb-1">Top Loser</p>
                    <h4 className="text-xl sm:text-2xl font-bold mb-1">-${Math.abs(portfolioData.topLoser)}k</h4>
                    <span className="inline-flex items-center text-sm text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
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
              <div className="w-full lg:col-span-1 min-h-[280px]">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden w-full h-full portfolio-growth-card">
                  <div className="absolute inset-0 opacity-30">
                    <img src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg" alt="Background" className="w-full h-full object-cover" />
                  </div>
                  <div className="portfolio-growth-content">
                    <h2 className="text-xl sm:text-2xl font-normal mb-4">Your portfolio value has been grown by</h2>
                    <h1 className="portfolio-value">$7.52k</h1>
                    <p className="opacity-90 text-lg">In last 7 days</p>
                  </div>
                </div>
              </div>

              {/* Summary and Chart */}
              <div className="w-full lg:col-span-2 h-full">
                <div className="bg-white rounded-2xl shadow-sm w-full h-full min-h-[280px] transition-all duration-300">
                  <div className="grid grid-cols-1 xl:grid-cols-2">
                    {/* Summary Cards */}
                    <div className="p-5 sm:p-6 w-full">
                      <h6 className="font-medium mb-5 text-lg">Summary</h6>
                      
                      <div className="space-y-5 w-full">
                        <div className="bg-blue-600 rounded-lg p-5 text-white w-full">
                          <p className="text-base opacity-90 mb-1">Current Value</p>
                          <h4 className="flex items-center">
                            <span className="text-2xl sm:text-3xl font-medium">$ {portfolioData.currentValue}k</span>
                            <span className="text-sm ml-2 flex items-center">
                              <ArrowUp className="w-4 h-4 inline mr-1" />
                              <span>18.5%</span>
                            </span>
                          </h4>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-5 w-full">
                          <p className="text-base text-gray-500 mb-1">Profit Revenue</p>
                          <h4 className="flex items-baseline">
                            <span className="text-2xl sm:text-3xl font-medium">$ {portfolioData.profitRevenue}k</span>
                            <span className="text-sm text-green-600 ml-2 flex items-center">
                              <ArrowUp className="w-4 h-4 inline mr-1" />
                              <span>11.5%</span>
                            </span>
                          </h4>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-5 w-full">
                          <p className="text-base text-gray-500 mb-1">Investment</p>
                          <h4 className="text-2xl sm:text-3xl font-medium">$ {portfolioData.investment}k</h4>
                        </div>
                      </div>
                    </div>

                    {/* Chart Section */}
                    <div className="p-5 sm:p-6 w-full flex flex-col h-full justify-between">
                      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                        <div className="flex gap-2 sm:gap-2">
                          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-full">1D</button>
                          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-full font-medium">1W</button>
                          <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-full">1M</button>
                          <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-full">1Y</button>
                          <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-full">All</button>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">19/03/2024 - 25/03/2024</span>
                          <span className="text-xs text-gray-500"></span>
                        </div>
                        
                        {/* Chart */}
                        <div className="h-full min-h-[200px] w-full">
                          <div className="relative h-full w-full">
                            <div className="absolute inset-0 flex flex-col justify-between">
                              {[18, 16, 14, 12, 10, 8, 6, 4, 2, 0].map((value, index) => (
                                <div key={index} className="flex items-center w-full">
                                  <span className="text-xs text-gray-400 w-10">{value}</span>
                                  <div className="flex-1 h-px bg-gray-200"></div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="absolute inset-x-10 inset-y-0">
                              {/* Chart visualization */}
                              <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
                                <defs>
                                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(37, 99, 235, 0.7)" />
                                    <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                                  </linearGradient>
                                </defs>
                                <path 
                                  d="M0,50 L0,40 C5,38 10,35 15,30 C20,25 25,20 30,18 C35,16 40,20 45,25 C50,30 55,40 60,42 C65,44 70,40 75,35 C80,30 85,25 90,20 C95,15 100,20 100,25 L100,50 Z" 
                                  fill="url(#blueGradient)" 
                                />
                                <path 
                                  d="M0,40 C5,38 10,35 15,30 C20,25 25,20 30,18 C35,16 40,20 45,25 C50,30 55,40 60,42 C65,44 70,40 75,35 C80,30 85,25 90,20 C95,15 100,20 100,25" 
                                  fill="none" 
                                  stroke="#2563eb" 
                                  strokeWidth="0.5"
                                />
                              </svg>
                            </div>
                            
                            <div className="absolute bottom-0 left-10 right-0 flex justify-between">
                              {['10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30'].map((time, index) => (
                                <span key={index} className="text-xs text-gray-400">{time}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Updates */}
            <div className="w-full bg-white rounded-xl p-4 shadow-sm transition-all duration-300">
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
                    <h6 className={`font-medium text-base ${update.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {update.value.toLocaleString()}
                    </h6>
                    <p className="text-sm">
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
                <div className="bg-white rounded-2xl shadow-sm w-full transition-all duration-300">
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
                          <div key={index} className="mb-4">
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
                <div className="bg-white rounded-2xl shadow-sm h-full w-full transition-all duration-300">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                          <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <h6 className="font-medium">My Wallet</h6>
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

                    <h4 className="text-2xl font-medium mb-2">${portfolioData.walletBalance.toLocaleString()}</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Total net revenue is $756.83 
                      <span className="text-green-600 ml-1">
                        <ArrowUp className="w-3 h-3 inline mr-1" />
                        11.5%
                      </span> 
                      increased in last week
                    </p>

                    {/* Mini Chart */}
                    <div className="h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center w-full">
                      <div className="text-center text-blue-600">
                        <BarChart3 className="w-8 h-8 mx-auto mb-1" />
                        <p className="text-xs">Chart</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 w-full">
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Top performing investment is <strong className="text-blue-600">Share Holdings</strong>
                      </p>
                      <h4 className="font-medium text-base">
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
            <div className="w-full bg-white rounded-xl p-6 shadow-sm mb-6 transition-all duration-300">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                {investmentOptions.map((option, index) => (
                  <a
                    key={index}
                    href={option.href}
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center shadow-sm transition-colors group w-full"
                  >
                    <option.icon className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-gray-700 font-medium leading-tight">{option.title}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Goals and Additional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 transition-all duration-300">
              {goals.slice(0, 2).map((goal, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
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
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 w-full">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-bold mb-2">Refer friends & earn</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                      Ask your friend to join us & earn 10% of profit they made first time.
                    </p>
                    <Button size="sm" variant="outline" className="">
                      Invite to Join
                    </Button>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center ml-4">
                    <Send className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* G-SEC Bid Card */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-blue-200 w-full">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-lg mr-4 flex items-center justify-center">
                    <DollarSign className="w-10 h-10 text-blue-600" />
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
            <div className="w-full mb-6 transition-all duration-300">
              <div className="bg-blue-600 text-white rounded-2xl p-6 w-full transition-all duration-300">
                <h2 className="text-2xl font-medium mb-4">Adminuiux Innovation and tech Fund</h2>
                <h4 className="text-lg sm:text-xl mb-1">$15.52</h4>
                <p className="opacity-75 mb-4">Current Nav (Today)</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <h5 className="text-base sm:text-lg mb-1">21</h5>
                    <p className="text-xs sm:text-sm opacity-75">
                      Risk
                    </p>
                  </div>
                  <div>
                    <h5 className="text-base sm:text-lg mb-1">15.25%</h5>
                    <p className="text-xs sm:text-sm opacity-75">
                      CAGR
                    </p>
                  </div>
                  <div>
                    <h5 className="text-base sm:text-lg mb-1">0.5%</h5>
                    <p className="text-xs sm:text-sm opacity-75">
                      Exit Load
                    </p>
                  </div>
                  <div>
                    <h5 className="text-base sm:text-lg mb-1">0.25%</h5>
                    <p className="text-xs sm:text-sm opacity-75">
                      Expense Ratio
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm">Buy</Button>
                    <Button variant="secondary" size="sm">SIP</Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white">Details</Button>
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="bg-white rounded-2xl shadow-sm w-full transition-all duration-300">
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
                  <thead className="bg-gray-50">
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
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-3 sm:p-4">
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{holding.company}</p>
                            {holding.hasEvent && (
                              <p className="text-xs text-blue-600">
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
                            <p className={`font-medium text-xs sm:text-sm ${holding.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${holding.profit > 0 ? '+' : ''}${holding.profit}
                            </p>
                            <p className={`text-xs ${holding.profitPercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {holding.profitPercent > 0 ? '+' : ''}{holding.profitPercent}%
                            </p>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 hidden lg:table-cell">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            holding.trend === 'Bullish' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {holding.trend}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4">
                          <span className={`font-medium text-xs sm:text-sm ${holding.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.change > 0 ? '+' : ''}{holding.change}%
                          </span>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center space-x-2">
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