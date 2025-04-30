const express = require('express');
const cors = require('cors');
const usuarioController = require('./controllers/usuarioController');
const paisController = require('./controllers/paisController');
const accionController = require('./controllers/accionController');
const gestoraController = require('./controllers/gestoraController');
const authController = require('./controllers/autenticationController');
const monedaController = require('./controllers/monedaController');
const transaccionController = require('./controllers/transaccionesController');

const app = express();

app.disable('x-powered-by');

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Rutas Usuario
app.get('/usuarios', usuarioController.obtenerUsuarios);
app.get('/usuarios/:id', usuarioController.obtenerUsuarioPorId);
app.post('/usuarios', usuarioController.crearUsuario);
app.post('/usuarios/acciones', usuarioController.asociarAccionAUsuario);
app.put('/usuarios/:id', usuarioController.actualizarUsuario);
app.delete('/usuarios/:id', usuarioController.eliminarUsuario);
app.delete('/usuarios/acciones/desasociar', usuarioController.desasociarAccionDeUsuario);
app.get('/usuarios/:usuario_id/balance', usuarioController.obtenerBalanceUsuario);
app.get('/usuarios/:usuario_id/earnings', usuarioController.obtenerGananciasUsuario);

// Rutas País
app.get('/paises', paisController.obtenerPaises);
app.get('/paises/:id', paisController.obtenerPaisPorId);
app.post('/paises', paisController.crearPais);
app.put('/paises/:id', paisController.actualizarPais);
app.delete('/paises/:id', paisController.eliminarPais);

// Rutas Acción
app.get('/acciones', accionController.obtenerAcciones);
app.get('/acciones/:id', accionController.obtenerAccionPorId);
app.post('/acciones', accionController.crearAccion);
app.put('/acciones/:id', accionController.actualizarAccion);
app.delete('/acciones/:id', accionController.eliminarAccion);

// Rutas Gestora
app.get('/gestoras', gestoraController.obtenerGestoras);
app.get('/gestoras/:id', gestoraController.obtenerGestoraPorId);
app.post('/gestoras', gestoraController.crearGestora);
app.put('/gestoras/:id', gestoraController.actualizarGestora);
app.delete('/gestoras/:id', gestoraController.eliminarGestora);
app.get('/gestoras/pais/:pais_id', gestoraController.obtenerGestorasPorPais);

// Rutas de autenticación
app.post('/auth/registrar', authController.registrarUsuario);
app.post('/auth/iniciar-sesion', authController.iniciarSesion);

// Ruta Moneda
app.get('/moneda', monedaController.obtenerMonedas);
app.get('/moneda/:id', monedaController.obtenerMonedaPorId);
app.post('/moneda', monedaController.crearMoneda);
app.put('/moneda/:id', monedaController.actualizarMoneda);
app.delete('/moneda/:id', monedaController.eliminarMoneda);

// Ruta de transacciones
app.get('/transaccion', transaccionController.obtenerTransacciones);
app.get('/transaccion/:id', transaccionController.obtenerTransaccionPorId);
app.post('/transaccion', transaccionController.crearTransaccion);
app.put('/transaccion/:id', transaccionController.actualizarTransaccion);
app.delete('/transaccion/:id', transaccionController.eliminarTransaccion);

module.exports = app;
