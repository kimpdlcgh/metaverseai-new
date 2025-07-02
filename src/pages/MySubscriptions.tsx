import React, { useState } from 'react';
import { CreditCard, Calendar, Check, X, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isRecommended: boolean;
  features: string[];
}

interface PaymentMethod {
  type: string;
  last4: string;
  expiryDate: string;
  nextDueDate: string;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
}

const MySubscriptions: React.FC = () => {
  // Current plan data
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Business',
    type: 'Annual Plan',
    price: 250.00,
    status: 'Active',
    renewalDate: '22-June-2024',
    features: [
      'All demo access',
      'Unlimited Download',
      'No Contact list',
      '10 transactions per day',
      '24/7 Customer Support'
    ],
    paymentMethod: {
      type: 'Credit Card',
      last4: '2548',
      expiryDate: '09/2025',
      nextDueDate: '22-June-2024'
    }
  });
  
  // Payment history
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      date: '22-June-2023',
      amount: 250.00,
      status: 'Paid'
    },
    {
      id: 'INV-2023-012',
      date: '22-June-2022',
      amount: 200.00,
      status: 'Paid'
    },
    {
      id: 'INV-2022-008',
      date: '22-June-2021',
      amount: 200.00,
      status: 'Paid'
    }
  ]);
  
  // Usage statistics
  const [usageStats, setUsageStats] = useState({
    dataUsed: '75%',
    apiCalls: '2,450 / 5,000',
    storageUsed: '1.2 GB / 5 GB',
    lastUpdated: 'Today at 10:45 AM'
  });
  
  const [showChangeCardModal, setShowChangeCardModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Handle card change
  const handleChangeCard = () => {
    setShowChangeCardModal(true);
  };

  // Handle subscription cancellation
  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };
  
  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-fluid mt-4">
        <div className="row gx-3 align-items-center">
          <div className="col-12 col-sm">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li className="breadcrumb-item"><a href="/profile">My Profile</a></li>
                <li className="breadcrumb-item active" aria-current="page">My Subscription</li>
              </ol>
            </nav>
            <h5>My Subscription</h5>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 col-lg-4 col-xl-3">
            {/* Profile details */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="p-4">
                <div className="text-center mb-3">
                  <div className="w-32 h-32 mx-auto mb-3">
                    <img 
                      src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h5 className="font-medium">Adminuiux</h5>
                  <p className="text-gray-500">London, UK</p>
                </div>
                
                <p className="text-gray-500 text-sm mb-0">Email Address</p>
                <div className="flex justify-between items-center">
                  <p className="mb-0">test@adminuiuix.com</p>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  </button>
                </div>

                <p className="text-gray-500 text-sm mb-0 mt-3">Password</p>
                <div className="flex justify-between items-center">
                  <p className="mb-0">Last changed 4 years ago</p>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-lg-8 col-xl-9">
            {/* Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-blue-500 bi bi-telephone-plus-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM12.5 1a.5.5 0 0 1 .5.5V3h1.5a.5.5 0 0 1 0 1H13v1.5a.5.5 0 0 1-1 0V4h-1.5a.5.5 0 0 1 0-1H12V1.5a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                </div>
                <div>
                  <h6 className="font-medium mb-1">Add a phone number</h6>
                  <p className="text-sm text-gray-600">Ensure you never lose access to your account and receive important account updates like billing and security alerts.</p>
                </div>
              </div>
            </div>
            
            {/* Current Plan */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <h6 className="font-medium">Current plan</h6>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {currentPlan.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Plan Card */}
                  <div className="lg:col-span-4">
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
                      <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                        <img 
                          src="https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg" 
                          alt="Background" 
                          className="w-full h-full object-cover opacity-50"
                        />
                      </div>
                      <div className="p-4 text-center mt-[-50px]">
                        <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center shadow-md">
                          <img 
                            src="https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg" 
                            alt="Logo" 
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <h4 className="font-medium">{currentPlan.name}</h4>
                        <p className="text-gray-500">{currentPlan.type}</p>
                      </div>
                      <div className="bg-gray-50 p-4 text-center">
                        <h4 className="font-medium">${currentPlan.price.toFixed(2)}</h4>
                      </div>
                    </div>
                  </div>
                  
                  {/* Plan Features */}
                  <div className="lg:col-span-4">
                    <h6 className="font-medium mb-4">Plan Features</h6>
                    <p className="text-gray-500 mb-4">Including features of basic plan</p>
                    
                    <ul className="space-y-2 mb-4">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      More details
                    </button>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="lg:col-span-4">
                    <h6 className="font-medium mb-4">Payment Method</h6>
                    <p className="text-gray-500 mb-4">1 Credit Card is saved</p>
                    
                    <div className="flex items-center mb-3">
                      <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                      <span>Visa ending ****<b>{currentPlan.paymentMethod.last4}</b></span>
                      <span className="ml-2 text-sm text-gray-500">
                        (Expires: {currentPlan.paymentMethod.expiryDate})
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                      <span>Next Due date is <b>{currentPlan.paymentMethod.nextDueDate}</b></span>
                    </div>
                    
                    <div className="space-x-2">
                      <button 
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        onClick={handleChangeCard}
                      >
                        Change Card
                      </button>
                      <button 
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        onClick={handleCancelSubscription}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4">
                <div className="flex flex-wrap gap-2">
                  <Link to="/app/subscription" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    View all plans
                  </Link>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
            
            {/* Usage Statistics */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <h6 className="font-medium">Usage Statistics</h6>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Last updated: {usageStats.lastUpdated}</span>
                    <button className="ml-2 text-gray-400 hover:text-gray-600">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="text-sm text-gray-500 mb-1">Data Usage</h6>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{usageStats.dataUsed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: usageStats.dataUsed }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="text-sm text-gray-500 mb-1">API Calls</h6>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{usageStats.apiCalls}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '49%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="text-sm text-gray-500 mb-1">Storage</h6>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{usageStats.storageUsed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment History */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="border-b border-gray-200 p-4">
                <h6 className="font-medium">Payment History</h6>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Invoice ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{invoice.id}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">{invoice.date}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">${invoice.amount.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="p-6">
                <h4 className="text-2xl font-bold mb-4">Best way to work fast and easy to use.<br/>Stay tracked and also committed with priorities.</h4>
                <p className="text-gray-600 mb-6">Get involved in the race of technology and digitization. Win the heart not the war. Go beyond of imagination but not far from your loved ones.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-bold mb-3">Creators of statements</h5>
                    <p className="text-gray-600 mb-4">All the export functionalities are available for your reports and email to any person around the world.</p>
                    
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center mr-3">
                        <span className="text-xl">📄</span>
                      </div>
                      <div>
                        <h6 className="font-bold">PDF export</h6>
                        <p className="text-gray-600">Pdf export functionalities available for all kind of reports including charts and background images.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded flex items-center justify-center mr-3">
                        <span className="text-xl">📊</span>
                      </div>
                      <div>
                        <h6 className="font-bold">Excel export</h6>
                        <p className="text-gray-600">Excel export functionalities available for all kind of reports including charts.</p>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Buy now
                    </button>
                  </div>

                  <div>
                    <h5 className="font-bold mb-3">Analytics Stronger</h5>
                    <p className="text-gray-600 mb-4">Keep the eye on your visitors and users. Downloads, Clicked, shared with region, gender and people are available.</p>
                    
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded flex items-center justify-center mr-3">
                        <span className="text-xl">📈</span>
                      </div>
                      <div>
                        <h6 className="font-bold">Reporting</h6>
                        <p className="text-gray-600">Subscription and manage features as per your need. More advance designs available to customize.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded flex items-center justify-center mr-3">
                        <span className="text-xl">🔄</span>
                      </div>
                      <div>
                        <h6 className="font-bold">Sharing Domain</h6>
                        <p className="text-gray-600">Now you can able to track more resource availability and share your progress with multiple users.</p>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      Buy now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Change Card Modal */}
      {showChangeCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h6 className="font-medium">Update Payment Method</h6>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-lg" 
                  placeholder="1234 5678 9012 3456" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-lg" 
                    placeholder="MM/YY" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-lg" 
                    placeholder="123" 
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-lg" 
                  placeholder="John Doe" 
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowChangeCardModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Card
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h6 className="font-medium">Cancel Subscription</h6>
            </div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h5 className="font-medium mb-2">Are you sure you want to cancel?</h5>
                  <p className="text-gray-600 text-sm">
                    Your subscription will be canceled immediately and you will lose access to premium features. Your subscription will remain active until the end of your current billing period on <strong>{currentPlan.renewalDate}</strong>.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h6 className="font-medium mb-2">Reasons for cancellation</h6>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="cancel-reason" className="mr-2" />
                    <span>Too expensive</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="cancel-reason" className="mr-2" />
                    <span>Not using it enough</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="cancel-reason" className="mr-2" />
                    <span>Missing features</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="cancel-reason" className="mr-2" />
                    <span>Switching to another service</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="cancel-reason" className="mr-2" />
                    <span>Other</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;