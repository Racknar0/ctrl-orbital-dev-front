import Link from 'next/link';
import { Zap, ArrowRight } from '../HomeIcon/HomeIcon';
import './SalasRapidasBanner.scss';
export default function SalasRapidasBanner() {
 return <section className="quick-rooms" aria-labelledby="quick-rooms-title"><div className="quick-rooms__panel"><div className="quick-rooms__content">
  <span className="quick-rooms__badge"><Zap size={14} />Salas Rápidas · Cero Registro</span>
  <h2 id="quick-rooms-title">¿Un viaje, salida o actividad grupal?<br /><span>Dividan los gastos con un código.</span></h2>
  <p>Lleva tus finanzas diarias en tu propia app. Y cuando hagas una salida, viaje o asado con amigos o compañeros, abres una sala temporal: cada uno anota lo que pagó y se reparte la cuenta sin que nadie tenga que registrarse.</p>
  <div className="quick-rooms__benefits">{[['🎯','Acceso con código','Sin descargar apps ni crear cuentas.'],['⚖️','Reparto exacto','Cero enredos: cada uno paga lo justo.'],['📲','Alias & CBU en 1 toque','Paga directo a las apps de banco.']].map(([icon,title,text])=><div key={title}><span aria-hidden="true">{icon}</span><div><strong>{title}</strong><small>{text}</small></div></div>)}</div>
 </div><div className="quick-rooms__action"><Link prefetch={false} href="/modo-fiesta">Abrir simulador de eventos<ArrowRight size={16} /></Link><small>✧ Salas de prueba: Asados, Bares y Pizzas</small></div></div></section>;
}
