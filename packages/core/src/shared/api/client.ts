'use client';

import axios from 'axios';

import { API_BASE_URL } from '../config';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      location.href = '/signin';
    }

    return Promise.reject(error);
  },
);
