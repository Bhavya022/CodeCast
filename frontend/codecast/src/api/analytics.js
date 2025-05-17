import axios from 'axios';
import { getToken } from '../utils/auth';

const ADMIN_URL = 'http://localhost:5000/api/admin/analytics';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const getAdminAnalytics = async () => {
  const res = await axios.get(ADMIN_URL, authHeader());
  return res.data;
};

// For creator dashboard, we can use /api/videos?creatorId=... and aggregate client-side 