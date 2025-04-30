const Accion = require('../models/accion'); // Asegúrate de tener un modelo para 'Accion'

// Obtener la lista de todas las acciones
exports.obtenerAcciones = async (req, res) => {
  try {
    const acciones = await Accion.findAll();
    res.json(acciones);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Obtener una acción por ID
exports.obtenerAccionPorId = async (req, res) => {
  try {
    const accion = await Accion.findByPk(req.params.id);
    if (accion) {
      res.json(accion);
    } else {
      res.status(404).send('Acción no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Crear una nueva acción
exports.crearAccion = async (req, res) => {
  try {
    const nuevaAccion = await Accion.create(req.body);
    res.status(201).json(nuevaAccion);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Actualizar una acción
exports.actualizarAccion = async (req, res) => {
  try {
    const [filasActualizadas] = await Accion.update(req.body, {
      where: { id: req.params.id },
    });
    if (filasActualizadas === 0) {
      res.status(404).send('Acción no encontrada');
    } else {
      res.json({ message: 'Acción actualizada con éxito' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Eliminar una acción
exports.eliminarAccion = async (req, res) => {
  try {
    const accionEliminada = await Accion.destroy({
      where: { id: req.params.id },
    });
    if (accionEliminada) {
      res.json({ message: 'Acción eliminada con éxito' });
    } else {
      res.status(404).send('Acción no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
