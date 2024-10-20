// models/PaymentTransaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Rental = require('./Rental');

const PaymentTransaction = sequelize.define('PaymentTransaction', {
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
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('credit_card', 'paypal', 'cash'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    }
}, {
    timestamps: false,
    tableName: 'payment_transactions'
});

module.exports = PaymentTransaction;
