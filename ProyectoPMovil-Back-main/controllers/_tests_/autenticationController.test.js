const request = require('supertest');
const express = require('express');
const app = express();
const authController = require('../autenticationController');

app.use(express.json());

// Rutas de autenticación
app.post('/auth/registrar', authController.registrarUsuario);
app.post('/auth/iniciar-sesion', authController.iniciarSesion);

// Mocks
jest.mock('../../models/usuario');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const Usuario = require('../../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Controlador de Autenticación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /auth/registrar - registrar nuevo usuario exitosamente', async () => {
    Usuario.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    Usuario.create.mockResolvedValue({ id: 1 });

    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'mockedToken');
    });

    const res = await request(app).post('/auth/registrar').send({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@mail.com',
      contraseña: '123456',
      cedula: '111111111',
      pais_id: 1,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('mockedToken');
  });

  test('POST /auth/registrar - correo ya en uso', async () => {
    Usuario.findOne.mockResolvedValueOnce({ id: 1 });

    const res = await request(app).post('/auth/registrar').send({
      correo: 'yaexiste@mail.com',
      cedula: '123456789',
      nombre: 'Ana',
      apellido: 'López',
      contraseña: '123456',
      pais_id: 1,
    });

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('El correo ya está en uso');
  });

  test('POST /auth/iniciar-sesion - inicio de sesión exitoso', async () => {
    Usuario.findOne.mockResolvedValue({ id: 1, contraseña: 'hashedPassword' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'mockedToken');
    });

    const res = await request(app).post('/auth/iniciar-sesion').send({
      correo: 'usuario@mail.com',
      contraseña: '123456',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('mockedToken');
  });

  test('POST /auth/iniciar-sesion - usuario no existe', async () => {
    Usuario.findOne.mockResolvedValue(null);

    const res = await request(app).post('/auth/iniciar-sesion').send({
      correo: 'noexiste@mail.com',
      contraseña: '123456',
    });

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('El usuario no existe');
  });

  test('POST /auth/iniciar-sesion - contraseña incorrecta', async () => {
    Usuario.findOne.mockResolvedValue({ id: 1, contraseña: 'hashedPassword' });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post('/auth/iniciar-sesion').send({
      correo: 'usuario@mail.com',
      contraseña: 'wrongPassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Contraseña incorrecta');
  });
});
