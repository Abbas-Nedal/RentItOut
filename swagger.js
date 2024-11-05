// swagger.js

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Rental Platform API',
        description: 'API documentation for the Rental Platform',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];




