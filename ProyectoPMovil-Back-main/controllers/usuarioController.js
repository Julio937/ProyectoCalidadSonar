const Usuario = require('../models/usuario');
const Pais = require('../models/pais');
const Accion = require('../models/accion');
const UsuarioAccion = require('../models/usuarioAccion');
const Transaccion = require('../models/transaccion');

// Obtener todos los usuarios con sus acciones asociadas
exports.obtenerUsuarios = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const usuarios = await Usuario.findAll();

    // Para cada usuario, buscar sus acciones asociadas a través de UsuarioAccion
    const usuariosConAcciones = await Promise.all(
      usuarios.map(async (usuario) => {
        // Buscar las asociaciones de UsuarioAccion para el usuario actual
        const usuarioAcciones = await UsuarioAccion.findAll({
          where: { usuario_id: usuario.id },
        });

        // Para cada asociación, buscar la acción correspondiente
        const acciones = await Promise.all(
          usuarioAcciones.map(async (ua) => {
            const accion = await Accion.findByPk(ua.accion_id);
            return accion ? accion.nombre : 'N/A';
          })
        );

        return {
          ...usuario.toJSON(),
          acciones: acciones.length > 0 ? acciones : ['N/A'],
        };
      })
    );

    res.json(usuariosConAcciones);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los usuarios');
  }
};

exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Buscar las asociaciones de UsuarioAccion para el usuario actual
    const usuarioAcciones = await UsuarioAccion.findAll({
      where: { usuario_id: usuario.id },
    });

    // Para cada asociación, buscar la acción correspondiente
    const acciones = await Promise.all(
      usuarioAcciones.map(async (ua) => {
        const accion = await Accion.findByPk(ua.accion_id);
        return accion ? { nombre: accion.nombre, valor_dolares: accion.valor_dolares } : null;
      })
    );

    // Filtrar las acciones para eliminar los valores nulos
    const accionesFiltradas = acciones.filter((a) => a != null);

    // Agregar las acciones al objeto del usuario
    const usuarioConAcciones = {
      ...usuario.toJSON(),
      acciones: accionesFiltradas.length > 0 ? accionesFiltradas : ['N/A'],
    };

    res.json(usuarioConAcciones);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el usuario');
  }
};

exports.obtenerBalanceUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    let balanceTotal = 0;

    // Obtener todas las acciones del usuario
    const accionesUsuario = await UsuarioAccion.findAll({
      where: { usuario_id },
    });

    // Calcular el balance total
    for (const ua of accionesUsuario) {
      const accion = await Accion.findByPk(ua.accion_id);
      if (accion) {
        balanceTotal += ua.cantidad * accion.valor_dolares;
      }
    }

    res.json({ balance: balanceTotal });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el balance del usuario');
  }
};

exports.obtenerGananciasUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    let gananciasTotales = 0;

    // Obtener todas las transacciones de compra del usuario
    const transacciones = await Transaccion.findAll({
      where: { usuario_id, tipo: 'compra' },
    });

    // Calcular las ganancias para cada transacción
    for (const transaccion of transacciones) {
      const accion = await Accion.findByPk(transaccion.accion_id);
      gananciasTotales += (accion.valor_dolares - transaccion.precio_unitario) * transaccion.cantidad;
    }

    res.json({ earnings: gananciasTotales });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las ganancias del usuario');
  }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña, cedula, pais_id } = req.body;

    // Verificar si el correo ya está en uso
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).send('El correo ya está en uso');
    }

    // Verificar si el país existe
    const pais = await Pais.findByPk(pais_id);
    if (!pais) {
      return res.status(404).send('País no encontrado');
    }

    // Crear el nuevo usuario si el correo no está en uso y el país existe
    const nuevoUsuario = await Usuario.create({ nombre, apellido, correo, contraseña, cedula, pais_id });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el usuario');
  }
};

// Asociar una acción a un usuario
exports.asociarAccionAUsuario = async (req, res) => {
  try {
    const { usuario_id, accion_id, cantidad } = req.body;
    const usuario = await Usuario.findByPk(usuario_id);
    const accion = await Accion.findByPk(accion_id);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }
    if (!accion) {
      return res.status(404).send('Acción no encontrada');
    }

    const pais = await Pais.findByPk(usuario.pais_id);

    if (!pais.acciones_permitidas.includes(accion.id.toString())) {
      return res.status(403).send('Acción no permitida para el país del usuario');
    }

    // Crear la asociación con la cantidad y la fecha_operacion actual
    await UsuarioAccion.create({
      usuario_id,
      accion_id,
      cantidad,
      fecha_operacion: new Date(),
    });

    res.status(201).send('Acción asociada al usuario con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al asociar la acción al usuario');
  }
};

// Desasociar una acción a un usuario
exports.desasociarAccionDeUsuario = async (req, res) => {
  try {
    const { usuario_id, accion_id } = req.body;
    const usuarioAccion = await UsuarioAccion.findOne({
      where: {
        usuario_id: usuario_id,
        accion_id: accion_id,
      },
    });

    if (!usuarioAccion) {
      return res.status(404).send('La asociación entre el usuario y la acción no existe');
    }

    await usuarioAccion.destroy();
    res.status(200).send('Acción desasociada del usuario con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al desasociar la acción del usuario');
  }
};

// Actualizar un usuario existente
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, contraseña, cedula, pais_id } = req.body;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Actualizar solo los campos que se han proporcionado en el body
    usuario.nombre = nombre ?? usuario.nombre;
    usuario.apellido = apellido ?? usuario.apellido;
    usuario.correo = correo ?? usuario.correo;
    usuario.contraseña = contraseña ?? usuario.contraseña;
    usuario.cedula = cedula ?? usuario.cedula;
    usuario.pais_id = pais_id ?? usuario.pais_id;

    await usuario.save();
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).send('Error al actualizar el usuario');
  }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    await usuario.destroy();
    res.status(200).send('Usuario eliminado con éxito');
  } catch (error) {
    res.status(500).send('Error al eliminar el usuario');
  }
};
