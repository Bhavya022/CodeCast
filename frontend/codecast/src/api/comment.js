import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/comments';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getComments = async (videoId) => {
  const res = await axios.get(`${API_URL}/${videoId}`);
  return res.data;
};

export const addComment = async (videoId, content) => {
  const res = await axios.post(`${API_URL}/${videoId}`, { content }, authHeader());
  return res.data;
}; 