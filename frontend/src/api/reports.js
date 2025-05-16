import axios from 'axios';

const API_URL = 'http://localhost:8080/reports';

export const loadReport = async (budgetId) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/generate?budgetId=${budgetId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
  