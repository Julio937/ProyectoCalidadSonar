const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

// Definición del modelo 'Transaccion'
const Transaccion = sequelize.define(
  'transaccion',
  {
    usuario_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    accion_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'acciones',
        key: 'id',
      },
    },
    tipo: {
      type: Sequelize.ENUM('compra', 'venta'),
      allowNull: false,
    },
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha_transaccion: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'transacciones',
  }
);

// Sincronizar el modelo con la base de datos
Transaccion.sync({ force: false })
  .then(() => console.log('Modelo de transacciones sincronizado con éxito'))
  .catch((error) => console.error('Error al sincronizar el modelo de transacciones:', error));

module.exports = Transaccion;
