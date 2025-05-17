import React, { useEffect, useState } from 'react';
import { getVideos } from '../api/video';
import { getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Reactions from '../components/Reactions';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function CreatorDashboard() {
  const user = getUser();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [commentCounts, setCommentCounts] = useState({});
  const [monthlyTopVideos, setMonthlyTopVideos] = useState([]);

  const handleRefresh = () => setRefresh(r => !r);

  useEffect(() => {
    if (user && user.role === 'creator') {
      fetchVideos();
    }
    // eslint-disable-next-line
  }, [refresh]);

  const fetchVideos = async () => {
    setLoading(true);
    const data = await getVideos({});
    setVideos(data.filter(v => v.creatorId === user.id));
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVideos(videos.filter(v => v.id !== id));
    } catch (err) {
      setError('Failed to delete video.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-video/${id}`);
  };

  // Fetch comment counts for all videos
  const fetchCommentCounts = async (videos) => {
    const counts = {};
    await Promise.all(videos.map(async v => {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/${v.id}`);
        counts[v.id] = res.data.length;
      } catch {
        counts[v.id] = 0;
      }
    }));
    setCommentCounts(counts);
  };

  // Compute top videos by month
  const computeMonthlyTopVideos = (videos) => {
    const byMonth = {};
    videos.forEach(v => {
      const month = new Date(v.uploadDate).toLocaleString('default', { year: 'numeric', month: 'short' });
      if (!byMonth[month] || v.views > byMonth[month].views) {
        byMonth[month] = v;
      }
    });
    setMonthlyTopVideos(Object.entries(byMonth).map(([month, v]) => ({ month, ...v })));
  };

  // Fetch comment counts and compute monthly top videos after videos are loaded
  useEffect(() => {
    if (videos.length > 0) {
      fetchCommentCounts(videos);
      computeMonthlyTopVideos(videos);
    }
    // eslint-disable-next-line
  }, [videos]);

  if (!user || user.role !== 'creator') return <div className="container mt-5">Only creators can view this dashboard.</div>;

  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const totalDislikes = videos.reduce((sum, v) => sum + (v.dislikes || 0), 0);
  const topVideo = videos.reduce((top, v) => (v.views > (top?.views || 0) ? v : top), null);

  const avgWatchDuration = (videoId) => {
    // Mock: random between 40% and 90% of video duration
    const video = videos.find(v => v.id === videoId);
    if (!video) return '-';
    const percent = 0.4 + Math.random() * 0.5;
    const seconds = Math.floor(video.duration * percent);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  };

  // Like:Dislike chart data
  const likeDislikeData = {
    labels: videos.map(v => v.title),
    datasets: [
      {
        label: 'Likes',
        data: videos.map(v => v.likes || 0),
        backgroundColor: 'rgba(40,167,69,0.7)'
      },
      {
        label: 'Dislikes',
        data: videos.map(v => v.dislikes || 0),
        backgroundColor: 'rgba(220,53,69,0.7)'
      }
    ]
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-bar-chart-line-fill display-5 text-primary me-3"></i>
        <h2 className="fw-bold mb-0">Creator Dashboard</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <>
          <div className="row mb-4 g-3">
            <div className="col-12 col-md-4">
              <div className="card p-4 border-0 shadow-sm text-center h-100">
                <i className="bi bi-eye-fill text-info fs-2 mb-2"></i>
                <h6 className="fw-bold">Total Views</h6>
                <div className="display-6 fw-bold">{totalViews}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card p-4 border-0 shadow-sm text-center h-100">
                <i className="bi bi-hand-thumbs-up-fill text-success fs-2 mb-2"></i>
                <h6 className="fw-bold">Like:Dislike Ratio</h6>
                <div className="display-6 fw-bold">{totalLikes}:{totalDislikes}</div>
                <div style={{height:180}}>
                  <Bar data={likeDislikeData} options={{ plugins: { legend: { display: true } }, responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card p-4 border-0 shadow-sm text-center h-100">
                <i className="bi bi-star-fill text-warning fs-2 mb-2"></i>
                <h6 className="fw-bold">Top Video</h6>
                <div className="fw-semibold">{topVideo ? topVideo.title : 'N/A'}</div>
                <div className="small text-muted">Views: {topVideo?.views || 0}</div>
              </div>
            </div>
          </div>
          {/* Top-performing videos by month */}
          <div className="card p-4 border-0 shadow-sm mb-4">
            <h6 className="fw-bold mb-3">Top Videos by Month</h6>
            <ul className="list-group">
              {monthlyTopVideos.length === 0 && <li className="list-group-item">No data</li>}
              {monthlyTopVideos.map(v => (
                <li key={v.month} className="list-group-item d-flex justify-content-between align-items-center">
                  <span><b>{v.month}:</b> {v.title}</span>
                  <span className="badge bg-primary">{v.views} views</span>
                </li>
              ))}
            </ul>
          </div>
          <h5 className="fw-bold mb-3 mt-4"><i className="bi bi-collection-play-fill me-2 text-primary"></i>Your Videos</h5>
          <ul className="list-group list-group-flush">
            {videos.length === 0 && <li className="list-group-item text-muted">No videos uploaded yet.</li>}
            {videos.map(v => (
              <li key={v.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                <span className="fw-semibold">{v.title}</span>
                <span>
                  <span className="badge bg-primary me-2"><i className="bi bi-eye me-1"></i>{v.views} views</span>
                  <span className="badge bg-success me-2"><i className="bi bi-hand-thumbs-up"></i> {v.likes || 0}</span>
                  <span className="badge bg-danger me-2"><i className="bi bi-hand-thumbs-down"></i> {v.dislikes || 0}</span>
                  <span className="badge bg-info me-2"><i className="bi bi-chat"></i> {commentCounts[v.id] ?? '-'}</span>
                  <span className="badge bg-warning text-dark me-2"><i className="bi bi-clock-history"></i> {avgWatchDuration(v.id)}</span>
                  <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleEdit(v.id)} title="Edit"><i className="bi bi-pencil-square"></i></button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(v.id)} title="Delete"><i className="bi bi-trash"></i></button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
} 