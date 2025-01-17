const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Define the User model
/*const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});*/

// Define any associations here
//User.hasMany(Product); // A user can have many products
//Product.belongsTo(User); // Each product belongs to one user

module.exports = {
    sequelize
    //User,
    //Product,
};