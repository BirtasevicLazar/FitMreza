import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isAuthenticated, userType, onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">FitMreza</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`nav-link ${isActive('/login') ? 'nav-link-active' : ''}`}
                >
                  Prijava
                </Link>
                <Link
                  to="/register"
                  className={`btn btn-primary`}
                >
                  Registracija
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to={userType === 'trainer' ? '/trainer-dashboard' : '/user-dashboard'}
                  className={`nav-link ${isActive('/trainer-dashboard') || isActive('/user-dashboard') ? 'nav-link-active' : ''}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="btn btn-secondary"
                >
                  Odjavi se
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="nav-link block"
                >
                  Prijava
                </Link>
                <Link
                  to="/register"
                  className="nav-link block"
                >
                  Registracija
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={userType === 'trainer' ? '/trainer-dashboard' : '/user-dashboard'}
                  className="nav-link block"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="nav-link block w-full text-left"
                >
                  Odjavi se
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 