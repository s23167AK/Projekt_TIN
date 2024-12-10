const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('library', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;