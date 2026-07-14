import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getExpirationText = (createdAt) => {
    const expiresAt = new Date(new Date(createdAt).getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffHours = Math.max(0, Math.floor((expiresAt - now) / (1000 * 60 * 60)));
    const diffMins = Math.max(0, Math.floor((expiresAt - now) / (1000 * 60)) % 60);
    return diffHours > 0 ? `${diffHours}h remaining` : `${diffMins}m remaining`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-64 bento-card animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">Latest Stories</h1>
          <p className="text-gray-500 max-w-xl">
            A premium collection of thoughts that vanish in 24 hours. Catch them while they exist.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-gray-400 mb-4 text-6xl">✧</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No stories active</h3>
          <p className="text-gray-500">Be the first to share something right now.</p>
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bento-card relative flex flex-col justify-between group hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <Link to={`/posts/${post.id}`} className="absolute inset-0 z-10" />
              
              <div className="relative z-20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {post.author?.image ? (
                      <img src={`http://localhost:8000${post.author.image}`} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium">
                        {post.author?.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium leading-none">{post.author?.name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                    {getExpirationText(post.created_at)}
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {post.body}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 relative z-20">
                {post.tags?.map((tag) => (
                  <span key={tag.id} className="text-xs font-medium text-zinc-500 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Feed;
