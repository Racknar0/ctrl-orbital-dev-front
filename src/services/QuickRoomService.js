import axiosInstance from './AxiosInterceptor';

const storageKey = 'orbital.quickRooms.sessions';
export async function loadRoomSessions() {
  let sessions = [];
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) sessions = stored.filter((s) => typeof s.code === 'string' && typeof s.token === 'string');
  } catch { /* El acceso temporal sigue funcionando aunque el almacenamiento no esté disponible. */ }
  return { sessions, code: new URLSearchParams(window.location.search).get('sala')?.toUpperCase() || '' };
}
export function saveRoomSession(sessions, session) {
  const next = [session, ...sessions.filter((s) => s.code !== session.code)];
  try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Conserva la sesión en memoria. */ }
  return next;
}

export async function roomRequest(method, code = '', token = '', suffix = '', data) {
  const response = await axiosInstance.request({
    method, url: `/api/quick-rooms${code ? `/${encodeURIComponent(code)}` : ''}${suffix}`,
    headers: { 'X-Room-Token': token }, data,
  });
  return response.data;
}
