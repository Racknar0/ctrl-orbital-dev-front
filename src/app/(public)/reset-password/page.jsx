import { Suspense } from 'react';
import AuthActionPage from '../components/AuthActionPage/AuthActionPage';
import '../login/Login.scss';

export const metadata = {
  title: 'Nueva contraseña | Orbital Ctrl',
  description: 'Crea una nueva contraseña para tu cuenta de Orbital Ctrl.',
};

export default function ResetPasswordPage() {
  return <Suspense fallback={<p role="status">Preparando formulario…</p>}><AuthActionPage mode="reset" /></Suspense>;
}
