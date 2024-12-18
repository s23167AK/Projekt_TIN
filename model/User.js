const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'Nazwa użytkownika nie może być pusta' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Podaj poprawny adres e-mail' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: { args: [6, 100], msg: 'Hasło musi mieć co najmniej 6 znaków' }
        }
    }
});

module.exports = User;
