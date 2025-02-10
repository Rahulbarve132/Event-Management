import axiosInstance from '../utils/axios';

export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await axiosInstance.post('/auth/register', { 
    name, 
    email, 
    password 
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
