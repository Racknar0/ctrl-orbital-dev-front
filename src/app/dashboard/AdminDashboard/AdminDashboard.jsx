"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HttpService from '@/services/HttpService';
import useStore, { getState } from '@/store/useStore';
import './AdminDashboard.scss';

const dateFormatter = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function AdminDashboard() {
  const router = useRouter();
  const currentUser = useStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', platformRole: 'USER' });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    const service = new HttpService();
    const token = window.sessionStorage.getItem('orbital_access_token');

    if (!token) {
      router.replace('/login?mode=login');
      return () => { active = false; };
    }

    getState().login(token);
    service.getData('/api/auth/me')
      .then(async ({ data }) => {
        if (!active) return;
        getState().login(token, data.user);
        if (data.user.platformRole !== 'ADMIN') {
          router.replace('/dashboard');
          return;
        }
        const result = await service.getData('/api/users');
        if (active) setUsers(result.data.users);
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 403) {
          router.replace('/dashboard');
          return;
        }
        setNotice(error.response?.data?.message || 'No se pudo cargar la lista de usuarios.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, [router]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.platformRole === 'ADMIN').length,
    workspaces: users.reduce((total, user) => total + user.workspaceCount, 0),
  }), [users]);

  function handleLogout() {
    window.sessionStorage.removeItem('orbital_access_token');
    getState().logout();
    router.replace('/login?mode=login');
  }

  function openEditor(user) {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, platformRole: user.platformRole });
    setNotice('');
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!editingUser) return;
    setIsSaving(true);
    setNotice('');

    try {
      const { data } = await new HttpService().patchData(`/api/users/${editingUser.id}`, form);
      setUsers((previous) => previous.map((user) => user.id === data.user.id ? { ...user, ...data.user } : user));
      if (data.user.id === currentUser?.id) {
        const token = getState().token;
        if (token) getState().login(token, { ...currentUser, ...data.user });
      }
      setEditingUser(null);
      setNotice('Los datos del usuario se actualizaron.');
    } catch (error) {
      setNotice(error.response?.data?.message || 'No se pudieron guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <main className="admin-dashboard admin-dashboard--loading" aria-live="polite"><p>Preparando administración…</p></main>;
  }

  return (
    <main className="admin-dashboard">
      <aside className="admin-dashboard__sidebar">
        <Link className="admin-dashboard__brand" href="/" aria-label="Orbital Ctrl, inicio">
          <span className="admin-dashboard__brand-mark">O</span>
          <span>orbital<span>ctrl</span></span>
        </Link>
        <div className="admin-dashboard__workspace-label">PLATAFORMA</div>
        <nav className="admin-dashboard__nav" aria-label="Administración">
          <a className="admin-dashboard__nav-item" href="#overview"><span aria-hidden="true">◫</span>Resumen</a>
          <a className="admin-dashboard__nav-item admin-dashboard__nav-item--active" href="#users"><span aria-hidden="true">◎</span>Usuarios</a>
        </nav>
        <div className="admin-dashboard__sidebar-bottom">
          <div className="admin-dashboard__admin-card">
            <span className="admin-dashboard__avatar">{initials(currentUser?.name || 'Admin')}</span>
            <span className="admin-dashboard__admin-copy"><strong>{currentUser?.name || 'Administrador'}</strong><small>Administrador</small></span>
          </div>
          <button className="admin-dashboard__logout" type="button" onClick={handleLogout}>Cerrar sesión <span aria-hidden="true">↗</span></button>
        </div>
      </aside>

      <section className="admin-dashboard__content" id="overview">
        <header className="admin-dashboard__topbar">
          <div><span className="admin-dashboard__breadcrumb">Orbital Ctrl / Administración</span><p>Panel de control</p></div>
          <span className="admin-dashboard__status"><i /> Sistema activo</span>
        </header>

        <div className="admin-dashboard__heading">
          <div>
            <span className="admin-dashboard__eyebrow">CENTRO DE ADMINISTRACIÓN</span>
            <h1>Usuarios</h1>
            <p>Consulta y actualiza las cuentas registradas en la plataforma.</p>
          </div>
          <div className="admin-dashboard__heading-note"><span aria-hidden="true">✳</span><div><strong>Control centralizado</strong><small>Roles de acceso a Orbital Ctrl</small></div></div>
        </div>

        <div className="admin-dashboard__stats" aria-label="Resumen de usuarios">
          <article className="admin-dashboard__stat"><span>Cuentas registradas</span><strong>{stats.total}</strong><small>En toda la plataforma</small></article>
          <article className="admin-dashboard__stat"><span>Administradores</span><strong>{stats.admins}</strong><small>Acceso al panel de control</small></article>
          <article className="admin-dashboard__stat"><span>Espacios creados</span><strong>{stats.workspaces}</strong><small>Vinculados a las cuentas</small></article>
        </div>

        <section className="admin-dashboard__users-card" id="users" aria-labelledby="users-title">
          <div className="admin-dashboard__users-heading">
            <div><span className="admin-dashboard__eyebrow">DIRECTORIO</span><h2 id="users-title">Cuentas de usuario <span>{stats.total}</span></h2></div>
            <p>Selecciona una cuenta para cambiar sus datos o su rol.</p>
          </div>
          {notice && <p className="admin-dashboard__notice" role="status">{notice}</p>}
          <div className="admin-dashboard__table-wrap">
            <table className="admin-dashboard__table">
              <thead><tr><th>Usuario</th><th>Rol de plataforma</th><th>Espacios</th><th>Fecha de registro</th><th><span className="admin-dashboard__visually-hidden">Acciones</span></th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td><div className="admin-dashboard__user-cell"><span className="admin-dashboard__avatar admin-dashboard__avatar--table">{initials(user.name)}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td>
                    <td><span className={`admin-dashboard__role admin-dashboard__role--${user.platformRole.toLowerCase()}`}>{user.platformRole === 'ADMIN' ? 'Administrador' : 'Usuario'}</span></td>
                    <td>{user.workspaceCount}</td>
                    <td>{dateFormatter.format(new Date(user.createdAt))}</td>
                    <td><button className="admin-dashboard__edit" type="button" onClick={() => openEditor(user)}>Editar</button></td>
                  </tr>
                ))}
                {!users.length && <tr><td className="admin-dashboard__empty" colSpan="5">Aún no hay cuentas para mostrar.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
        <footer className="admin-dashboard__footer">Orbital Ctrl <span>·</span> Administración de cuentas</footer>
      </section>

      {editingUser && (
        <div className="admin-dashboard__scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingUser(null); }}>
          <section className="admin-dashboard__editor" role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
            <button className="admin-dashboard__close" type="button" aria-label="Cerrar edición" onClick={() => setEditingUser(null)}>×</button>
            <span className="admin-dashboard__eyebrow">PERFIL DE CUENTA</span>
            <h2 id="edit-user-title">Editar usuario</h2>
            <p>Actualiza la información y el nivel de acceso de esta cuenta.</p>
            <form onSubmit={handleSave}>
              <label>Nombre<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label>Correo electrónico<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
              <label>Rol de plataforma<select value={form.platformRole} onChange={(event) => setForm({ ...form, platformRole: event.target.value })}><option value="USER">Usuario</option><option value="ADMIN">Administrador</option></select></label>
              {notice && <p className="admin-dashboard__notice" role="status">{notice}</p>}
              <div className="admin-dashboard__editor-actions"><button className="admin-dashboard__cancel" type="button" onClick={() => setEditingUser(null)}>Cancelar</button><button className="admin-dashboard__save" type="submit" disabled={isSaving}>{isSaving ? 'Guardando…' : 'Guardar cambios'}</button></div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
