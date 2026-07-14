import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (image) {
      data.append('image', image);
    }

    try {
      await signup(data);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Check inputs.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bento-card"
      >
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Create an account</h1>
        <p className="text-sm text-gray-500 mb-8">Join the premium community.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-zinc-400 transition-colors"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Email address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-zinc-400 transition-colors"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-zinc-400 transition-colors"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Profile Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-zinc-700 hover:file:bg-slate-200 cursor-pointer"
            />
          </div>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-4 bg-zinc-950 text-white py-3 rounded-xl font-medium tracking-wide shadow-lg shadow-zinc-950/20"
          >
            Create Account
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
