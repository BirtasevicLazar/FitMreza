import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProfileImage from './common/ProfileImage';
import CoverImage from './common/CoverImage';

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTrainerData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/me');
      
      if (!response.data?.user) {
        throw new Error('Invalid response format');
      }

      if (response.data.user.type !== 'trainer') {
        throw new Error('Unauthorized access');
      }

      if (!response.data.user.is_active) {
        throw new Error('Account is deactivated');
      }

      setTrainer(response.data.user);
      setError(null);
    } catch (error) {
      let errorMessage = 'An error occurred while fetching data';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server';
      } else {
        // Other errors
        errorMessage = error.message;
      }

      setError(errorMessage);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTrainerData();

    return () => {
      delete axios.defaults.headers.common['Authorization'];
    };
  }, [fetchTrainerData]);

  const handleImageUpdate = (updatedUser) => {
    setTrainer(updatedUser);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!trainer) return null;

  const trainerDetails = trainer.trainer_details || {};

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
          <CoverImage user={trainer} onImageUpdate={handleImageUpdate} />
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
                  <ProfileImage user={trainer} onImageUpdate={handleImageUpdate} />
                </motion.div>
                
                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                      {trainer.name}
                    </h1>
                    <p className="text-[#4F46E5] font-medium text-lg">
                      Profesionalni Trener
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
                      {trainer.email}
                    </p>
                  </div>
                  <div className="bg-white/[0.02] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors">
                    <p className="text-white/60 text-sm mb-1">Telefon</p>
                    <p className="text-white font-medium flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {trainer.phone_number || 'Nije uneto'}
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

            {/* Right Column - Professional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 space-y-8"
            >
              {/* Professional Profile Card */}
              <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                  <span className="w-10 h-10 rounded-full bg-[#4F46E5]/10 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Profesionalni Profil
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg text-white/80 mb-4 flex items-center font-medium">
                      <svg className="w-5 h-5 mr-2 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Specijalizacije
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {trainerDetails.specializations?.split(',').map((spec, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] text-sm font-medium flex items-center hover:bg-[#4F46E5]/20 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg text-white/80 mb-4 flex items-center font-medium">
                      <svg className="w-5 h-5 mr-2 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Sertifikati
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {trainerDetails.certifications?.split(',').map((cert, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] text-sm font-medium flex items-center hover:bg-[#4F46E5]/20 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {cert.trim()}
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
                      {trainerDetails.bio || 'Bio nije unet'}
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

export default TrainerProfile; 