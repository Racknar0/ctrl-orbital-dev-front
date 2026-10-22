"use client";

import { useState } from 'react';
import './PasswordInput.scss';

export function PasswordMatchFeedback({ id, password, confirmation }) {
  if (!confirmation) return null;
  const matches = password === confirmation;
  return <small id={id} className={`password-match password-match--${matches ? 'success' : 'error'}`} role="status">{matches ? 'Las contraseñas coinciden.' : 'Las contraseñas no coinciden.'}</small>;
}

export default function PasswordInput({ visibilityLabel = 'contraseña', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="password-input">
      <input {...props} type={visible ? 'text' : 'password'} className="password-input__control" />
      <button className="password-input__toggle" type="button" aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${visibilityLabel}`} aria-pressed={visible} aria-controls={props.id} onClick={() => setVisible((current) => !current)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="m3 3 18 18" />}
        </svg>
      </button>
    </span>
  );
}
