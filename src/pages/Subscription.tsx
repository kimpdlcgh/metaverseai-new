import React, { useState } from 'react';
import { Check, AlertCircle, Shield, BarChart3, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface SubscriptionProps {
  isDarkMode?: boolean;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isRecommended: boolean;
  isBest: boolean;
  features: string[];
  premiumFeatures?: string[];
  monthlyPrice?: number;
  annualPrice?: number;
}

const Subscription: React.FC<SubscriptionProps> = ({ isDarkMode = false }) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: 1,
      name: 'Personal',
      description: 'Perfect for the individuals',
      price: 50, 
      monthlyPrice: 5,
      annualPrice: 50,
      isActive: true,
      isRecommended: false,
      isBest: false,
      features: [
        'All demo access',
        'Unlimited Download',
        'No Contact list',
        '10 transactions per day',
        '24/7 Customer Support'
      ],
      premiumFeatures: []
    },
    {
      id: 2,
      name: 'Business',
      description: 'Multiple team & customer',
      price: 100,
      monthlyPrice: 10,
      annualPrice: 100,
      isActive: false,
      isRecommended: true,
      isBest: false,
      features: [
        'All demo access',
        'Unlimited Download',
        'No Contact list',
        '10 transactions per day',
        '24/7 Customer Support'
      ],
      premiumFeatures: [
        'Multiple team access',
        'Priority email support',
        'Advanced analytics'
      ]
    },
    {
      id: 3,
      name: 'Ultra Pro',
      description: 'Multiple Application',
      price: 150,
      monthlyPrice: 15,
      annualPrice: 150,
      isActive: false,
      isRecommended: false,
      isBest: true,
      features: [
        'All demo access',
        'Unlimited Download',
        'No Contact list',
        '10 transactions per day',
        '24/7 Customer Support'
      ],
      premiumFeatures: [
        'Unlimited access to all features',
        'Priority 24/7 support',
        'Exclusive premium content',
        'Custom branding options',
        'Advanced security features',
        'Dedicated account manager'
      ]
    }
  ]);

  const handleBuyPlan = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile with new subscription
      console.log(`Subscription to ${selectedPlan.name} plan confirmed`);
      
      // Close modal and redirect
      setShowConfirmModal(false);
      setIsProcessing(false);
      
      // Redirect to My Subscription page
      navigate('/app/mysubscriptions');
      
      // In a real app, you would send a confirmation email here
    } catch (error) {
      console.error('Error processing subscription:', error);
      setIsProcessing(false);
    }
  };

  const handleCancelPurchase = () => {
    setShowConfirmModal(false);
    setSelectedPlan(null);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-fluid mt-4">
        <div className="row gx-3 align-items-center">
          <div className="col-12 col-sm">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Subscription Plans</li>
              </ol>
            </nav>
            <h5>All Subscriptions</h5>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mt-4">
        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              className={`px-4 py-2 rounded-lg ${
                billingCycle === 'monthly' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                billingCycle === 'annual' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <span className="text-green-500 text-xs">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className="col-span-1 cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => !plan.isActive && handleBuyPlan(plan.id)}
            >
              <div className={`bg-white rounded-lg shadow-sm overflow-hidden h-full ${plan.isRecommended ? 'border-2 border-blue-500' : ''}`}>
                <div className="p-6">
                  <div className="text-center mb-4">
                    {plan.isActive && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    )}
                    {plan.isRecommended && (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Recommended
                      </span>
                    )}
                    {plan.isBest && (
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Best
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                      plan.name === 'Personal' 
                        ? 'bg-blue-100 text-blue-600' 
                        : plan.name === 'Business' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-blue-100 text-blue-600'
                    }`}>
                      {plan.name === 'Personal' ? (
                        <span className="text-xl">👤</span>
                      ) : plan.name === 'Business' ? (
                        <span className="text-xl">👥</span>
                      ) : (
                        <span className="text-xl">🏢</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{plan.name}</h4>
                      <p className="text-gray-500">{plan.description}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center mb-4 ${plan.isBest ? 'text-white' : ''}`}>
                    <h1 className="text-4xl font-bold">
                      <span className={plan.isBest ? 'opacity-75' : 'text-gray-400'}>$</span>
                      {billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                    </h1>
                    <div className="ml-2">
                      <p className={plan.isBest ? 'opacity-75' : 'text-gray-500'}>
                        per {billingCycle === 'monthly' ? 'month' : 'year'}
                      </p>
                    </div>
                  </div>
                  
                  <h6 className="font-medium mb-3">Basic includes:</h6>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className={`flex items-center ${plan.isBest ? 'text-white' : 'text-gray-600'}`}>
                        <Check className={`w-5 h-5 mr-2 ${plan.isBest ? 'text-white' : 'text-green-500'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Premium Features */}
                  {plan.premiumFeatures && plan.premiumFeatures.length > 0 && (
                    <>
                      <h6 className={`font-medium mb-3 ${plan.isBest ? 'text-white' : ''}`}>Premium features:</h6>
                      <ul className="space-y-2 mb-4">
                        {plan.premiumFeatures.map((feature, index) => (
                          <li key={index} className={`flex items-center ${plan.isBest ? 'text-white' : 'text-gray-600'}`}>
                            <Check className={`w-5 h-5 mr-2 ${plan.isBest ? 'text-white' : 'text-green-500'}`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className={`p-4 text-center ${plan.isBest ? 'bg-none' : 'bg-gray-50'}`}>
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      plan.isActive 
                        ? 'bg-gray-300 cursor-not-allowed text-white' 
                        : plan.isBest
                          ? 'bg-white text-blue-600 hover:bg-blue-50'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    onClick={() => handleBuyPlan(plan.id)}
                    disabled={plan.isActive}
                  >
                    {plan.isActive ? 'Current Plan' : 'Buy Now!'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Comparison */}
        <div className="mt-12 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left border-b">Features</th>
                  <th className="p-4 text-center border-b">Personal</th>
                  <th className="p-4 text-center border-b">Business</th>
                  <th className="p-4 text-center border-b">Ultra Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b">Demo Access</td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Unlimited Downloads</td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Daily Transactions</td>
                  <td className="p-4 text-center border-b">10</td>
                  <td className="p-4 text-center border-b">50</td>
                  <td className="p-4 text-center border-b">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Customer Support</td>
                  <td className="p-4 text-center border-b">Email</td>
                  <td className="p-4 text-center border-b">Priority Email</td>
                  <td className="p-4 text-center border-b">24/7 Priority</td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Team Members</td>
                  <td className="p-4 text-center border-b">1</td>
                  <td className="p-4 text-center border-b">5</td>
                  <td className="p-4 text-center border-b">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Advanced Analytics</td>
                  <td className="p-4 text-center border-b">-</td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Exclusive Content</td>
                  <td className="p-4 text-center border-b">-</td>
                  <td className="p-4 text-center border-b">-</td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Custom Branding</td>
                  <td className="p-4 text-center border-b">-</td>
                  <td className="p-4 text-center border-b">-</td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b">Dedicated Account Manager</td>
                  <td className="p-4 text-center border-b">-</td>
                  <td className="p-4 text-center border-b">-</td>
                  <td className="p-4 text-center border-b"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-sm mb-4 mt-8">
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
      
      {/* Confirmation Modal */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Confirm Subscription</h3>
              <p className="mb-4">You are about to subscribe to the <strong>{selectedPlan.name}</strong> plan.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span>Plan:</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Billing:</span>
                  <span className="font-medium">{billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price:</span>
                  <span className="font-medium">${billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice}/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                By confirming, you agree to the terms and conditions of the subscription. You can cancel or change your plan at any time.
              </p>
              
              {isProcessing ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <button 
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    onClick={handleCancelPurchase}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleConfirmPurchase}
                  >
                    Confirm Subscription
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;