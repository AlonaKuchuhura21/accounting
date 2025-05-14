import axios from 'axios';

const API_URL = 'http://localhost:8080/transactions';

export const getMonthlySummary = async (budgetId, year, month) => {
  const token = localStorage.getItem('token');

  return axios.get(`${API_URL}/monthly-summary`, {
    params: {
      budgetId,
      year,
      month
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
