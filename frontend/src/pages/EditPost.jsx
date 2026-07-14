import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      const post = res.data;
      if (post.user_id !== user.id) {
        navigate('/'); // Redirect if not author
        return;
      }
      setTitle(post.title);
      setBody(post.body);
      setTags(post.tags.map(t => t.name));
      setLoading(false);
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tags.length === 0) {
      setError('You must add at least one tag');
      return;
    }

    try {
      await api.put(`/posts/${id}`, { title, body, tags });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError('Failed to update post. Please check inputs.');
    }
  };

  if (loading) return <div className="py-20 text-center animate-pulse">Loading story...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold tracking-tighter mb-2">Edit Story</h1>
        <p className="text-gray-500 mb-10">Make changes to your vanishing thought.</p>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl md:text-4xl font-bold tracking-tight bg-transparent border-none outline-none placeholder:text-gray-300"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <textarea 
              placeholder="Tell your story..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="text-lg text-gray-700 bg-transparent border-none outline-none placeholder:text-gray-300 resize-none leading-relaxed"
              required
            />
          </div>

          <div className="border-t border-slate-200 pt-8 mt-4">
            <label className="text-sm font-medium block mb-4">Tags</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-emerald-900">&times;</button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-zinc-400 text-sm flex-1 max-w-xs"
              />
              <button 
                type="button" 
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Press enter or click Add. At least one tag is required.</p>
          </div>

          <div className="flex justify-end pt-4">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-zinc-950 text-white px-8 py-3 rounded-xl font-medium tracking-wide shadow-lg shadow-zinc-950/20"
            >
              Update Story
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditPost;
