import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

export const getUser = async (userId) => {
    return {
        id: userId,
        fullName: 'Alisa Vitchenko',
        email: 'ali.vitchenko@gmail.com',
        createdAt: '12-May-2025'
    };
};

export const deleteUser = async (userId) => {
    await axios.delete(`${API_URL}/${userId}`);
};

export const updateUser = async (userId) => {
    const token = localStorage.getItem('token');
    await axios.patch(`${API_URL}/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
