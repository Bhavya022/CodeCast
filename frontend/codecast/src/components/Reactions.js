import React, { useEffect, useState } from 'react';
import { getReactions, addReaction } from '../api/reaction';
import { getUser } from '../utils/auth';

const EMOJIS = [
  { type: 'like', label: '👍', tooltip: 'Like' },
  { type: 'dislike', label: '👎', tooltip: 'Dislike' },
  { type: 'emoji', label: '🔥', tooltip: 'Fire' },
];

export default function Reactions({ videoId, onReact }) {
  const [reactions, setReactions] = useState([]);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchReactions();
    // eslint-disable-next-line
  }, [videoId]);

  const fetchReactions = async () => {
    const data = await getReactions(videoId);
    setReactions(data);
  };

  const handleReact = async (type) => {
    setError('');
    try {
      await addReaction(videoId, type);
      fetchReactions();
      if (onReact) onReact();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to react');
    }
  };

  const count = (type) => reactions.filter(r => r.type === type).length;
  const userReaction = user && reactions.find(r => r.userId === user.id);

  return (
    <div className="mb-3">
      <div className="d-flex align-items-center gap-2">
        {EMOJIS.map(e => (
          <button
            key={e.type}
            className={`btn btn-sm px-3 d-flex align-items-center gap-1 shadow-none ${userReaction?.type === e.type ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => handleReact(e.type)}
            disabled={!user}
            title={e.tooltip}
            aria-label={e.tooltip}
            style={{ fontSize: '1.15rem', fontWeight: 500 }}
          >
            {e.label} <span className="ms-1">{count(e.type)}</span>
          </button>
        ))}
        {error && <span className="text-danger ms-2 small">{error}</span>}
      </div>
    </div>
  );
} 