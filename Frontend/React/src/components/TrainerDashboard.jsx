import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrainerDashboard = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="loading-text">Učitavanje...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  if (!trainer) {
    return null;
  }

  const trainerDetails = trainer.trainer_details || {};

  return (
    <div className="dashboard-container">
      <div className="container-custom px-4 py-8">
        <div className="dashboard-card">
          <div className="border-bottom pb-6 mb-6">
            <h2 className="text-3xl font-bold">
              Dobrodošli, {trainer.name}!
            </h2>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">Profil Trenera</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Ime i prezime</label>
                <p className="text-body mt-1">{trainer.name}</p>
              </div>
              <div>
                <label className="form-label">Email</label>
                <p className="text-body mt-1">{trainer.email}</p>
              </div>
              <div>
                <label className="form-label">Broj Telefona</label>
                <p className="text-body mt-1">{trainer.phone_number || 'Nije uneto'}</p>
              </div>
              <div>
                <label className="form-label">Specijalizacije</label>
                <p className="text-body mt-1">{trainerDetails.specializations || 'Nije uneto'}</p>
              </div>
              <div>
                <label className="form-label">Sertifikati</label>
                <p className="text-body mt-1">{trainerDetails.certifications || 'Nije uneto'}</p>
              </div>
              <div>
                <label className="form-label">Bio</label>
                <p className="text-body mt-1">{trainerDetails.bio || 'Nije uneto'}</p>
              </div>
              <div>
                <label className="form-label">Tip Naloga</label>
                <p className="text-body mt-1">Trener</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard; 