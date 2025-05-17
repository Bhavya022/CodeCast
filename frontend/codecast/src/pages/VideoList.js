import React, { useEffect, useState, useRef } from 'react';
import { getVideos } from '../api/video';
import { Link } from 'react-router-dom';
import TagLeaderboard from '../components/TagLeaderboard';

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('uploadDate');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    // Debounce search
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line
  }, [debouncedSearch, tag, category, difficulty, page, sort]);

  const fetchVideos = async () => {
    setLoading(true);
    const params = { search: debouncedSearch, tag, category, difficulty, page, limit: 10, sort };
    const data = await getVideos(params);
    setVideos(data);
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      {/* Hero/Landing Section */}
      <section className="py-5 mb-4 text-center bg-white rounded shadow-sm">
        <h1 className="display-4 fw-bold mb-3">🖥️ CodeCast</h1>
        <p className="lead mb-4">The developer-centric video platform for sharing, learning, and collaborating with code. <br />
          <span className="text-primary fw-semibold">Watch. Code. Grow.</span>
        </p>
        <Link to="/register" className="btn btn-primary btn-lg px-4 me-2">Get Started</Link>
        <Link to="/upload" className="btn btn-outline-primary btn-lg px-4">Upload Video</Link>
      </section>

      {/* Services/Features Section */}
      <section className="mb-5">
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <i className="bi bi-code-slash display-5 text-primary mb-3"></i>
              <h5 className="fw-bold mb-2">Code Snippet Overlays</h5>
              <p className="text-muted mb-0">Watch videos with live code overlays and learn by example.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <i className="bi bi-people-fill display-5 text-success mb-3"></i>
              <h5 className="fw-bold mb-2">Real-Time Watch Parties</h5>
              <p className="text-muted mb-0">Sync up and chat with friends or the community while watching code videos together.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <i className="bi bi-bar-chart-line-fill display-5 text-info mb-3"></i>
              <h5 className="fw-bold mb-2">Skill Tag Leaderboards</h5>
              <p className="text-muted mb-0">Track trending skills, top tags, and your progress in the coding community.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <i className="bi bi-person-badge-fill display-5 text-warning mb-3"></i>
              <h5 className="fw-bold mb-2">Creator Portfolios</h5>
              <p className="text-muted mb-0">Showcase your coding journey, achievements, and badges to the world.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <i className="bi bi-patch-question-fill display-5 text-danger mb-3"></i>
              <h5 className="fw-bold mb-2">Interactive Quizzes</h5>
              <p className="text-muted mb-0">Test your knowledge after each video and reinforce your learning.</p>
            </div>
          </div>
        </div>
      </section>

      <TagLeaderboard onTagClick={setTag} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0">Explore Videos</h2>
        <span className="text-muted">{videos.length} results</span>
      </div>
      <div className="row g-2 mb-4 align-items-end">
        <div className="col-md-3">
          <input placeholder="Search by title..." className="form-control" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input placeholder="Tag" className="form-control" value={tag} onChange={e => setTag(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input placeholder="Category" className="form-control" value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input placeholder="Difficulty" className="form-control" value={difficulty} onChange={e => setDifficulty(e.target.value)} />
        </div>
        <div className="col-md-1">
          <select className="form-select" value={sort} onChange={e => setSort(e.target.value)} title="Sort by">
            <option value="uploadDate">Newest</option>
            <option value="views">Views</option>
            <option value="likes">Likes</option>
          </select>
        </div>
      </div>
      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div> : (
        <div className="row">
          {videos.length === 0 && <div className="text-center text-muted py-5">No videos found.</div>}
          {videos.map(video => (
            <div className="col-md-4 mb-4" key={video.id}>
              <div className="card h-100 shadow-sm border-0 video-card-hover">
                {/* Placeholder for video thumbnail */}
                <div className="bg-light d-flex align-items-center justify-content-center" style={{height:180, borderRadius:'0.5rem 0.5rem 0 0'}}>
                  <span className="display-6 text-secondary">🎬</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{video.title}</h5>
                  <p className="card-text text-truncate" title={video.description}>{video.description.slice(0, 80)}...</p>
                  <div className="mb-2">
                    <span className="badge bg-primary me-1">{video.difficulty}</span>
                    <span className="badge bg-secondary me-1">{video.category}</span>
                    {video.tags && video.tags.map(tag => <span key={tag} className="badge bg-info text-dark me-1">{tag}</span>)}
                  </div>
                  <Link to={`/video/${video.id}`} className="btn btn-primary btn-sm w-100">Watch</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button className="btn btn-outline-secondary px-4" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span className="fw-semibold">Page {page}</span>
        <button className="btn btn-outline-secondary px-4" onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {/* Card hover effect style */}
      <style>{`
        .video-card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 6px 24px rgba(0,0,0,0.10);
          transition: all 0.2s;
        }
      `}</style>
    </div>
  );
} 