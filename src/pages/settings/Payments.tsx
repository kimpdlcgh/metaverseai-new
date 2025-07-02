import React, { useState } from 'react';
import { CreditCard, Pencil, Trash, Plus, RefreshCw } from 'lucide-react';

export default function Payments() {
  // TODO: integrate with Supabase
  const [cards, setCards] = useState([
    {
      id: 1,
      bank: 'City Bank',
      type: 'Credit Card',
      number: '000 0000 0001 546598',
      expiry: '09/023',
      holder: 'adminuiux',
      background: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg',
      transactions: [
        {
          id: 1,
          name: "Lion's dan resort",
          category: 'Hotel and Restaurant',
          image: 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg',
          amount: 252.00
        },
        {
          id: 2,
          name: 'Treeview SuperMart',
          category: 'Grocery',
          image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
          amount: 300.35
        },
        {
          id: 3,
          name: 'Flamingo Bar & Club',
          category: 'Hotel and Restaurant',
          image: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg',
          amount: 500.50
        }
      ]
    },
    {
      id: 2,
      bank: 'City Bank',
      type: 'Credit Card',
      number: '000 0000 0001 546598',
      expiry: '09/023',
      holder: 'adminuiux',
      transactions: [
        {
          id: 1,
          name: "Lion's dan resort",
          category: 'Hotel and Restaurant',
          image: 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg',
          amount: 252.00
        },
        {
          id: 2,
          name: 'Treeview SuperMart',
          category: 'Grocery',
          image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
          amount: 300.35
        },
        {
          id: 3,
          name: 'Flamingo Bar & Club',
          category: 'Hotel and Restaurant',
          image: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg',
          amount: 500.50
        }
      ]
    }
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState({
    onlinePayment: true,
    posDevice: true,
    cash: false
  });
  const [paypalEmail, setPaypalEmail] = useState('testmail@adminuiux.com');
  const [paypalVerified, setPaypalVerified] = useState(true);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardData, setNewCardData] = useState({
    holderName: 'Max Johnson',
    cardNumber: '',
    expiryMonth: '02',
    expiryYear: '24',
    cvv: ''
  });

  // TODO: integrate with Supabase
  const handleEditCard = (cardId: number) => {
    console.log('Edit card', cardId);
  };

  // TODO: integrate with Supabase
  const handleDeleteCard = (cardId: number) => {
    console.log('Delete card', cardId);
  };

  // TODO: integrate with Supabase
  const handleAddCard = () => {
    console.log('Add card', newCardData);
    setShowAddCardModal(false);
  };

  // TODO: integrate with Supabase
  const handleSave = () => {
    console.log('Save payment settings', { paymentMethods, paypalEmail });
  };

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="row gx-3 align-items-center">
          <div className="col-12 col-sm">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li className="breadcrumb-item"><a href="/app/settings">Settings</a></li>
                <li className="breadcrumb-item active" aria-current="page">Payments</li>
              </ol>
            </nav>
            <h5>Settings Payment</h5>
          </div>
        </div>
      </div>

      <div className="container mt-4" id="main-content">
        <div className="card bg-white rounded-lg shadow-sm mb-4">
          <div className="card-body pb-0">
            <h6 className="mb-3">My credit cards</h6>
            <div className="relative mb-3">
              <div className="flex overflow-x-auto pb-2 space-x-4">
                {cards.map((card, index) => (
                  <div key={card.id} className={`flex-shrink-0 w-72 ${index === currentCardIndex ? 'block' : 'hidden md:block'}`}>
                    <div className={`card bg-blue-600 text-white rounded-lg p-4 mb-2 relative overflow-hidden`}>
                      {card.background && (
                        <div className="absolute inset-0 opacity-50">
                          <img src={card.background} alt="Card background" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="relative z-10">
                        <div className="flex justify-between mb-3">
                          <CreditCard className="w-6 h-6" />
                          <div className="text-right">
                            <span className="text-xs opacity-75">{card.bank}</span><br />
                            <span>{card.type}</span>
                          </div>
                        </div>
                        <p className="text-lg mb-4">
                          {card.number}
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs opacity-75 mb-0">Expiry</p>
                            <p>{card.expiry}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-75 mb-0">Card Holder</p>
                            <p>{card.holder}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button 
                        className="btn btn-link"
                        onClick={() => handleEditCard(card.id)}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button 
                        className="btn btn-link text-red-600"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex-shrink-0 w-72">
                  <button 
                    onClick={() => setShowAddCardModal(true)}
                    className="bg-gray-100 text-blue-600 h-44 w-full rounded-lg text-center flex flex-col items-center justify-center"
                  >
                    <Plus className="w-8 h-8 mb-4" />
                    <p className="text-lg font-medium mb-0">Create New</p>
                    <p className="text-sm opacity-75">Add new card</p>
                  </button>
                </div>
              </div>
              {cards.length > 1 && (
                <>
                  <button 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full shadow-md md:hidden"
                    onClick={prevCard}
                  >
                    <span className="text-lg">◀</span>
                  </button>
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded-full shadow-md md:hidden"
                    onClick={nextCard}
                  >
                    <span className="text-lg">▶</span>
                  </button>
                </>
              )}
            </div>

            <h6 className="mb-3">How you receive Payment?</h6>
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="form-check form-switch mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="onlinepayment"
                    checked={paymentMethods.onlinePayment}
                    onChange={() => setPaymentMethods({...paymentMethods, onlinePayment: !paymentMethods.onlinePayment})}
                  />
                  <label className="form-check-label" htmlFor="onlinepayment">Online Payment</label>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="form-check form-switch mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="pos"
                    checked={paymentMethods.posDevice}
                    onChange={() => setPaymentMethods({...paymentMethods, posDevice: !paymentMethods.posDevice})}
                  />
                  <label className="form-check-label" htmlFor="pos">Have POS Device</label>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="form-check form-switch mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="cash"
                    checked={paymentMethods.cash}
                    onChange={() => setPaymentMethods({...paymentMethods, cash: !paymentMethods.cash})}
                  />
                  <label className="form-check-label" htmlFor="cash">Cash</label>
                </div>
              </div>
            </div>

            <h6 className="mb-3">PayPal ID
              <small className="text-secondary fw-normal"> - Provide to receive payouts</small>
            </h6>
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-4">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={paypalEmail} 
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="form-control"
                  />
                  <label>Email</label>
                </div>
              </div>
              <div className="col-auto align-self-center">
                <p className="mb-4 text-success">
                  <CheckCircle className="w-4 h-4 inline mr-1" /> Verified
                </p>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col">
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-link">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Credit Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h6 className="font-medium">Add Credit Card</h6>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text"><User className="w-5 h-5" /></span>
                  <div className="form-floating">
                    <input 
                      type="text" 
                      placeholder="Card Holder Name" 
                      value={newCardData.holderName} 
                      onChange={(e) => setNewCardData({...newCardData, holderName: e.target.value})}
                      className="form-control"
                    />
                    <label>Card Holder Name</label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text"><CreditCard className="w-5 h-5" /></span>
                  <div className="form-floating">
                    <input 
                      type="text" 
                      placeholder="Card Number" 
                      value={newCardData.cardNumber} 
                      onChange={(e) => setNewCardData({...newCardData, cardNumber: e.target.value})}
                      className="form-control"
                    />
                    <label>Card Number</label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="input-group mb-3">
                    <span className="input-group-text"><Calendar className="w-5 h-5" /></span>
                    <div className="form-floating">
                      <select 
                        className="form-select"
                        value={newCardData.expiryMonth}
                        onChange={(e) => setNewCardData({...newCardData, expiryMonth: e.target.value})}
                      >
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = (i + 1).toString().padStart(2, '0');
                          return <option key={month} value={month}>{month}</option>;
                        })}
                      </select>
                      <label>Expiry Month</label>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="input-group mb-3">
                    <span className="input-group-text"><Calendar className="w-5 h-5" /></span>
                    <div className="form-floating">
                      <select 
                        className="form-select"
                        value={newCardData.expiryYear}
                        onChange={(e) => setNewCardData({...newCardData, expiryYear: e.target.value})}
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = (new Date().getFullYear() + i).toString().slice(-2);
                          return <option key={year} value={year}>{year}</option>;
                        })}
                      </select>
                      <label>Expiry Year</label>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="input-group mb-3">
                    <span className="input-group-text">*</span>
                    <div className="form-floating">
                      <input 
                        type="number" 
                        placeholder="CVV" 
                        value={newCardData.cvv} 
                        onChange={(e) => setNewCardData({...newCardData, cvv: e.target.value})}
                        className="form-control"
                      />
                      <label>CVV</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between">
                <button className="btn btn-primary" onClick={handleAddCard}>Add Card</button>
                <button className="btn btn-link" onClick={() => setShowAddCardModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}