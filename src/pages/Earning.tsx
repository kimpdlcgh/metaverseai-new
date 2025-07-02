import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUp, 
  Calendar, 
  BarChart3, 
  RefreshCw, 
  MoreHorizontal,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Filter,
  ChevronDown,
  Clock,
  Search,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface EarningProps {
  isDarkMode?: boolean;
}

export default function Earning({ isDarkMode = false }: EarningProps) {
  // State management
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [balance, setBalance] = useState(980.00);
  const [totalEarning, setTotalEarning] = useState(4154.00);
  const [pendingPayment, setPendingPayment] = useState(645.00);
  const [nextPayout, setNextPayout] = useState(980.00);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Investment categories data
  const [investmentCategories, setInvestmentCategories] = useState([
    { name: "Share holdings", value: 165520, percentage: 25.30, color: "bg-green-500" },
    { name: "Mutual Funds", value: 265850, percentage: 21.42, color: "bg-yellow-500" },
    { name: "Bank Bonds", value: 356260, percentage: 20.18, color: "bg-orange-500" },
    { name: "Gov. Securities", value: 18565, percentage: 15.65, color: "bg-purple-500" },
    { name: "Fixed Deposit", value: 190450, percentage: 18.50, color: "bg-gray-500" }
  ]);
  
  // Transactions data
  const [transactions, setTransactions] = useState([
    {
      id: '500ID',
      date: '9 June 2024',
      time: '3:30 PM',
      amount: 190.00,
      type: 'Cash',
      user: {
        name: 'Jr. Chen Li',
        location: 'United Kingdom',
        image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
      },
      contact: {
        email: 'cheli@sales.core.com',
        phone: '+44 8466585****1154'
      },
      status: 'Rejected'
    },
    {
      id: '500ID',
      date: '9 June 2024',
      time: '11:55 AM',
      amount: 150.00,
      type: 'Cash',
      user: {
        name: 'Jr. Chen Li',
        location: 'United Kingdom',
        image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
      },
      contact: {
        email: 'cheli@sales.core.com',
        phone: '+44 8466585****1154'
      },
      status: 'Rejected'
    },
    {
      id: '2054ID',
      date: '9 June 2024',
      time: '9:10 AM',
      amount: 130.00,
      type: 'Net Banking',
      user: {
        name: 'David Warner',
        location: 'United Kingdom',
        image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
      },
      contact: {
        email: 'david@sales.core.com',
        phone: '+44 8466585****1154'
      },
      status: 'Pending'
    },
    {
      id: '2054ID',
      date: '9 June 2024',
      time: '12:15 PM',
      amount: 250.00,
      type: 'Cash',
      user: {
        name: 'David Warner',
        location: 'United Kingdom',
        image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
      },
      contact: {
        email: 'david@sales.core.com',
        phone: '+44 8466585****1154'
      },
      status: 'Pending'
    },
    {
      id: '2054ID',
      date: '9 June 2024',
      time: '9:10 AM',
      amount: 130.00,
      type: 'Net Banking',
      user: {
        name: 'David Warner',
        location: 'United Kingdom',
        image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
      },
      contact: {
        email: 'david@sales.core.com',
        phone: '+44 8466585****1154'
      },
      status: 'Pending'
    }
  ]);

  // Get status badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Waiting':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter transactions based on search and status
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || transaction.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Toggle filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div>
      {/* Header section with breadcrumb and actions */}
      <div className="container-fluid mt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0 flex text-sm text-gray-500">
                <li className="breadcrumb-item"><a href="/dashboard" className="hover:text-blue-600">Home</a></li>
                <li className="mx-2">/</li>
                <li className="breadcrumb-item active text-gray-700" aria-current="page">My Earning</li>
              </ol>
            </nav>
            <h1 className="text-2xl font-bold">My Earnings</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-800 py-2 px-3 rounded-lg text-sm">
              <p className="font-medium">$1500.00 withdraw in-process</p>
            </div>
            
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <DollarSign className="w-4 h-4" />
              <span>Withdraw</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Date range selector and export button */}
      <div className="container mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                <input 
                  type="text" 
                  className="px-3 py-2 border-none focus:outline-none rounded-l-lg w-48" 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                />
                <button className="p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={toggleFilter}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
        
        {/* Filter panel */}
        {isFilterOpen && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Complete">Complete</option>
                  <option value="Pending">Pending</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Types</option>
                  <option>Cash</option>
                  <option>Net Banking</option>
                  <option>Credit Card</option>
                  <option>Wallet</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" className="mr-2">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Balance */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold mb-1">${balance.toFixed(2)}</h4>
            <p className="text-gray-500">Current Account Balance</p>
          </div>

          {/* Total earning */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold mb-1">${totalEarning.toFixed(2)}</h4>
            <p className="text-gray-500 flex items-center">
              Total Earning
              <span className="text-green-600 ml-2 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" /> 11.5%
              </span>
            </p>
          </div>

          {/* Pending payment */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold mb-1">${pendingPayment.toFixed(2)}</h4>
            <p className="text-gray-500">Payment Pending</p>
          </div>

          {/* Payout */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-bold mb-1">${nextPayout.toFixed(2)}</h4>
            <p className="text-gray-500">Next Payout on 2 July 2024</p>
          </div>
        </div>

        {/* Earnings chart and breakdown */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Chart area */}
            <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Earnings Overview</h2>
                <div className="flex items-center gap-2">
                  <select className="text-sm border border-gray-200 rounded-lg px-2 py-1">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option selected>Monthly</option>
                    <option>Yearly</option>
                  </select>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Area chart visualization */}
              <div className="h-64 relative mb-6">
                <div className="absolute inset-0">
                  <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="w-full h-full">
                    {/* Green area (income) */}
                    <path 
                      d="M0,150 L0,70 C20,60 40,40 60,30 C80,20 100,50 120,55 C140,60 160,40 180,30 C200,20 220,40 240,50 C260,60 280,70 300,65 C320,60 340,40 360,35 C380,30 400,40 400,50 L400,150 Z" 
                      fill="rgba(34, 197, 94, 0.2)" 
                      stroke="#22c55e" 
                      strokeWidth="2"
                    />
                    
                    {/* Purple area (expenses) */}
                    <path 
                      d="M0,150 L0,100 C20,95 40,105 60,110 C80,115 100,105 120,100 C140,95 160,105 180,110 C200,115 220,105 240,100 C260,95 280,105 300,110 C320,115 340,105 360,100 C380,95 400,105 400,110 L400,150 Z" 
                      fill="rgba(168, 85, 247, 0.2)" 
                      stroke="#a855f7" 
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                  </svg>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="text-xl font-bold">$5,560.50</h4>
                  <p className="text-gray-600 flex items-center">
                    Earning 
                    <span className="ml-2 text-green-600 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" /> 11.5%
                    </span>
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="text-xl font-bold">$4,146.50</h4>
                  <p className="text-gray-600 flex items-center">
                    Previous Period 
                    <span className="ml-2 text-green-600 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" /> 8.3%
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Earnings breakdown */}
            <div className="lg:col-span-5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Earnings Breakdown</h2>
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              {/* Donut chart visualization */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute text-center">
                  <h3 className="text-2xl font-bold">$4,154.00</h3>
                  <p className="text-sm text-gray-500">Zonal Earning</p>
                </div>
                <div className="w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Donut segments */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="15" strokeDasharray="75.4 125.6" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eab308" strokeWidth="15" strokeDasharray="64.3 136.7" strokeDashoffset="-75.4" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="15" strokeDasharray="60.5 139.5" strokeDashoffset="-139.7" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="15" strokeDasharray="47 153" strokeDashoffset="-200.2" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#6b7280" strokeWidth="15" strokeDasharray="55.5 144.5" strokeDashoffset="-247.2" />
                    <circle cx="50" cy="50" r="30" fill="white" />
                  </svg>
                </div>
              </div>
              
              {/* Categories breakdown */}
              <div className="space-y-4">
                {investmentCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></span>
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(category.value / 1000).toFixed(2)}k
                      </p>
                      <p className="text-xs text-green-600 flex items-center justify-end">
                        <ArrowUp className="w-3 h-3 mr-1" /> {category.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Earning Transactions</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input 
                    type="text" 
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button variant="outline" className="text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time & Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Made by</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Contact info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium">{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium">{transaction.time}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          + ${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img 
                            src={transaction.user.image} 
                            alt={transaction.user.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.user.name}</p>
                          <p className="text-xs text-gray-500">{transaction.user.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <p className="text-sm">{transaction.contact.email}</p>
                      <p className="text-xs text-gray-500">{transaction.contact.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">25</span> results
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent activity */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Payment Received</h4>
                        <p className="text-sm text-gray-500">From David Warner</p>
                      </div>
                      <span className="text-green-600 font-medium">+$250.00</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Today at 12:15 PM</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Withdrawal Initiated</h4>
                        <p className="text-sm text-gray-500">To Bank Account ****1234</p>
                      </div>
                      <span className="text-red-600 font-medium">-$1,500.00</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Yesterday at 3:45 PM</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Payment Received</h4>
                        <p className="text-sm text-gray-500">From Jr. Chen Li</p>
                      </div>
                      <span className="text-green-600 font-medium">+$190.00</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Yesterday at 9:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
          
          {/* Upcoming payouts */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Upcoming Payouts</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Next Payout</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Scheduled</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold">${nextPayout.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        2 July 2024
                      </p>
                    </div>
                    <Button variant="outline" className="text-sm border-blue-600 text-blue-600 hover:bg-blue-50">
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Payout Schedule</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-gray-600" />
                        </div>
                        <span>Monthly</span>
                      </div>
                      <span className="text-sm text-gray-500">Every 1st of month</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                        </div>
                        <span>Minimum Amount</span>
                      </div>
                      <span className="text-sm text-gray-500">$500.00</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                            <path d="M4 10V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
                            <circle cx="9" cy="9" r="1"></circle>
                            <path d="m15 9-6 6"></path>
                            <path d="m15 15-6-6"></path>
                          </svg>
                        </div>
                        <span>Payment Method</span>
                      </div>
                      <span className="text-sm text-gray-500">Bank Transfer</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button className="text-sm">
                  Change Payout Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}