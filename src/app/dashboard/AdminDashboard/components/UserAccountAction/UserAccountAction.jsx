"use client";

import { useEffect, useRef, useState } from 'react';
import './UserAccountAction.scss';

export default function UserAccountAction({ action, isSaving, error, onCancel, onConfirm }) {
  const [emailConfirmation, setEmailConfirmation] = useState('');
  const focusRef = useRef(null);
  const deleting = action.type === 'delete';
  const activating = action.type === 'activate';
  const title = deleting ? 'Eliminar definitivamente' : activating ? 'Reactivar usuario' : 'Desactivar usuario';

  useEffect(() => { focusRef.current?.focus(); }, []);

  return (
    <div className="admin-dashboard__scrim" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) onCancel(); }} onKeyDown={(event) => { if (event.key === 'Escape' && !isSaving) onCancel(); }}>
      <section className="admin-dashboard__editor user-account-action" role="dialog" aria-modal="true" aria-labelledby="account-action-title" aria-describedby="account-action-description">
        <button className="admin-dashboard__close" type="button" aria-label="Cerrar ventana" disabled={isSaving} onClick={onCancel}>×</button>
        <span className="admin-dashboard__eyebrow">GESTIÓN DE CUENTA</span>
        <h2 id="account-action-title">{title}</h2>
        <p id="account-action-description">{deleting
          ? 'Solo se pueden eliminar cuentas sin actividad ni vínculos compartidos. Esta acción es permanente: se borrarán la cuenta, sus tokens y su espacio inicial vacío, si existe.'
          : activating
            ? 'La cuenta podrá volver a iniciar sesión. Sus datos se conservan; deberá ingresar de nuevo con su contraseña.'
            : 'La cuenta no podrá iniciar sesión y sus sesiones abiertas quedarán invalidadas. Se conservarán sus datos y podrás reactivarla después.'}</p>
        <div className="user-account-action__identity"><strong>{action.user.name}</strong><span>{action.user.email}</span></div>
        <form onSubmit={(event) => { event.preventDefault(); if (!isSaving) onConfirm(emailConfirmation); }} aria-busy={isSaving}>
          {deleting && <label htmlFor="delete-user-email">Escribe el correo del usuario para confirmar
            <input ref={focusRef} id="delete-user-email" type="email" autoComplete="off" value={emailConfirmation} onChange={(event) => setEmailConfirmation(event.target.value)} required disabled={isSaving} />
          </label>}
          {error && <p className="admin-dashboard__notice" role="alert">{error}</p>}
          <div className="admin-dashboard__editor-actions">
            <button ref={deleting ? undefined : focusRef} className="admin-dashboard__cancel" type="button" onClick={onCancel} disabled={isSaving}>Cancelar</button>
            <button className={deleting ? 'admin-dashboard__delete' : 'admin-dashboard__save'} type="submit" disabled={isSaving || (deleting && emailConfirmation.trim().toLowerCase() !== action.user.email.toLowerCase())}>{isSaving ? 'Procesando…' : title}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
