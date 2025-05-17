import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/reactions';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getReactions = async (videoId) => {
  const res = await axios.get(`${API_URL}/${videoId}`);
  return res.data;
};

export const addReaction = async (videoId, type) => {
  const res = await axios.post(`${API_URL}/${videoId}`, { type }, authHeader());
  return res.data;
}; 