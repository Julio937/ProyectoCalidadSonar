# 📈 Broker de Acciones - API REST

Esta es una API REST para una aplicación tipo **broker de acciones**, que permite a los usuarios registrarse, iniciar sesión, gestionar su portafolio de acciones, asociarlas según las reglas de su país y consultar su balance y ganancias. El backend está desarrollado en **Node.js** usando **Express.js**, con una base de datos relacional gestionada por Sequelize.

## 🚀 Funcionalidades

- Registro y autenticación de usuarios con JWT.
- Asociación y desasociación de acciones por usuario.
- Validación por país para permitir ciertas acciones.
- Gestión completa de usuarios (CRUD).
- Consulta de ganancias y balance del usuario.
- Transacciones de compra y venta de acciones.

## 📦 Tecnologías utilizadas

- **Node.js** + **Express**
- **Sequelize** (ORM)
- **MySQL**
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas
- **Jest + Supertest** para pruebas unitarias
- **SonarQube** para análisis de calidad de código

## 🛡 Seguridad

- Uso de JWT para sesiones seguras.
- Contraseñas encriptadas con bcrypt.
- CORS configurado para aceptar solo orígenes seguros.
- Se elimina la cabecera `X-Powered-By` para evitar la exposición de la tecnología usada.
- Prácticas seguras contra vulnerabilidades comunes (XSS, inyecciones, etc.).

## ✅ Calidad del código (SonarQube)

- **Security**: 0 vulnerabilidades detectadas.
- **Reliability**: sin errores de fiabilidad.
- **Maintainability**: sin deuda técnica.
- **Duplications**: 0% de código duplicado.
- **Coverage**: Cobertura de pruebas superior al 85%.
- **Security Hotspots**: mitigados con validación de CORS y ocultamiento de versión.

## 🧪 Pruebas

Se implementaron pruebas unitarias con Jest y Supertest para los siguientes controladores:

- `authController`
- `usuarioController`
- `monedaController`
- `transaccionesController`

Las pruebas incluyen:

- Rutas exitosas y casos de error.
- Simulación de fallos de base de datos.
- Comprobación de validaciones de negocio (por país, duplicados, etc.).
- Casos con status `201`, `200`, `404`, `403`, `500`.
