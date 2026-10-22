"use client";

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Base de Los Rones sin datos comerciales ni un contrato de autenticación supuesto.
const useStore = create(
  subscribeWithSelector((set) => ({
    loading: false,
    token: null,
    user: null,

    setLoading: (loading) => set({ loading }),
    login: (token, user = null) => set({ token, user }),
    logout: () => set({ token: null, user: null, loading: false }),
  })),
);

export const getState = useStore.getState;
export default useStore;
