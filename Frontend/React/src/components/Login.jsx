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
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-start md:items-center justify-center px-4 md:px-8 pt-24 md:pt-0">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Dobrodošli nazad
            </h2>
            <p className="text-white/60">
              Nemate nalog?{' '}
              <Link 
                to="/register" 
                className="text-[#4F46E5] hover:text-[#4338CA] transition-colors font-medium"
              >
                Registrujte se
              </Link>
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 md:p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
              >
                <p className="text-red-500 text-sm text-center font-medium">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-white/80"
                >
                  Email adresa
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  placeholder="vasa@email.com"
                />
              </div>

              <div className="space-y-1">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-white/80"
                >
                  Lozinka
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/10 bg-white/[0.03] text-[#4F46E5] focus:ring-[#4F46E5] focus:ring-offset-0"
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="ml-2 block text-sm text-white/60"
                  >
                    Zapamti me
                  </label>
                </div>

                <Link 
                  to="/forgot-password" 
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Zaboravili ste lozinku?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="relative w-full mt-6 bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white font-medium py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="relative z-10">
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                    />
                  ) : (
                    'Prijavi se'
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#4338CA] to-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.button>
            </form>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-white/40"
          >
            <Link to="/terms" className="hover:text-white/60 transition-colors">
              Uslovi korišćenja
            </Link>
            <span className="mx-2">•</span>
            <Link to="/privacy" className="hover:text-white/60 transition-colors">
              Politika privatnosti
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login; 