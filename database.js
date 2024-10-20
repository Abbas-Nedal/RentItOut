//database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Rental', 'admin', '903911865+', {
    host: 'aws-abbas.c5osoi48c22a.eu-north-1.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306
});

sequelize.sync(); // Sync all models with the database

module.exports = sequelize;
