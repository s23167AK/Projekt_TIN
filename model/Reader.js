const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Reader = sequelize.define('Reader', {
    id_reader: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true,
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pole jest wymagane",
            },
            len: {
                args: [2, 60],
                msg: "Pole powinno zawierać od 2 do 60 znaków",
            },
        },
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pole jest wymagane",
            },
            len: {
                args: [2, 60],
                msg: "Pole powinno zawierać od 2 do 60 znaków",
            },
        },
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Pole jest wymagane",
            },
            len: {
                args:[5,60],
                msg: "Pole powinno zawierać od 5 do 60 znaków"
            },
            isEmail: {
                msg: "Pole powinno zawierać prawidłowy adres email",
            },
        },
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pole jest wymagane",
            },
            len: {
                args: [9],
                msg: "Pole powinno być liczbą 9 cyfrową"
            },
            isNumeric: {
                msg: "Pole powinno być liczbą"
            },
        },
    },
}, {
    freezeTableName: true,
});

module.exports = Reader;
