import React from 'react';

export default function CreatorBadges({ creator, videos }) {
  if (!creator || !videos) return null;
  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const badges = [];
  if (videos.length >= 5) badges.push({ label: 'Rising Star', desc: '5+ Videos' });
  if (totalViews >= 1000) badges.push({ label: '1K+ Views', desc: '1,000+ Total Views' });
  if (totalLikes >= 100) badges.push({ label: '100+ Likes', desc: '100+ Total Likes' });
  if (badges.length === 0) return null;
  return (
    <div className="mb-3">
      <h6>Creator Badges</h6>
      {badges.map((b, i) => (
        <span key={i} className="badge bg-warning text-dark me-2" title={b.desc}>{b.label}</span>
      ))}
    </div>
  );
} 