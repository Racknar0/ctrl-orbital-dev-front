import Link from 'next/link';
import { ArrowRight } from '../HomeIcon/HomeIcon';
import './CtaBanner.scss';
export default function CtaBanner() {
 return <section className="home-cta"><div className="home-cta__panel"><h2>Tus finanzas en orden, a tu propio ritmo.</h2><p>Empieza con tu espacio personal hoy mismo y comparte cuentas solo cuando lo necesites.</p><Link prefetch={false} href="/login?mode=register">Crear mi espacio gratis<ArrowRight size={17} /></Link></div></section>;
}
