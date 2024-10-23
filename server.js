const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const logger = require('./logger'); 

const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const logisticRoutes = require('./routes/logisticRoutes');

const app = express();
app.use(bodyParser.json());

// Middleware to log requests
app.use((req, res, next) => {
    const logMessage = `${req.method} ${req.url} - HTTP/${req.httpVersion} - ${req.headers['user-agent']}`;
    logger.info(logMessage);
    next();
});

// Test DB connection
db.getConnection()
    .then(connection => {
        console.log('Database connected');
        connection.release();
    })
    .catch(err => console.error('Unable to connect to the DB:', err));

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/logistics', logisticRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
