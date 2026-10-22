"use client";
import { create } from 'zustand';

const modes = ['schedule', 'light', 'dark'];
const storageKey = 'orbital_theme_preference';
function applyTheme(preference) {
  const minutes = new Date().getHours() * 60 + new Date().getMinutes();
  const effective = preference === 'schedule' ? (minutes >= 360 && minutes <= 1080 ? 'light' : 'dark') : preference;
  document.documentElement.classList.toggle('dark', effective === 'dark');
  return effective;
}
const useThemeStore = create((set, get) => ({
  preference: 'schedule',
  effective: 'light',
  initialize: () => {
    let preference = 'schedule';
    try { const saved = localStorage.getItem(storageKey); if (modes.includes(saved)) preference = saved; } catch { /* El tema funciona también sin almacenamiento. */ }
    set({ preference, effective: applyTheme(preference) });
  },
  refresh: () => set({ effective: applyTheme(get().preference) }),
  cycle: () => {
    const preference = modes[(modes.indexOf(get().preference) + 1) % modes.length];
    try { localStorage.setItem(storageKey, preference); } catch { /* Mantener la selección en memoria. */ }
    set({ preference, effective: applyTheme(preference) });
  },
}));
export default useThemeStore;
