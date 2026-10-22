import { Check } from '../HomeIcon/HomeIcon';
import './ComparativaSection.scss';
const comparisons = [
  {
    feature: 'Carga de gastos',
    manual: 'Transcribir montos a mano o tipear en hojas de cálculo.',
    orbital: 'Lectura instantánea de tickets y facturas con IA.',
  },
  {
    feature: 'Respaldo de comprobantes',
    manual: 'Fotos y capturas dispersas que caducan en chats.',
    orbital: 'Documentos adjuntos de por vida a cada movimiento.',
  },
  {
    feature: 'Privacidad personal',
    manual: 'Exponer todas tus cuentas personales para coordinar el grupo.',
    orbital: 'Tus gastos individuales se mantienen 100% confidenciales.',
  },
  {
    feature: 'Liquidación de saldos',
    manual: 'Múltiples transferencias cruzadas y discusiones a fin de mes.',
    orbital: 'Saldo neto exacto: un solo pago y cuentas al día.',
  },
]


export default function ComparativaSection() {
  return <section id="comparativa" className="comparison">
    <header className="comparison__heading"><span>Rendimiento comparado</span><h2>El fin de las planillas rotas y los chats desordenados.</h2><p>Menos fricción manual, mayor precisión. Diseñado para personas, profesionales y organizaciones que valoran su tiempo.</p></header>
    <div className="comparison__table"><table><caption>Comparación de la gestión manual de gastos con Orbital Ctrl</caption><thead><tr><th scope="col">Funcionalidad</th><th scope="col">Gestión manual</th><th scope="col">Orbital Ctrl</th></tr></thead><tbody>{comparisons.map(item => <tr key={item.feature}><th scope="row">{item.feature}</th><td>{item.manual}</td><td><span><Check size={16} />{item.orbital}</span></td></tr>)}</tbody></table></div>
    <div className="comparison__mobile">{comparisons.map(item => <article key={item.feature}><h3>{item.feature}</h3><strong>Gestión manual</strong><p>{item.manual}</p><div><strong>Orbital Ctrl</strong><p><Check size={16} />{item.orbital}</p></div></article>)}</div>
  </section>;
}
