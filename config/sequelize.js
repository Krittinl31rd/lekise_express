const { Sequelize } = require('sequelize');

// Set up Sequelize with MySQL connection
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'mysql',
//     logging: false,
// });

const sequelize = new Sequelize('IOTServer', 'sa', '123456789', {
    host: 'localhost',
    dialect: 'mssql',
    logging: false,
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to SQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();

module.exports = sequelize;
