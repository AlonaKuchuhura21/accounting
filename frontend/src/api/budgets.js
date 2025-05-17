import axios from 'axios';

const BASE_URL = 'http://localhost:8080/budgets';

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const getBudgets = async () => {
  return await axios.get(`${BASE_URL}/all`, authHeader());
};

export const createBudget = async (data) => {
  return await axios.post(`${BASE_URL}/create`, data, authHeader());
};

export const updateBudget = async (id, data) => {
  return await axios.patch(`${BASE_URL}/${id}/update`, data, authHeader());
};

export const deleteBudget = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}/delete`, authHeader());
};

export const getBudgetById = async (id) => {
  return await axios.get(`${BASE_URL}/${id}`, authHeader());
};