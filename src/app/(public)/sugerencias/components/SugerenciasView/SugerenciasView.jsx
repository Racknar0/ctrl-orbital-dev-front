'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Lightbulb, MessageSquare, Send, ThumbsUp } from '../../../home/components/HomeIcon/HomeIcon';
import './SugerenciasView.scss';

const ideas = [
  {
    category: 'Planeación',
    title: 'Presupuestos que se ajustan a tu ritmo',
    description: 'Organiza tus metas mensuales y anticipa gastos importantes con más flexibilidad.',
    votes: 28,
    status: 'En exploración',
    tone: 'gold',
  },
  {
    category: 'Análisis',
    title: 'Un resumen financiero para cada semana',
    description: 'Consulta tus movimientos, categorías y avances recientes de un vistazo.',
    votes: 19,
    status: 'Próximamente',
    tone: 'green',
  },
  {
    category: 'Organización',
    title: 'Etiquetas personalizadas para tus gastos',
    description: 'Agrupa tus compras a tu manera y encuentra cada movimiento fácilmente.',
    votes: 12,
    status: 'En exploración',
    tone: 'slate',
  },
];

export default function SugerenciasView() {
  const [category, setCategory] = useState('Experiencia general');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [votes, setVotes] = useState(ideas.map(idea => idea.votes));
  const [voted, setVoted] = useState([]);

  function submitSuggestion(event) {
    event.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
  }

  function supportIdea(index) {
    if (voted.includes(index)) return;
    setVotes(current => current.map((count, item) => item === index ? count + 1 : count));
    setVoted(current => [...current, index]);
  }

  return (
    <div className="suggestions-view">
      <div className="suggestions-view__container">
        <Link className="suggestions-view__back" href="/">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <section className="suggestions-hero" aria-labelledby="suggestions-title">
          <div className="suggestions-hero__copy">
            <span className="suggestions-eyebrow"><Lightbulb size={15} /> Tu voz mejora Orbital</span>
            <h1 id="suggestions-title">Hagamos que tu dinero <em>trabaje mejor.</em></h1>
            <p>Cuéntanos qué te gustaría encontrar en Orbital Ctrl. Tus ideas nos ayudan a construir una experiencia financiera más útil para todos.</p>
            <div className="suggestions-hero__notes">
              <span><i /> Ideas reales, mejoras reales</span>
              <span><MessageSquare size={15} /> Solo toma un minuto</span>
            </div>
          </div>

          <form className="suggestion-form" onSubmit={submitSuggestion}>
            <div className="suggestion-form__heading">
              <span className="suggestion-form__icon"><Lightbulb size={19} /></span>
              <div><h2>Comparte una idea</h2><p>¿Qué haría tu experiencia más sencilla?</p></div>
            </div>

            <label htmlFor="suggestion-category">¿Sobre qué trata?</label>
            <select id="suggestion-category" value={category} onChange={event => setCategory(event.target.value)}>
              <option>Experiencia general</option>
              <option>Presupuestos y metas</option>
              <option>Registro de gastos</option>
              <option>Reportes y análisis</option>
              <option>Otra idea</option>
            </select>

            <label htmlFor="suggestion-message">Tu sugerencia</label>
            <textarea id="suggestion-message" value={message} onChange={event => { setMessage(event.target.value); setSent(false); }} maxLength={500} rows={4} placeholder="Me gustaría poder…" />
            <div className="suggestion-form__meta"><span>No incluyas datos personales</span><span>{message.length}/500</span></div>

            {sent && <p className="suggestion-form__success" role="status"><Check size={17} /> ¡Gracias! Tu idea quedó registrada en esta demostración.</p>}
            <button className="suggestion-form__submit" type="submit" disabled={!message.trim()}>
              Enviar sugerencia <Send size={15} />
            </button>
            <p className="suggestion-form__local-note">Demostración visual: el envío no se guarda ni se transmite.</p>
          </form>
        </section>

        <section className="suggestions-board" aria-labelledby="suggestions-board-title">
          <div className="suggestions-board__heading">
            <div>
              <span className="suggestions-board__eyebrow">Construimos en comunidad</span>
              <h2 id="suggestions-board-title">Ideas que ya están sobre la mesa</h2>
              <p>Estas son algunas mejoras que nos encantaría explorar.</p>
            </div>
            <span className="suggestions-board__status"><i /> Vista previa de la comunidad</span>
          </div>

          <div className="suggestion-cards">
            {ideas.map((idea, index) => (
              <article className="suggestion-card" key={idea.title}>
                <div className="suggestion-card__meta"><span className={`suggestion-card__category suggestion-card__category--${idea.tone}`}>{idea.category}</span><span>{idea.status}</span></div>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
                <div className="suggestion-card__footer">
                  <span><ThumbsUp size={14} /> {votes[index]} apoyos</span>
                  <button type="button" onClick={() => supportIdea(index)} disabled={voted.includes(index)} aria-pressed={voted.includes(index)}>
                    {voted.includes(index) ? 'Apoyada' : 'Apoyar'} <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="suggestions-signoff">
            <span className="suggestions-signoff__icon"><Check size={18} /></span>
            <div><strong>Cada mejora empieza con una conversación.</strong><p>Gracias por ayudarnos a construir una mejor relación con tu dinero.</p></div>
            <Link href="/dashboard">Explorar Orbital Ctrl <ArrowRight size={14} /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
