import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-white">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container-custom px-4 py-8">
        <div className="dashboard-card">
          <div className="border-b border-[#E8E8E8]/10 pb-6 mb-6">
            <h2 className="text-3xl font-bold">
              Dobrodošli, {user?.name || 'Korisniče'}!
            </h2>
          </div>

          <div className="dashboard-section">
            <h3 className="text-xl font-semibold mb-4">Lične Informacije</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E8E8E8]/70">Ime i prezime</label>
                <p className="mt-1">{user?.name || 'Nije uneto'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E8E8E8]/70">Email</label>
                <p className="mt-1">{user?.email || 'Nije uneto'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E8E8E8]/70">Broj Telefona</label>
                <p className="mt-1">{user?.phone_number || 'Nije uneto'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#E8E8E8]/70">Tip Naloga</label>
                <p className="mt-1">Korisnik</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 