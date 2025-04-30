const request = require('supertest');
const express = require('express');
const app = express();
const usuarioController = require('../usuarioController');

// Middlewares
app.use(express.json());

// Simular rutas para test
app.get('/usuarios', usuarioController.obtenerUsuarios);
app.get('/usuarios/:id', usuarioController.obtenerUsuarioPorId);
app.post('/usuarios', usuarioController.crearUsuario);
app.put('/usuarios/:id', usuarioController.actualizarUsuario);
app.delete('/usuarios/:id', usuarioController.eliminarUsuario);
app.post('/usuarios/acciones', usuarioController.asociarAccionAUsuario);
app.delete('/usuarios/acciones/desasociar', usuarioController.desasociarAccionDeUsuario);
app.get('/usuarios/:usuario_id/balance', usuarioController.obtenerBalanceUsuario);
app.get('/usuarios/:usuario_id/earnings', usuarioController.obtenerGananciasUsuario);

// Mocks
jest.mock('../../models/usuario');
jest.mock('../../models/pais');
jest.mock('../../models/accion');
jest.mock('../../models/usuarioAccion');
jest.mock('../../models/transaccion');

const Usuario = require('../../models/usuario');
const Pais = require('../../models/pais');
const Accion = require('../../models/accion');
const UsuarioAccion = require('../../models/usuarioAccion');
const Transaccion = require('../../models/transaccion');

describe('Controlador Usuario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /usuarios - debe retornar todos los usuarios con sus acciones', async () => {
    Usuario.findAll.mockResolvedValue([{ id: 1, nombre: 'Juan', toJSON: () => ({ id: 1, nombre: 'Juan' }) }]);
    UsuarioAccion.findAll.mockResolvedValue([{ usuario_id: 1, accion_id: 1 }]);
    Accion.findByPk.mockResolvedValue({ id: 1, nombre: 'Acción1' });

    const res = await request(app).get('/usuarios');

    expect(res.statusCode).toBe(200);
    expect(res.body[0].acciones).toContain('Acción1');
  });

  test('GET /usuarios - debe manejar error del servidor', async () => {
    Usuario.findAll.mockRejectedValue(new Error('Error simulado'));

    const res = await request(app).get('/usuarios');

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al obtener los usuarios');
  });

  test('GET /usuarios/:id - usuario encontrado', async () => {
    Usuario.findByPk.mockResolvedValue({ id: 1, nombre: 'Juan', toJSON: () => ({ id: 1, nombre: 'Juan' }) });
    UsuarioAccion.findAll.mockResolvedValue([{ accion_id: 1 }]);
    Accion.findByPk.mockResolvedValue({ nombre: 'AcciónX', valor_dolares: 500 });

    const res = await request(app).get('/usuarios/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Juan');
    expect(res.body.acciones[0]).toEqual({ nombre: 'AcciónX', valor_dolares: 500 });
  });

  test('GET /usuarios/:id - usuario no encontrado', async () => {
    Usuario.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/usuarios/999');

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Usuario no encontrado');
  });

  test('GET /usuarios/:id - error del servidor', async () => {
    Usuario.findByPk.mockRejectedValue(new Error('Fallo simulado'));

    const res = await request(app).get('/usuarios/1');

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al obtener el usuario');
  });

  test('POST /usuarios - crear un nuevo usuario', async () => {
    Usuario.findOne.mockResolvedValue(null);
    Pais.findByPk.mockResolvedValue({ id: 1 });
    Usuario.create.mockResolvedValue({ id: 2, nombre: 'Carlos' });

    const res = await request(app).post('/usuarios').send({
      nombre: 'Carlos',
      apellido: 'Pérez',
      correo: 'carlos@mail.com',
      contraseña: '123456',
      cedula: '987654321',
      pais_id: 1,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Carlos');
  });

  test('POST /usuarios - correo ya en uso', async () => {
    Usuario.findOne.mockResolvedValue({ id: 1 });

    const res = await request(app).post('/usuarios').send({
      nombre: 'Carlos',
      apellido: 'Pérez',
      correo: 'carlos@mail.com',
      contraseña: '123456',
      cedula: '987654321',
      pais_id: 1,
    });

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('El correo ya está en uso');
  });

  test('POST /usuarios - país no encontrado', async () => {
    Usuario.findOne.mockResolvedValue(null);
    Pais.findByPk.mockResolvedValue(null);

    const res = await request(app).post('/usuarios').send({
      nombre: 'Carlos',
      apellido: 'Pérez',
      correo: 'carlos@mail.com',
      contraseña: '123456',
      cedula: '987654321',
      pais_id: 999,
    });

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('País no encontrado');
  });

  test('POST /usuarios - error del servidor', async () => {
    Usuario.findOne.mockRejectedValue(new Error('Fallo simulado'));

    const res = await request(app).post('/usuarios').send({
      nombre: 'Carlos',
      apellido: 'Pérez',
      correo: 'carlos@mail.com',
      contraseña: '123456',
      cedula: '987654321',
      pais_id: 1,
    });

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al crear el usuario');
  });

  test('PUT /usuarios/:id - actualización exitosa del usuario', async () => {
    const mockSave = jest.fn();
    Usuario.findByPk.mockResolvedValue({ save: mockSave });

    const res = await request(app).put('/usuarios/1').send({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan.perez@example.com',
      contraseña: 'newpassword',
      cedula: '1234567890',
      pais_id: 1,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Juan');
    expect(res.body.apellido).toBe('Pérez');
    expect(res.body.correo).toBe('juan.perez@example.com');
    expect(res.body.cedula).toBe('1234567890');
    expect(res.body.pais_id).toBe(1);
    expect(mockSave).toHaveBeenCalled();
  });

  test('PUT /usuarios/:id - usuario no encontrado', async () => {
    Usuario.findByPk.mockResolvedValue(null);

    const res = await request(app).put('/usuarios/1').send({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan.perez@example.com',
    });

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Usuario no encontrado');
  });

  test('PUT /usuarios/:id - error del servidor', async () => {
    Usuario.findByPk.mockRejectedValue(new Error('DB error'));

    const res = await request(app).put('/usuarios/1').send({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan.perez@example.com',
    });

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al actualizar el usuario');
  });

  test('GET /usuarios/:usuario_id/earnings - ganancias calculadas', async () => {
    Transaccion.findAll.mockResolvedValue([
      { accion_id: 1, cantidad: 3, precio_unitario: 80 },
      { accion_id: 2, cantidad: 2, precio_unitario: 50 },
    ]);

    Accion.findByPk.mockResolvedValueOnce({ valor_dolares: 100 }).mockResolvedValueOnce({ valor_dolares: 70 });

    const res = await request(app).get('/usuarios/1/earnings');
    expect(res.statusCode).toBe(200);
    expect(res.body.earnings).toBe((100 - 80) * 3 + (70 - 50) * 2); // 60 + 40 = 100
  });

  test('GET /usuarios/:usuario_id/earnings - sin transacciones', async () => {
    Transaccion.findAll.mockResolvedValue([]);

    const res = await request(app).get('/usuarios/1/earnings');
    expect(res.statusCode).toBe(200);
    expect(res.body.earnings).toBe(0);
  });

  test('GET /usuarios/:usuario_id/earnings - error del servidor', async () => {
    Transaccion.findAll.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/usuarios/1/earnings');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al obtener las ganancias del usuario');
  });

  test('POST /usuarios/acciones - asociación exitosa', async () => {
    Usuario.findByPk.mockResolvedValue({ id: 1, pais_id: 10 });
    Accion.findByPk.mockResolvedValue({ id: 2 });
    Pais.findByPk.mockResolvedValue({ acciones_permitidas: ['2', '3'] });
    UsuarioAccion.create.mockResolvedValue({});

    const res = await request(app).post('/usuarios/acciones').send({
      usuario_id: 1,
      accion_id: 2,
      cantidad: 5,
    });

    expect(res.statusCode).toBe(201);
    expect(res.text).toBe('Acción asociada al usuario con éxito');
  });

  test('POST /usuarios/acciones - usuario o acción no encontrada', async () => {
    Usuario.findByPk.mockResolvedValue(null);

    const res = await request(app).post('/usuarios/acciones').send({
      usuario_id: 99,
      accion_id: 2,
      cantidad: 5,
    });

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Usuario no encontrado');

    Usuario.findByPk.mockResolvedValue({ id: 99 });
    Accion.findByPk.mockResolvedValue(null);

    const res2 = await request(app).post('/usuarios/acciones').send({
      usuario_id: 99,
      accion_id: 2,
      cantidad: 5,
    });

    expect(res2.statusCode).toBe(404);
    expect(res2.text).toBe('Acción no encontrada');
  });

  test('POST /usuarios/acciones - acción no permitida por país', async () => {
    Usuario.findByPk.mockResolvedValue({ id: 1, pais_id: 10 });
    Accion.findByPk.mockResolvedValue({ id: 2 });
    Pais.findByPk.mockResolvedValue({ acciones_permitidas: ['3', '4'] }); // No incluye la acción 2

    const res = await request(app).post('/usuarios/acciones').send({
      usuario_id: 1,
      accion_id: 2,
      cantidad: 5,
    });

    expect(res.statusCode).toBe(403);
    expect(res.text).toBe('Acción no permitida para el país del usuario');
  });

  test('POST /usuarios/acciones - error en servidor', async () => {
    // Simulamos que el usuario existe
    Usuario.findByPk.mockResolvedValue({ id: 99 });

    // Simulamos un error en la base de datos para la acción
    Accion.findByPk.mockRejectedValue(new Error('Error en la base de datos'));

    const res = await request(app).post('/usuarios/acciones').send({
      usuario_id: 99,
      accion_id: 2,
      cantidad: 5,
    });

    // Verificamos que se devuelva el código de estado 500 y el mensaje de error
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al asociar la acción al usuario');
  });

  test('DELETE /usuarios/acciones/desasociar - desasociación exitosa', async () => {
    const destroyMock = jest.fn();
    UsuarioAccion.findOne.mockResolvedValue({ destroy: destroyMock });

    const res = await request(app).delete('/usuarios/acciones/desasociar').send({ usuario_id: 1, accion_id: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Acción desasociada del usuario con éxito');
    expect(destroyMock).toHaveBeenCalled();
  });

  test('DELETE /usuarios/acciones/desasociar - asociación no existe', async () => {
    UsuarioAccion.findOne.mockResolvedValue(null);

    const res = await request(app).delete('/usuarios/acciones/desasociar').send({ usuario_id: 1, accion_id: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('La asociación entre el usuario y la acción no existe');
  });

  test('DELETE /usuarios/acciones/desasociar - error del servidor', async () => {
    UsuarioAccion.findOne.mockRejectedValue(new Error('DB error'));

    const res = await request(app).delete('/usuarios/acciones/desasociar').send({ usuario_id: 1, accion_id: 2 });

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al desasociar la acción del usuario');
  });

  test('GET /usuarios/:usuario_id/balance - balance calculado', async () => {
    UsuarioAccion.findAll.mockResolvedValue([{ accion_id: 1, cantidad: 2 }]);
    Accion.findByPk.mockResolvedValue({ valor_dolares: 100 });

    const res = await request(app).get('/usuarios/1/balance');

    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe(200);
  });

  test('GET /usuarios/:usuario_id/balance - sin acciones asociadas', async () => {
    UsuarioAccion.findAll.mockResolvedValue([]);

    const res = await request(app).get('/usuarios/1/balance');

    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe(0);
  });

  test('GET /usuarios/:usuario_id/balance - acción no encontrada', async () => {
    UsuarioAccion.findAll.mockResolvedValue([{ accion_id: 1, cantidad: 3 }]);
    Accion.findByPk.mockResolvedValue(null); // Simula acción no encontrada

    const res = await request(app).get('/usuarios/1/balance');

    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe(0);
  });

  test('GET /usuarios/:usuario_id/balance - error del servidor', async () => {
    UsuarioAccion.findAll.mockRejectedValue(new Error('Fallo simulado'));

    const res = await request(app).get('/usuarios/1/balance');

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al obtener el balance del usuario');
  });

  test('DELETE /usuarios/:id - usuario eliminado', async () => {
    const destroyMock = jest.fn();
    Usuario.findByPk.mockResolvedValue({ destroy: destroyMock });

    const res = await request(app).delete('/usuarios/1');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Usuario eliminado con éxito');
    expect(destroyMock).toHaveBeenCalled();
  });

  test('DELETE /usuarios/:id - usuario no encontrado', async () => {
    Usuario.findByPk.mockResolvedValue(null);

    const res = await request(app).delete('/usuarios/999');

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Usuario no encontrado');
  });

  test('DELETE /usuarios/:id - error del servidor', async () => {
    Usuario.findByPk.mockRejectedValue(new Error('Fallo en la base de datos'));

    const res = await request(app).delete('/usuarios/1');

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error al eliminar el usuario');
  });
});
