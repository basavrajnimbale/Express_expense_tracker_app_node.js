const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'Basavraj@123', {
    dialect: 'mysql',
    host: 'localhost',
    logging: false
});

module.exports = sequelize;

