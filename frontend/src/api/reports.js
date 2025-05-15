import axios from 'axios';

export const loadReport = async (budgetId) => {
  const token = localStorage.getItem("token");
  return axios.get(`http://localhost:8080/reports/generate`, {
    params: { budgetId },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
