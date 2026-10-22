import { Suspense } from 'react';
import AuthActionPage from '../components/AuthActionPage/AuthActionPage';
import '../login/Login.scss';

export const metadata = {
  title: 'Verificar correo | Orbital Ctrl',
  description: 'Confirma tu correo para activar tu cuenta de Orbital Ctrl.',
};

export default function VerifyEmailPage() {
  return <Suspense fallback={<p role="status">Preparando verificación…</p>}><AuthActionPage mode="verify" /></Suspense>;
}
