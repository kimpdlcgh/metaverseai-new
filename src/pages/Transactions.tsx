import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  User, 
  LogOut, 
  Filter, 
  Plus, 
  Eye, 
  MoreHorizontal, 
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

interface TransactionsProps {
  isDarkMode?: boolean;
}

interface Transaction {
  id: string;
  date: string;
  time: string;
  userName: string;
  userImage?: string;
  userInitials?: string;
  userBgColor?: string;
  userDescription: string;
  email: string;
  phone: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Error' | 'Waiting' | 'Blocked' | 'Requested';
}

export const Transactions: React.FC<TransactionsProps> = ({ isDarkMode = false }) => {
  const { user } = useAuth();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // TODO: fetch real data from Supabase
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '2054ID',
      date: '25-12-2024',
      time: '08:30 PM',
      userName: 'Mc. Doweelds',
      userInitials: 'MD',
      userBgColor: 'bg-red',
      userDescription: 'Storefront, United Kingdom',
      email: 'info@maxd..core.com',
      phone: '+44 846655****1154',
      amount: 110.00,
      status: 'Completed'
    },
    {
      id: '105ID',
      date: '22-12-2024',
      time: '9:00 PM',
      userName: 'Winnie John',
      userImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      userDescription: '18 years, Australia',
      email: 'winnie@sales..core.com',
      phone: '+44 8466585****1154',
      amount: 63.00,
      status: 'Completed'
    },
    {
      id: '058ID',
      date: '22-12-2024',
      time: '07:15 PM',
      userName: 'Alicia Smith',
      userImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      userDescription: '30 years, United States',
      email: 'alicia@sales..core.com',
      phone: '+44 8466585****1154',
      amount: 75.00,
      status: 'Completed'
    },
    {
      id: '500ID',
      date: '21-12-2024',
      time: '01:15 PM',
      userName: 'Johnson Bags',
      userInitials: 'JG',
      userBgColor: 'bg-purple',
      userDescription: 'eCommerce, United States',
      email: 'sales@JJohnso..led.com',
      phone: '+44 8466585****1154',
      amount: 65.00,
      status: 'Error'
    },
    {
      id: '2054ID',
      date: '20-12-2024',
      time: '08:18 PM',
      userName: 'David Warner',
      userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      userDescription: '30 years, United States',
      email: 'david@sales..core.com',
      phone: '+44 8466585****1154',
      amount: 84.00,
      status: 'Pending'
    },
    {
      id: '105ID',
      date: '20-12-2024',
      time: '05:07 PM',
      userName: 'Winnie John',
      userInitials: 'WJ',
      userBgColor: 'bg-blue-600',
      userDescription: '15 years, Australia',
      email: 'winnie@sales..core.com',
      phone: '+44 8466585****1154',
      amount: 65.00,
      status: 'Pending'
    }
  ]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Error':
        return 'bg-red-500';
      case 'Waiting':
        return 'bg-blue-400';
      case 'Blocked':
        return 'bg-gray-500';
      case 'Requested':
        return 'bg-purple-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
          <div className="container-fluid mt-4">
            <div className="row items-center">
              <div className="col-12 col-sm">
                <nav aria-label="breadcrumb" className="mb-2">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Transactions</li>
                  </ol>
                </nav>
                <h5>Transactions</h5>
              </div>
              <div className="col-auto py-1">
                <a href="#" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Invoice</span>
                </a>
              </div>
              <div className="col-auto py-1 ms-auto ms-sm-0">
                <button 
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  onClick={toggleFilter}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container">
            {/* Filter Area */}
            {isFilterOpen && (
              <div className="mt-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>All</option>
                        <option>My Self</option>
                        <option>Agent</option>
                        <option>Users</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>All</option>
                        <option>Completed</option>
                        <option>Requested</option>
                        <option>Pending</option>
                        <option>Error</option>
                        <option>Waiting</option>
                        <option>Blocked</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Table */}
            <div className={`mt-4 mb-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-600'}`}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date and Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">User Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Contact Info</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction, index) => (
                      <tr key={index} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{transaction.id}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{transaction.date}</div>
                          <div className="text-xs text-gray-500">{transaction.time}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {transaction.userImage ? (
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={transaction.userImage} 
                                  alt={transaction.userName} 
                                />
                              ) : (
                                <div className={`h-10 w-10 rounded-full ${transaction.userBgColor || 'bg-gray-300'} flex items-center justify-center text-white`}>
                                  <span>{transaction.userInitials}</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{transaction.userName}</div>
                              <div className="text-xs text-gray-500">{transaction.userDescription}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm">{transaction.email}</div>
                          <div className="text-xs text-gray-500">{transaction.phone}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm font-medium">${transaction.amount.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(transaction.status)} text-white`}>
                            {transaction.status}
                          </span>
                          {transaction.status === 'Error' && (
                            <button className="ml-2 text-gray-400 hover:text-gray-500">
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-500">
                              <Eye className="h-5 w-5" />
                            </button>
                            <div className="relative inline-block text-left">
                              <button className="text-gray-400 hover:text-gray-500">
                                <MoreHorizontal className="h-5 w-5" />
                              </button>
                              {/* Dropdown menu would go here */}
                            </div>
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

export default Transactions;