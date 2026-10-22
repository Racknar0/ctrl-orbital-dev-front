import { Suspense } from 'react';
import LoginHeader from './components/LoginHeader/LoginHeader';
import LoginShowcase from './components/LoginShowcase/LoginShowcase';
import LoginForm from './components/LoginForm/LoginForm';
import './Login.scss';

export default function Login() {
  return (
    <main className="login">
      <div className="login__container">
        <LoginHeader />
        <div className="login__frame">
          <LoginShowcase />
          <section className="login__content" aria-labelledby="login-title">
            <Suspense fallback={<p role="status">Preparando tu formulario…</p>}>
              <LoginForm />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
