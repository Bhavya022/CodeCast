import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quiz';

export const getQuiz = async (videoId) => {
  const res = await axios.get(`${API_URL}/${videoId}`);
  return res.data;
};

// For future: submitQuiz (not implemented in backend yet) 