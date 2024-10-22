const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const logisticRoutes = require('./routes/logisticRoutes');

const app = express();
app.use(bodyParser.json());

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
    console.log(`Server running on port ${PORT}`);
});
