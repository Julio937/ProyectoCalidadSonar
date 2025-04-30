const Transaccion = require('../models/transaccion');

// Obtener la lista de todas las transacciones
exports.obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.findAll();
    res.json(transacciones);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Obtener una transacción por ID
exports.obtenerTransaccionPorId = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByPk(req.params.id);
    if (transaccion) {
      res.json(transaccion);
    } else {
      res.status(404).send('Transacción no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Crear una nueva transacción
exports.crearTransaccion = async (req, res) => {
  try {
    const { usuario_id, accion_id, tipo, cantidad, precio_unitario } = req.body;
    const nuevaTransaccion = await Transaccion.create({
      usuario_id,
      accion_id,
      tipo,
      cantidad,
      precio_unitario,
      fecha_transaccion: new Date(),
    });
    res.status(201).json(nuevaTransaccion);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Actualizar una transacción
exports.actualizarTransaccion = async (req, res) => {
  try {
    const [filasActualizadas] = await Transaccion.update(req.body, {
      where: { id: req.params.id },
    });
    if (filasActualizadas === 0) {
      res.status(404).send('Transacción no encontrada');
    } else {
      res.json({ message: 'Transacción actualizada con éxito' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Eliminar una transacción
exports.eliminarTransaccion = async (req, res) => {
  try {
    const transaccionEliminada = await Transaccion.destroy({
      where: { id: req.params.id },
    });
    if (transaccionEliminada) {
      res.json({ message: 'Transacción eliminada con éxito' });
    } else {
      res.status(404).send('Transacción no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
