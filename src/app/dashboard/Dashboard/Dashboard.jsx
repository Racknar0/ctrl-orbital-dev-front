"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HttpService from '@/services/HttpService';
import useStore, { getState } from '@/store/useStore';
import './Dashboard.scss';

export default function Dashboard() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = window.sessionStorage.getItem('orbital_access_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    getState().login(token);
    new HttpService().getData('/api/auth/me')
      .then(({ data }) => {
        getState().login(token, data.user);
        if (data.user.platformRole === 'ADMIN') router.replace('/dashboard/admin');
      })
      .catch(() => {
        window.sessionStorage.removeItem('orbital_access_token');
        getState().logout();
        router.replace('/login');
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  function handleLogout() {
    window.sessionStorage.removeItem('orbital_access_token');
    getState().logout();
    router.replace('/login');
  }

  if (isLoading || !user) {
    return <main className="dashboard" aria-live="polite"><p>Preparando tu espacio…</p></main>;
  }

  return (
    <main className="dashboard">
      <section className="dashboard__card" aria-labelledby="dashboard-title">
        <span className="dashboard__eyebrow">Orbital Ctrl</span>
        <h1 id="dashboard-title">Hola, {user.name}</h1>
        <p>Tu espacio está listo. Pronto podrás empezar a organizar tus finanzas aquí.</p>
        {user.workspace?.name && <p className="dashboard__workspace">{user.workspace.name}</p>}
        <button className="dashboard__logout" type="button" onClick={handleLogout}>Cerrar sesión</button>
      </section>
    </main>
  );
}
