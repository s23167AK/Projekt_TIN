const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');
const Reader = require('./Reader');
const Book = require('./Book');

const Borrowing = sequelize.define('Borrowing', {
    id_borrow: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    borrow_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pole jest wymagane",
            },
            isDate: {
                msg: "Pole musi być poprawną datą",
            },
            isNotFutureDate(value) {
                if (value > new Date()) {
                    throw new Error("Pole nie może być datą z przyszłości");
                }
            },
        },
    },
    return_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: "Pole musi być poprawną datą",
            },
        },
    },
}, {
    freezeTableName: true,
});

module.exports = Borrowing;
