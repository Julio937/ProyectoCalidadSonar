const request = require('supertest');
const app = require('../../app'); // Ajusta según la ubicación de tu app
const Gestora = require('../../models/Gestora');

jest.mock('../../models/Gestora');

describe('Controlador Gestora', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /gestoras - obtener todas las gestoras', async () => {
    Gestora.findAll.mockResolvedValue([{ id: 1, nombre: 'Gestora A', pais_id: 1 }]);

    const res = await request(app).get('/gestoras');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, nombre: 'Gestora A', pais_id: 1 }]);
  });

  test('GET /gestoras/:id - obtener gestora existente', async () => {
    Gestora.findByPk.mockResolvedValue({ id: 1, nombre: 'Gestora A', pais_id: 1 });

    const res = await request(app).get('/gestoras/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Gestora A');
  });

  test('GET /gestoras/:id - gestora no encontrada', async () => {
    Gestora.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/gestoras/999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /gestoras - crear nueva gestora', async () => {
    const nuevaGestora = { id: 1, nombre: 'Gestora Nueva', pais_id: 1 };
    Gestora.create.mockResolvedValue(nuevaGestora);

    const res = await request(app).post('/gestoras').send({
      nombre: 'Gestora Nueva',
      pais_id: 1,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Gestora Nueva');
  });

  test('PUT /gestoras/:id - actualizar gestora existente', async () => {
    Gestora.update.mockResolvedValue([1]);

    const res = await request(app).put('/gestoras/1').send({ nombre: 'Gestora Actualizada' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Gestora actualizada con éxito');
  });

  test('PUT /gestoras/:id - gestora no encontrada', async () => {
    Gestora.update.mockResolvedValue([0]);

    const res = await request(app).put('/gestoras/999').send({ nombre: 'Inexistente' });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /gestoras/:id - eliminar gestora existente', async () => {
    Gestora.destroy.mockResolvedValue(1);

    const res = await request(app).delete('/gestoras/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Gestora eliminada con éxito');
  });

  test('DELETE /gestoras/:id - gestora no encontrada', async () => {
    Gestora.destroy.mockResolvedValue(0);

    const res = await request(app).delete('/gestoras/999');
    expect(res.statusCode).toBe(404);
  });

  test('GET /gestoras/pais/:pais_id - obtener gestoras por país', async () => {
    Gestora.findAll.mockResolvedValue([
      { id: 1, nombre: 'Gestora 1', pais_id: 1 },
      { id: 2, nombre: 'Gestora 2', pais_id: 1 },
    ]);

    const res = await request(app).get('/gestoras/pais/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].pais_id).toBe(1);
  });
});
