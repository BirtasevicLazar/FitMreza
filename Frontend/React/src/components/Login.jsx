import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('/login', formData);
      
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate(response.data.user.type === 'trainer' ? '/trainer-dashboard' : '/user-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Došlo je do greške prilikom prijave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-[#000000] px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Dobrodošli nazad</h2>
          <p className="text-[#E8E8E8]/70">
            Nemate nalog?{' '}
            <Link to="/register" className="text-[#E8E8E8] hover:text-white">
              Registrujte se
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="form-container"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-text bg-red-500/10 border border-red-500 p-3 rounded mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                Email adresa
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="vasa@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Lozinka
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#E8E8E8] bg-[#000000] text-[#E8E8E8] focus:ring-[#E8E8E8]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#E8E8E8]/70">
                  Zapamti me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="text-[#E8E8E8]/70 hover:text-[#E8E8E8]">
                  Zaboravili ste lozinku?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Učitavanje...
                </span>
              ) : (
                'Prijavi se'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login; 