import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  User, 
  LogOut, 
  DollarSign, 
  Target, 
  Clock, 
  Shield, 
  Wallet, 
  BarChart3, 
  Calendar, 
  Percent, 
  HashIcon as CashStack, 
  UserCheck, 
  Tags, 
  ShieldCheck, 
  Building, 
  Home, 
  Car, 
  Send, 
  Award, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal, 
  RefreshCw, 
  Search, 
  Settings, 
  Users, 
  Gift, 
  Bell, 
  Grid3X3, 
  Sun, 
  Moon, 
  Menu, 
  AlertTriangle, 
  Calculator, 
  X 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

interface PortfolioProps {
  isDarkMode?: boolean;
}

export const Portfolio: React.FC<PortfolioProps> = ({ isDarkMode = false }) => {
  const { user } = useAuth();

  // TODO: fetch real data from Supabase
  const [portfolioData, setPortfolioData] = useState({
    currentValue: 65520,
    profitRevenue: 15510,
    sevenDaysProfit: 4150,
    investment: 45000,
    portfolioValue: 1165300,
    walletBalance: 1152250
  });

  const [marketUpdates, setMarketUpdates] = useState([
    { name: "GIFTS NIFTYS", value: 24806.00, change: 1.40, trend: "up" },
    { name: "Nikkies 2250", value: 41118.13, change: 0.40, trend: "up" },
    { name: "JOHN DOUES", value: 30006.00, change: -0.40, trend: "down" },
    { name: "Adminuiux Love", value: 90105.00, change: 1.40, trend: "up" }
  ]);

  const [investmentCategories, setInvestmentCategories] = useState([
    { name: "Share holdings", value: 165520, percentage: 25.30, color: "bg-green-500" },
    { name: "Mutual Funds", value: 265850, percentage: 21.42, color: "bg-yellow-500" },
    { name: "Bank Bonds", value: 356260, percentage: 20.18, color: "bg-orange-500" },
    { name: "Gov. Securities", value: 18565, percentage: 15.65, color: "bg-purple-500" },
    { name: "Fixed Deposit", value: 190450, percentage: 18.50, color: "bg-gray-500" }
  ]);

  const [holdings, setHoldings] = useState([
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
  ]);

  return (
    <div>
      <div className="w-full max-w-none p-4 sm:p-6 space-y-4 sm:space-y-6 md:space-y-8">
            {/* Portfolio Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="xl:col-span-5 xxl:col-span-4">
                <div className="rounded bg-blue-50 flex flex-col mb-4">
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm mb-3`}>
                    <div className="p-4 sm:p-6 pb-0">
                      {/* Welcome box */}
                      <div className="my-4">
                        <h4 className="text-lg text-gray-500 mb-0">Good Morning!</h4>
                        <h1 className="text-2xl sm:text-3xl font-bold">John Smith</h1>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-600 text-white rounded-lg p-4 mb-3">
                          <p className="text-white mb-2">Current Value</p>
                          <h4 className="font-medium">
                            ${portfolioData.currentValue.toLocaleString()}k
                            <br />
                            <span className="text-white text-sm">
                              <ArrowUp className="w-3 h-3 inline mr-1" />
                              18.5%
                            </span>
                          </h4>
                        </div>
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4 mb-3`}>
                          <p className="text-gray-500 mb-2">Profit Revenue</p>
                          <h4 className="font-medium">
                            ${portfolioData.profitRevenue.toLocaleString()}k
                            <br />
                            <span className="text-green-600 text-sm">
                              <ArrowUp className="w-3 h-3 inline mr-1" />
                              11.5%
                            </span>
                          </h4>
                        </div>
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4 mb-3`}>
                          <p className="text-gray-500 mb-2">7 Days Profit</p>
                          <h4 className="font-medium">
                            ${portfolioData.sevenDaysProfit.toLocaleString()}k
                            <br />
                            <span className="text-green-600 text-sm">
                              <ArrowUp className="w-3 h-3 inline mr-1" />
                              2.54%
                            </span>
                          </h4>
                        </div>
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4 mb-3`}>
                          <p className="text-gray-500 mb-2">Investment</p>
                          <h4 className="font-medium">
                            ${portfolioData.investment.toLocaleString()}k
                            <br />
                            <span className="text-green-600 text-sm">$1.50k 30 days</span>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goals Cards */}
                  <div className="px-3">
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 mb-3`}>
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center mr-3">
                          <Home className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="mb-0">$22,500.00</h4>
                          <p className="text-sm text-gray-500">Goal: Sweet Home</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>2 months</span>
                        <span>22 months</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>10%</span>
                        <span>90%</span>
                      </div>
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 mb-3`}>
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-3">
                          <Car className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="mb-0">$10,500.00</h4>
                          <p className="text-sm text-gray-500">Goal: Car</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>3 months</span>
                        <span>9 months</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>30%</span>
                        <span>70%</span>
                      </div>
                    </div>

                    {/* Referral Card */}
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 mb-3`}>
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h4 className="font-bold mb-2">Refer friends & earn</h4>
                          <p className="text-gray-500 text-sm mb-4">
                            Ask your friend to join us & earn 10% of profit they made first time.
                          </p>
                          <Button size="sm" variant="outline" className="touch-manipulation">
                            Invite to Join
                          </Button>
                        </div>
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center ml-4">
                          <Send className="w-8 h-8" />
                        </div>
                      </div>
                    </div>

                    {/* G-SEC Bid Card */}
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 mb-3 border border-blue-200`}>
                      <div className="flex items-center">
                        <div className="w-20 h-20 rounded-lg overflow-hidden mr-4">
                          <img 
                            src="[IMG_PLACEHOLDER_80px_x_80px]" 
                            alt="G-SEC" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">G-SEC</span>
                            <Button size="sm" variant="outline" className="touch-manipulation">Place Bid</Button>
                          </div>
                          <h4 className="font-bold mb-1">New GS 2025</h4>
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
                </div>
              </div>

              {/* Right Column */}
              <div className="xl:col-span-7 xxl:col-span-8">
                <div className="space-y-4 sm:space-y-6">
                  {/* Summary Chart */}
                  <div className="grid grid-cols-1 xxl:grid-cols-3 gap-4 sm:gap-6">
                    <div className="xxl:col-span-2">
                      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1W</button>
                              <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">1D</button>
                              <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">1M</button>
                              <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">1Y</button>
                              <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded">All</button>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded">
                              <Calendar className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Chart Placeholder</p>
                              <p className="text-xs">Portfolio Performance</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Portfolio Growth Card */}
                    <div className="xxl:col-span-1">
                      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-6 text-white relative overflow-hidden h-full">
                        <div className="absolute inset-0 opacity-20">
                          <img 
                            src="[IMG_PLACEHOLDER_400px_x_300px]" 
                            alt="Background" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="relative z-10 flex flex-col justify-center h-full py-4">
                          <h2 className="text-xl font-normal mb-4">Your portfolio value has been grown by</h2>
                          <h1 className="text-4xl font-bold mb-3">$7.52k</h1>
                          <p className="opacity-90">In last 7 days</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Updates */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h6 className="font-medium">Updates:</h6>
                        <p className="text-sm text-gray-500">Today <span className="text-red-500">Live</span></p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex space-x-6 overflow-x-auto pb-2">
                      {marketUpdates.map((update, index) => (
                        <div key={index} className="flex-shrink-0 min-w-48">
                          <h6 className={`font-medium ${update.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
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
                  <div className="grid grid-cols-1 xxl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Investment Categories */}
                    <div className="xxl:col-span-2">
                      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                          {/* Doughnut Chart */}
                          <div className="p-6">
                            <h6 className="font-medium mb-4">Investment Categories</h6>
                            <div className="relative flex items-center justify-center mb-4">
                              <div className="absolute text-center">
                                <h4 className="text-xl font-bold">${portfolioData.portfolioValue.toLocaleString()}k</h4>
                                <p className="text-sm text-gray-500">Portfolio Value</p>
                              </div>
                              <div className="w-48 h-48 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 via-purple-400 to-gray-400 flex items-center justify-center">
                                <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}></div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              You have invested in different types of categories shown as above and summary of each category.
                            </p>
                          </div>

                          {/* Category Details */}
                          <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {investmentCategories.map((category, index) => (
                                <div key={index} className="mb-4">
                                  <p className="text-sm text-gray-500 mb-2 flex items-center">
                                    <span className={`w-3 h-3 rounded mr-2 ${category.color}`}></span>
                                    {category.name}
                                  </p>
                                  <h4 className="font-medium">
                                    ${category.value.toLocaleString()}
                                    <br />
                                    <span className="text-sm text-green-600 font-normal">
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
                    <div className="xxl:col-span-1">
                      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm h-full`}>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                                <Wallet className="w-4 h-4" />
                              </div>
                              <h6 className="font-medium">My Wallet</h6>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select className="text-sm border rounded px-2 py-1">
                                <option>USD</option>
                                <option>CAD</option>
                                <option>AUD</option>
                              </select>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <RefreshCw className="w-4 h-4" />
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
                          <div className="h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                            <div className="text-center text-blue-600">
                              <BarChart3 className="w-8 h-8 mx-auto mb-1" />
                              <p className="text-xs">Chart</p>
                            </div>
                          </div>

                          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4`}>
                            <p className="text-sm text-gray-500 mb-2">
                              Top performing investment is <strong className="text-blue-600">Share Holdings</strong>
                            </p>
                            <h4 className="font-medium">
                              $165.52k 
                              <span className="text-sm text-green-600 ml-2">
                                <ArrowUp className="w-3 h-3 inline mr-1" />
                                25.30%
                              </span>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fund Offer */}
                  <div className="bg-blue-600 text-white rounded-xl p-6">
                    <h2 className="text-2xl font-medium mb-4">Adminuiux Innovation and tech Fund</h2>
                    <h4 className="text-xl mb-1">$15.52</h4>
                    <p className="opacity-75 mb-4">Current Nav (Today)</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <h5 className="text-lg mb-1">21</h5>
                        <p className="text-sm opacity-75">
                          <Shield className="w-3 h-3 inline mr-1" />
                          Risk
                        </p>
                      </div>
                      <div>
                        <h5 className="text-lg mb-1">15.25%</h5>
                        <p className="text-sm opacity-75">
                          <BarChart3 className="w-3 h-3 inline mr-1" />
                          CAGR
                        </p>
                      </div>
                      <div>
                        <h5 className="text-lg mb-1">0.5%</h5>
                        <p className="text-sm opacity-75">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Exit Load
                        </p>
                      </div>
                      <div>
                        <h5 className="text-lg mb-1">0.25%</h5>
                        <p className="text-sm opacity-75">
                          <DollarSign className="w-3 h-3 inline mr-1" />
                          Expense Ratio
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="sm">Buy</Button>
                        <Button variant="secondary" size="sm">SIP</Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-white">Details</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h6 className="font-medium">Market with Technical Trend</h6>
                  <div className="flex items-center space-x-4">
                    <select className="text-sm border rounded px-3 py-1">
                      <option>All Trend</option>
                      <option>Bullish</option>
                      <option>Bearish</option>
                    </select>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Company</th>
                      <th className="text-left p-4 font-medium text-sm">Price</th>
                      <th className="text-left p-4 font-medium text-sm hidden sm:table-cell">Holding</th>
                      <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Profit/Loss</th>
                      <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Today's Trend</th>
                      <th className="text-left p-4 font-medium text-sm">% Change</th>
                      <th className="text-left p-4 font-medium text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding, index) => (
                      <tr key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-sm">{holding.company}</p>
                            {holding.hasEvent && (
                              <p className="text-xs text-blue-600">
                                <Award className="w-3 h-3 inline mr-1" />
                                Event
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-sm">${holding.price}</p>
                            <p className="text-xs text-gray-500">LTP: {holding.ltp}</p>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div>
                            <p className="font-medium text-sm">{holding.units} units</p>
                            <p className="text-xs text-gray-500">Invested: ${holding.invested}</p>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div>
                            <p className="font-medium text-green-600 text-sm">
                              <ArrowUp className="w-3 h-3 inline mr-1" />
                              {holding.profitPercent}%
                            </p>
                            <p className="text-xs text-gray-500">Profit: ${holding.profit}</p>
                          </div>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <p className={`font-medium text-sm ${holding.trend === 'Bullish' ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.trend === 'Bullish' ? '📈' : '📉'} {holding.trend}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className={`font-medium text-sm ${holding.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.change > 0 ? <ArrowUp className="w-3 h-3 inline mr-1" /> : <ArrowDown className="w-3 h-3 inline mr-1" />}
                            {Math.abs(holding.change)}%
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-1">
                              Buy
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 text-xs px-2 py-1">
                              Sell
                            </Button>
                            <button className="p-1 hover:bg-gray-100 rounded">
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