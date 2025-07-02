import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  User, 
  LogOut, 
  Settings as SettingsIcon,
  Clock,
  Camera,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

interface SettingsProps {
  isDarkMode?: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  bloodGroup: string;
  weight: string;
  address: {
    line1: string;
    line2: string;
    landmark: string;
    street: string;
    country: string;
    pincode: string;
    state: string;
    city: string;
  };
  professionalBio: string;
  academicQualifications: {
    degree: string;
    institution: string;
  }[];
  specializedTreatments: string[];
  visibility: {
    showProfilePublicly: boolean;
    showAvailability: boolean;
    showTaglineInProfile: boolean;
    makeProfileInactive: boolean;
  };
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode = false }) => {
  const { user } = useAuth();
  
  // TODO: fetch real data from Supabase
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'adminuiux',
    lastName: '',
    email: 'guest@adminuiux.com',
    birthDate: '26-04-1982',
    bloodGroup: 'B+',
    weight: '52',
    address: {
      line1: '',
      line2: '',
      landmark: '',
      street: '',
      country: '',
      pincode: '',
      state: '',
      city: ''
    },
    professionalBio: '',
    academicQualifications: [
      {
        degree: 'M.B.B.S',
        institution: ''
      }
    ],
    specializedTreatments: [
      'Skin whitening',
      'Skin problem',
      'Skin decease',
      'Lesser treatment',
      'Hair problem'
    ],
    visibility: {
      showProfilePublicly: true,
      showAvailability: true,
      showTaglineInProfile: false,
      makeProfileInactive: false
    }
  });
  
  const [profileImage, setProfileImage] = useState<string>('https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  const [coverImage, setCoverImage] = useState<string>('https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  
  const handleInputChange = (field: string, value: string | boolean) => {
    // Handle nested fields
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUserProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserProfile],
          [child]: value
        }
      }));
    } else {
      setUserProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to Supabase storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to Supabase storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddAcademicQualification = () => {
    setUserProfile(prev => ({
      ...prev,
      academicQualifications: [
        ...prev.academicQualifications,
        { degree: '', institution: '' }
      ]
    }));
  };
  
  const handleAddTreatment = () => {
    setUserProfile(prev => ({
      ...prev,
      specializedTreatments: [
        ...prev.specializedTreatments,
        ''
      ]
    }));
  };
  
  const handleSaveProfile = () => {
    // TODO: Save profile to Supabase
    console.log('Saving profile:', userProfile);
    // Show success message
    alert('Profile saved successfully!');
  };

  return (
    <div>
      {/* Breadcrumb */}
          <div className="container-fluid mt-4">
            <div className="flex flex-wrap items-center">
              <div className="w-full sm:flex-1">
                <nav aria-label="breadcrumb" className="mb-2">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Settings</li>
                  </ol>
                </nav>
                <h5>Settings Basic</h5>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mt-4">
            {/* Cover */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden mb-4 pt-5 relative`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 z-10"></div>
              <div className="absolute top-0 right-0 m-2 z-20">
                <button 
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => document.getElementById('cover-upload')?.click()}
                >
                  <Camera className="w-4 h-4 inline mr-2" /> Change Cover
                </button>
                <input 
                  id="cover-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
              </div>
              <img 
                src={coverImage} 
                alt="Cover" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center text-white relative z-20">
                <div className="inline-block relative w-auto mx-auto my-3">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                  <div className="absolute bottom-0 right-0 z-30">
                    <button 
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      onClick={() => document.getElementById('profile-upload')?.click()}
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input 
                      id="profile-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfileImageChange}
                    />
                  </div>
                </div>
                <h4 className="font-medium">AdminUIUX</h4>
                <p className="opacity-75 mb-3">{userProfile.email}</p>
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Sidebar */}
              <div className="col-span-1">
                <div className="sticky top-20">
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm mb-4`}>
                    <div className="p-4">
                      <ul className="space-y-2">
                        <li>
                          <Link 
                            to="/app/settings" 
                            className="flex items-center p-3 bg-blue-600 text-white rounded-lg"
                          >
                            <User className="w-6 h-6 mr-3" />
                            <div>
                              <p className="font-medium">My Profile</p>
                              <p className="text-xs opacity-75">Basic Details</p>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/app/settings/users" 
                            className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <span className="w-6 h-6 mr-3 flex items-center justify-center">👥</span>
                            <div>
                              <p className="font-medium">Users</p>
                              <p className="text-xs text-gray-500">Roles, Permission, Access</p>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/app/settings/timing" 
                            className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <Clock className="w-6 h-6 mr-3" />
                            <div>
                              <p className="font-medium">Timing</p>
                              <p className="text-xs text-gray-500">Business hours, Emergency</p>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/app/settings/payments" 
                            className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <span className="w-6 h-6 mr-3 flex items-center justify-center">💰</span>
                            <div>
                              <p className="font-medium">Payment</p>
                              <p className="text-xs text-gray-500">Online, Devices, Cash</p>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/app/settings/contact" 
                            className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <span className="w-6 h-6 mr-3 flex items-center justify-center">🛟</span>
                            <div>
                              <p className="font-medium">Contact</p>
                              <p className="text-xs text-gray-500">Support, Call, Chat, email</p>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-1 md:col-span-3">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden mb-4`}>
                  <div className="p-6">
                    <h6 className="font-medium mb-4">Basic Details</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">First Name</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-green-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Last Name</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Last Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                          value={userProfile.email}
                          disabled
                          placeholder="Email Address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Birth date</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.birthDate}
                          onChange={(e) => handleInputChange('birthDate', e.target.value)}
                          placeholder="Birth date"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Blood group</label>
                        <select 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.bloodGroup}
                          onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                        >
                          <option>A</option>
                          <option>A+</option>
                          <option>B</option>
                          <option value="B+">B+</option>
                          <option>B-</option>
                          <option>O</option>
                          <option>O-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Weight (kg)</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          placeholder="Weight"
                        />
                      </div>
                    </div>

                    <h6 className="font-medium mb-4">Address Details</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Address Line 1</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.address.line1}
                          onChange={(e) => handleInputChange('address.line1', e.target.value)}
                          placeholder="Address Line 1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Address Line 2</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.address.line2}
                          onChange={(e) => handleInputChange('address.line2', e.target.value)}
                          placeholder="Address Line 2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Landmark</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.address.landmark}
                          onChange={(e) => handleInputChange('address.landmark', e.target.value)}
                          placeholder="Landmark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Street</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.address.street}
                          onChange={(e) => handleInputChange('address.street', e.target.value)}
                          placeholder="Street"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Country</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.address.country}
                          onChange={(e) => handleInputChange('address.country', e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Pincode</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.address.pincode}
                          onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                          placeholder="Pincode"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">State</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.address.state}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">City</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-red-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={userProfile.address.city}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          placeholder="City"
                        />
                        <div className="text-red-500 text-xs mt-1">Please enter valid input</div>
                      </div>
                    </div>

                    <h6 className="font-medium mb-4">Professional bio</h6>
                    <div className="mb-6">
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32"
                        value={userProfile.professionalBio}
                        onChange={(e) => handleInputChange('professionalBio', e.target.value)}
                        placeholder="Enter your professional bio here..."
                      ></textarea>
                    </div>

                    <h6 className="font-medium mb-4">Academic qualification</h6>
                    <div className="mb-6">
                      {userProfile.academicQualifications.map((qualification, index) => (
                        <div key={index} className="flex flex-wrap items-center mb-3 gap-4">
                          <div className="w-full md:w-auto flex-1">
                            <label className="block text-sm text-gray-500 mb-1">Degree</label>
                            <input 
                              type="text" 
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={qualification.degree}
                              onChange={(e) => {
                                const newQualifications = [...userProfile.academicQualifications];
                                newQualifications[index].degree = e.target.value;
                                setUserProfile(prev => ({
                                  ...prev,
                                  academicQualifications: newQualifications
                                }));
                              }}
                              placeholder="Degree"
                            />
                          </div>
                          <div className="w-full md:w-auto flex-1">
                            <label className="block text-sm text-gray-500 mb-1">College/University</label>
                            <input 
                              type="text" 
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={qualification.institution}
                              onChange={(e) => {
                                const newQualifications = [...userProfile.academicQualifications];
                                newQualifications[index].institution = e.target.value;
                                setUserProfile(prev => ({
                                  ...prev,
                                  academicQualifications: newQualifications
                                }));
                              }}
                              placeholder="College/University"
                            />
                          </div>
                          {index === userProfile.academicQualifications.length - 1 && (
                            <button 
                              className="text-blue-600 hover:text-blue-800 mt-6"
                              onClick={handleAddAcademicQualification}
                            >
                              <Plus className="w-5 h-5 inline mr-1" /> Add
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <h6 className="font-medium mb-4">Specialized treatment</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {userProfile.specializedTreatments.map((treatment, index) => (
                        <div key={index}>
                          <label className="block text-sm text-gray-500 mb-1">Treatment name</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={treatment}
                            onChange={(e) => {
                              const newTreatments = [...userProfile.specializedTreatments];
                              newTreatments[index] = e.target.value;
                              setUserProfile(prev => ({
                                ...prev,
                                specializedTreatments: newTreatments
                              }));
                            }}
                            placeholder="Treatment name"
                          />
                        </div>
                      ))}
                      <div className="flex items-end">
                        <button 
                          className="text-blue-600 hover:text-blue-800 mb-3"
                          onClick={handleAddTreatment}
                        >
                          <Plus className="w-5 h-5 inline mr-1" /> Add
                        </button>
                      </div>
                    </div>

                    <h6 className="font-medium mb-4">Public Visibility</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="showProfilePublicly"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={userProfile.visibility.showProfilePublicly}
                          onChange={(e) => handleInputChange('visibility.showProfilePublicly', e.target.checked)}
                        />
                        <label htmlFor="showProfilePublicly" className="ml-2 text-sm">
                          Show profile publicly
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="showAvailability"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={userProfile.visibility.showAvailability}
                          onChange={(e) => handleInputChange('visibility.showAvailability', e.target.checked)}
                        />
                        <label htmlFor="showAvailability" className="ml-2 text-sm">
                          Show availability
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="showTaglineInProfile"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={userProfile.visibility.showTaglineInProfile}
                          onChange={(e) => handleInputChange('visibility.showTaglineInProfile', e.target.checked)}
                        />
                        <label htmlFor="showTaglineInProfile" className="ml-2 text-sm">
                          Show tagline in profile
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="makeProfileInactive"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={userProfile.visibility.makeProfileInactive}
                          onChange={(e) => handleInputChange('visibility.makeProfileInactive', e.target.checked)}
                        />
                        <label htmlFor="makeProfileInactive" className="ml-2 text-sm">
                          Make profile inactive
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between">
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleSaveProfile}
                      >
                        Save
                      </button>
                      <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default Settings;