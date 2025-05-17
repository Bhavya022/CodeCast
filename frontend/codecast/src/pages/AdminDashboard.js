import React, { useEffect, useState } from 'react';
import { getAdminAnalytics } from '../api/analytics';
import { getUser } from '../utils/auth';
import axios from 'axios';

export default function AdminDashboard() {
  const user = getUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAnalytics();
      fetchUsers();
      fetchVideos();
      fetchComments();
    }
    // eslint-disable-next-line
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const d = await getAdminAnalytics();
    setData(d);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/videos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVideos(res.data);
    } catch (err) {
      setError('Failed to fetch videos.');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/comments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComments(res.data);
    } catch (err) {
      // Comments endpoint may not exist for all, so ignore for now
    }
  };

  const handleUserStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status.');
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchVideos();
    } catch (err) {
      setError('Failed to delete video.');
    }
  };

  const handleModerateComment = async (id, isSpam) => {
    try {
      await axios.put(`http://localhost:5000/api/comments/moderate/${id}`, { isSpam }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchComments();
    } catch (err) {
      setError('Failed to moderate comment.');
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchComments();
    } catch (err) {
      setError('Failed to delete comment.');
    }
  };

  if (!user || user.role !== 'admin') return <div className="container mt-5">Only admins can view this dashboard.</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-shield-lock-fill display-5 text-danger me-3"></i>
        <h2 className="fw-bold mb-0">Admin Dashboard</h2>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading || !data ? <div>Loading...</div> : (
        <>
          {/* Analytics Cards */}
          <div className="row mb-4 g-3">
            <div className="col-12 col-md-4">
              <div className="card p-4 border-0 shadow-sm text-center h-100">
                <i className="bi bi-camera-reels-fill text-primary fs-2 mb-2"></i>
                <h6 className="fw-bold">Most Viewed Video</h6>
                <div className="fw-semibold">{data.topVideo ? data.topVideo.title : 'N/A'}</div>
                <div className="small text-muted">Views: {data.topVideo?.views || 0}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card p-4 border-0 shadow-sm text-center h-100">
                <i className="bi bi-tags-fill text-info fs-2 mb-2"></i>
                <h6 className="fw-bold">Most Used Tags</h6>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {data.tags.map(t => (
                    <span key={t.tag} className="badge bg-info text-dark px-3 py-2">
                      <i className="bi bi-tag me-1"></i>{t.tag} <span className="ms-1">({t.viewCount})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card p-4 border-0 shadow-sm text-center h-100">
                <i className="bi bi-person-badge-fill text-success fs-2 mb-2"></i>
                <h6 className="fw-bold">Top Creators</h6>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {data.creators.map(c => (
                    <span key={c.id} className="badge bg-secondary px-3 py-2">
                      <i className="bi bi-person-circle me-1"></i>{c.username}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <h4 className="mt-5 mb-3">All Users</h4>
          <div className="table-responsive mb-4">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.status}</td>
                    <td>
                      {u.status !== 'banned' && <button className="btn btn-sm btn-danger me-2" onClick={() => handleUserStatus(u.id, 'banned')}>Ban</button>}
                      {u.status !== 'suspended' && <button className="btn btn-sm btn-warning me-2" onClick={() => handleUserStatus(u.id, 'suspended')}>Suspend</button>}
                      {u.status !== 'active' && <button className="btn btn-sm btn-success" onClick={() => handleUserStatus(u.id, 'active')}>Unban</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Videos Table */}
          <h4 className="mt-5 mb-3">All Videos</h4>
          <div className="table-responsive mb-4">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Creator</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(v => (
                  <tr key={v.id}>
                    <td>{v.title}</td>
                    <td>{v.creatorId}</td>
                    <td>{v.views}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteVideo(v.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comments Moderation Table (if comments endpoint available) */}
          {comments.length > 0 && <>
            <h4 className="mt-5 mb-3">Moderate Comments</h4>
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Content</th>
                    <th>Video ID</th>
                    <th>Spam?</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(c => (
                    <tr key={c.id}>
                      <td>{c.content}</td>
                      <td>{c.videoId}</td>
                      <td>{c.isSpam ? 'Yes' : 'No'}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleModerateComment(c.id, !c.isSpam)}>{c.isSpam ? 'Unmark Spam' : 'Mark Spam'}</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteComment(c.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>}
        </>
      )}
    </div>
  );
} 