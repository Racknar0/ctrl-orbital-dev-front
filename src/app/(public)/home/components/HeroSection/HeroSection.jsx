"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Plus, Wallet, ShoppingBag, House, Check, TrendingUp, Building2, Briefcase, Monitor } from '../HomeIcon/HomeIcon.jsx'

import './HeroSection.scss'

const scenarios = {
  Individual: { name: 'Mi espacio personal', total: '$1.450.000', members: '1 usuario · 100% privado', label: 'Tus gastos de este mes', activity: 'Tu actividad diaria', caption: 'Solo visible para ti', message: 'Tus finanzas, en orden.', rows: [['Suscripciones & Servicios', '$120.000', Monitor], ['Compras del mes', '$480.000', ShoppingBag]], bars: [35, 50, 42, 68, 55, 75, 60] },
  'Equipos & Proyectos': { name: 'Proyecto compartido', total: '$2.800.000', members: 'Tú y 3 integrantes', label: 'Presupuesto común', activity: 'Gastos colaborativos', caption: 'Sincronizado entre miembros', message: 'Coordinación en equilibrio.', rows: [['Insumos & Operaciones', '$850.000', Briefcase], ['Espacio de trabajo', '$1.950.000', House]], bars: [45, 62, 58, 85, 70, 92, 80] },
  Organizaciones: { name: 'Gestión corporativa', total: '$6.500.000', members: 'Administración · Múltiples áreas', label: 'Rendición consolidada', activity: 'Gastos por área', caption: 'Rendición con comprobantes', message: 'Transparencia corporativa.', rows: [['Herramientas & Licencias', '$1.800.000', Monitor], ['Viáticos & Representación', '$4.700.000', Building2]], bars: [50, 68, 72, 88, 76, 94, 98] },
}
const categories = Object.keys(scenarios)
export default function HeroSection() {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [paused, setPaused] = useState(false)
  const activeCategory = categories[categoryIndex]
  const data = scenarios[activeCategory]
  const selectCategory = index => {
    setTransitioning(false)
    setCategoryIndex(index)
  }
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let interval
    let transitionTimer
    const configure = () => {
      clearInterval(interval)
      clearTimeout(transitionTimer)
      setTransitioning(false)
      if (paused || motion.matches) return
      interval = setInterval(() => {
        if (document.hidden) return
        setTransitioning(true)
        transitionTimer = setTimeout(() => {
          setCategoryIndex(index => (index + 1) % categories.length)
          setTransitioning(false)
        }, 220)
      }, 5000)
    }
    configure()
    motion.addEventListener('change', configure)
    return () => {
      clearInterval(interval)
      clearTimeout(transitionTimer)
      motion.removeEventListener('change', configure)
    }
  }, [paused])
  const editorialRef = useRef(null)
  const showcaseRef = useRef(null)
  const previewRef = useRef(null)
  useLayoutEffect(() => {
    const editorial = editorialRef.current
    const showcase = showcaseRef.current
    const preview = previewRef.current
    const fitPreview = () => {
      const scale = Math.min(1, Math.max(0, editorial.offsetHeight - 56) / preview.offsetHeight, Math.max(0, showcase.clientWidth - 56) / preview.offsetWidth)
      showcase.style.setProperty('--preview-scale', String(scale))
    }
    const observer = new ResizeObserver(fitPreview)
    observer.observe(editorial)
    observer.observe(showcase)
    observer.observe(preview)
    fitPreview()
    return () => observer.disconnect()
  }, [])
  return <section className="premium-hero">
    <div className="hero-editorial" ref={editorialRef}>
      <span className="hero-eyebrow">● &nbsp; GESTIÓN DE GASTOS PERSONAL Y COMPARTIDA</span>
      <h1 className="hero-heading-balanced">Control de gastos.<br />Para ti solo.<br /><span className="hero-heading-accent">O para cualquier equipo.</span></h1>
      <p>Lleva tus cuentas personales con total privacidad. Si necesitas coordinar gastos con alguien más o con tu equipo, sincroniza en un solo toque.</p>
      <ul className="hero-use-cases" aria-label="Diseñado para compartir" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
        {categories.map((name, index) => <li key={name} className={activeCategory === name ? 'category-highlight' : ''} onMouseEnter={() => selectCategory(index)}><button type="button" aria-pressed={activeCategory === name} onFocus={() => selectCategory(index)} onClick={() => selectCategory(index)}><Check size={16} strokeWidth={2.5} aria-hidden="true" /><span>{name}</span></button></li>)}
      </ul>
      <div className="hero-actions"><Link prefetch={false} className="premium-primary" href="/login?mode=register">Comenzar gratis <ArrowUpRight size={18} /></Link></div>
      <p className="hero-cta-note"><TrendingUp size={14} strokeWidth={1.7} aria-hidden="true" />Funciona para una persona sola, una pareja o un equipo entero.</p>
    </div>
    <div className={`hero-showcase${transitioning ? ' scenario-transitioning' : ''}`} ref={showcaseRef} aria-label={`Vista de ejemplo para ${activeCategory.toLowerCase()}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
      <div className="finance-preview" ref={previewRef}>
        <div className="preview-header"><span><Wallet size={19} /> Mi espacio</span><b>A</b></div>
        <div className="preview-group"><small>RESUMEN DEL GRUPO</small><h2>{data.name}</h2><p>{data.members}</p></div>
        <div className="preview-balance"><span>{data.label}</span><strong>{data.total}<small> COP</small></strong><div><span>● Este mes</span><span>Todo en un solo lugar ↗</span></div></div>
        <div className="preview-chart"><div className="preview-section-title"><h3>{data.activity}</h3><span>Esta semana</span></div><div className="chart-bars">{data.bars.map((height, i) => <div key={i}><span style={{ height: `${height}%` }} /><small>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</small></div>)}</div></div>
        <div className="preview-transactions"><div className="preview-section-title"><h3>Últimos movimientos</h3><span>Ver todos</span></div>{data.rows.map(([name, amount, Icon]) => <div className="transaction-row" key={name}><span><Icon size={17} /></span><div><strong>{name}</strong><small>{data.caption}</small></div><b>{amount}</b></div>)}</div>
        <Link prefetch={false} href="/dashboard" className="preview-add"><Plus size={16} /> Registrar un gasto <ArrowUpRight size={15} /></Link>
      </div>
      <div className="floating-settled"><span><Check size={17} /></span><div><strong>{data.message}</strong><small>Más tiempo para lo que importa.</small></div></div>
    </div>
  </section>
}
