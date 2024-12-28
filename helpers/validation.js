// helpers/validation.js
exports.validateBorrowingData = (data) => {
    const errors = [];
    const borrowDate = new Date(data.borrow_date);
    const today = new Date();
    const returnDate = data.return_date ? new Date(data.return_date) : null;

    if (!data.id_reader || isNaN(data.id_reader)) {
        errors.push({ path: 'id_reader', message: 'Musisz wybrać poprawnego czytelnika.' });
    }

    if (!data.id_book || isNaN(data.id_book)) {
        errors.push({ path: 'id_book', message: 'Musisz wybrać poprawną książkę.' });
    }

    if (!data.borrow_date || isNaN(borrowDate.getTime())) {
        errors.push({ path: 'borrow_date', message: 'Musisz podać poprawną datę wypożyczenia.' });
    } else if (borrowDate.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) {
        errors.push({ path: 'borrow_date', message: 'Data wypożyczenia musi być dzisiejsza.' });
    }

    if (returnDate && (isNaN(returnDate.getTime()) || returnDate <= borrowDate)) {
        errors.push({ path: 'return_date', message: 'Data zwrotu musi być późniejsza niż data wypożyczenia.' });
    }

    return errors;
};
