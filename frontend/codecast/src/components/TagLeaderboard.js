import React, { useEffect, useState } from 'react';
import { getTrendingTags } from '../api/tags';

export default function TagLeaderboard({ onTagClick }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    const data = await getTrendingTags();
    setTags(data);
    setLoading(false);
  };

  return (
    <div className="mb-4">
      <h5>Trending Tags</h5>
      {loading ? <div>Loading...</div> : (
        <div>
          {tags.map(t => (
            <span
              key={t.tag}
              className="badge bg-info me-2 mb-2"
              style={{ cursor: 'pointer', fontSize: 16 }}
              onClick={() => onTagClick && onTagClick(t.tag)}
            >
              {t.tag} <span className="small">({t.viewCount})</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
} 