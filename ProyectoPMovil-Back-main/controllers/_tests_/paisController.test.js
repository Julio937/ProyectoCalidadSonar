const request = require('supertest');
const express = require('express');
const paisController = require('../paisController');

const app = express();
app.use(express.json());

// Rutas a testear
app.get('/paises', paisController.obtenerPaises);
app.get('/paises/:id', paisController.obtenerPaisPorId);
app.post('/paises', paisController.crearPais);
app.put('/paises/:id', paisController.actualizarPais);
app.delete('/paises/:id', paisController.eliminarPais);

// Mock del modelo
jest.mock('../../models/pais');
const Pais = require('../../models/pais');

describe('Controlador de País', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /paises - retorna todos los países', async () => {
    Pais.findAll.mockResolvedValue([{ id: 1, nombre: 'Colombia' }]);
    const res = await request(app).get('/paises');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].nombre).toBe('Colombia');
  });

  test('GET /paises/:id - retorna un país específico', async () => {
    Pais.findByPk.mockResolvedValue({ id: 1, nombre: 'Argentina' });
    const res = await request(app).get('/paises/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Argentina');
  });

  test('GET /paises/:id - país no encontrado', async () => {
    Pais.findByPk.mockResolvedValue(null);
    const res = await request(app).get('/paises/999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /paises - crear un nuevo país', async () => {
    Pais.create = jest.fn().mockResolvedValue({ id: 2, nombre: 'Brasil' });
    const res = await request(app)
      .post('/paises')
      .send({ nombre: 'Brasil', acciones_permitidas: ['compra', 'venta'] });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Brasil');
  });

  test('PUT /paises/:id - actualizar país', async () => {
    Pais.update = jest.fn().mockResolvedValue([1]); // 1 fila modificada
    const res = await request(app).put('/paises/1').send({ nombre: 'Chile' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('País actualizado con éxito');
  });

  test('DELETE /paises/:id - eliminar país', async () => {
    Pais.destroy = jest.fn().mockResolvedValue(1); // 1 fila eliminada
    const res = await request(app).delete('/paises/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('País eliminado con éxito');
  });

  test('DELETE /paises/:id - país no encontrado', async () => {
    Pais.destroy = jest.fn().mockResolvedValue(0); // 0 filas eliminadas
    const res = await request(app).delete('/paises/999');
    expect(res.statusCode).toBe(404);
  });
});
