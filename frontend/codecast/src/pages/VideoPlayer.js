import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVideo } from '../api/video';
import Comments from '../components/Comments';
import Reactions from '../components/Reactions';
import Quiz from '../components/Quiz';
// For syntax highlighting
import 'prismjs/themes/prism-tomorrow.css';
import Prism from 'prismjs';

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [activeSnippet, setActiveSnippet] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState(null);
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    getVideo(id).then(setVideo);
  }, [id]);

  // Highlight code when snippets change
  useEffect(() => {
    Prism.highlightAll();
  }, [video, activeSnippet]);

  // Handle code snippet overlay
  useEffect(() => {
    if (!video || !video.codeSnippets) return;
    const snippet = video.codeSnippets.find(s => Math.abs(s.timestamp - currentTime) < 5);
    setActiveSnippet(snippet || null);
  }, [currentTime, video]);

  // Video time update handler
  const onTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  // Seek to snippet
  const seekTo = (timestamp) => {
    if (player) player.currentTime = timestamp;
  };

  const startWatchParty = async () => {
    // Create party via API
    const res = await fetch('http://localhost:5000/api/watchparty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ videoId: video.id }),
    });
    const party = await res.json();
    navigate(`/watchparty/${party.id}/${video.id}`);
  };

  const fetchAiSummary = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch(`http://localhost:5000/api/videos/${id}/ai-summary`);
      const data = await res.json();
      if (data.summary) setAiSummary(data.summary);
      else setAiError(data.message || 'No summary available');
    } catch (err) {
      setAiError('Failed to fetch summary');
    }
    setAiLoading(false);
  };

  if (!video) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <Link to="/" className="btn btn-link text-decoration-none px-0">
          <i className="bi bi-arrow-left me-2"></i>Back to Videos
        </Link>
      </div>
      <div className="row">
        {/* Main Video Section */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-lg border-0 p-4">
            <h2 className="fw-bold mb-2">{video.title}</h2>
            <div className="mb-2">
              <span className="badge bg-primary me-2">{video.difficulty}</span>
              <span className="badge bg-secondary me-2">{video.category}</span>
              {video.tags && video.tags.map(tag => (
                <span key={tag} className="badge bg-info text-dark me-1">{tag}</span>
              ))}
            </div>
            <div className="ratio ratio-16x9 rounded shadow mb-3 overflow-hidden">
              {video.url.includes('youtube.com') || video.url.includes('youtu.be') ? (
                // Render YouTube embed
                <iframe
                  src={
                    video.url.includes('youtube.com')
                      ? video.url.replace('watch?v=', 'embed/')
                      : `https://www.youtube.com/embed/${video.url.split('/').pop()}`
                  }
                  title={video.title}
                  allowFullScreen
                  style={{ border: 0 }}
                />
              ) : (
                // Render direct video file
                <video
                  src={video.url}
                  title={video.title}
                  className="w-100 h-100"
                  controls
                  onTimeUpdate={onTimeUpdate}
                  ref={el => setPlayer(el)}
                  style={{ background: '#000' }}
                />
              )}
            </div>
            <p className="text-muted">{video.description}</p>
            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-success btn-lg px-4 fw-semibold shadow-sm" onClick={startWatchParty}>
                <i className="bi bi-people-fill me-2"></i>Start Watch Party
              </button>
            </div>
            <div className="mb-3">
              <button className="btn btn-outline-info" onClick={fetchAiSummary} disabled={aiLoading}>
                {aiLoading ? 'Generating AI Summary...' : 'Show AI Summary'}
              </button>
            </div>
            {aiSummary && (
              <div className="alert alert-info"><b>AI Summary:</b> {aiSummary}</div>
            )}
            {aiError && (
              <div className="alert alert-danger">{aiError}</div>
            )}
            <hr />
            <Reactions videoId={video.id} />
            <div className="mt-4">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="mb-3"><i className="bi bi-chat-dots me-2"></i>Comments</h5>
                  <Comments videoId={video.id} showAvatars={true} />
                </div>
              </div>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3"><i className="bi bi-question-circle me-2"></i>Quiz</h5>
                  <Quiz videoId={video.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar for Code Snippets */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3 sticky-top" style={{ top: 80, minHeight: 400 }}>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-code-slash fs-4 text-primary me-2"></i>
              <h5 className="mb-0">Code Snippets</h5>
            </div>
            <ul className="list-group list-group-flush">
              {(!video.codeSnippets || video.codeSnippets.length === 0) && (
                <li className="list-group-item">No snippets</li>
              )}
              {video.codeSnippets && video.codeSnippets.map((s, i) => (
                <li
                  key={i}
                  className={`list-group-item code-snippet-item${activeSnippet === s ? ' active' : ''}`}
                  style={{ cursor: 'pointer', background: activeSnippet === s ? '#e3f2fd' : undefined }}
                  onClick={() => seekTo(s.timestamp)}
                >
                  <b>{new Date(s.timestamp * 1000).toISOString().substr(11, 8)}</b>
                  <span className="ms-2">[{s.language}]</span>
                  <pre className="mb-0 mt-1 rounded bg-dark text-white p-2" style={{ fontSize: 12, overflowX: 'auto' }}>
                    <code className={`language-${s.language}`}>{s.code}</code>
                  </pre>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Custom styles for code snippet hover/focus */}
      <style>{`
        .code-snippet-item:hover {
          background: #f1f8ff !important;
          transition: background 0.2s;
        }
        .code-snippet-item.active {
          border-left: 4px solid #0d6efd;
          background: #e3f2fd !important;
        }
      `}</style>
    </div>
  );
} 