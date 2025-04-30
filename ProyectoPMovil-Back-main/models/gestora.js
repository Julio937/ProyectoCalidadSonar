const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

// Definición del modelo 'Gestora'
const Gestora = sequelize.define(
  'gestora',
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
    tableName: 'gestoras',
  }
);

// Sincronizar el modelo con la base de datos
Gestora.sync({ force: false })
  .then(() => console.log('Modelo de gestoras sincronizado con éxito'))
  .catch((error) => console.error('Error al sincronizar el modelo de gestoras:', error));

module.exports = Gestora;
