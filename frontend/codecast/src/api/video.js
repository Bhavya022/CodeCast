import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/videos';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getVideos = async (params) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getVideo = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createVideo = async (data) => {
  const res = await axios.post(API_URL, data, authHeader());
  return res.data;
};

export const updateVideo = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, authHeader());
  return res.data;
};

export const deleteVideo = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, authHeader());
  return res.data;
}; 