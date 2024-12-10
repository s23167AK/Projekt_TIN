const Reader = require('../model/Reader');
const Borrowing = require('../model/Borrowing');
const Book = require('../model/Book');

exports.getAllReaders = () => {
    return Reader.findAll({
        include: [{
            model: Borrowing,
            as: 'borrowing',
            include: [{
                model: Book,
                as: 'book',
            }],
        }],
    });
};

exports.getReaderById = (readerId) => {
    return Reader.findByPk(readerId, {
        include: [{
            model: Borrowing,
            as: 'borrowing',
            include: [{
                model: Book,
                as: 'book',
            }],
        }],
    });
};

exports.createReader = (readerData) => {
    return Reader.create({
        first_name: readerData.first_name,
        last_name: readerData.last_name,
        email: readerData.email,
        phone: readerData.phone,
    });
};

exports.updateReader = (readerId, readerData) => {
    return Reader.update(readerData, { where: { id_reader: readerId } });
};

exports.deleteReader = (readerId) => {
    return Reader.destroy({ where: { id_reader: readerId } });
};