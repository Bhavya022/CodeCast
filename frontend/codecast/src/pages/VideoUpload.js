import React from 'react';
import { createVideo } from '../api/video';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import VideoForm from '../components/VideoForm';

export default function VideoUpload() {
  const navigate = useNavigate();
  const user = getUser();

  if (!user || user.role !== 'creator') return <div className="container mt-5">Only creators can upload videos.</div>;

  const handleSubmit = async (data) => {
    await createVideo(data);
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h2>Upload Video</h2>
      <VideoForm onSubmit={handleSubmit} submitLabel="Upload" mode="upload" />
    </div>
  );
} 