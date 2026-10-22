"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import HttpService from '@/services/HttpService';
import LoginHeader from '../../login/components/LoginHeader/LoginHeader';
import LoginShowcase from '../../login/components/LoginShowcase/LoginShowcase';
import './AuthActionPage.scss';

const actionCopy = {
  verify: {
    eyebrow: 'VERIFICACIÓN DE CUENTA',
    title: 'Confirma tu correo',
    description: 'Activa tu cuenta con el enlace que enviamos a tu correo.',
    successLink: 'Ir a iniciar sesión',
  },
  forgot: {
    eyebrow: 'RECUPERAR ACCESO',
    title: '¿Olvidaste tu contraseña?',
    description: 'Escribe el correo de tu cuenta y te enviaremos un enlace para cambiarla.',
    successLink: 'Volver a iniciar sesión',
  },
  reset: {
    eyebrow: 'NUEVA CONTRASEÑA',
    title: 'Restablece tu contraseña',
    description: 'Elige una contraseña nueva para volver a entrar a tu cuenta.',
    successLink: 'Ir a iniciar sesión',
  },
};

export default function AuthActionPage({ mode }) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [notice, setNotice] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = actionCopy[mode];

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice('');
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    let url;
    let payload;

    if (mode === 'verify') {
      url = '/api/auth/verify-email';
      payload = { token };
    } else if (mode === 'forgot') {
      url = '/api/auth/forgot-password';
      payload = { email: String(form.get('email') || '').trim() };
    } else {
      const password = String(form.get('password') || '');
      const confirmPassword = String(form.get('confirmPassword') || '');
      if (password !== confirmPassword) {
        setNotice('Las contraseñas no coinciden.');
        setIsSubmitting(false);
        return;
      }
      url = '/api/auth/reset-password';
      payload = { token, password };
    }

    try {
      const { data } = await new HttpService().postData(url, payload);
      setNotice(data.message || 'Listo.');
      setIsSuccess(true);
    } catch (error) {
      setNotice(error.response?.data?.message || 'No pudimos completar la solicitud. Inténtalo de nuevo.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login">
      <div className="login__container">
        <LoginHeader />
        <div className="login__frame">
          <LoginShowcase />
          <section className="login__content" aria-labelledby="auth-action-title">
            <div className="auth-action">
              <span className="auth-action__eyebrow">{copy.eyebrow}</span>
              <h1 id="auth-action-title">{copy.title}</h1>
              <p className="auth-action__description">{copy.description}</p>

              {isSuccess ? (
                <div className="auth-action__result">
                  <p className="auth-action__notice auth-action__notice--success" role="status">{notice}</p>
                  <Link className="auth-action__link" href="/login?mode=login">{copy.successLink}</Link>
                </div>
              ) : mode === 'verify' ? (
                <form onSubmit={handleSubmit}>
                  {!token && <p className="auth-action__notice" role="alert">El enlace no contiene un token válido.</p>}
                  <button className="auth-action__submit" type="submit" disabled={isSubmitting || !token}>
                    {isSubmitting ? 'Verificando…' : 'Verificar correo'}
                  </button>
                </form>
              ) : mode === 'forgot' ? (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="forgot-email">Correo electrónico</label>
                  <input id="forgot-email" name="email" type="email" autoComplete="email" required />
                  <button className="auth-action__submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando…' : 'Enviar enlace'}
                  </button>
                  {notice && <p className="auth-action__notice" role="status">{notice}</p>}
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  {!token && <p className="auth-action__notice" role="alert">El enlace no contiene un token válido.</p>}
                  <label htmlFor="reset-password">Contraseña nueva</label>
                  <input id="reset-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
                  <label htmlFor="reset-confirm-password">Confirma la contraseña</label>
                  <input id="reset-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
                  <small>Mínimo 8 caracteres.</small>
                  <button className="auth-action__submit" type="submit" disabled={isSubmitting || !token}>
                    {isSubmitting ? 'Guardando…' : 'Cambiar contraseña'}
                  </button>
                </form>
              )}

              {!isSuccess && mode === 'verify' && notice && <p className="auth-action__notice" role="alert">{notice}</p>}
              {!isSuccess && mode === 'reset' && notice && <p className="auth-action__notice" role="alert">{notice}</p>}
              {!isSuccess && <Link className="auth-action__back" href="/login?mode=login">Volver a iniciar sesión</Link>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
