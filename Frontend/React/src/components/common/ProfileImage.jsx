import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ProfileImage = ({ user, onImageUpdate, ignorePlaceholder = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Helper funkcija za proveru da li je URL placeholder
  const isPlaceholderUrl = (url) => {
    return url?.includes('ui-avatars.com');
  };

  // Određivanje da li treba prikazati sliku
  const shouldShowImage = user.profile_image_url && (!ignorePlaceholder || !isPlaceholderUrl(user.profile_image_url));

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Slika ne sme biti veća od 2MB');
      setShowModal(false);
      setShowErrorModal(true);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Dozvoljeni formati su: JPG, JPEG, PNG');
      setShowModal(false);
      setShowErrorModal(true);
      return;
    }

    setIsUploading(true);
    setError('');
    setShowModal(false);
    setShowErrorModal(false);

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const response = await axios.post('/update-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        onImageUpdate(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Greška prilikom uploada slike');
      setShowErrorModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      setShowModal(false);
      const response = await axios.delete('/remove-profile-image', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        onImageUpdate(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Greška prilikom brisanja slike');
      setShowErrorModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative cursor-pointer group"
          onClick={() => setShowModal(true)}
        >
          {shouldShowImage ? (
            <div className="relative">
              <img
                src={user.profile_image_url}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#4F46E5]/20"
              />
              {/* Hover indikator */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-[#1A1A1A] border-4 border-[#4F46E5]/20 flex items-center justify-center group-hover:bg-[#4F46E5]/10 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal za izmenu slike */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                Izmena Profilne Slike
              </h3>
              
              <div className="space-y-4">
                <label className="block w-full cursor-pointer bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 transition-all duration-300 rounded-xl px-4 py-3 text-center">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                  <span className="text-[#4F46E5] font-medium inline-flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Promeni Sliku
                  </span>
                </label>

                {shouldShowImage && (
                  <button
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-300 rounded-xl px-4 py-3 font-medium inline-flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Ukloni Sliku
                  </button>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white/80 transition-all duration-300 rounded-xl px-4 py-3 font-medium"
                >
                  Otkaži
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm border border-red-500/20"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                Greška
              </h3>
              
              <p className="text-white/80 text-center mb-6">
                {error}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    setShowModal(true);
                  }}
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all duration-300 rounded-xl px-4 py-3 font-medium"
                >
                  Pokušaj Ponovo
                </button>
                
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white/80 transition-all duration-300 rounded-xl px-4 py-3 font-medium"
                >
                  Zatvori
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileImage; 