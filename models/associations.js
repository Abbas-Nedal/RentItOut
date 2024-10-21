// models/associations.js
const User = require('./User');
const Item = require('./Item');
const Rental = require('./Rental');
const Logistic = require('./Logistic');
const Review = require('./Review');
const PaymentTransaction = require('./PaymentTransaction');


User.hasMany(Item, { foreignKey: 'user_id' });
Item.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Rental, { foreignKey: 'user_id' });
Rental.belongsTo(User, { foreignKey: 'user_id' });

Item.hasMany(Rental, { foreignKey: 'item_id' });
Rental.belongsTo(Item, { foreignKey: 'item_id' });

Rental.hasOne(Logistic, { foreignKey: 'rental_id' });
Logistic.belongsTo(Rental, { foreignKey: 'rental_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Item.hasMany(Review, { foreignKey: 'item_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Item, { foreignKey: 'item_id' });

Rental.hasOne(PaymentTransaction, { foreignKey: 'rental_id' });
PaymentTransaction.belongsTo(Rental, { foreignKey: 'rental_id' });

module.exports = {
    User,
    Item,
    Rental,
    Logistic,
    Review,
    PaymentTransaction
};
