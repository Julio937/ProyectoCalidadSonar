const Moneda = require('../models/moneda'); // Asegúrate de tener un modelo para 'Moneda'

// Obtener la lista de todas las monedas
exports.obtenerMonedas = async (req, res) => {
  try {
    const monedas = await Moneda.findAll();
    res.json(monedas);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Obtener una moneda por ID
exports.obtenerMonedaPorId = async (req, res) => {
  try {
    const moneda = await Moneda.findByPk(req.params.id);
    if (moneda) {
      res.json(moneda);
    } else {
      res.status(404).send('Moneda no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Crear una nueva moneda
exports.crearMoneda = async (req, res) => {
  try {
    const nuevaMoneda = await Moneda.create(req.body);
    res.status(201).json(nuevaMoneda);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Actualizar una moneda
exports.actualizarMoneda = async (req, res) => {
  try {
    const monedaActualizada = await Moneda.update(req.body, {
      where: { id: req.params.id },
    });
    if (monedaActualizada) {
      res.json({ message: 'Moneda actualizada con éxito' });
    } else {
      res.status(404).send('Moneda no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Eliminar una moneda
exports.eliminarMoneda = async (req, res) => {
  try {
    const monedaEliminada = await Moneda.destroy({
      where: { id: req.params.id },
    });
    if (monedaEliminada) {
      res.json({ message: 'Moneda eliminada con éxito' });
    } else {
      res.status(404).send('Moneda no encontrada');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
