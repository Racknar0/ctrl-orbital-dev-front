'use client';

import { useEffect, useRef, useState } from 'react';
import { loadRoomSessions, roomRequest, saveRoomSession } from '@/services/QuickRoomService';
import './QuickRoomsView.scss';

const money = (cents) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(cents / 100);
const amountCents = (value) => Math.round(Number(value) * 100);
const field = (form, name) => String(form.get(name) || '').trim();
const failure = (error) => error.response?.data?.message || 'No pudimos conectar. Comprueba que el backend esté encendido.';

export default function QuickRoomsView() {
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState(null);
  const [room, setRoom] = useState(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null);
  const revision = useRef(0);
  const mutationInFlight = useRef(false);

  useEffect(() => {
    let active = true;
    loadRoomSessions().then(({ sessions: saved, code: invitation }) => {
      if (!active) return;
      setSessions(saved); setCode(invitation); setReady(true);
      const selected = invitation ? saved.find((s) => s.code === invitation) : saved[0];
      if (selected) setSession(selected);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!session) return;
    let active = true;
    async function refresh() {
      if (mutationInFlight.current) return;
      const current = revision.current;
      try {
        const data = await roomRequest('get', session.code, session.token);
        if (active && current === revision.current) setRoom(data);
      } catch (error) { if (active) setNotice(failure(error)); }
    }
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => { active = false; clearInterval(timer); };
  }, [session]);

  async function run(work, message) {
    if (mutationInFlight.current) return false;
    mutationInFlight.current = true;
    revision.current += 1;
    setBusy(true); setNotice('');
    try { await work(); setNotice(message); return true; }
    catch (error) { setNotice(failure(error)); return false; }
    finally { revision.current += 1; mutationInFlight.current = false; setBusy(false); }
  }

  function accept(result) {
    const saved = { code: result.room.invitationCode, token: result.token, name: result.room.name };
    setSessions(saveRoomSession(sessions, saved)); setSession(saved); setRoom(result.room); setEditing(null);
    window.history.replaceState(null, '', `/salas-rapidas?sala=${saved.code}`);
  }

  function selectSession(saved) {
    revision.current += 1;
    setRoom(null); setSession({ ...saved }); setEditing(null); setNotice('');
    window.history.replaceState(null, '', `/salas-rapidas?sala=${saved.code}`);
  }

  function enter(event, create) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const requested = field(form, 'code').toUpperCase();
    const existing = sessions.find((s) => s.code === requested);
    if (!create && existing) { selectSession(existing); return; }
    run(async () => {
      const result = await roomRequest('post', create ? '' : requested, '', create ? '' : '/join', {
        name: field(form, 'name'), displayName: field(form, 'displayName'),
      });
      accept(result);
    }, create ? 'Sala creada. Comparte el enlace para sumar personas.' : 'Ya estás dentro de la sala.');
  }

  const me = room?.participants.find((p) => p.id === room.me);
  const editableExpense = room?.settlements.length ? null : editing;
  const person = (id) => room.participants.find((p) => p.id === id)?.displayName || 'Participante';
  async function change(method, suffix, data, message) {
    return run(async () => {
      const result = await roomRequest(method, session.code, session.token, suffix, data);
      setRoom(result); setEditing(null);
    }, message);
  }
  async function copy(value) {
    try { await navigator.clipboard.writeText(value); setNotice('Copiado al portapapeles.'); }
    catch { setNotice(`Copia este dato: ${value}`); }
  }

  return <section className="rooms-view" aria-labelledby="rooms-title">
    <header className="rooms-view__heading"><div><span className="rooms-view__eyebrow">Salas rápidas · Sin registro</span><h1 id="rooms-title">Cuentas claras,<br /><em>planes compartidos.</em></h1><p>Crea una sala, comparte el enlace y reparte los gastos con tu grupo.</p></div><span className="rooms-view__pill">30 días de actividad · COP</span></header>
    <div role="status" aria-live="polite" className="rooms-view__notice">{busy ? 'Guardando…' : notice}</div>
    {sessions.length > 0 && <nav className="rooms-view__saved" aria-label="Tus salas en este navegador">{sessions.map((s) => <button key={s.code} type="button" disabled={busy} aria-pressed={session?.code === s.code} onClick={() => selectSession(s)}>{s.name || s.code}</button>)}<button type="button" disabled={busy} onClick={() => { revision.current += 1; setSession(null); setRoom(null); setCode(''); setEditing(null); window.history.replaceState(null, '', '/salas-rapidas'); }}>+ Crear o entrar</button></nav>}
    {!ready && <p>Cargando tus salas…</p>}
    {ready && !session && <div className="rooms-view__entry">
      <form className="rooms-view__card" onSubmit={(e) => enter(e, true)}><span className="rooms-view__eyebrow">Organiza un plan</span><h2>Crear una sala</h2><p>El organizador puede corregir gastos y cerrar la sala.</p><label>Nombre de la sala<input name="name" placeholder="Viaje a Cartagena" maxLength={80} required /></label><label>Tu nombre<input name="displayName" placeholder="¿Cómo te llama el grupo?" maxLength={50} required /></label><button className="rooms-view__primary" disabled={busy}>Crear sala</button></form>
      <form className="rooms-view__card" onSubmit={(e) => enter(e, false)}><span className="rooms-view__eyebrow">Ya tienes invitación</span><h2>Entrar a una sala</h2><p>Quien tenga el enlace o código puede unirse mientras esté abierta.</p><label>Código de invitación<input name="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={16} placeholder="Código de 16 caracteres" required /></label><label>Tu nombre<input name="displayName" maxLength={50} placeholder="Tu nombre en esta sala" required /></label><button className="rooms-view__primary" disabled={busy}>Entrar al grupo</button></form>
      <p className="rooms-view__hint">Tu acceso se conserva en este navegador. Para probar otra persona, abre la invitación en una ventana incógnita. Si borras los datos del navegador perderás tu acceso de invitado.</p>
    </div>}
    {session && !room && <p>Cargando sala… <button type="button" onClick={() => setSession(null)}>Volver al acceso</button></p>}
    {room && me && <>
      <article className="rooms-view__card rooms-view__room-heading"><div><span className="rooms-view__eyebrow">{room.writable ? 'Sala abierta' : 'Solo consulta'} · {me.displayName}{me.role === 'OWNER' ? ' · Organizador' : ''}</span><h2>{room.name}</h2><p>Actividad hasta {new Date(room.expiresAt).toLocaleDateString('es-CO')}. Compartir el enlace permite entrar al grupo.</p><code>{room.invitationCode}</code></div><div className="rooms-view__actions"><button disabled={busy} type="button" onClick={() => copy(`${window.location.origin}/salas-rapidas?sala=${room.invitationCode}`)}>Copiar invitación</button>{me.role === 'OWNER' && room.writable && <button disabled={busy} type="button" onClick={() => { if (window.confirm('¿Cerrar la sala? Quedará en consulta y no permitirá nuevos gastos ni pagos.')) change('post', '/close', {}, 'Sala cerrada.'); }}>Cerrar sala</button>}</div></article>
      <div className="rooms-view__stats"><div><span>Gastos del grupo</span><strong>{money(room.total)}</strong></div><div><span>{me.balance > 0 ? 'Debes recibir' : me.balance < 0 ? 'Te falta pagar' : 'Tu saldo'}</span><strong>{money(Math.abs(me.balance))}</strong></div><div><span>Participantes</span><strong>{room.participants.length}</strong></div></div>
      <div className="rooms-view__columns"><div>
        <article className="rooms-view__card"><h2>El grupo y sus saldos</h2><p>Los saldos incluyen únicamente los pagos confirmados.</p>{room.participants.map((p) => <div className="rooms-view__row" key={p.id}><div><strong>{p.displayName}{p.id === me.id ? ' (tú)' : ''}</strong><small>{p.role === 'OWNER' ? 'Organizador' : 'Participante'}</small>{p.paymentReference && <button type="button" className="rooms-view__copy" onClick={() => copy(`${p.paymentMethod}: ${p.paymentReference}${p.paymentHolder ? ` · ${p.paymentHolder}` : ''}`)}>{p.paymentMethod}: {p.paymentReference}{p.paymentHolder && ` · ${p.paymentHolder}`} · Copiar</button>}</div><span className={p.balance > 0 ? 'rooms-view__positive' : ''}>{p.balance > 0 ? 'Recibe ' : p.balance < 0 ? 'Debe ' : ''}{money(Math.abs(p.balance))}</span></div>)}</article>
        <article className="rooms-view__card"><h2>Gastos registrados</h2>{room.expenses.length === 0 && <p>Todavía no hay gastos. Invita al grupo antes de registrar los gastos que compartirán.</p>}{room.expenses.map((expense) => <div className="rooms-view__expense" key={expense.id}><div className="rooms-view__row"><div><strong>{expense.description}</strong><small>Pagó {person(expense.paidByParticipantId)} · Registró {person(expense.createdByParticipantId)}</small></div><strong>{money(amountCents(expense.amount))}</strong></div><small>Reparto: {expense.shares.map((s) => `${person(s.participantId)} ${money(amountCents(s.amount))}`).join(' · ')}</small>{room.writable && !room.settlements.length && (expense.createdByParticipantId === me.id || me.role === 'OWNER') && <div className="rooms-view__actions"><button type="button" disabled={busy} onClick={() => setEditing(expense)}>Editar</button><button type="button" disabled={busy} onClick={() => { if (window.confirm('¿Eliminar este gasto?')) change('delete', `/expenses/${expense.id}`, undefined, 'Gasto eliminado.'); }}>Eliminar</button></div>}</div>)}</article>
        <article className="rooms-view__card"><h2>Pagos para saldar cuentas</h2><p>La transferencia se realiza fuera de Orbital. El destinatario confirma que recibió el dinero.</p>{room.settlements.length === 0 && <p>Aún no hay pagos reportados.</p>}{room.settlements.map((payment) => <div className="rooms-view__expense" key={payment.id}><strong>{person(payment.fromParticipantId)} → {person(payment.toParticipantId)} · {money(amountCents(payment.amount))}</strong><small>{payment.status === 'CONFIRMED' ? 'Recepción confirmada' : 'Pendiente de confirmar'}</small>{room.writable && payment.status === 'REPORTED' && <div className="rooms-view__actions">{payment.toParticipantId === me.id && <button disabled={busy} type="button" onClick={() => change('post', `/payments/${payment.id}/confirm`, {}, 'Pago confirmado. Saldo actualizado.')}>Confirmar que recibí</button>}{[payment.fromParticipantId, payment.toParticipantId].includes(me.id) && <button type="button" disabled={busy} onClick={() => change('delete', `/payments/${payment.id}`, undefined, 'Reporte cancelado.')}>Cancelar reporte</button>}</div>}</div>)}</article>
      </div><aside>
        {room.writable && <ExpenseForm key={`${room.id}-${editableExpense?.id || 'new'}`} room={room} me={me} expense={editableExpense} busy={busy} cancel={() => setEditing(null)} submit={(payload) => change(editableExpense ? 'patch' : 'post', `/expenses${editableExpense ? `/${editableExpense.id}` : ''}`, payload, editableExpense ? 'Gasto actualizado.' : 'Gasto registrado.')} />}
        {room.writable && room.settlements.length > 0 && <div className="rooms-view__card"><h2>Historial de cuentas</h2><p>Puedes seguir agregando gastos. Para conservar el historial, los gastos anteriores no se editan mientras haya pagos. Los reportes pendientes pueden cancelarse; los pagos confirmados son definitivos en esta primera versión.</p></div>}
        {room.writable && me.balance < 0 && <form className="rooms-view__card" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); change('post', '/payments', { toParticipantId: field(f, 'to'), amount: field(f, 'amount') }, 'Pago reportado. Falta confirmación del destinatario.'); }}><h2>Ya hice una transferencia</h2><label>Destinatario<select name="to" required><option value="">Elige a quién pagaste</option>{room.participants.filter((p) => p.id !== me.id && p.balance > 0).map((p) => <option key={p.id} value={p.id}>{p.displayName} · recibe {money(p.balance)}</option>)}</select></label><label>Valor pagado<input name="amount" type="number" min="0.01" max={Math.abs(me.balance) / 100} step="0.01" required /></label><button className="rooms-view__primary" disabled={busy}>Reportar pago</button></form>}
        <ProfileForm key={`${room.id}-${me.id}`} me={me} busy={busy} writable={room.writable} submit={(payload) => change('patch', '/me', payload, 'Datos de pago guardados.')} />
        {!room.writable && <div className="rooms-view__card"><h2>Sala en consulta</h2><p>Esta sala se cerró o llegó a sus 30 días de actividad. Puedes revisar los gastos y saldos.</p></div>}
      </aside></div>
    </>}
  </section>;
}

function ExpenseForm({ room, me, expense, busy, cancel, submit }) {
  return <form className="rooms-view__card" onSubmit={async (event) => {
    event.preventDefault(); const element = event.currentTarget; const f = new FormData(element);
    const saved = await submit({ description: field(f, 'description'), amount: field(f, 'amount'), paidByParticipantId: field(f, 'payer'), participantIds: f.getAll('participants') });
    if (saved && !expense) element.reset();
  }}><h2>{expense ? 'Editar gasto' : 'Anotar un gasto'}</h2><label>¿Qué se pagó?<input name="description" defaultValue={expense?.description || ''} maxLength={160} required placeholder="Mercado para el viaje" /></label><label>Valor total (COP)<input name="amount" type="number" defaultValue={expense?.amount || ''} step="0.01" min="0.01" max="1000000000" required /></label><label>¿Quién pagó?<select name="payer" defaultValue={expense?.paidByParticipantId || me.id}>{room.participants.map((p) => <option value={p.id} key={p.id}>{p.displayName}{p.id === me.id ? ' (tú)' : ''}</option>)}</select></label><fieldset><legend>Repartir por igual entre</legend>{room.participants.map((p) => <label className="rooms-view__check" key={p.id}><input type="checkbox" name="participants" value={p.id} defaultChecked={!expense || expense.shares.some((s) => s.participantId === p.id)} />{p.displayName}</label>)}</fieldset><p>El reparto queda guardado. Quienes entren después no se suman a este gasto.</p><button className="rooms-view__primary" disabled={busy}>{expense ? 'Guardar cambios' : 'Registrar gasto'}</button>{expense && <button type="button" onClick={cancel}>Cancelar edición</button>}</form>;
}

function ProfileForm({ me, busy, writable, submit }) {
  return <form className="rooms-view__card" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); submit(Object.fromEntries(f)); }}><h2>Tu perfil en esta sala</h2><p>Los datos de pago son opcionales y visibles para el grupo.</p><fieldset disabled={!writable || busy}><label>Tu nombre<input name="displayName" defaultValue={me.displayName} maxLength={50} required /></label><label>Método para recibir dinero<input name="paymentMethod" defaultValue={me.paymentMethod || ''} placeholder="Nequi, Bre-B, Yape, cuenta…" maxLength={100} /></label><label>Número, cuenta o llave<input name="paymentReference" defaultValue={me.paymentReference || ''} maxLength={100} /></label><label>Nombre del titular<input name="paymentHolder" defaultValue={me.paymentHolder || ''} maxLength={100} /></label><button className="rooms-view__primary">Guardar mis datos</button></fieldset></form>;
}
