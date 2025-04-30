const request = require('supertest');
const app = require('../../app');
const Transaccion = require('../../models/transaccion');

// Mock del modelo
jest.mock('../../models/transaccion');

describe('Controlador Transaccion', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /transaccion - obtener todas las transacciones', async () => {
    Transaccion.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const res = await request(app).get('/transaccion');
    expect(res.statusCode).toBe(200);
    expect(Transaccion.findAll).toHaveBeenCalled();
    expect(res.body).toHaveLength(2);
  });

  test('GET /transaccion/:id - obtener una transacción por ID', async () => {
    Transaccion.findByPk.mockResolvedValue({ id: 1 });

    const res = await request(app).get('/transaccion/1');
    expect(res.statusCode).toBe(200);
    expect(Transaccion.findByPk).toHaveBeenCalledWith('1');
    expect(res.body.id).toBe(1);
  });

  test('GET /transaccion/:id - transacción no encontrada', async () => {
    Transaccion.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/transaccion/999');
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Transacción no encontrada');
  });

  test('POST /transaccion - crear nueva transacción', async () => {
    const nueva = {
      usuario_id: 1,
      accion_id: 2,
      tipo: 'compra',
      cantidad: 10,
      precio_unitario: 100.5,
    };

    const creada = { id: 1, ...nueva, fecha_transaccion: expect.any(String) };

    Transaccion.create.mockResolvedValue(creada);

    const res = await request(app).post('/transaccion').send(nueva);
    expect(res.statusCode).toBe(201);
    expect(Transaccion.create).toHaveBeenCalledWith(expect.objectContaining(nueva));
    expect(res.body.id).toBe(1);
  });

  test('PUT /transaccion/:id - actualizar transacción existente', async () => {
    Transaccion.update.mockResolvedValue([1]); // Una fila afectada

    const res = await request(app).put('/transaccion/1').send({ cantidad: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Transacción actualizada con éxito');
  });

  test('PUT /transaccion/:id - transacción no encontrada', async () => {
    Transaccion.update.mockResolvedValue([0]); // Ninguna fila afectada

    const res = await request(app).put('/transaccion/999').send({ cantidad: 20 });
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Transacción no encontrada');
  });

  test('DELETE /transaccion/:id - eliminar transacción existente', async () => {
    Transaccion.destroy.mockResolvedValue(1); // Una fila eliminada

    const res = await request(app).delete('/transaccion/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Transacción eliminada con éxito');
  });

  test('DELETE /transaccion/:id - transacción no encontrada', async () => {
    Transaccion.destroy.mockResolvedValue(0); // Nada eliminado

    const res = await request(app).delete('/transaccion/999');
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Transacción no encontrada');
  });
});
