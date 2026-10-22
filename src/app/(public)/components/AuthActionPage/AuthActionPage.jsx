"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import HttpService from '@/services/HttpService';
import { authErrorMessage } from '@/helpers/authFeedback';
import AuthNotice from '../AuthNotice/AuthNotice';
import PasswordInput, { PasswordMatchFeedback } from '@/components/PasswordInput/PasswordInput';
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
  const [noticeType, setNoticeType] = useState('info');
  const inFlight = useRef(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const copy = actionCopy[mode];

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setNoticeType('pending');
    setNotice(mode === 'forgot' ? 'Estamos enviando el enlace de recuperación. Espera un momento.' : 'Estamos procesando tu solicitud.');
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
        inFlight.current = false;
        setNoticeType('error');
        setNotice('Las contraseñas no coinciden.');
        setIsSubmitting(false);
        return;
      }
      url = '/api/auth/reset-password';
      payload = { token, password };
    }

    try {
      const { data } = await new HttpService().postData(url, payload, { timeout: mode === 'forgot' ? 45000 : 15000 });
      setNotice(data.message || 'Listo.');
      setNoticeType('success');
      setIsSuccess(true);
    } catch (error) {
      setNoticeType('error');
      setNotice(authErrorMessage(error, mode === 'forgot'));
      setIsSuccess(false);
    } finally {
      inFlight.current = false;
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
              <AuthNotice message={notice || (mode !== 'forgot' && !token ? 'El enlace no contiene un token válido.' : '')} type={mode !== 'forgot' && !token ? 'error' : noticeType} />

              {isSuccess ? (
                <div className="auth-action__result">
                  <Link className="auth-action__link" href="/login?mode=login">{copy.successLink}</Link>
                </div>
              ) : mode === 'verify' ? (
                <form onSubmit={handleSubmit}>
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
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="reset-password">Contraseña nueva</label>
                  <PasswordInput id="reset-password" name="password" value={passwordValue} onChange={(event) => setPasswordValue(event.target.value)} autoComplete="new-password" minLength={8} required />
                  <label htmlFor="reset-confirm-password">Confirma la contraseña</label>
                  <PasswordInput id="reset-confirm-password" name="confirmPassword" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} aria-invalid={!!confirmation && passwordValue !== confirmation} aria-describedby={confirmation ? 'reset-password-match' : undefined} visibilityLabel="confirmación de contraseña" autoComplete="new-password" minLength={8} required />
                  <PasswordMatchFeedback id="reset-password-match" password={passwordValue} confirmation={confirmation} />
                  <small>Mínimo 8 caracteres.</small>
                  <button className="auth-action__submit" type="submit" disabled={isSubmitting || !token || (!!confirmation && passwordValue !== confirmation)}>
                    {isSubmitting ? 'Guardando…' : 'Cambiar contraseña'}
                  </button>
                </form>
              )}

              {!isSuccess && <Link className="auth-action__back" href="/login?mode=login">Volver a iniciar sesión</Link>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
