import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const CoverImage = ({ user, onImageUpdate }) => {
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
    formData.append('cover_image', file);

    try {
      const response = await axios.post('/update-cover-image', formData, {
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
      const response = await axios.delete('/remove-cover-image', {
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
    <div className="absolute inset-0 w-full h-full">
      {user.cover_image_url ? (
        <div className="relative w-full h-full">
          <img
            src={user.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* Gornji gradijent za navbar */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/90 via-black/50 to-transparent" />
          {/* Osnovni overlay za kontrast */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#4F46E5]/20 via-[#4338CA]/20 to-[#4F46E5]/20 backdrop-blur-xl">
          {/* Gornji gradijent za navbar na default pozadini */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/90 via-black/50 to-transparent" />
        </div>
      )}

      {/* Overlay sa kontrolama */}
      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300 rounded-xl px-4 py-2.5 inline-flex items-center transform hover:scale-105">
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
            <span className="ml-2 text-white text-sm font-medium">Promeni Cover</span>
          </label>
          {user.cover_image_url && (
            <button
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="bg-red-500/20 hover:bg-red-500/30 transition-all duration-300 rounded-xl px-4 py-2.5 inline-flex items-center transform hover:scale-105"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="ml-2 text-white text-sm font-medium">Ukloni Cover</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default CoverImage; 