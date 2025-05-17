import React, { useEffect, useState } from 'react';
import { getPlaylists, createPlaylist, deletePlaylist } from '../api/playlist';
import { getUser } from '../utils/auth';
import { getVideo } from '../api/video';

export default function Playlists() {
  const user = getUser();
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [watchLaterVideos, setWatchLaterVideos] = useState([]);

  useEffect(() => {
    fetchPlaylists();
    // eslint-disable-next-line
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const data = await getPlaylists();
      setPlaylists(data);
      // Watch Later special handling
      const wl = data.find(p => p.name === 'Watch Later');
      if (wl && wl.videos.length > 0) {
        // Fetch video details for each video, filter out 404s
        Promise.all(
          wl.videos.map(id => getVideo(id).catch(() => null))
        ).then(videos => setWatchLaterVideos(videos.filter(Boolean)));
      } else {
        setWatchLaterVideos([]);
      }
    } catch {
      setPlaylists([]);
      setWatchLaterVideos([]);
    }
    setLoading(false);
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    try {
      await createPlaylist(name);
      setName('');
      fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create playlist');
    }
  };

  const handleDelete = async id => {
    await deletePlaylist(id);
    fetchPlaylists();
  };

  if (!user) return <div className="container mt-5">Login to manage playlists.</div>;

  // Watch Later playlist
  const watchLater = playlists.find(p => p.name === 'Watch Later');

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2>My Playlists</h2>
      <form onSubmit={handleCreate} className="mb-3 d-flex gap-2">
        <input className="form-control" placeholder="Playlist name" value={name} onChange={e => setName(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Create</button>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <>
          {watchLater && (
            <div className="mb-4">
              <h5><i className="bi bi-clock-history me-2"></i>Watch Later <span className="badge bg-secondary ms-2">{watchLater.videos.length} videos</span></h5>
              {watchLaterVideos.length === 0 ? <div className="text-muted">No videos in Watch Later.</div> : (
                <ul className="list-group mb-2">
                  {watchLaterVideos.map(v => (
                    <li key={v.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{v.title}</span>
                      <a href={`/video/${v.id}`} className="btn btn-outline-primary btn-sm">Watch</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <ul className="list-group">
            {playlists.filter(p => p.name !== 'Watch Later').length === 0 && <li className="list-group-item">No playlists yet.</li>}
            {playlists.filter(p => p.name !== 'Watch Later').map(p => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{p.name} <span className="badge bg-secondary ms-2">{p.videos.length} videos</span></span>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
} 