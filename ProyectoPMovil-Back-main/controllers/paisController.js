const Pais = require('../models/pais');

// Obtener la lista de todos los países
exports.obtenerPaises = async (req, res) => {
  try {
    const paises = await Pais.findAll();
    res.json(paises);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Obtener un país por ID
exports.obtenerPaisPorId = async (req, res) => {
  try {
    const pais = await Pais.findByPk(req.params.id);
    if (pais) {
      res.json(pais);
    } else {
      res.status(404).send('País no encontrado');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Crear un nuevo país
exports.crearPais = async (req, res) => {
  try {
    const nuevoPais = await Pais.create(req.body);
    res.status(201).json(nuevoPais);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Actualizar un país
exports.actualizarPais = async (req, res) => {
  try {
    const paisActualizado = await Pais.update(req.body, {
      where: { id: req.params.id },
    });
    if (paisActualizado) {
      res.json({ message: 'País actualizado con éxito' });
    } else {
      res.status(404).send('País no encontrado');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Eliminar un país
exports.eliminarPais = async (req, res) => {
  try {
    const paisEliminado = await Pais.destroy({
      where: { id: req.params.id },
    });
    if (paisEliminado) {
      res.json({ message: 'País eliminado con éxito' });
    } else {
      res.status(404).send('País no encontrado');
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
