import axios from "axios";

const API_URL = "http://localhost:8080/users";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const getCurrentUser = async () => {
  return axios.patch(`${API_URL}`, {}, authHeader());
};

export const updateUser = async (data) => {
  return axios.patch(API_URL, data, authHeader());
};

export const deleteUser = async () => {
  return axios.delete(API_URL, authHeader());
};
