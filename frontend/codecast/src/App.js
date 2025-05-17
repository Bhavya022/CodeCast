import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoList from './pages/VideoList';
import VideoPlayer from './pages/VideoPlayer';
import VideoUpload from './pages/VideoUpload';
import NavBar from './components/NavBar';
import CreatorDashboard from './pages/CreatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WatchParty from './pages/WatchParty';
import Portfolio from './pages/Portfolio';
import Playlists from './pages/Playlists';
import EditVideo from './pages/EditVideo';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ minHeight: '85vh' }}>
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/edit-video/:id" element={<EditVideo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/watchparty/:partyId/:videoId" element={<WatchParty />} />
          <Route path="/@:username" element={<Portfolio />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-5 border-top">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-2 mb-md-0">
            <span className="fw-bold">🖥️ CodeCast</span> &copy; {new Date().getFullYear()} All rights reserved.
          </div>
          <div>
            <Link to="/" className="text-light text-decoration-none me-3">Home</Link>
            <Link to="/register" className="text-light text-decoration-none me-3">Sign Up</Link>
            <Link to="/upload" className="text-light text-decoration-none me-3">Upload</Link>
            <Link to="/playlists" className="text-light text-decoration-none">Playlists</Link>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App; 