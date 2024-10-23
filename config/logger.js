const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDirectory = path.join(__dirname, '..', 'logs-output');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDirectory, 'app.log') })
    ],
});

module.exports = logger;



