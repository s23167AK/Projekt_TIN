const Borrowing = require('../model/Borrowing');
const Reader = require('../model/Reader');
const Book = require('../model/Book');

exports.getPaginatedBorrowings = async (limit, offset) => {
    try {
        return await Borrowing.findAndCountAll({
            include: [
                { model: Reader, as: 'reader' },
                { model: Book, as: 'book' }
            ],
            limit: limit,
            offset: offset,
        });
    } catch (error) {
        throw new Error('Błąd pobierania wypożyczeń: ' + error.message);
    }
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