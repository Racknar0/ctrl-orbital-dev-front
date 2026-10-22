"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import HttpService from '@/services/HttpService';
import useStore from '@/store/useStore';
import LoginIcon from '../LoginIcon/LoginIcon';
import './LoginForm.scss';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  return <AccountForm key={mode} mode={mode} searchParams={searchParams} />;
}

function AccountForm({ mode, searchParams }) {
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const setSession = useStore((state) => state.login);
  const isRegister = mode === 'register';

  function modeHref(nextMode) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', nextMode);
    return `/login?${params.toString()}`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice('');
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');
    const payload = isRegister
      ? {
          name: String(form.get('name') || '').trim(),
          workspaceName: String(form.get('teamName') || '').trim(),
          email,
          password,
        }
      : { email, password };

    try {
      const service = new HttpService();
      const { data } = await service.postData(`/api/auth/${isRegister ? 'register' : 'login'}`, payload);
      sessionStorage.setItem('orbital_access_token', data.token);
      setSession(data.token, { ...data.user, workspace: data.workspace });
      router.replace(data.user.platformRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'No pudimos conectar con el servidor. Inténtalo de nuevo.';
      setNotice(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-form">
      <div className="login-form__heading">
        <span className="login-form__eyebrow">Tu cuenta</span>
        <h1 id="login-title">{isRegister ? 'Crea tu cuenta' : 'Bienvenido a Orbital Ctrl'}</h1>
        <p>{isRegister ? 'Empieza a organizar los gastos de tu familia, empresa o equipo.' : 'Inicia sesión con tus credenciales para gestionar tus cuentas.'}</p>
      </div>

      <nav className="login-form__access" aria-label="Acceso a tu cuenta">
        <Link href={modeHref('login')} scroll={false} prefetch={false} aria-current={!isRegister ? 'page' : undefined} className={!isRegister ? 'login-form__active' : undefined}>Iniciar sesión</Link>
        <Link href={modeHref('register')} scroll={false} prefetch={false} aria-current={isRegister ? 'page' : undefined} className={isRegister ? 'login-form__active' : undefined}>Crear cuenta</Link>
      </nav>

      <form onSubmit={handleSubmit}>
        {isRegister && <>
          <div className="login-form__field">
            <label htmlFor="register-name">Nombre completo</label>
            <div className="login-form__input">
              <LoginIcon name="user" />
              <input id="register-name" name="name" type="text" autoComplete="name" placeholder="Ej. María González" required />
            </div>
          </div>
          <div className="login-form__field">
            <label htmlFor="register-team">Nombre de tu familia, empresa o equipo</label>
            <div className="login-form__input">
              <LoginIcon name="house" />
              <input id="register-team" name="teamName" type="text" autoComplete="organization" placeholder="Ej. Casa María y Juan, Proyecto Alpha…" required />
            </div>
          </div>
        </>}
        <div className="login-form__field">
          <label htmlFor="login-email">Correo electrónico</label>
          <div className="login-form__input">
            <LoginIcon name="mail" />
            <input id="login-email" name="email" type="email" autoComplete="username" placeholder="tu@correo.com" required />
          </div>
        </div>

        <div className="login-form__field">
          <div className="login-form__label-row">
            <label htmlFor="login-password">Contraseña</label>
            {!isRegister && <button type="button" onClick={() => setNotice('La recuperación de contraseña estará disponible próximamente.')}>¿Olvidaste tu clave?</button>}
          </div>
          <div className="login-form__input">
            <LoginIcon name="key" />
            <input id="login-password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder={isRegister ? 'Crea tu contraseña' : 'Tu contraseña'} required />
          </div>
        </div>

        {!isRegister && <label className="login-form__remember">
          <input type="checkbox" name="remember" />
          <span>Recuérdame <small>(recordar mi correo para el próximo ingreso)</small></span>
        </label>}

        <button type="submit" className="login-form__submit" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Un momento…' : isRegister ? 'Crear mi cuenta' : 'Iniciar sesión'}</span>
          {!isSubmitting && <LoginIcon name="arrowRight" />}
        </button>
        <p className="login-form__terms">
          Al continuar, aceptas nuestros{' '}
          <button type="button" onClick={() => setNotice('Los términos y la política de privacidad estarán disponibles próximamente.')}>Términos y Condiciones</button>{' '}
          y Política de Privacidad de Orbital Dev.
        </p>
      </form>

      <div className="login-form__divider"><span>O continúa con</span></div>
      <button type="button" className="login-form__google" onClick={() => setNotice('El acceso con Google estará disponible próximamente.')}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Continuar con Google
      </button>
      <p className="login-form__notice" role="status">{notice}</p>
    </div>
  );
}
