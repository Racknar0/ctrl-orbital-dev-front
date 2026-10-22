"use client";
import { useEffect } from 'react';
import useThemeStore from '@/store/useThemeStore';

export default function useHomeTheme() {
  const preference = useThemeStore(state => state.preference);
  const effective = useThemeStore(state => state.effective);
  const cycle = useThemeStore(state => state.cycle);
  useEffect(() => {
    const { initialize, refresh } = useThemeStore.getState();
    initialize();
    const interval = setInterval(refresh, 30000);
    window.addEventListener('storage', initialize);
    return () => { clearInterval(interval); window.removeEventListener('storage', initialize); };
  }, []);
  return { preference, effective, cycle };
}
