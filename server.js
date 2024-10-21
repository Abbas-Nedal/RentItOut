// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
require('./models/associations'); // استدعاء العلاقات

const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const logisticRoutes = require('./routes/logisticRoutes');


const app = express();
app.use(bodyParser.json());

// Test DB connection
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Unable to connect to the DB:', err));

sequelize.sync()
    .then(() => console.log('Models synced with database'))
    .catch(err => console.error('Error syncing models:', err));

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/logistics', logisticRoutes);


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
