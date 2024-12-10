const sequelize = require('./sequelize');
const Book = require('../model/Book');
const Borrowing = require('../model/Borrowing');
const Reader = require('../model/Reader');

module.exports = () => {
    Book.hasMany(Borrowing, {
        as: 'borrowing',
        foreignKey: { name: 'id_book', allowNull: false },
        onDelete: 'CASCADE'
    });

    Borrowing.belongsTo(Book, {
        as: 'book',
        foreignKey: { name: 'id_book', allowNull: false }
    });

    Reader.hasMany(Borrowing, {
        as: 'borrowing',
        foreignKey: { name: 'id_reader', allowNull: false },
        onDelete: 'CASCADE'
    });

    Borrowing.belongsTo(Reader, {
        as: 'reader',
        foreignKey: { name: 'id_reader', allowNull: false }
    });

    return sequelize
        .sync({ force: true })
        .then(() => {
            console.log('Modele zsynchronizowane z bazą danych.');

            return Book.bulkCreate([
                { title: 'Lalka', author: 'Bolesław Prus', publication_year: 1890, genre: 'Powieść', description: 'Opowieść o losach Stanisława Wokulskiego.' },
                { title: 'W pustyni i w puszczy', author: 'Henryk Sienkiewicz', publication_year: 1911, genre: 'Powieść przygodowa', description: 'Historia dzieci porwanych w Afryce.' },
                { title: 'Pan Tadeusz', author: 'Adam Mickiewicz', publication_year: 1834, genre: 'Epopeja', description: 'Ostatni zajazd na Litwie.' },
                { title: 'Quo Vadis', author: 'Henryk Sienkiewicz', publication_year: 1896, genre: 'Powieść historyczna', description: 'Miłość w czasach prześladowań chrześcijan.' },
                { title: 'Dziady', author: 'Adam Mickiewicz', publication_year: 1823, genre: 'Dramat romantyczny', description: 'Dramat poświęcony duchowości i historii Polski.' }
            ]);
        })
        .then(() => {
            return Reader.bulkCreate([
                { first_name: 'Jan', last_name: 'Kowalski', email: 'jan.kowalski@gmail.com', phone: '123456789' },
                { first_name: 'Anna', last_name: 'Nowak', email: 'anna.nowak@gmail.com', phone: '987654321' },
                { first_name: 'Piotr', last_name: 'Zawadzki', email: 'piotr.zawadzki@gmail.com', phone: '555666777' },
                { first_name: 'Ewa', last_name: 'Kwiatkowska', email: 'ewa.kwiatkowska@gmail.com', phone: '444555666' },
                { first_name: 'Marek', last_name: 'Wiśniewski', email: 'marek.wisniewski@gmail.com', phone: '333444555' }
            ]);
        })
        .then(() => {
            return Borrowing.bulkCreate([
                { borrow_date: '2024-11-01', return_date: '2024-11-15', id_reader: 1, id_book: [0] },
                { borrow_date: '2024-11-05', return_date: '2024-11-20', id_reader: 2, id_book: [1] },
                { borrow_date: '2024-11-10', return_date: '2024-11-25', id_reader: 3, id_book: 3 },
                { borrow_date: '2024-11-12', return_date: '2024-11-22', id_reader: 4, id_book: 4 },
                { borrow_date: '2024-11-15', return_date: null, id_reader: 5, id_book: 5 }
            ]);
        })
        .then(() => {
            console.log('Dane przykładowe zostały dodane.');
        })
        .catch(err => {
            console.error('Błąd synchronizacji modeli lub dodawania danych:', err);
        });
};
