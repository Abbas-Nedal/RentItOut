require('dotenv').config();

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
const itemRoutes=require('./routes/itemRoutes');
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


app.use('/users', userRoutes);
app.use('/rentals', rentalRoutes);
app.use('/rentals',paymentRoutes );
app.use('/reviews', reviewRoutes);
app.use('/logistics', logisticRoutes);
app.use('/item',itemRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to RentItOut Platform!');
});


const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
