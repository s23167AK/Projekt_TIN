const Borrowing = require('../model/Borrowing');
const Reader = require('../model/Reader');
const Book = require('../model/Book');

exports.getAllBorrowings = async () => {
    return Borrowing.findAll({
        include: [
            { model: Reader, as: 'reader' },
            { model: Book, as: 'book' }
        ]
    });
};

exports.getBorrowingById = (borrowingId) => {
    return Borrowing.findByPk(borrowingId, {
        include: [
            {
                model: Reader,
                as: 'reader',
            },
            {
                model: Book,
                as: 'book',
            },
        ],
    });
};

exports.createBorrowing = (borrowingData) => {
    return Borrowing.create({
        borrow_date: borrowingData.borrow_date,
        return_date: borrowingData.return_date,
        id_reader: borrowingData.id_reader,
        id_book: borrowingData.id_book,
    });
};

exports.updateBorrowing = (borrowingId, borrowingData) => {
    return Borrowing.update(borrowingData, { where: { id_borrow: borrowingId } });
};

exports.deleteBorrowing = (borrowingId) => {
    return Borrowing.destroy({ where: { id_borrow: borrowingId } });
};