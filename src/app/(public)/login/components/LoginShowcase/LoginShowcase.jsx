import Image from 'next/image';
import LoginIcon from '../LoginIcon/LoginIcon';
import './LoginShowcase.scss';

export default function LoginShowcase() {
  return (
    <aside className="login-showcase" aria-label="Orbital Ctrl, gastos compartidos">
      <div>
        <div className="login-showcase__brand">
          <div className="login-showcase__logo"><Image src="/equa-logo.png" alt="" width={48} height={48} priority /></div>
          <div><strong>Orbital Ctrl</strong><span>by Orbital Dev</span></div>
        </div>
        <span className="login-showcase__eyebrow">Plataforma compartida</span>
        <h2>Tus gastos compartidos.<br /><span>En un solo lugar.</span></h2>
        <p>Organiza los gastos y aportes de tu familia, empresa o equipo.</p>
      </div>
      <div className="login-showcase__balance">
        <div className="login-showcase__balance-header"><span>Gastos compartidos · Ejemplo</span><strong><LoginIcon name="sparkles" /> CTRL</strong></div>
        <p className="login-showcase__amount">$1.840.000 <span>COP</span></p>
        <div className="login-showcase__split"><span>Camila (60%) • Lucas (40%)</span><strong>Equilibrado ●</strong></div>
      </div>
    </aside>
  );
}
