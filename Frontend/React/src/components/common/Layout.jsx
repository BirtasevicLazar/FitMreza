import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        userType={user?.type}
        onLogout={handleLogout}
      />
      <main className="flex-grow bg-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 