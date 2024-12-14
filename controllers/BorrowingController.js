const BorrowingRepository = require('../repository/BorrowingRepository');
const BookRepository = require('../repository/BookRepository');
const ReaderRepository = require('../repository/ReaderRepository');


exports.getAllBorrowings = async (req, res) => {
    try {
        const borrowings = await BorrowingRepository.getAllBorrowings();
        res.render('pages/borrowing/list', {
            borrowings: borrowings,
            navLocation: 'borrowings'
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};


exports.showBorrowingDetails = async (req, res) => {
    try {
        const borrowing = await BorrowingRepository.getBorrowingById(req.params.id);
        if (!borrowing) {
            return res.status(404).send('Nie znaleziono wypożyczenia');
        }
        res.render('pages/borrowing/details', {
            borrowing: borrowing,
            navLocation: 'borrowings'
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showCreateForm = async (req, res) => {
    try {
        const readers = await ReaderRepository.getAllReaders();
        const books = await BookRepository.getAllBooks();

        res.render('pages/borrowing/form', {
            borrowing: {}, // Pusty obiekt wypożyczenia (dla nowego wypożyczenia)
            pageTitle: 'Dodaj Nowe Wypożyczenie',
            formMode: 'createNew',
            btnLabel: 'Dodaj Wypożyczenie',
            formAction: '/borrowings/add',
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: []
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.createBorrowing = async (req, res) => {
    const borrowingData = { ...req.body };

    try {
        await BorrowingRepository.createBorrowing(borrowingData);
        res.redirect('/borrowings');
    } catch (error) {
        const readers = await ReaderRepository.getAllReaders();
        const books = await BookRepository.getAllBooks();

        res.render('pages/borrowing/form', {
            borrowing: borrowingData,
            pageTitle: 'Dodaj Nowe Wypożyczenie',
            formMode: 'createNew',
            btnLabel: 'Dodaj Wypożyczenie',
            formAction: '/borrowings/add',
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: error.errors || []
        });
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const borrowing = await BorrowingRepository.getBorrowingById(req.params.id);
        const readers = await ReaderRepository.getAllReaders();
        const books = await BookRepository.getAllBooks();

        if (!borrowing) {
            return res.status(404).send('Nie znaleziono wypożyczenia');
        }

        res.render('pages/borrowing/edit', {
            borrowing: borrowing,
            pageTitle: 'Edytuj Wypożyczenie',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/borrowings/edit/${req.params.id}`,
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: []
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.updateBorrowing = async (req, res) => {
    const borrowingId = req.params.id;
    const borrowingData = { ...req.body };

    try {
        await BorrowingRepository.updateBorrowing(borrowingId, borrowingData);
        res.redirect('/borrowings');
    } catch (error) {
        const readers = await ReaderRepository.getAllReaders();
        const books = await BookRepository.getAllBooks();

        res.render('pages/borrowing/form', {
            borrowing: borrowingData,
            pageTitle: 'Edytuj Wypożyczenie',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/borrowings/edit/${borrowingId}`,
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: error.errors || []
        });
    }
};

exports.deleteBorrowing = async (req, res) => {
    const borrowingId = req.params.id;

    try {
        await BorrowingRepository.deleteBorrowing(borrowingId);
        res.redirect('/borrowings');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};