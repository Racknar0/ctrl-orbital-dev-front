import { Camera, Receipt, User, Users, Scale, Clock, PieChart } from '../HomeIcon/HomeIcon';
import './BentoSection.scss';
export default function BentoSection() {
 return <section id="bento" className="features">
  <header className="features__heading"><span>Precisión de alto rendimiento</span><h2>Potencia invisible. Control absoluto.</h2><p>Herramientas inteligentes diseñadas para tomar el control de tu dinero en segundos.</p></header>
  <div className="features__grid">
   <article className="features__card"><h3><span><Camera /></span>Escaneo de recibos y tickets</h3><p>Toma una foto a tu ticket o comprobante para capturar el comercio, fecha y total sin tipear a mano.</p><div className="features__receipt"><Receipt /><div><strong>Factura digitalizada</strong><small>$120.000 COP · Captura automática</small></div><b>PDF / JPG</b></div></article>
   <article className="features__card"><h3><span><Users /></span>Modularidad sin límites</h3><p>Opera de forma 100% individual o enlaza tu cuenta a espacios colectivos con total independencia y privacidad.</p><div className="features__spaces" aria-label="Ejemplo de espacios separados"><span><User size={16} />Uso Individual</span><span><Users size={16} />Uso Colectivo</span></div></article>
   <article className="features__card"><h3><span><PieChart /></span>Diagnóstico en tiempo real</h3><p>Visualiza el balance exacto entre tus compromisos fijos, variables y liquidez disponible.</p><div className="features__balance"><span>Fijos 55%</span><span>Variables 30%</span><span>Disponible 15%</span></div></article>
   <article className="features__card"><h3><span><Scale /></span>Cuentas claras al instante</h3><p>Saldar cuentas nunca fue tan fácil: la app calcula los balances netos para resolver todo con los pagos justos.</p><div className="features__payment"><div><small>Saldo pendiente · Ejemplo</small><strong>Luis → Ana: $60.000 COP</strong></div><Clock /></div></article>
  </div>
 </section>;
}
