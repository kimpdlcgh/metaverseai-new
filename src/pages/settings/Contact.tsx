import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export default function Contact() {
  // TODO: integrate with Supabase
  const [formData, setFormData] = useState({
    phoneNumber: '044985624A125',
    supportEmail: 'support@adminuiux.com',
    email: 'guest@adminuiux.com',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    street: '',
    country: '',
    pincode: '',
    state: '',
    city: '',
    enableChat: true,
    showContactForm: true,
    showAddress: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({
    city: 'Please enter valid input'
  });

  // TODO: integrate with Supabase
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // TODO: integrate with Supabase
  const handleSave = () => {
    console.log('Saving contact settings', formData);
  };

  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="row gx-3 align-items-center">
          <div className="col-12 col-sm">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Settings</li>
              </ol>
            </nav>
            <h5>Contact Setting</h5>
          </div>
        </div>
      </div>

      <div className="container mt-4" id="main-content">
        <div className="card bg-white rounded-lg shadow-sm overflow-hidden mb-4 pt-5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 z-10"></div>
          <div className="absolute top-0 right-0 m-2 z-20">
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4 inline mr-2" /> Change Cover
            </button>
            <input type="file" className="hidden" />
          </div>
          <img 
            src="https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg" 
            alt="Cover" 
            className="w-full h-48 object-cover"
          />
          <div className="p-6 text-center text-white relative z-20">
            <div className="inline-block relative w-auto mx-auto my-3">
              <img 
                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
              <div className="absolute bottom-0 right-0 z-30">
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
                <input type="file" className="hidden" />
              </div>
            </div>
            <h4 className="font-medium">AdminUIUX</h4>
            <p className="opacity-75 mb-3">{formData.email}</p>
          </div>
        </div>

        <div className="card bg-white rounded-lg shadow-sm mb-4">
          <div className="card-body">
            <h6 className="mb-3">Basic Details</h6>
            <div className="row mb-2">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="Phone number" 
                    value={formData.phoneNumber} 
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="form-control"
                  />
                  <label>Phone number</label>
                </div>
                <div className="invalid-feedback">Please enter valid input</div>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating">
                  <input 
                    type="email" 
                    placeholder="Support Email Address" 
                    value={formData.supportEmail} 
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                    className="form-control"
                  />
                  <label>Support Email Address</label>
                </div>
                <div className="invalid-feedback mb-3">Add .com at last to insert valid data</div>
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email} 
                    disabled 
                    className="form-control"
                  />
                  <label>Email Address</label>
                </div>
                <div className="invalid-feedback mb-3">Add .com at last to insert valid data</div>
              </div>
            </div>

            <h6 className="mb-3">Address Details</h6>
            <div className="row mb-2">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="Address Line 1" 
                    value={formData.addressLine1} 
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    className="form-control"
                  />
                  <label>Address Line 1</label>
                </div>
                <div className="invalid-feedback">Please enter valid input</div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="Address Line 2" 
                    value={formData.addressLine2} 
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    className="form-control"
                  />
                  <label>Address Line 2</label>
                </div>
                <div className="invalid-feedback mb-3">Add insert valid data</div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="Landmark" 
                    value={formData.landmark} 
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    className="form-control"
                  />
                  <label>Landmark</label>
                </div>
                <div className="invalid-feedback">Please enter valid input</div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="Street" 
                    value={formData.street} 
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    className="form-control"
                  />
                  <label>Street</label>
                </div>
                <div className="invalid-feedback mb-3">Add insert valid data</div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="Country" 
                    value={formData.country} 
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="form-control"
                  />
                  <label>Country</label>
                </div>
                <div className="invalid-feedback">Please enter valid input</div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="Pincode" 
                    value={formData.pincode} 
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="form-control"
                  />
                  <label>Pincode</label>
                </div>
                <div className="invalid-feedback">Please enter valid input</div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="State" 
                    value={formData.state} 
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="form-control"
                  />
                  <label>State</label>
                </div>
                <div className="invalid-feedback">Please enter valid input</div>
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    placeholder="City" 
                    value={formData.city} 
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="form-control is-invalid"
                  />
                  <label>City</label>
                </div>
                <div className="invalid-feedback">Please enter valid input</div>
              </div>
            </div>

            <h6 className="mb-3">Enable Contact page with</h6>
            <div className="row">
              <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="support1"
                    checked={formData.enableChat}
                    onChange={() => handleInputChange('enableChat', !formData.enableChat)}
                  />
                  <label className="form-check-label" htmlFor="support1">Enable Chat</label>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="support2"
                    checked={formData.showContactForm}
                    onChange={() => handleInputChange('showContactForm', !formData.showContactForm)}
                  />
                  <label className="form-check-label" htmlFor="support2">Show contact form</label>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="support3"
                    checked={formData.showAddress}
                    onChange={() => handleInputChange('showAddress', !formData.showAddress)}
                  />
                  <label className="form-check-label" htmlFor="support3">Show address</label>
                </div>
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
    </div>
  );
}