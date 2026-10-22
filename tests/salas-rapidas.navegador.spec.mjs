import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

// Este set requiere back/ y front/ como carpetas hermanas y sus servidores locales activos.
const backendPath = fileURLToPath(new URL('../../back/', import.meta.url));
const backendRequire = createRequire(path.join(backendPath, 'package.json'));
const env = backendRequire('dotenv').config({ path: path.join(backendPath, '.env'), quiet: true }).parsed;
const database = new URL(env.DATABASE_URL);
if (!['localhost', '127.0.0.1'].includes(database.hostname) || database.pathname !== '/app_gastos') {
  throw new Error('Las pruebas E2E solo admiten la base local app_gastos.');
}
const { PrismaClient } = backendRequire('@prisma/client');
const db = new PrismaClient({ datasourceUrl: env.DATABASE_URL });
const prefix = `E2E-${randomUUID().slice(0, 8)}`;
const createForm = (page) => page.locator('form').filter({ has: page.getByRole('heading', { name: 'Crear una sala', exact: true }) });
const joinForm = (page) => page.locator('form').filter({ has: page.getByRole('heading', { name: 'Entrar a una sala', exact: true }) });
const expenseForm = (page, editing = false) => page.locator('form').filter({ has: page.getByRole('heading', { name: editing ? 'Editar gasto' : 'Anotar un gasto', exact: true }) });

async function create(page, suffix, who = 'Camilo') {
  await page.goto('/salas-rapidas');
  const form = createForm(page);
  await form.getByLabel('Nombre de la sala').fill(`${prefix}-${suffix}`);
  await form.getByLabel('Tu nombre', { exact: true }).fill(who);
  await form.getByRole('button', { name: 'Crear sala', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Sala creada. Comparte el enlace para sumar personas.');
  return new URL(page.url()).searchParams.get('sala');
}
async function addExpense(page, description, amount) {
  const form = expenseForm(page);
  await form.getByLabel('¿Qué se pagó?').fill(description);
  await form.getByLabel('Valor total (COP)', { exact: true }).fill(amount);
  await form.getByRole('button', { name: 'Registrar gasto', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Gasto registrado.');
}

test.afterEach(async () => {
  const rooms = await db.quickRoom.findMany({ where: { name: { startsWith: prefix } }, select: { id: true } });
  for (const { id: roomId } of rooms) await db.$transaction(async (tx) => {
    await tx.quickRoomSettlement.deleteMany({ where: { roomId } });
    await tx.quickRoomExpense.deleteMany({ where: { roomId } });
    await tx.quickRoomParticipant.deleteMany({ where: { roomId } });
    await tx.quickRoom.delete({ where: { id: roomId } });
  });
});
test.afterAll(async () => { await db.$disconnect(); });

test('dos invitados: gasto compartido, pago, confirmación y cierre', async ({ page, browser }) => {
  const code = await create(page, 'viaje');
  const context = await browser.newContext();
  const guest = await context.newPage();
  try {
    await guest.goto(`http://localhost:3001/salas-rapidas?sala=${code}`);
    await joinForm(guest).getByLabel('Tu nombre', { exact: true }).fill('Laura');
    await joinForm(guest).getByRole('button', { name: 'Entrar al grupo' }).click();
    await expect(guest.getByRole('status')).toHaveText('Ya estás dentro de la sala.');
    await expect(expenseForm(page).getByRole('checkbox', { name: 'Laura', exact: true })).toBeChecked();
    await addExpense(page, 'Carne y bebidas', '100000');
    await expect(expenseForm(page).getByLabel('¿Qué se pagó?')).toBeEmpty();
    await expect(guest.getByText('Te falta pagar', { exact: true })).toBeVisible();
    const payment = guest.locator('form').filter({ has: guest.getByRole('heading', { name: 'Ya hice una transferencia' }) });
    await payment.getByLabel('Destinatario').selectOption({ index: 1 });
    await payment.getByLabel('Valor pagado').fill('50000');
    await payment.getByRole('button', { name: 'Reportar pago' }).click();
    await expect(guest.getByRole('status')).toHaveText('Pago reportado. Falta confirmación del destinatario.');
    await expect(page.getByRole('button', { name: 'Confirmar que recibí' })).toBeVisible();
    await page.getByRole('button', { name: 'Confirmar que recibí' }).click();
    await expect(page.getByText('Recepción confirmada', { exact: true })).toBeVisible();
    await expect(guest.getByText('Tu saldo', { exact: true })).toBeVisible();
    await addExpense(page, 'Un gasto después de pagar', '20000');
    await expect(guest.getByText('Te falta pagar', { exact: true })).toBeVisible();
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Cerrar sala', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Sala en consulta' })).toBeVisible();
    await expect(guest.getByRole('heading', { name: 'Sala en consulta' })).toBeVisible();
    await expect(expenseForm(guest)).toHaveCount(0);
  } finally { await context.close(); }
});

test('persiste la sesión y permite participar en varias salas', async ({ page }) => {
  const first = await create(page, 'primera');
  await page.getByRole('button', { name: '+ Crear o entrar' }).click();
  await createForm(page).getByLabel('Nombre de la sala').fill(`${prefix}-segunda`);
  await createForm(page).getByLabel('Tu nombre', { exact: true }).fill('Camilo');
  await createForm(page).getByRole('button', { name: 'Crear sala', exact: true }).click();
  await expect(page.getByRole('heading', { name: `${prefix}-segunda`, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: `${prefix}-segunda`, exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Tus salas en este navegador' }).getByRole('button', { name: `${prefix}-primera`, exact: true }).click();
  await expect(page.getByRole('heading', { name: `${prefix}-primera`, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: `${prefix}-primera`, exact: true })).toBeVisible();
  const room = await db.quickRoom.findUnique({ where: { invitationCode: first }, include: { participants: true } });
  expect(room.participants).toHaveLength(1);
});

test('crear, editar y eliminar un gasto desde la interfaz', async ({ page }) => {
  await create(page, 'crud');
  await addExpense(page, 'Compra inicial', '12000');
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  await expenseForm(page, true).getByLabel('¿Qué se pagó?').fill('Compra corregida');
  await expenseForm(page, true).getByLabel('Valor total (COP)', { exact: true }).fill('15000');
  await expenseForm(page, true).getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  await expect(page.getByText('Compra corregida', { exact: true })).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Gasto eliminado.');
  await expect(page.getByText('Compra corregida', { exact: true })).toHaveCount(0);
});

test('datos de pago opcionales y validación de campos relacionados', async ({ page }) => {
  await create(page, 'perfil');
  const profile = page.locator('form').filter({ has: page.getByRole('heading', { name: 'Tu perfil en esta sala' }) });
  await profile.getByLabel('Método para recibir dinero').fill('Nequi');
  await profile.getByRole('button', { name: 'Guardar mis datos' }).click();
  await expect(page.getByRole('status')).toHaveText('Indica el método y su número o llave, o deja ambos vacíos.');
  await profile.getByLabel('Número, cuenta o llave').fill('3000000000');
  await profile.getByLabel('Nombre del titular').fill('Camilo de prueba');
  await profile.getByRole('button', { name: 'Guardar mis datos' }).click();
  await expect(page.getByRole('status')).toHaveText('Datos de pago guardados.');
  await expect(page.getByRole('button', { name: /Nequi: 3000000000/ })).toBeVisible();
  await page.reload();
  await expect(profile.getByLabel('Número, cuenta o llave')).toHaveValue('3000000000');
});

test('móvil sin desbordamiento y sala vencida en consulta', async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const code = await create(page, 'movil');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await db.quickRoom.update({ where: { invitationCode: code }, data: { expiresAt: new Date(Date.now() - 1000) } });
  await expect(page.getByRole('heading', { name: 'Sala en consulta' })).toBeVisible();
  const profile = page.locator('form').filter({ has: page.getByRole('heading', { name: 'Tu perfil en esta sala' }) });
  await expect(profile.getByRole('button', { name: 'Guardar mis datos' })).toBeDisabled();
  const context = await browser.newContext();
  try {
    const guest = await context.newPage();
    await guest.goto(`http://localhost:3001/salas-rapidas?sala=${code}`);
    await joinForm(guest).getByLabel('Tu nombre', { exact: true }).fill('Invitado tarde');
    await joinForm(guest).getByRole('button', { name: 'Entrar al grupo' }).click();
    await expect(guest.getByRole('status')).toHaveText('La sala está cerrada o venció.');
  } finally { await context.close(); }
});

test('código inexistente muestra un error comprensible', async ({ page }) => {
  await page.goto('/salas-rapidas?sala=NOEXISTE');
  await joinForm(page).getByLabel('Tu nombre', { exact: true }).fill('Invitado');
  await joinForm(page).getByRole('button', { name: 'Entrar al grupo' }).click();
  await expect(page.getByRole('status')).toHaveText('La sala no existe.');
  await expect(joinForm(page)).toBeVisible();
});
