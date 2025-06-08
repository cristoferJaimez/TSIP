const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Catálogo Virtual',
    version: '1.0.0',
    description: 'Documentación de la API para el catálogo virtual.\n\nEquipo 11 - Trabajo de TSIP Politécnico Grancolombiano\nIntegrantes:\n- Cristofer Ramon Jaimez Lopez\n- Manuel Fernando Muñoz Rodríguez\n- Angelyne Valentina Ortiz Eraso\n- Jim Owen Rey Forero\n- Diego Armando Rodríguez Marín\n- Lina Alejandra Yomayuza Gomez',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Documentar rutas con JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
