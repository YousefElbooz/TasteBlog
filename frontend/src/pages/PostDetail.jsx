import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentBody, setCommentBody] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentBody, setEditCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    try {
      await api.post(`/posts/${id}/comments`, { body: commentBody });
      setCommentBody('');
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (confirm('Are you sure you want to delete this story?')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm('Delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        fetchPost();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditComment = async (e, commentId) => {
    e.preventDefault();
    if (!editCommentBody.trim()) return;
    try {
      await api.put(`/comments/${commentId}`, { body: editCommentBody });
      setEditingCommentId(null);
      setEditCommentBody('');
      fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentBody(comment.body);
  };

  if (loading) return <div className="py-20 text-center animate-pulse">Loading story...</div>;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {post.author?.image ? (
              <img src={`http://localhost:8000${post.author.image}`} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold">
                {post.author?.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-bold">{post.author?.name}</p>
              <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          {user && user.id === post.user_id && (
            <div className="flex gap-4 items-center">
              <button onClick={() => navigate(`/edit-post/${post.id}`)} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                Edit Story
              </button>
              <button onClick={handleDeletePost} className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
                Delete Story
              </button>
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">{post.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags?.map((tag) => (
            <span key={tag.id} className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>

        <div className="prose prose-lg max-w-none mb-16 text-gray-800 leading-relaxed whitespace-pre-wrap">
          {post.body}
        </div>

        <hr className="border-slate-200 mb-12" />

        <div className="mb-12">
          <h3 className="text-2xl font-bold tracking-tight mb-8">Comments ({post.comments?.length || 0})</h3>
          
          {user ? (
            <form onSubmit={handleAddComment} className="mb-10 flex gap-4 items-start">
              <div className="flex-1">
                <textarea 
                  placeholder="Share your thoughts..."
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-zinc-400 resize-none shadow-sm"
                  required
                />
                <div className="mt-3 flex justify-end">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-zinc-950 text-white px-6 py-2 rounded-lg text-sm font-medium"
                  >
                    Post Comment
                  </motion.button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-10 p-4 bg-slate-50 rounded-xl text-center text-sm text-gray-500">
              Please log in to leave a comment.
            </div>
          )}

          <div className="flex flex-col gap-6">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                {comment.author?.image ? (
                  <img src={`http://localhost:8000${comment.author.image}`} alt={comment.author.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-sm font-bold text-slate-600">
                    {comment.author?.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-semibold text-sm">{comment.author?.name}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <form onSubmit={(e) => handleEditComment(e, comment.id)} className="mt-2">
                      <textarea 
                        value={editCommentBody}
                        onChange={(e) => setEditCommentBody(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-zinc-400 resize-none shadow-sm text-sm"
                        required
                      />
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md">Save</button>
                        <button type="button" onClick={() => setEditingCommentId(null)} className="text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{comment.body}</p>
                      {user && user.id === comment.user_id && (
                        <div className="flex gap-3 mt-2">
                          <button 
                            onClick={() => startEditingComment(comment)}
                            className="text-xs font-medium text-zinc-500 hover:text-zinc-700"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs font-medium text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PostDetail;
