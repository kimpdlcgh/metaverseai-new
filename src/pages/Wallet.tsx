import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  User, 
  LogOut, 
  Calendar, 
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  RefreshCw,
  Edit,
  Trash,
  CreditCard,
  ArrowLeftRight,
  Home,
  Car,
  Percent,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  BarChart2,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

interface WalletProps {
  isDarkMode?: boolean;
}

interface Card {
  id: string;
  bank: string;
  type: string;
  number: string;
  expiry: string;
  holder: string;
  background?: string;
  transactions: CardTransaction[];
}

interface CardTransaction {
  id: string;
  name: string;
  category: string;
  image?: string;
  amount: number;
  date: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'bill';
  description: string;
  date: string;
  amount: number;
}

interface Goal {
  id: string;
  name: string;
  icon: 'home' | 'car' | 'percent' | 'calendar';
  target: number;
  current: number;
  percentComplete: number;
  additionalInfo?: string;
}

export const Wallet: React.FC<WalletProps> = ({ isDarkMode = false }) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('Last 30 days');
  
  // TODO: fetch real data from Supabase
  const [balance, setBalance] = useState(25052.00);
  const [income, setIncome] = useState(5560.50);
  const [expense, setExpense] = useState(3586.15);
  const [shareHoldings, setShareHoldings] = useState(5560.50);
  const [mutualFunds, setMutualFunds] = useState(3586.15);
  
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      bank: 'City Bank',
      type: 'Credit Card',
      number: '000 0000 0001 546598',
      expiry: '09/023',
      holder: 'adminuiux',
      background: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg',
      transactions: [
        {
          id: '1',
          name: "Lion's dan resort",
          category: 'Hotel and Restaurant',
          image: 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg',
          amount: 252.00,
          date: '25 Jun 2024'
        },
        {
          id: '2',
          name: 'Treeview SuperMart',
          category: 'Grocery',
          image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
          amount: 300.35,
          date: '22 Jun 2024'
        },
        {
          id: '3',
          name: 'Flamingo Bar & Club',
          category: 'Hotel and Restaurant',
          image: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg',
          amount: 500.50,
          date: '20 Jun 2024'
        }
      ]
    },
    {
      id: '2',
      bank: 'City Bank',
      type: 'Credit Card',
      number: '000 0000 0001 546598',
      expiry: '09/023',
      holder: 'adminuiux',
      transactions: [
        {
          id: '1',
          name: "Lion's dan resort",
          category: 'Hotel and Restaurant',
          image: 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg',
          amount: 252.00,
          date: '25 Jun 2024'
        },
        {
          id: '2',
          name: 'Treeview SuperMart',
          category: 'Grocery',
          image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
          amount: 300.35,
          date: '22 Jun 2024'
        },
        {
          id: '3',
          name: 'Flamingo Bar & Club',
          category: 'Hotel and Restaurant',
          image: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg',
          amount: 500.50,
          date: '20 Jun 2024'
        }
      ]
    }
  ]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'send',
      description: 'Send money',
      date: '12 December 2024, 12:50 PM',
      amount: 150.00
    },
    {
      id: '2',
      type: 'bill',
      description: 'Paid Bill',
      date: '11 December 2024, 7:15 AM',
      amount: 145.00
    },
    {
      id: '3',
      type: 'bill',
      description: 'Paid Bill',
      date: '10 November 2024, 1:20 PM',
      amount: 325.00
    },
    {
      id: '4',
      type: 'receive',
      description: 'Received money',
      date: '5 November 2024, 1:45 AM',
      amount: 562.00
    },
    {
      id: '5',
      type: 'send',
      description: 'Send money',
      date: '3 November 2024, 1:30 PM',
      amount: 356.00
    }
  ]);
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Goal: Sweet Home',
      icon: 'home',
      target: 22500.00,
      current: 4500.00,
      percentComplete: 20
    },
    {
      id: '2',
      name: 'Goal: Car',
      icon: 'car',
      target: 10500.00,
      current: 3150.00,
      percentComplete: 30
    },
    {
      id: '3',
      name: 'Fixed Deposit',
      icon: 'percent',
      target: 4000.00,
      current: 4280.00,
      additionalInfo: '7.25% Interest'
    },
    {
      id: '4',
      name: 'Fixed Deposit',
      icon: 'percent',
      target: 4500.00,
      current: 4280.00,
      additionalInfo: '8.00% Interest'
    },
    {
      id: '5',
      name: 'Real Estate Fund',
      icon: 'calendar',
      target: 1500.00,
      current: 1850.00,
      additionalInfo: '25.15% Profit'
    }
  ]);
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [showReceiveMoneyModal, setShowReceiveMoneyModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [exchangeAmount, setExchangeAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CAD');
  const [exchangeRate, setExchangeRate] = useState(1.38);
  
  const [selectedGoal, setSelectedGoal] = useState('Goal: Sweet Home');
  const [topUpAmount, setTopUpAmount] = useState(100);

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };
  
  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };
  
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // TODO: Implement chart data and rendering
  useEffect(() => {
    // This would be where we'd initialize charts with real data
    console.log('Initialize charts');
  }, []);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'car':
        return <Car className="w-5 h-5" />;
      case 'percent':
        return <Percent className="w-5 h-5" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-fluid mt-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full sm:flex-1">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0 flex items-center text-sm text-gray-500">
                <li className="breadcrumb-item"><Link to="/dashboard" className="hover:text-blue-600">Home</Link></li>
                <li className="mx-2">/</li>
                <li className="breadcrumb-item active text-gray-700 font-medium" aria-current="page">Wallet</li>
              </ol>
            </nav>
            <h5 className="text-xl font-bold">My Wallet</h5>
          </div>
          <div className="w-full sm:w-auto mt-3 sm:mt-0">
            <div className="inline-flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
              <input 
                type="text" 
                className="px-3 py-2 border-none focus:outline-none rounded-l-lg w-40" 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <button className="p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mt-4">
        {/* Top Row - Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Main Balance */}
          <div className="col-span-1 lg:col-span-1">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow-md h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-10 -mr-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -mb-8 -ml-8"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <WalletIcon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors"
                    onClick={() => setShowQRModal(true)}
                    title="Show QR Code"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                  <button 
                    className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors"
                    onClick={() => setShowSendMoneyModal(true)}
                    title="Send Money"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors"
                    onClick={() => setShowReceiveMoneyModal(true)}
                    title="Receive Money"
                  >
                    <ArrowDownLeft className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors"
                    onClick={() => setShowAddMoneyModal(true)}
                    title="Add Money"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-1">${balance.toLocaleString()}</h1>
                <p className="text-white text-opacity-80 text-sm">Total Balance</p>
              </div>
            </div>
          </div>

          {/* Income & Expense */}
          <div className="col-span-1 lg:col-span-1">
            <div className="grid grid-cols-1 gap-4 h-full">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mr-3">
                    <ArrowDownLeft className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">${income.toLocaleString()}</h4>
                    <p className="text-gray-500 text-sm flex items-center">
                      Income 
                      <span className="text-green-500 text-xs ml-2 flex items-center">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        11.5%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mr-3">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">${expense.toLocaleString()}</h4>
                    <p className="text-gray-500 text-sm flex items-center">
                      Expense
                      <span className="text-red-500 text-xs ml-2 flex items-center">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        8.2%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investments */}
          <div className="col-span-1 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">${shareHoldings.toLocaleString()}</h4>
                    <p className="text-gray-500 text-sm flex items-center">
                      Share Holdings
                      <span className="text-green-500 text-xs ml-2 flex items-center">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        25.35%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">${mutualFunds.toLocaleString()}</h4>
                    <p className="text-gray-500 text-sm flex items-center">
                      Mutual Funds
                      <span className="text-green-500 text-xs ml-2 flex items-center">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        56.51%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Cash Flow & Quick Exchange */}
          <div className="lg:col-span-1">
            {/* Cash Flow Chart */}
            <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h6 className="font-medium text-gray-800">Cash Flow</h6>
                  <div className="flex items-center">
                    <select className="text-sm border border-gray-200 rounded-lg px-2 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>USD</option>
                      <option>CAD</option>
                      <option>AUD</option>
                    </select>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="h-48 bg-gradient-to-b from-blue-50 to-white rounded-lg flex items-center justify-center mb-4 relative">
                  {/* Chart visualization */}
                  <div className="absolute inset-0 px-4 pt-4">
                    <div className="relative h-full">
                      {/* Income line */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                          <path 
                            d="M0,40 L5,35 L10,38 L15,30 L20,32 L25,25 L30,28 L35,20 L40,22 L45,15 L50,18 L55,10 L60,12 L65,5 L70,8 L75,2 L80,5 L85,0 L90,3 L95,1 L100,4 L100,40 L0,40 Z" 
                            fill="rgba(59, 130, 246, 0.2)" 
                            stroke="#3b82f6" 
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                      
                      {/* Expense line */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                          <path 
                            d="M0,40 L5,38 L10,36 L15,37 L20,35 L25,36 L30,34 L35,35 L40,33 L45,34 L50,32 L55,33 L60,31 L65,32 L70,30 L75,31 L80,29 L85,30 L90,28 L95,29 L100,27 L100,40 L0,40 Z" 
                            fill="rgba(239, 68, 68, 0.1)" 
                            stroke="#ef4444" 
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-400 z-10">
                    <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Cash Flow Visualization</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-600 text-white rounded-lg p-3">
                    <h4 className="font-medium text-lg">$5,560.50</h4>
                    <p className="text-sm text-white text-opacity-80 flex items-center">
                      Income 
                      <ArrowUpRight className="w-3 h-3 ml-1" /> 
                      <span className="ml-1">11.5%</span>
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-medium text-lg">$3,586.15</h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      Expense 
                      <ArrowUpRight className="w-3 h-3 ml-1 text-red-500" /> 
                      <span className="ml-1 text-red-500">8.2%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Exchange */}
            <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h6 className="font-medium text-gray-800">Quick Exchange</h6>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">Updated 12s ago</span>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="relative mb-4">
                  <input 
                    type="number" 
                    className="w-full text-center text-xl p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Convert Amount..." 
                    value={exchangeAmount}
                    onChange={(e) => setExchangeAmount(Number(e.target.value))}
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <div className="mb-1">
                      <label className="block text-sm text-gray-500 mb-1">I have...</label>
                      <select 
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 text-center">1.00 {fromCurrency}</p>
                  </div>
                  
                  <div className="mx-2">
                    <button 
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={swapCurrencies}
                    >
                      <ArrowLeftRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="mb-1">
                      <label className="block text-sm text-gray-500 mb-1">I want...</label>
                      <select 
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 text-center">{exchangeRate} {toCurrency}</p>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <h5 className="font-normal"><span className="font-bold">Great!</span> You will get</h5>
                  <h1 className="text-3xl font-bold text-blue-600">{(exchangeAmount * exchangeRate).toFixed(2)}</h1>
                  <p className="text-xs text-gray-500 mb-4">in {toCurrency}</p>
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors w-full">
                    Exchange Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle Column - My Cards & Recent Transactions */}
          <div className="lg:col-span-1">
            {/* My Cards */}
            <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h6 className="font-medium text-gray-800">My Cards</h6>
                  <Link to="/app/cards" className="text-sm text-blue-600 hover:text-blue-800">Manage</Link>
                </div>
              </div>
              
              <div className="p-4">
                <div className="relative">
                  {/* Card */}
                  <div className="mx-auto w-full max-w-xs">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-4 relative overflow-hidden mb-3 shadow-lg">
                      {cards[currentCardIndex].background && (
                        <div className="absolute inset-0 opacity-30">
                          <img 
                            src={cards[currentCardIndex].background} 
                            alt="Card background" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="relative z-10">
                        <div className="flex justify-between mb-3">
                          <CreditCard className="w-6 h-6" />
                          <div className="text-right">
                            <span className="text-xs opacity-75">{cards[currentCardIndex].bank}</span><br />
                            <span>{cards[currentCardIndex].type}</span>
                          </div>
                        </div>
                        
                        <p className="text-lg mb-4 font-medium">
                          {cards[currentCardIndex].number}
                        </p>
                        
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs opacity-75 mb-0">Expiry</p>
                            <p className="font-medium">{cards[currentCardIndex].expiry}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-75 mb-0">Card Holder</p>
                            <p className="font-medium">{cards[currentCardIndex].holder}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4 mb-3">
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-500 hover:text-red-700 transition-colors">
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Card navigation buttons */}
                  {cards.length > 1 && (
                    <>
                      <button 
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        onClick={prevCard}
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button 
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        onClick={nextCard}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Card indicators */}
                {cards.length > 1 && (
                  <div className="flex justify-center space-x-1 mt-2 mb-3">
                    {cards.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${index === currentCardIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                      ></div>
                    ))}
                  </div>
                )}
                
                {/* Add new card button */}
                <button className="w-full py-2 border border-dashed border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Card
                </button>
              </div>
              
              {/* Recent card transactions */}
              <div className="border-t border-gray-100">
                <div className="p-3 border-b border-gray-100">
                  <h6 className="font-medium text-sm text-gray-600">Recent Transactions</h6>
                </div>
                <ul className="divide-y divide-gray-100">
                  {cards[currentCardIndex].transactions.map((transaction, index) => (
                    <li key={index} className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="mr-3 flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img 
                              src={transaction.image} 
                              alt={transaction.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{transaction.name}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="truncate">{transaction.category}</span>
                            <span className="mx-1">•</span>
                            <span>{transaction.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">-${transaction.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-3 text-center">
                  <Link to="/app/transactions" className="text-sm text-blue-600 hover:text-blue-800">
                    View All Transactions
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Goals & Recent Activity */}
          <div className="lg:col-span-1">
            {/* Goals and Savings */}
            <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h6 className="font-medium text-gray-800">Goals & Savings</h6>
                  <div className="flex items-center">
                    <Link to="/app/goals" className="text-sm text-blue-600 hover:text-blue-800 mr-2">View All</Link>
                    <button className="p-1 text-blue-600 hover:text-blue-800 rounded-lg border border-blue-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600 mb-3">Top-Up your saving</p>
                  <div className="flex items-center">
                    <select 
                      className="flex-1 p-2 text-sm border border-gray-200 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                    >
                      {goals.map(goal => (
                        <option key={goal.id} value={goal.name}>{goal.name}</option>
                      ))}
                    </select>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">$</span>
                      <input 
                        type="number" 
                        className="w-20 p-2 text-sm border border-gray-200 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(Number(e.target.value))}
                      />
                      <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {goals.slice(0, 3).map((goal, index) => (
                    <li key={index} className="bg-white border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            {renderIcon(goal.icon)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{goal.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="w-full max-w-[120px]">
                              <div className="h-1.5 w-full bg-gray-200 rounded-full">
                                <div 
                                  className="h-1.5 bg-blue-600 rounded-full" 
                                  style={{ width: `${goal.percentComplete}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">
                              {goal.additionalInfo || `${goal.percentComplete}%`}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <p className="font-medium text-gray-800">${goal.current.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">${goal.target.toFixed(2)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h6 className="font-medium text-gray-800">Recent Activity</h6>
                  <Link to="/app/transactions" className="text-sm text-blue-600 hover:text-blue-800">See All</Link>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">Recently connected contacts</p>
                <div className="flex space-x-2 overflow-x-auto py-2 mb-3">
                  <button className="w-10 h-10 rounded-full border border-dashed border-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-50 transition-colors">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </button>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} 
                        alt="Contact" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                <ul className="divide-y divide-gray-100">
                  {transactions.slice(0, 3).map((transaction, index) => (
                    <li key={index} className={`py-3 ${transaction.type === 'receive' ? 'bg-green-50 rounded-lg px-3 mb-1' : ''}`}>
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'receive' 
                              ? 'bg-blue-100 text-blue-600' 
                              : transaction.type === 'send'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {transaction.type === 'send' ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : transaction.type === 'receive' ? (
                              <ArrowDownLeft className="w-5 h-5" />
                            ) : (
                              <DollarSign className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{transaction.description}</p>
                          <p className="text-xs text-gray-500 truncate flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {transaction.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.type === 'receive' ? 'text-blue-600' : 'text-gray-800'}`}>
                            {transaction.type === 'receive' ? '+ ' : '- '}${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center my-4">
                <div className="w-48 h-48 mx-auto mb-4 bg-white p-3 rounded-xl shadow-md">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example" 
                    alt="QR Code" 
                    className="w-full h-full"
                  />
                </div>
                <h5 className="font-bold text-xl text-gray-800">Scan QR Code</h5>
                <p className="text-gray-600">To add money in wallet account</p>
              </div>
              
              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium text-gray-800">AdminUIUX</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Virtual ID</p>
                  <p className="font-medium text-gray-800 text-sm">00VFGBADMINUIUX02154869</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Valid Till</p>
                  <p className="font-medium text-gray-800">26-09-2026 12:00 am</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Generated on</p>
                  <p className="font-medium text-gray-800 flex items-center">
                    12-04-2024 6:25 am 
                    <RefreshCw className="w-4 h-4 inline-block ml-2 text-gray-500 cursor-pointer" />
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-between">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowQRModal(false)}
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Money Modal */}
      {showSendMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-gray-800">Send Money</h5>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowSendMoneyModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Send money to</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter contact..." 
                    defaultValue="Jonathan"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center mb-2">Recently connected contacts</p>
              <div className="flex space-x-2 overflow-x-auto py-2 mb-4">
                <div className="w-10 h-10 rounded-full border border-dashed border-blue-600 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <img 
                      src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} 
                      alt="Contact" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="relative mb-4">
                <input 
                  type="number" 
                  className="w-full text-center text-2xl p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Amount..." 
                  defaultValue="100.00"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex-1">
                  <div className="mb-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">From...</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>USD Wallet</option>
                      <option>CAD Wallet</option>
                      <option>AUD Wallet</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 text-center">1.00 USD</p>
                </div>
                
                <div className="mx-2">
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ArrowLeftRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="mb-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Send in...</label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>USD</option>
                      <option selected>CAD</option>
                      <option>AUD</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 text-center">1.38 CAD</p>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <h5 className="font-normal"><span className="font-bold">Great!</span> You are going to send</h5>
                <h1 className="text-3xl font-bold text-blue-600">100.00</h1>
                <p className="text-xs text-gray-500">in Canadian Dollar</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-between">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowSendMoneyModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Send Money
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;