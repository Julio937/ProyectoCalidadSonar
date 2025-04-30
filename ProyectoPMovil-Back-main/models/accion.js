const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

// Definición del modelo 'Accion'
const Accion = sequelize.define(
  'accion',
  {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    valor_dolares: {
      type: Sequelize.DECIMAL(10, 2), // dos decimales para el valor en dólares
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'acciones',
  }
);

// Sincronizar el modelo con la base de datos
Accion.sync({ force: false })
  .then(() => console.log('Modelo de acciones sincronizado con éxito'))
  .catch((error) => console.error('Error al sincronizar el modelo de acciones:', error));

module.exports = Accion;
