import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProfileImage from './common/ProfileImage';
import CoverImage from './common/CoverImage';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/me');
        
        if (!response.data?.user || response.data.user.type !== 'user') {
          navigate('/login');
          return;
        }

        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      delete axios.defaults.headers.common['Authorization'];
    };
  }, [navigate]);

  const handleImageUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
      {/* Header Section with Cover Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-32"
      >
        {/* Cover Image Container */}
        <div className="relative h-[400px] md:h-[500px] w-full">
          <CoverImage user={user} onImageUpdate={handleImageUpdate} />
        </div>
        
        {/* Profile Info Overlay */}
        <div className="absolute -bottom-24 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto px-6 max-w-5xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:items-end">
                {/* Profile Image */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative -mt-16 md:mt-0"
                >
                  <ProfileImage user={user} onImageUpdate={handleImageUpdate} />
                </motion.div>
                
                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                      {user.name}
                    </h1>
                    <p className="text-[#4F46E5] font-medium text-lg">
                      Član
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Left Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 space-y-8"
            >
              {/* Contact Card */}
              <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[#4F46E5]/10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Kontakt Informacije
                </h2>
                <div className="space-y-6">
                  <div className="bg-white/[0.02] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors">
                    <p className="text-white/60 text-sm mb-1">Email</p>
                    <p className="text-white font-medium flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      {user.email}
                    </p>
                  </div>
                  <div className="bg-white/[0.02] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors">
                    <p className="text-white/60 text-sm mb-1">Telefon</p>
                    <p className="text-white font-medium flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {user.phone_number || 'Nije uneto'}
                    </p>
                  </div>
                  <div className="bg-white/[0.02] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors">
                    <p className="text-white/60 text-sm mb-1">Status</p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-white font-medium">Aktivan</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Fitness Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 space-y-8"
            >
              {/* Fitness Profile Card */}
              <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                  <span className="w-10 h-10 rounded-full bg-[#4F46E5]/10 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  Fitness Profil
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg text-white/80 mb-4 flex items-center font-medium">
                      <svg className="w-5 h-5 mr-2 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Ciljevi Treninga
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {user.training_goals?.split(',').map((goal, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] text-sm font-medium flex items-center hover:bg-[#4F46E5]/20 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {goal.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg text-white/80 mb-4 flex items-center font-medium">
                      <svg className="w-5 h-5 mr-2 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      O Meni
                    </h3>
                    <div className="bg-white/[0.02] rounded-2xl p-6 text-white/90 leading-relaxed hover:bg-white/[0.04] transition-colors">
                      {user.bio || 'Bio nije unet'}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg text-white/80 mb-4 flex items-center font-medium">
                      <svg className="w-5 h-5 mr-2 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Fitness Statistika
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/[0.02] rounded-2xl p-5 hover:bg-white/[0.04] transition-colors">
                        <p className="text-white/60 text-sm mb-2">Visina</p>
                        <p className="text-white text-xl font-semibold">
                          {user.height || '-'} <span className="text-white/60 text-sm">cm</span>
                        </p>
                      </div>
                      <div className="bg-white/[0.02] rounded-2xl p-5 hover:bg-white/[0.04] transition-colors">
                        <p className="text-white/60 text-sm mb-2">Težina</p>
                        <p className="text-white text-xl font-semibold">
                          {user.weight || '-'} <span className="text-white/60 text-sm">kg</span>
                        </p>
                      </div>
                      <div className="bg-white/[0.02] rounded-2xl p-5 hover:bg-white/[0.04] transition-colors">
                        <p className="text-white/60 text-sm mb-2">BMI</p>
                        <p className="text-white text-xl font-semibold">
                          {user.height && user.weight
                            ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
                            : '-'}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] rounded-2xl p-5 hover:bg-white/[0.04] transition-colors">
                        <p className="text-white/60 text-sm mb-2">Nivo Aktivnosti</p>
                        <p className="text-white text-xl font-semibold">
                          {user.activity_level || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 