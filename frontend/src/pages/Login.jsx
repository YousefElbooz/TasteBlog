import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bento-card"
      >
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-8">Log in to your account to continue.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-zinc-400 transition-colors"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-zinc-400 transition-colors"
              required
            />
          </div>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-4 bg-zinc-950 text-white py-3 rounded-xl font-medium tracking-wide shadow-lg shadow-zinc-950/20"
          >
            Sign in
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
