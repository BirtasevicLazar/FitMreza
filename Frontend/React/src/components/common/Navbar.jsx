import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ isAuthenticated, userType, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Početna', path: '/' },
    { name: 'Treneri', path: '/trainers' },
    { name: 'O nama', path: '/about' },
    { name: 'Kontakt', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="relative group flex items-center space-x-2"
          >
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white"
            >
              Fit<span className="bg-gradient-to-r from-[#4F46E5] via-[#C0C0C0] to-[#4F46E5] bg-clip-text text-transparent">Mreza</span>
            </motion.span>
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#4F46E5] group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group py-2"
                >
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isActive(link.path) ? 'text-white' : 'text-white/80 hover:text-white'
                  }`}>
                    {link.name}
                  </span>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-[#4F46E5] transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="relative group px-4 py-2"
                  >
                    <span className="text-sm font-medium text-white/80 transition-colors duration-300 group-hover:text-white">
                      Prijava
                    </span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4F46E5] group-hover:w-full transition-all duration-300" />
                  </Link>
                  <Link
                    to="/register"
                    className="relative inline-flex items-center justify-center rounded-full bg-[#4F46E5] px-5 py-2 text-sm font-medium text-white overflow-hidden transition-all duration-300 hover:bg-[#4338CA] group"
                  >
                    <span className="relative z-10">Registracija</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] via-white/10 to-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={userType === 'trainer' ? '/trainer-profile' : '/user-profile'}
                    className="relative group px-4 py-2 flex items-center space-x-2"
                  >
                    <svg 
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isActive('/trainer-profile') || isActive('/user-profile') 
                          ? 'text-white' 
                          : 'text-white/80 group-hover:text-white'
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isActive('/trainer-profile') || isActive('/user-profile') 
                        ? 'text-white' 
                        : 'text-white/80 group-hover:text-white'
                    }`}>
                      Profil
                    </span>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-[#4F46E5] transition-all duration-300 ${
                      isActive('/trainer-profile') || isActive('/user-profile') 
                        ? 'w-full' 
                        : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                  <button
                    onClick={onLogout}
                    className="relative inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-white/80 overflow-hidden transition-all duration-300 hover:text-white hover:border-white/20 group"
                  >
                    <span className="relative z-10">Odjavi se</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 rounded-full hover:bg-white/5 transition-colors duration-300 flex items-center justify-center"
            >
              <div className="relative w-5 h-4">
                <span className={`absolute w-5 h-0.5 bg-white transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 top-2' : 'rotate-0 top-0'
                }`} />
                <span className={`absolute w-5 h-0.5 bg-white transform transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100 top-2'
                }`} />
                <span className={`absolute w-5 h-0.5 bg-white transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 top-2' : 'rotate-0 top-4'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="bg-black/95 backdrop-blur-xl rounded-2xl p-6 m-2 space-y-6 shadow-xl border border-white/10">
                <div className="flex flex-col items-center space-y-4">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full"
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block relative group py-2 text-center ${
                          isActive(link.path) ? 'text-white' : 'text-white/80'
                        }`}
                      >
                        <span className="text-base font-medium">{link.name}</span>
                        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#4F46E5] transition-all duration-300 ${
                          isActive(link.path) ? 'w-12' : 'w-0 group-hover:w-12'
                        }`} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-center text-sm font-medium text-white/80 hover:text-white px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                      >
                        Prijava
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="text-center text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] px-6 py-3 rounded-xl transition-all duration-300"
                      >
                        Registracija
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Link
                        to={userType === 'trainer' ? '/trainer-profile' : '/user-profile'}
                        onClick={() => setIsOpen(false)}
                        className="text-center text-sm font-medium text-white/80 hover:text-white px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-2"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Profil</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onLogout();
                        }}
                        className="w-full text-center text-sm font-medium text-white/80 hover:text-white px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                      >
                        Odjavi se
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar; 