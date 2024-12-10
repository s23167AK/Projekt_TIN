const Book = require('../model/Book');
const Borrowing = require('../model/Borrowing');
const Reader = require('../model/Reader');

exports.getAllBooks = () => {
    return Book.findAll();
};

exports.getBookById = (bookId) => {
    return Book.findByPk(bookId, {
        include: [{
            model: Borrowing,
            as: 'borrowing',
            include: [{
                model: Reader,
                as: 'reader',
            }],
        }],
    });
};

exports.createBook = (bookData) => {
    return Book.create({
        title: bookData.title,
        author: bookData.author,
        publication_year: bookData.publication_year,
        genre: bookData.genre,
        description: bookData.description,
    });
};


exports.updateBook = (bookId, bookData) => {
    return Book.update(bookData, { where: { id_book: bookId } });
};

exports.deleteBook = (bookId) => {
    return Book.destroy({ where: { id_book: bookId } });
};
