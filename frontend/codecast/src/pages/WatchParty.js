import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { getUser } from '../utils/auth';

const SOCKET_URL = 'http://localhost:5000/watchparty';

export default function WatchParty() {
  const { partyId, videoId } = useParams();
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef();
  const socketRef = useRef();
  const user = getUser();

  useEffect(() => {
    // Fetch video URL (for demo, just use videoId as a YouTube embed)
    fetch(`http://localhost:5000/api/videos/${videoId}`)
      .then(res => res.json())
      .then(data => setVideoUrl(data.url));
  }, [videoId]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit('join', { partyId, userId: user?.id });
    socket.on('user-joined', ({ userId }) => {
      setParticipants(prev => [...new Set([...prev, userId])]);
    });
    socket.on('chat', ({ userId, message }) => {
      setChat(prev => [...prev, { userId, message }]);
    });
    socket.on('sync', ({ action, time }) => {
      if (!videoRef.current) return;
      if (action === 'play') videoRef.current.play();
      if (action === 'pause') videoRef.current.pause();
      if (action === 'seek') videoRef.current.currentTime = time;
    });
    return () => socket.disconnect();
    // eslint-disable-next-line
  }, [partyId, user?.id]);

  const sendChat = e => {
    e.preventDefault();
    if (!message) return;
    socketRef.current.emit('chat', { partyId, userId: user?.id, message });
    setMessage('');
  };

  const handlePlay = () => socketRef.current.emit('sync', { partyId, action: 'play' });
  const handlePause = () => socketRef.current.emit('sync', { partyId, action: 'pause' });
  const handleSeek = e => socketRef.current.emit('sync', { partyId, action: 'seek', time: e.target.currentTime });

  return (
    <div className="container mt-4">
      <h2>Watch Party</h2>
      <div className="mb-2">Party ID: <b>{partyId}</b></div>
      <div className="mb-2">Participants: {participants.join(', ') || 'Just you'}</div>
      <div className="ratio ratio-16x9 mb-3">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeek}
        />
      </div>
      <div className="row">
        <div className="col-md-8">
          <h5>Chat</h5>
          <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
            {chat.map((c, i) => (
              <div key={i}><b>{c.userId || 'Anon'}:</b> {c.message}</div>
            ))}
          </div>
          <form onSubmit={sendChat} className="d-flex gap-2">
            <input className="form-control" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
} 