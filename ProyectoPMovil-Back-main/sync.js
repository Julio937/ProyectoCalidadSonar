const Usuario = require('./models/usuario');

// Sincronizar el modelo 'Usuario' con la base de datos
Usuario.sync({ force: false })
  .then(() => console.log('Tabla de usuarios creada o sincronizada con éxito'))
  .catch((error) => console.error('Error al sincronizar la tabla de usuarios:', error));
