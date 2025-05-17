import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUser } from '../utils/auth';
import VideoForm from '../components/VideoForm';

export default function EditVideo() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
        if (res.data.creatorId !== user.id) {
          setError('You are not authorized to edit this video.');
        } else {
          setVideo(res.data);
        }
      } catch (err) {
        setError('Failed to fetch video.');
      }
      setLoading(false);
    };
    fetchVideo();
    // eslint-disable-next-line
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5000/api/videos/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/creator-dashboard');
    } catch (err) {
      setError('Failed to update video.');
    }
  };

  if (!user || user.role !== 'creator') return <div className="container mt-5">Only creators can edit videos.</div>;
  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h2>Edit Video</h2>
      <VideoForm initialData={video} onSubmit={handleSubmit} submitLabel="Save Changes" mode="edit" />
    </div>
  );
} 