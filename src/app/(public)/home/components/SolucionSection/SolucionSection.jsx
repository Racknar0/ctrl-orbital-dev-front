import Image from 'next/image';
import { Check } from '../HomeIcon/HomeIcon';
import './SolucionSection.scss';
const steps = [
  { image: 'solucion-aportes', alt: 'Ilustración de control individual de gastos', title: '1. Tu espacio privado', description: 'Registra tus compras, guarda fotos de tus recibos y lleva tu presupuesto personal al día sin que nadie más tenga acceso.', note: '100% privado e independiente' },
  { image: 'solucion-comprobantes', alt: 'Ilustración de conexión colaborativa', title: '2. Espacios compartidos', description: 'Conéctate con tu pareja, compañeros o equipo de trabajo. Los gastos comunes se sincronizan al instante para todos.', note: 'Sincronización en vivo' },
  { image: 'solucion-saldos', alt: 'Ilustración de salas rápidas con código', title: '3. Salas rápidas con código', description: 'Para un viaje, salida o asado puntual: abre una sala rápida y tus amigos se suman con un código de 4 dígitos sin registrarse.', note: 'Sin registro ni descargas' },
];
export default function SolucionSection() {
  return <section id="solucion" className="solution">
    <header className="solution__heading"><span>Cómo funciona</span><h2>Simple para ti. Potente para compartir.</h2><p>Organiza tus gastos personales día a día, o suma a otras personas cuando compartan una casa, un viaje o un proyecto.</p></header>
    <div className="solution__grid">{steps.map(step => <article key={step.image} className="solution__card"><Image src={`/images/${step.image}.png`} alt={step.alt} width={1536} height={1024} sizes="(max-width: 767px) 90vw, 33vw" /><h3>{step.title}</h3><p>{step.description}</p><div className="solution__note"><Check size={17} />{step.note}</div></article>)}</div>
  </section>;
}
