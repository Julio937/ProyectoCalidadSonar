const Sequelize = require('sequelize');

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize('db_proyecto_movil', 'Julio937', 'Ndvs25_*/', {
  host: 'localhost',
  dialect: 'mysql',
});

// Verificar la conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión establecida exitosamente.');
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = sequelize;
