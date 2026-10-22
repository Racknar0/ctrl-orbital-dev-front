import Link from 'next/link';
import Image from 'next/image';
import './HomeFooter.scss';
export default function HomeFooter() {
 return <footer className="home-footer"><div className="home-footer__grid"><div className="home-footer__brand"><Link prefetch={false} href="/"><Image src="/equa-logo.png" alt="" width={40} height={40} /><strong>Orbital Ctrl</strong></Link><p>Gastos compartidos bajo control, para familias, empresas y equipos.</p></div>
 <nav aria-label="Producto"><h3>Producto</h3><Link href="/#solucion">Beneficios</Link><Link href="/#bento">Características</Link><Link href="/#comparativa">Comparativa</Link></nav>
 <nav aria-label="Comunidad"><h3>Comunidad</h3><Link prefetch={false} href="/sugerencias">Ideas y sugerencias</Link><Link prefetch={false} href="/salas-rapidas">Salas Rápidas</Link></nav>
 <nav aria-label="Tu cuenta"><h3>Tu cuenta</h3><Link prefetch={false} href="/login?mode=login">Iniciar sesión</Link><Link prefetch={false} href="/login?mode=register">Comenzar gratis</Link><Link prefetch={false} href="/dashboard">Dashboard</Link></nav></div>
 <div className="home-footer__bottom"><span>© Orbital Ctrl · Desarrollado por Orbital Dev</span><div className="home-footer__legal"><Link prefetch={false} href="/terminos">Términos y condiciones</Link><Link prefetch={false} href="/privacidad">Política de privacidad</Link></div></div></footer>;
}
