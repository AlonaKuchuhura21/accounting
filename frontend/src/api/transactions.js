import axios from 'axios';

const API_URL = 'http://localhost:8080/transactions';

export const getYearlyTransactions = async (budgetId, year) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/all?budgetId=${budgetId}&year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const createTransaction = async (data, budgetId) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/create?budgetId=${budgetId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

export const updateTransaction = async (transactionId, budgetId, data) => {
  const token = localStorage.getItem('token');
  return axios.patch(`${API_URL}/${transactionId}/update?budgetId=${budgetId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteTransaction = async (transactionId) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_URL}/${transactionId}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};