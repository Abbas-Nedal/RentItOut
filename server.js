require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];
const doc = require('./swagger')

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const logger = require('./config/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const logisticRoutes = require('./routes/logisticRoutes');
const itemRoutes = require('./routes/itemRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(bodyParser.json());

// Middleware to log requests
app.use((req, res, next) => {
    const logMessage = `${req.method} ${req.url} - HTTP/${req.httpVersion} - ${req.headers['user-agent']}`;
    logger.info(logMessage);
    next();
});

db.getConnection()
    .then(connection => {
        console.log('Database connected');
        connection.release();
    })
    .catch(err => console.error('Unable to connect to the DB:', err));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/logistics', logisticRoutes);
app.use('/api/v1/items', itemRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to RentItOut Platform!');
});

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    const PORT = 3000;
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
});
