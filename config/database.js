const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'aws-abbas.c5osoi48c22a.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: '903911865+',
    database: 'Rental',
    port: 3306,
    timezone: '+03:00'
});

module.exports = db;
