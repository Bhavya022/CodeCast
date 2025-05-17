import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPortfolio } from '../api/portfolio';
import CreatorBadges from '../components/CreatorBadges';

export default function Portfolio() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line
  }, [username]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const d = await getPortfolio(username);
      setData(d);
    } catch {
      setData(null);
    }
    setLoading(false);
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!data) return <div className="container mt-5">Portfolio not found or not public.</div>;

  return (
    <div className="container mt-4">
      <h2>@{data.creator.username}'s Portfolio</h2>
      <CreatorBadges creator={data.creator} videos={data.topVideos} />
      <h5 className="mt-3">Featured Stack Journey</h5>
      <div className="mb-3">
        {data.featuredStack.map(tag => <span key={tag} className="badge bg-info me-2">{tag}</span>)}
      </div>
      <h5>Top Videos</h5>
      <ul className="list-group">
        {data.topVideos.map(v => (
          <li key={v.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{v.title}</span>
            <span className="badge bg-primary">{v.views} views</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 