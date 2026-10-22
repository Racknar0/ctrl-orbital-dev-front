"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useHomeTheme from '@/helpers/useHomeTheme';
import useStore from '@/store/useStore';
import { Clock, Moon, Sun, Menu, X, User, ChevronDown, ArrowRight, Zap } from '../HomeIcon/HomeIcon';
import './HomeNavbar.scss';

const sections = [['solucion', 'Beneficios'], ['bento', 'Características'], ['comparativa', 'Comparativa']];
export default function HomeNavbar() {
  const { preference, effective, cycle } = useHomeTheme();
  const token = useStore(state => state.token);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [active, setActive] = useState('');
  const navRef = useRef(null);
  const accountRef = useRef(null);
  const menuRef = useRef(null);
  const accountButtonRef = useRef(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const marker = (navRef.current?.offsetHeight || 80) + window.innerHeight * .25;
      const current = sections.find(([id]) => { const rect = document.getElementById(id)?.getBoundingClientRect(); return rect && rect.top <= marker && rect.bottom > marker; });
      setActive(current?.[0] || '');
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  useEffect(() => {
    const outside = event => { if (!accountRef.current?.contains(event.target)) setAccountOpen(false); };
    const escape = event => {
      if (event.key !== 'Escape') return;
      if (mobileOpen) menuRef.current?.focus();
      else if (accountOpen) accountButtonRef.current?.focus();
      setAccountOpen(false); setMobileOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [mobileOpen, accountOpen]);
  const ThemeIcon = preference === 'schedule' ? Clock : effective === 'dark' ? Moon : Sun;
  const themeName = preference === 'schedule' ? 'Automático por horario' : preference === 'dark' ? 'Oscuro' : 'Claro';
  return <header className="home-navbar" ref={navRef}>
    <div className="home-navbar__bar">
      <Link prefetch={false} className="home-navbar__brand" href="/" aria-label="Orbital Ctrl, inicio"><Image src="/equa-logo.png" alt="" width={40} height={40} priority /><span><strong>Orbital Ctrl</strong><small>by Orbital Dev</small></span></Link>
      <nav className="home-navbar__links" aria-label="Navegación principal">{sections.map(([id,label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}<Link prefetch={false} className="home-navbar__rooms" href="/salas-rapidas">Salas Rápidas <Zap size={12} /></Link></nav>
      <div className="home-navbar__actions"><button type="button" className="home-navbar__theme" onClick={cycle} aria-label={`Tema: ${themeName}. Alternar modo de pantalla`} title={themeName}><ThemeIcon size={17} /></button>
        <div className="home-navbar__account" ref={accountRef}><button ref={accountButtonRef} className="home-navbar__login" type="button" onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-controls="account-links"><User size={15} />{token ? 'Mi cuenta' : 'Ingresar'}<ChevronDown size={14} /></button>
          {accountOpen && <nav id="account-links" className="home-navbar__dropdown" aria-label="Acceso a tu cuenta">{token ? <><Link prefetch={false} href="/dashboard">Ir al dashboard<ArrowRight size={15} /></Link><button type="button" onClick={() => { useStore.getState().logout(); setAccountOpen(false); }}>Cerrar sesión</button></> : <><Link prefetch={false} href="/login?mode=login">Iniciar sesión<ArrowRight size={15} /></Link><Link prefetch={false} href="/login?mode=register">Crear una cuenta<ArrowRight size={15} /></Link></>}</nav>}
        </div>
        <button ref={menuRef} type="button" className="home-navbar__menu" aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
    </div>
    {mobileOpen && <nav id="mobile-navigation" className="home-navbar__mobile" aria-label="Navegación móvil">{sections.map(([id,label]) => <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)}>{label}</a>)}<Link prefetch={false} href="/salas-rapidas" onClick={() => setMobileOpen(false)}>Salas Rápidas</Link><Link prefetch={false} href="/login?mode=login">Iniciar sesión</Link><Link prefetch={false} href="/login?mode=register">Comenzar gratis<ArrowRight size={16} /></Link></nav>}
  </header>;
}
