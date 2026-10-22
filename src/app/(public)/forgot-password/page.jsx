import { Suspense } from 'react';
import AuthActionPage from '../components/AuthActionPage/AuthActionPage';
import '../login/Login.scss';

export const metadata = {
  title: 'Recuperar contraseña | Orbital Ctrl',
  description: 'Solicita un enlace para recuperar tu cuenta de Orbital Ctrl.',
};

export default function ForgotPasswordPage() {
  return <Suspense fallback={<p role="status">Preparando formulario…</p>}><AuthActionPage mode="forgot" /></Suspense>;
}
