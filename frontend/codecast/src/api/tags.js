// src/api/tags.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/videos/leaderboard/tags';

export const getTrendingTags = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};