import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 pointer-events-none">
        <div className="w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-3xl absolute -top-40 -left-20 animate-pulse"></div>
        <div className="w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl absolute -bottom-40 -right-20"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 max-w-4xl px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium tracking-wide"
        >
          Discover Premium Stories
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-zinc-950 leading-[1.1] mb-8">
          Words that matter, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-800">
            vanishing in 24 hours.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join an exclusive community where ideas live in the moment. Share your deepest thoughts, read premium stories, and watch them fade away naturally.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/signup" 
            className="group relative px-8 py-4 bg-zinc-950 text-white rounded-full font-medium text-lg overflow-hidden w-full sm:w-auto text-center"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10">Start Writing</span>
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 bg-white text-zinc-950 border border-slate-200 rounded-full font-medium text-lg hover:bg-slate-50 transition-colors w-full sm:w-auto text-center"
          >
            Log in to Account
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
      >
        <span className="text-sm font-medium tracking-widest uppercase">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default Landing;
