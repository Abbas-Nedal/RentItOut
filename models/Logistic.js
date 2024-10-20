const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Rental = require('./Rental');

const Logistic = sequelize.define('Logistic', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rental_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Rental,
            key: 'id'
        },
        allowNull: false
    },
    pickup_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    delivery_option: {
        type: DataTypes.ENUM('pickup', 'delivery'),
        allowNull: false
    },
    delivery_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'logistics'
});

module.exports = Logistic;
