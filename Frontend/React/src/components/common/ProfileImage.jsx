import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ProfileImage = ({ user, onImageUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Slika ne sme biti veća od 2MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Dozvoljeni formati su: JPG, JPEG, PNG');
      return;
    }

    setIsUploading(true);
    setError('');

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
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
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
          className="relative group"
        >
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#4F46E5]/20"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#4F46E5]/10 to-[#4338CA]/10 border-4 border-[#4F46E5]/20 flex items-center justify-center">
              <span className="text-3xl text-white/60">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="space-x-2">
              <label className="cursor-pointer bg-white/20 hover:bg-white/30 transition-colors rounded-full p-2">
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </label>
              {user.profile_image_url && (
                <button
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="bg-red-500/20 hover:bg-red-500/30 transition-colors rounded-full p-2"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

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

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm text-center mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default ProfileImage; 