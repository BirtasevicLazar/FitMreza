import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ isAuthenticated, userType, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Početna', path: '/' },
    { name: 'Treneri', path: '/trainers' },
    { name: 'O nama', path: '/about' },
    { name: 'Kontakt', path: '/contact' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">FitMreza</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="btn btn-secondary px-5 py-2"
                  >
                    Prijava
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary px-5 py-2"
                  >
                    Registracija
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={userType === 'trainer' ? '/trainer-dashboard' : '/user-dashboard'}
                    className={`nav-link ${isActive('/trainer-dashboard') || isActive('/user-dashboard') ? 'nav-link-active' : ''}`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={onLogout}
                    className="btn btn-secondary px-5 py-2"
                  >
                    Odjavi se
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-[#E8E8E8] hover:bg-[#E8E8E8]/10 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Otvori glavni meni</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
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
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="glass rounded-xl mt-2 p-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-[#E8E8E8]/10">
                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="btn btn-secondary w-full text-center"
                      >
                        Prijava
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="btn btn-primary w-full text-center"
                      >
                        Registracija
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to={userType === 'trainer' ? '/trainer-dashboard' : '/user-dashboard'}
                        onClick={() => setIsOpen(false)}
                        className="block nav-link text-center"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onLogout();
                        }}
                        className="btn btn-secondary w-full"
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