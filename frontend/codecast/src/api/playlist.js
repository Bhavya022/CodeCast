import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/playlists';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getPlaylists = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

export const createPlaylist = async (name) => {
  const res = await axios.post(API_URL, { name }, authHeader());
  return res.data;
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
  const res = await axios.post(`${API_URL}/${playlistId}/add`, { videoId }, authHeader());
  return res.data;
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const res = await axios.post(`${API_URL}/${playlistId}/remove`, { videoId }, authHeader());
  return res.data;
};

export const deletePlaylist = async (playlistId) => {
  const res = await axios.delete(`${API_URL}/${playlistId}`, authHeader());
  return res.data;
}; 