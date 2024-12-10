const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Book = sequelize.define('Book', {
    id_book: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pole 'Tytuł' jest wymagane",
            },
            len: {
                args: [2, 255],
                msg: "Pole 'Tytuł' powinno zawierać od 2 do 255 znaków",
            },
        },
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pole 'Autor' jest wymagane",
            },
            len: {
                args: [2, 255],
                msg: "Pole 'Autor' powinno zawierać od 2 do 255 znaków",
            },
        },
    },
    publication_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: "Pole 'Rok publikacji' musi być liczbą całkowitą",
            },
            min: {
                args: [1000],
                msg: "Pole 'Rok publikacji' musi być większe niż 1000",
            },
            max: {
                args: [new Date().getFullYear()],
                msg: "Pole 'Rok publikacji' nie może być w przyszłości",
            },
        },
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pole 'Gatunek' jest wymagane",
            },
            len: {
                args: [2, 255],
                msg: "Pole 'Gatunek' powinno zawierać od 2 do 255 znaków",
            },
        },
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pole 'Opis' jest wymagane",
            },
        },
    },
}, {
    freezeTableName: true,
});

module.exports = Book;

