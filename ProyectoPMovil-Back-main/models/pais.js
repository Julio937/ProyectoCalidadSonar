const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

// Definición del modelo 'Pais'
const Pais = sequelize.define(
  'pais',
  {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    acciones_permitidas: {
      type: Sequelize.JSON,
    },
  },
  {
    timestamps: false,
    tableName: 'paises',
  }
);

// Sincronizar el modelo con la base de datos
Pais.sync({ force: false })
  .then(() => console.log('Modelo de paises sincronizado con éxito'))
  .catch((error) => console.error('Error al sincronizar el modelo de paises:', error));

module.exports = Pais;
