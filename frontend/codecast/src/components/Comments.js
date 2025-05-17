import React, { useEffect, useState } from 'react';
import { getComments, addComment } from '../api/comment';
import { getUser } from '../utils/auth';

export default function Comments({ videoId, showAvatars }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [videoId]);

  const fetchComments = async () => {
    setLoading(true);
    const data = await getComments(videoId);
    setComments(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addComment(videoId, content);
      setContent('');
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  // Helper for avatar initials
  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-3">
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Add a comment..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit" disabled={!user || !content}>Comment</button>
        </div>
        {error && <div className="text-danger mt-1">{error}</div>}
      </form>
      {loading ? <div>Loading...</div> : (
        <ul className="list-group list-group-flush">
          {comments.length === 0 && <li className="list-group-item text-muted">No comments yet.</li>}
          {comments.map(c => (
            <li key={c.id} className="list-group-item d-flex align-items-start gap-3 py-3">
              {showAvatars && (
                <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{width:36, height:36, fontWeight:600, fontSize:'1.1rem'}}>
                  {getInitials(c.username || 'U')}
                </div>
              )}
              <div className="flex-grow-1">
                <div className="fw-semibold">{c.username || 'User'}</div>
                <div>{c.content}</div>
                <div className="text-muted small mt-1">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 