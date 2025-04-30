const request = require('supertest');
const express = require('express');
const app = express();
const accionController = require('../accionController');

// Middlewares
app.use(express.json());

// Rutas para pruebas
app.get('/acciones', accionController.obtenerAcciones);
app.get('/acciones/:id', accionController.obtenerAccionPorId);
app.post('/acciones', accionController.crearAccion);
app.put('/acciones/:id', accionController.actualizarAccion);
app.delete('/acciones/:id', accionController.eliminarAccion);

// Mocks de modelos
jest.mock('../../models/accion');

const Accion = require('../../models/accion');

describe('Controlador Accion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /acciones - debe retornar todas las acciones', async () => {
    Accion.findAll.mockResolvedValue([
      { id: 1, nombre: 'Coca-Cola', valor_dolares: '100.00' },
      { id: 2, nombre: 'Pepsi', valor_dolares: '80.50' },
    ]);

    const res = await request(app).get('/acciones');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].nombre).toBe('Coca-Cola');
  });

  test('GET /acciones/:id - acción encontrada', async () => {
    Accion.findByPk.mockResolvedValue({ id: 1, nombre: 'Coca-Cola' });

    const res = await request(app).get('/acciones/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Coca-Cola');
  });

  test('GET /acciones/:id - acción no encontrada', async () => {
    Accion.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/acciones/999');

    expect(res.statusCode).toBe(404);
  });

  test('POST /acciones - crear nueva acción', async () => {
    const nuevaAccion = { nombre: 'Postobón', valor_dolares: '50.00' };
    Accion.create.mockResolvedValue({ id: 3, ...nuevaAccion });

    const res = await request(app).post('/acciones').send(nuevaAccion);

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Postobón');
  });

  test('PUT /acciones/:id - actualizar acción existente', async () => {
    Accion.update.mockResolvedValue([1]);

    const res = await request(app).put('/acciones/1').send({ nombre: 'Fanta' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Acción actualizada con éxito');
  });

  test('PUT /acciones/:id - acción no encontrada', async () => {
    Accion.update.mockResolvedValue([0]);

    const res = await request(app).put('/acciones/999').send({ nombre: 'NoExiste' });

    expect(res.statusCode).toBe(404);
  });

  test('DELETE /acciones/:id - eliminar acción existente', async () => {
    Accion.destroy.mockResolvedValue(1);

    const res = await request(app).delete('/acciones/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Acción eliminada con éxito');
  });

  test('DELETE /acciones/:id - acción no encontrada', async () => {
    Accion.destroy.mockResolvedValue(0);

    const res = await request(app).delete('/acciones/999');

    expect(res.statusCode).toBe(404);
  });
});
