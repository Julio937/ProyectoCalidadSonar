const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo usuario
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña, cedula, pais_id } = req.body;

    // Verificar si el correo o la cédula ya existen
    let usuario = await Usuario.findOne({ where: { correo } });
    if (usuario) {
      return res.status(400).send('El correo ya está en uso');
    }
    usuario = await Usuario.findOne({ where: { cedula } });
    if (usuario) {
      return res.status(400).send('La cédula ya está en uso');
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    // Crear el usuario
    usuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      contraseña: contraseñaEncriptada,
      cedula,
      pais_id,
    });

    // Crear y enviar el token
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    jwt.sign(payload, 'tuSecretKey', { expiresIn: 3600 }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

// Función para iniciar sesión
exports.iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(400).send('El usuario no existe');
    }

    // Verificar la contraseña
    const esMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esMatch) {
      return res.status(400).send('Contraseña incorrecta');
    }

    // Crear y enviar el token
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    jwt.sign(payload, 'tuSecretKey', { expiresIn: 3600 }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};
