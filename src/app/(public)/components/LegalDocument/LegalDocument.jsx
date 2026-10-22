import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Receipt } from '../../home/components/HomeIcon/HomeIcon';
import HomeFooter from '../../home/components/HomeFooter/HomeFooter';
import { legalDocuments } from './legalContent';
import '../../home/Home.scss';
import './LegalDocument.scss';

export default function LegalDocument({ type }) {
  const document = legalDocuments[type];

  return (
    <div className="home legal-document">
      <a className="home__skip" href="#contenido">Saltar al contenido</a>
      <header className="legal-document__header">
        <Link className="legal-document__brand" href="/" aria-label="Orbital Ctrl, inicio"><Image src="/equa-logo.png" alt="" width={36} height={36} /><span>Orbital Ctrl<small>by Orbital Dev</small></span></Link>
        <Link className="legal-document__back" href="/"><ArrowLeft size={16} /> Volver al inicio</Link>
      </header>
      <main id="contenido" className="legal-document__container">
        <div className="legal-document__hero">
          <span className="legal-document__eyebrow"><Receipt size={16} /> Información legal</span>
          <h1>{document.title}</h1>
          <p>{document.description}</p>
          <div className="legal-document__meta"><span>Contenido de ejemplo</span><span>Revisión: <time dateTime="2026-10-22">22 de octubre de 2026</time></span></div>
        </div>
        <nav className="legal-document__tabs" aria-label="Documentos legales">
          <Link href="/terminos" aria-current={type === 'terms' ? 'page' : undefined}>Términos y condiciones</Link>
          <Link href="/privacidad" aria-current={type === 'privacy' ? 'page' : undefined}>Política de privacidad</Link>
        </nav>
        <div className="legal-document__layout">
          <aside className="legal-document__index"><span>EN ESTA PÁGINA</span><nav aria-label="Índice del documento">{document.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>)}</nav></aside>
          <div className="legal-document__body">
            <div className="legal-document__summary"><span>Para tener en cuenta</span><p>{document.summary}</p></div>
            {document.sections.map((section, index) => <section className="legal-document__section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}><span className="legal-document__number">{String(index + 1).padStart(2, '0')}</span><div><h2 id={`${section.id}-title`}>{section.title}</h2>{section.paragraphs.map((text) => <p key={text}>{text}</p>)}</div></section>)}
            <div className="legal-document__contact"><div><h2>¿Tienes alguna pregunta?</h2><p>Contacto de ejemplo · ejemplo@ejemplo.com</p></div><Link href={type === 'terms' ? '/privacidad' : '/terminos'}>{type === 'terms' ? 'Leer política de privacidad' : 'Leer términos y condiciones'}<ArrowRight size={16} /></Link></div>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
