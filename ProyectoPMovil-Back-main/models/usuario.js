const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

// Definición del modelo 'Usuario'
const Usuario = sequelize.define(
  'usuario',
  {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    apellido: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    correo: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    contraseña: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cedula: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
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
    // Opciones adicionales
    timestamps: false, // Desactiva la creación automática de las columnas 'createdAt' y 'updatedAt'
    tableName: 'usuarios',
  }
);

// // Sincronizar el modelo con la base de datos
Usuario.sync({ force: false }) // 'force: false' para no sobrescribir la tabla existente
  .then(() => console.log('Modelo de usuarios sincronizado con éxito'))
  .catch((error) => console.error('Error al sincronizar el modelo de usuarios:', error));

module.exports = Usuario;
