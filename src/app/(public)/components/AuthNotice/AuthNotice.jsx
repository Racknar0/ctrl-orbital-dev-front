"use client";

import { useEffect, useRef } from 'react';
import './AuthNotice.scss';

export default function AuthNotice({ message, type = 'info' }) {
  const noticeRef = useRef(null);

  useEffect(() => {
    if (!message || type === 'pending') return;
    noticeRef.current?.focus({ preventScroll: true });
    noticeRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, [message, type]);

  if (!message) return null;

  const titles = { error: 'No pudimos completar la solicitud', success: '¡Listo!', pending: 'Procesando tu solicitud…', info: 'Información' };

  return (
    <div ref={noticeRef} className={`auth-notice auth-notice--${type}`} role={type === 'error' ? 'alert' : 'status'} tabIndex={-1} aria-atomic="true">
      <strong>{titles[type]}</strong>
      <p>{message}</p>
    </div>
  );
}
