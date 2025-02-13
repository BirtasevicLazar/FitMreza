import { useState } from 'react';
import { compressImage } from '../../utils/imageCompression';
import axios from 'axios';

const UpdateProfileImage = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Kompresuj sliku pre slanja
      const compressedImage = await compressImage(file);
      
      const formData = new FormData();
      formData.append('profile_image', compressedImage);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/update-profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Greška prilikom ažuriranja slike');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          disabled={isLoading}
          className="hidden"
          id="profile-image-input"
        />
        <label
          htmlFor="profile-image-input"
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {isLoading ? 'Ažuriranje...' : 'Promeni profilnu sliku'}
        </label>
      </div>
    </div>
  );
};

export default UpdateProfileImage; 