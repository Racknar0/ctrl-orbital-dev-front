'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from '../HomeIcon/HomeIcon';
import './SalasRapidasBanner.scss';

const demoRooms = [
  { code: 'ASAD-7X9K', name: 'Asado con los Pibes', emoji: '🥩', people: [['Juan', 52000, 'Carne y chorizos'], ['Sofía', 30000, 'Bebidas y hielo'], ['Lucas', 14000, 'Pan y carbón'], ['Mateo', 0, '']] },
  { code: 'BAR-4M2P', name: 'Previa y salida a bar', emoji: '🍻', people: [['Camila', 45000, 'Tragos'], ['Tomás', 35000, 'Cervezas'], ['Valen', 20000, 'Papas'], ['Nico', 0, '']] },
  { code: 'PIZZA-9K3L', name: 'Noche de pizzas', emoji: '🍕', people: [['Fede', 38000, 'Pizzas'], ['Mica', 22000, 'Bebidas'], ['Agustín', 0, '']] },
];

const money = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

export default function SalasRapidasBanner({ initialOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [room, setRoom] = useState(demoRooms[0]);
  const [code, setCode] = useState('');
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [detail, setDetail] = useState('');
  const [notice, setNotice] = useState('');
  const total = useMemo(() => room.people.reduce((sum, [, value]) => sum + value, 0), [room]);
  const share = room.people.length ? total / room.people.length : 0;

  const selectRoom = (selected) => {
    setRoom(selected);
    setNotice(`Sala ${selected.code} lista para explorar`);
  };

  const joinRoom = (event) => {
    event.preventDefault();
    const requested = code.trim().toUpperCase();
    if (!requested) return;
    const found = demoRooms.find((item) => item.code === requested);
    if (found) selectRoom(found);
    else {
      setRoom({ code: requested, name: 'Nueva sala de prueba', emoji: '🎉', people: [['Tú', 0, '']] });
      setNotice(`Sala ${requested} creada para esta vista previa`);
    }
    setCode('');
  };

  const addExpense = (event) => {
    event.preventDefault();
    if (!person.trim() || Number(amount) <= 0) return;
    setRoom((current) => {
      const exists = current.people.some(([name]) => name.toLowerCase() === person.trim().toLowerCase());
      const people = exists
        ? current.people.map(([name, value, item]) => name.toLowerCase() === person.trim().toLowerCase() ? [name, value + Number(amount), detail.trim() || item] : [name, value, item])
        : [...current.people, [person.trim(), Number(amount), detail.trim()]];
      return { ...current, people };
    });
    setNotice(`${person.trim()} agregó un gasto`);
    setPerson(''); setAmount(''); setDetail('');
  };

  return (
    <section className="quick-rooms" aria-labelledby="quick-rooms-title">
      {!isOpen ? <div className="quick-rooms__panel">
        <div className="quick-rooms__content">
          <span className="quick-rooms__badge"><Zap size={14} />Salas Rápidas · Cero Registro</span>
          <h2 id="quick-rooms-title">¿Un viaje, salida o actividad grupal?<br /><span>Dividan los gastos con un código.</span></h2>
          <p>Lleva tus finanzas diarias en tu propia app. Y cuando hagas una salida, viaje o asado con amigos o compañeros, abres una sala temporal: cada uno anota lo que pagó y se reparte la cuenta sin que nadie tenga que registrarse.</p>
          <div className="quick-rooms__benefits">{[['🎯','Acceso con código','Sin descargar apps ni crear cuentas.'],['⚖️','Reparto exacto','Cero enredos: cada uno paga lo justo.'],['📲','Datos de pago a un toque','Copia los datos para transferir.']].map(([icon,title,text])=><div key={title}><span aria-hidden="true">{icon}</span><div><strong>{title}</strong><small>{text}</small></div></div>)}</div>
        </div>
        <div className="quick-rooms__action"><Link href="/salas-rapidas">Abrir Salas Rápidas<ArrowRight size={16} /></Link><small>30 días de actividad · Sin registro</small></div>
      </div> : <div className="quick-rooms__app">
        <header className="quick-rooms__app-header">
          <div><span className="quick-rooms__badge"><Zap size={14} />Sala de prueba · Sin registro</span><h2 id="quick-rooms-title">Tu grupo, <span>cuenta clara.</span></h2></div>
          <button className="quick-rooms__back" type="button" onClick={() => onClose ? onClose() : setIsOpen(false)}>← Volver</button>
        </header>
        <div className="quick-rooms__workspace">
          <aside className="quick-rooms__sidebar">
            <form className="quick-rooms__join" onSubmit={joinRoom}><label htmlFor="quick-room-code">Entrar con código</label><div><input id="quick-room-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej. ASAD-7X9K"/><button type="submit" aria-label="Abrir sala"><ArrowRight size={16}/></button></div></form>
            <span className="quick-rooms__eyebrow">SALAS DE EJEMPLO</span>
            <div className="quick-rooms__room-list">{demoRooms.map((item) => <button className={room.code === item.code ? 'is-active' : ''} type="button" key={item.code} onClick={() => selectRoom(item)}><span>{item.emoji}</span><span><strong>{item.name}</strong><small>{item.code}</small></span><ArrowRight size={15}/></button>)}</div>
          </aside>
          <div className="quick-rooms__main">
            <div className="quick-rooms__summary"><div><span className="quick-rooms__eyebrow">SALA · {room.code}</span><h3>{room.emoji} {room.name}</h3><p>Comparte el código para que todos anoten sus gastos.</p></div><div className="quick-rooms__total"><small>GASTO DEL GRUPO</small><strong>{money(total)}</strong></div></div>
            <div className="quick-rooms__split"><span>Por persona</span><strong>{money(share)}</strong><small>{room.people.length} participantes</small></div>
            <div className="quick-rooms__people"><div className="quick-rooms__section-title"><h4>Participantes</h4><span>APORTÓ / BALANCE</span></div>{room.people.map(([name, value, item]) => <div className="quick-rooms__person" key={name}><span className="quick-rooms__avatar">{name.slice(0, 1).toUpperCase()}</span><span className="quick-rooms__person-info"><strong>{name}</strong><small>{item || 'Aún no agregó gastos'}</small></span><span className="quick-rooms__person-amount"><strong>{money(value)}</strong><small className={value >= share ? 'is-positive' : ''}>{value >= share ? 'Recibe' : 'Debe'} {money(Math.abs(value - share))}</small></span></div>)}</div>
            <form className="quick-rooms__expense" onSubmit={addExpense}><div className="quick-rooms__section-title"><h4>Anotar un gasto</h4><span>VISTA PREVIA</span></div><div className="quick-rooms__fields"><input aria-label="Tu nombre" value={person} onChange={(event) => setPerson(event.target.value)} placeholder="Tu nombre"/><input aria-label="Detalle" value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="¿Qué pagaste?"/><input aria-label="Valor" type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="$ Valor"/><button type="submit">+ Agregar</button></div></form>
          </div>
        </div>
        {notice && <p className="quick-rooms__notice" role="status">{notice}</p>}
      </div>}
    </section>
  );
}
