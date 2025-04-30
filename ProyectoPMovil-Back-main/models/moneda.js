const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

// Definición del modelo 'Moneda'
const Moneda = sequelize.define(
  'moneda',
  {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pais_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'paises',
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
    tableName: 'monedas',
  }
);

// Sincronizar el modelo con la base de datos
Moneda.sync({ force: false })
  .then(() => console.log('Modelo de monedas sincronizado con éxito'))
  .catch((error) => console.error('Error al sincronizar el modelo de monedas:', error));

module.exports = Moneda;
