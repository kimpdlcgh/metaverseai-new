import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart,
  Award,
  Plus,
  MessageSquare,
  CheckCircle,
  Edit, 
  Edit3,
  Phone,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import NotificationCenter from '../components/ui/NotificationCenter';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { NotificationService } from '../services/notificationService';

interface UserProfileProps {
  isDarkMode?: boolean;
}

interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  avatar_url: string;
  bio: string;
  location: {
    street_address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  professional_bio: string;
  degree: string;
  college: string;
  specializations: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
    location: string;
  }[];
  rating: number;
  reviews_count: number;
  cover_image_url?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ isDarkMode = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const notifications = await NotificationService.getNotifications(user!.id, 3);
      setRecentNotifications(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const combinedData: UserProfileData = {
        id: data?.id || '',
        full_name: data?.full_name || user?.email?.split('@')[0] || 'User',
        email: data?.email || user?.email || '',
        phone_number: data?.phone_number || '',
        date_of_birth: data?.date_of_birth || '',
        avatar_url: data?.avatar_url || '',
        bio: data?.bio || '',
        location: data?.location || {
          street_address: '',
          city: '',
          state: '',
          postal_code: '',
          country: ''
        },
        professional_bio: profileData?.professional_bio || '',
        degree: profileData?.degree || '',
        college: profileData?.college || '',
        specializations: ['Shares', 'Mutual Funds', 'Deposit', 'Fixed Deposit', 'Gov. Bonds', 'Loan', 'Insurance'],
        experience: [
          {
            company: 'Lively Investment Services',
            position: 'Mutual Fund Specialist',
            duration: '2021 - 2023, 3 years',
            description: '',
            location: 'London, United Kingdom'
          },
          {
            company: 'All is Well Investment Company',
            position: 'Deposit Specialist',
            duration: '2020 - 2021, 1 year',
            description: '',
            location: 'London, United Kingdom'
          }
        ],
        rating: 5.0,
        reviews_count: 150,
        cover_image_url: data?.cover_image_url
      };

      setProfile(combinedData);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error.message);
      showToast(`Error loading profile: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
    showToast('Editing profile. Remember to save your changes!', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => fetchUserProfile()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-fluid mt-4">
        <div className="flex flex-wrap items-center">
          <div className="w-full sm:flex-1">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0 flex text-sm text-gray-500">
                <li className="breadcrumb-item"><Link to="/dashboard" className="hover:text-blue-600">Home</Link></li>
                <li className="mx-2">/</li>
                <li className="breadcrumb-item active text-gray-700" aria-current="page">My Profile</li>
              </ol>
            </nav>
            <h5 className="text-xl font-bold">My Profile</h5>
          </div>
          <div className="w-full sm:w-auto text-end sm:text-auto">
            <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mt-4" id="main-content">
        {/* Cover Image */}
        <div className="h-64 w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden mb-4">
          {profile?.cover_image_url ? (
            <img 
              src={profile.cover_image_url} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <img 
              src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg" 
              alt="Default Cover" 
              className="w-full h-full object-cover opacity-30"
            />
          )}
        </div>
        
        {/* Profile Avatar in Negative Margin */}
        <div className="flex flex-wrap z-10 -mt-20 mb-4 relative">
          <div className="ml-8 text-center">
            <div className="avatar h-40 w-40 rounded-full bg-white p-1 shadow-lg">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile?.full_name} 
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <img 
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" 
                  alt="Default Avatar"
                  className="rounded-full w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {/* User Info Header */}
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h4 className="text-2xl font-bold mb-1 flex items-center">
                  {profile?.full_name || 'User'}
                  <span className="ml-2 inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                </h4>
                <p className="text-gray-500 mb-1">
                  Investor 
                  <span className="mx-2">|</span> <Clock className="w-4 h-4 inline mr-1" /> Full Time
                  <span className="mx-2">|</span> <DollarSign className="w-4 h-4 inline mr-1" /> $150 - $500
                </p>
                <p className="text-gray-600">
                  {profile?.location?.street_address ? (
                    <>
                      {profile.location.street_address}, 
                      {profile.location.city && ` ${profile.location.city},`} 
                      {profile.location.state && ` ${profile.location.state},`} 
                      {profile.location.country && ` ${profile.location.country}`}
                    </>
                  ) : (
                    'No address information'
                  )}
                  <MapPin className="w-4 h-4 inline ml-1 text-gray-500" />
                </p>
              </div>
              
              <div className="text-right mt-4 md:mt-0">
                <h5 className="font-bold text-xl flex items-center justify-end">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" /> 
                  {profile?.rating?.toFixed(1) || '5.0'}
                </h5>
                <p className="text-gray-500 text-sm">{profile?.reviews_count || 150} Reviews</p>
              </div>
            </div>
            
            {/* Personal Information */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="text-center">
                <h5 className="text-xl font-medium mb-1">
                  {new Date(profile?.date_of_birth || '').getFullYear() ? 
                    new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : 39} 
                  <small className="text-gray-500">yr</small>
                </h5>
                <p className="text-gray-500 text-sm">
                  <Calendar className="w-3 h-3 inline mr-1" /> 
                  {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : '26-04-1982'}
                </p>
              </div>
              
              <div className="text-center">
                <h5 className="text-xl font-medium mb-1">B+</h5>
                <p className="text-gray-500 text-sm">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span> Blood Group
                </p>
              </div>
              
              <div className="text-center">
                <h5 className="text-xl font-medium mb-1">52</h5>
                <p className="text-gray-500 text-sm">
                  <span>⚖️</span> Weight
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2">
                <Plus className="w-4 h-4 mr-2" /> Book Appointment
              </Button>
              
              <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 px-4 py-2">
                <Phone className="w-4 h-4 mr-2" /> Make a Call
              </Button>
              
              <Button variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 px-4 py-2">
                <MessageSquare className="w-4 h-4 mr-2" /> Send Message
              </Button>
            </div>
            
            <hr className="my-6" />
            
            {/* Professional Bio */}
            <div className="mb-6">
              <h6 className="text-lg font-bold mb-4">Professional bio</h6>
              <p className="text-gray-700">
                {profile?.professional_bio || 
                  'A regular investor and doing investment practising for the past 13 years and having a wide range of experience in finance sector with all kinds of deposits.'}
              </p>
            </div>
            
            <hr className="my-6" />
            
            {/* Academic Qualification */}
            <div className="mb-6">
              <h6 className="text-lg font-bold mb-4">Academic qualification</h6>
              <p className="text-gray-700">
                {profile?.degree ? profile.degree : 'MBA'}, {profile?.college ? profile.college : 'Management University, UK'}<br />
                MA Deposit, Finance Institute, Russia<br />
                Banking, Finance College and Hospital, United States
              </p>
            </div>
            
            <hr className="my-6" />
            
            {/* Industrial Experience */}
            <div className="mb-6">
              <h6 className="text-lg font-bold mb-4">Industrial experience</h6>
              
              {/* Experience Card 1 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex flex-wrap">
                  <div className="w-20 h-20 bg-blue-100 rounded-lg mr-4 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h6 className="text-lg font-medium">Lively Investment Services</h6>
                    <p className="text-gray-500 mb-1">
                      Mutual Fund Specialist
                      <span className="mx-2">|</span> <Clock className="w-4 h-4 inline" /> Full Time
                      <span className="mx-2">|</span> <Calendar className="w-4 h-4 inline" /> 2021 - 2023, 3 years
                    </p>
                    <p className="text-gray-600">
                      Villamore Hospital, 12, Featherstone Street, Ward, London, NG25 5AY, United Kingdom
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Experience Card 2 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex flex-wrap">
                  <div className="w-20 h-20 bg-purple-100 rounded-lg mr-4 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-10 h-10 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h6 className="text-lg font-medium">All is Well investment company</h6>
                    <p className="text-gray-500 mb-1">
                      Deposit Specialist
                      <span className="mx-2">|</span> <Clock className="w-4 h-4 inline" /> Full Time
                      <span className="mx-2">|</span> <Calendar className="w-4 h-4 inline" /> 2020 - 2021, 1 year
                    </p>
                    <p className="text-gray-600">
                      12, Featherstone Street, Ward, London, NG25 5AY, United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            {/* Notification Center */}
            <div className="mb-6">
              <NotificationCenter />
            </div>
            
            {/* Specialized Treatment */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="border-b border-gray-100 px-5 py-3">
                <h6 className="font-bold">Specialized treatment</h6>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {profile?.specializations.map((spec, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded-md text-gray-700">{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Offer Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white overflow-hidden relative shadow-lg">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg" 
                  alt="Background" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 relative z-10">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <h2 className="text-3xl font-bold mb-2">20% <small>OFF</small></h2>
                  <h5 className="text-xl mb-2">Holiday Season</h5>
                  <p className="opacity-90 text-sm mb-3">Price including with our launch offer get 5% Extra</p>
                  <button className="px-4 py-1 border border-white/50 rounded-full text-sm hover:bg-white/10 transition-colors">
                    GOSEASON
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

export default UserProfile;