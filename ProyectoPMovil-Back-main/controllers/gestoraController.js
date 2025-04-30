const Gestora = require('../models/Gestora'); // Asegúrate de tener un modelo para 'Gestora'

// Obtener la lista de todas las gestoras
exports.obtenerGestoras = async (req, res) => {
  try {
    const gestoras = await Gestora.findAll();
    res.json(gestoras);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Obtener una gestora por ID
exports.obtenerGestoraPorId = async (req, res) => {
  try {
    const gestora = await Gestora.findByPk(req.params.id);
    if (gestora) {
      res.json(gestora);
    } else {
      res.status(404).send('Gestora no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Crear una nueva gestora
exports.crearGestora = async (req, res) => {
  try {
    const nuevaGestora = await Gestora.create(req.body);
    res.status(201).json(nuevaGestora);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Actualizar una gestora
exports.actualizarGestora = async (req, res) => {
  try {
    const [filasActualizadas] = await Gestora.update(req.body, {
      where: { id: req.params.id },
    });
    if (filasActualizadas === 0) {
      res.status(404).send('Gestora no encontrada');
    } else {
      res.json({ message: 'Gestora actualizada con éxito' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Eliminar una gestora
exports.eliminarGestora = async (req, res) => {
  try {
    const gestoraEliminada = await Gestora.destroy({
      where: { id: req.params.id },
    });
    if (gestoraEliminada) {
      res.json({ message: 'Gestora eliminada con éxito' });
    } else {
      res.status(404).send('Gestora no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Obtener las gestoras activas en un país específico
exports.obtenerGestorasPorPais = async (req, res) => {
  try {
    const { pais_id } = req.params;
    const gestoras = await Gestora.findAll({
      where: { pais_id },
    });
    res.json(gestoras);
  } catch (error) {
    res.status(500).send('Error al obtener las gestoras por país');
  }
};
