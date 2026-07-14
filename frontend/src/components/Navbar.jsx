import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-5xl liquid-glass rounded-full px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold tracking-tighter text-zinc-950">
        Taste<span className="text-emerald-500">Blog</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/create-post" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Write Story
            </Link>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              {user.image ? (
                <img src={`http://localhost:8000${user.image}`} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium">
                  {user.name.charAt(0)}
                </div>
              )}
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-zinc-600 transition-colors">
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="bg-zinc-950 text-white px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
