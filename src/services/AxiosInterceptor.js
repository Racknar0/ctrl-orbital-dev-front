"use client";

import axios, { AxiosError } from 'axios';
import { getState } from '../store/useStore.js';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_HOST?.trim() || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.baseURL) {
      throw new AxiosError(
        'Configura NEXT_PUBLIC_BACK_HOST cuando se defina el backend.',
        'API_NOT_CONFIGURED',
        config,
      );
    }

    const token = getState().token;
    if (token && !config.headers.has('Authorization')) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = getState().token;
    const authorization = error.config?.headers?.get?.('Authorization');

    // No cerrar una sesión nueva por una respuesta pendiente del token anterior.
    if (error.response?.status === 401 && token && authorization === `Bearer ${token}`) {
      getState().logout();
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('orbital_access_token');
      }
    }

    // Las rutas de acceso y la presentación de errores se definirán con su UI.
    return Promise.reject(error);
  },
);

export default axiosInstance;
