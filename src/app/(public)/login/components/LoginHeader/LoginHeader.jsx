"use client";

import Link from 'next/link';
import useHomeTheme from '@/helpers/useHomeTheme';
import LoginIcon from '../LoginIcon/LoginIcon';
import './LoginHeader.scss';

export default function LoginHeader() {
  const { preference, effective, cycle } = useHomeTheme();
  const icon = preference === 'schedule' ? 'clock' : effective === 'dark' ? 'moon' : 'sun';
  const themeName = preference === 'schedule' ? 'Automático por horario' : effective === 'dark' ? 'Oscuro' : 'Claro';

  return (
    <header className="login-header">
      <Link href="/" className="login-header__back"><LoginIcon name="arrowLeft" />Volver al inicio</Link>
      <button type="button" className="login-header__theme" onClick={cycle} title={themeName} aria-label={`Tema: ${themeName}. Alternar modo de pantalla`}>
        <LoginIcon name={icon} />
      </button>
    </header>
  );
}
