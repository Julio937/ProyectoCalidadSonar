const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

// Definición del modelo 'UsuarioAccion'
const UsuarioAccion = sequelize.define(
  'usuarioAccion',
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
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fecha_operacion: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'usuarios_acciones',
  }
);

// Sincronizar el modelo con la base de datos
UsuarioAccion.sync({ force: false })
  .then(() => console.log('Modelo de usuarios_acciones sincronizado con éxito'))
  .catch((error) => console.error('Error al sincronizar el modelo de usuarios_acciones:', error));

module.exports = UsuarioAccion;
