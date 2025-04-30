const request = require('supertest');
const express = require('express');
const monedaController = require('../monedaController');

const app = express();
app.use(express.json());

// Rutas a testear
app.get('/moneda', monedaController.obtenerMonedas);
app.get('/moneda/:id', monedaController.obtenerMonedaPorId);
app.post('/moneda', monedaController.crearMoneda);
app.put('/moneda/:id', monedaController.actualizarMoneda);
app.delete('/moneda/:id', monedaController.eliminarMoneda);

// Mocks
jest.mock('../../models/moneda');

const Moneda = require('../../models/moneda');

describe('Controlador de Moneda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /moneda - retorna todas las monedas', async () => {
    Moneda.findAll.mockResolvedValue([{ id: 1, nombre: 'Dólar' }]);
    const res = await request(app).get('/moneda');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].nombre).toBe('Dólar');
  });

  test('GET /moneda/:id - retorna una moneda específica', async () => {
    Moneda.findByPk.mockResolvedValue({ id: 1, nombre: 'Euro' });
    const res = await request(app).get('/moneda/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Euro');
  });

  test('GET /moneda/:id - moneda no encontrada', async () => {
    Moneda.findByPk.mockResolvedValue(null);
    const res = await request(app).get('/moneda/999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /moneda - crear una nueva moneda', async () => {
    Moneda.create = jest.fn().mockResolvedValue({ id: 3, nombre: 'Peso' });
    const res = await request(app).post('/moneda').send({ nombre: 'Peso', pais_id: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Peso');
  });

  test('PUT /moneda/:id - actualizar moneda existente', async () => {
    Moneda.update = jest.fn().mockResolvedValue([1]); // 1 fila afectada
    const res = await request(app).put('/moneda/1').send({ nombre: 'Peso Mexicano' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Moneda actualizada con éxito');
  });

  test('DELETE /moneda/:id - eliminar moneda existente', async () => {
    Moneda.destroy = jest.fn().mockResolvedValue(1); // 1 fila eliminada
    const res = await request(app).delete('/moneda/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Moneda eliminada con éxito');
  });

  test('DELETE /moneda/:id - moneda no encontrada', async () => {
    Moneda.destroy = jest.fn().mockResolvedValue(0); // 0 filas eliminadas
    const res = await request(app).delete('/moneda/999');
    expect(res.statusCode).toBe(404);
  });
});
