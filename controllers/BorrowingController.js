// const BorrowingRepository = require('../repository/BorrowingRepository');
// const BookRepository = require('../repository/BookRepository');
// const ReaderRepository = require('../repository/ReaderRepository');
//
//
// exports.getAllBorrowings = async (req, res) => {
//     try {
//         const limit = 3; // Liczba wypożyczeń na stronę
//         const page = parseInt(req.query.page) || 1; // Numer strony z parametru `?page=`
//         const offset = (page - 1) * limit; // Oblicz przesunięcie
//
//         // Pobieranie danych z repozytorium
//         const { count, rows: borrowings } = await BorrowingRepository.getPaginatedBorrowings(limit, offset);
//
//         const totalPages = Math.ceil(count / limit); // Oblicz całkowitą liczbę stron
//
//         res.render('pages/borrowing/list', {
//             borrowings: borrowings, // Wypożyczenia dla bieżącej strony
//             currentPage: page, // Numer aktualnej strony
//             totalPages: totalPages, // Całkowita liczba stron
//             navLocation: 'borrowings' // Aktywna sekcja w nawigacji
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
//
// exports.showBorrowingDetails = async (req, res) => {
//     try {
//         const borrowing = await BorrowingRepository.getBorrowingById(req.params.id);
//         if (!borrowing) {
//             return res.status(404).send('Nie znaleziono wypożyczenia');
//         }
//         res.render('pages/borrowing/details', {
//             borrowing: borrowing,
//             navLocation: 'borrowings'
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.showCreateForm = async (req, res) => {
//     try {
//         const readers = await ReaderRepository.getAllReaders();
//         const books = await BookRepository.getAllBooks();
//
//         res.render('pages/borrowing/form', {
//             borrowing: {}, // Pusty obiekt wypożyczenia (dla nowego wypożyczenia)
//             pageTitle: 'Dodaj Nowe Wypożyczenie',
//             formMode: 'createNew',
//             btnLabel: 'Dodaj Wypożyczenie',
//             formAction: '/borrowings/add',
//             navLocation: 'borrowings',
//             readers: readers,
//             books: books,
//             validationErrors: []
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.createBorrowing = async (req, res) => {
//     const borrowingData = { ...req.body };
//
//     try {
//         await BorrowingRepository.createBorrowing(borrowingData);
//         res.redirect('/borrowings');
//     } catch (error) {
//         const readers = await ReaderRepository.getAllReaders();
//         const books = await BookRepository.getAllBooks();
//
//         res.render('pages/borrowing/form', {
//             borrowing: borrowingData,
//             pageTitle: 'Dodaj Nowe Wypożyczenie',
//             formMode: 'createNew',
//             btnLabel: 'Dodaj Wypożyczenie',
//             formAction: '/borrowings/add',
//             navLocation: 'borrowings',
//             readers: readers,
//             books: books,
//             validationErrors: error.errors || []
//         });
//     }
// };
//
// exports.showEditForm = async (req, res) => {
//     try {
//         const borrowing = await BorrowingRepository.getBorrowingById(req.params.id);
//         const readers = await ReaderRepository.getAllReaders();
//         const books = await BookRepository.getAllBooks();
//
//         if (!borrowing) {
//             return res.status(404).send('Nie znaleziono wypożyczenia');
//         }
//
//         res.render('pages/borrowing/edit', {
//             borrowing: borrowing,
//             pageTitle: 'Edytuj Wypożyczenie',
//             formMode: 'edit',
//             btnLabel: 'Zapisz Zmiany',
//             formAction: `/borrowings/edit/${req.params.id}`,
//             navLocation: 'borrowings',
//             readers: readers,
//             books: books,
//             validationErrors: []
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.updateBorrowing = async (req, res) => {
//     const borrowingId = req.params.id;
//     const borrowingData = { ...req.body };
//
//     try {
//         await BorrowingRepository.updateBorrowing(borrowingId, borrowingData);
//         res.redirect('/borrowings');
//     } catch (error) {
//         const readers = await ReaderRepository.getAllReaders();
//         const books = await BookRepository.getAllBooks();
//
//         res.render('pages/borrowing/form', {
//             borrowing: borrowingData,
//             pageTitle: 'Edytuj Wypożyczenie',
//             formMode: 'edit',
//             btnLabel: 'Zapisz Zmiany',
//             formAction: `/borrowings/edit/${borrowingId}`,
//             navLocation: 'borrowings',
//             readers: readers,
//             books: books,
//             validationErrors: error.errors || []
//         });
//     }
// };
//
// exports.deleteBorrowing = async (req, res) => {
//     const borrowingId = req.params.id;
//
//     try {
//         await BorrowingRepository.deleteBorrowing(borrowingId);
//         res.redirect('/borrowings');
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };

// Pobierz wszystkie wypożyczenia
exports.getAllBorrowings = async (req, res) => {
    try {
        const [borrowings] = await req.db.query(
            `SELECT borrowing.id_borrow, borrowing.borrow_date, borrowing.return_date,
                    book.title AS book_title, reader.first_name AS reader_first_name, reader.last_name AS reader_last_name
             FROM borrowing
             JOIN book ON borrowing.id_book = book.id_book
             JOIN reader ON borrowing.id_reader = reader.id_reader`
        );
        res.render('pages/borrowing/list', {
            borrowings: borrowings,
            navLocation: 'borrowings',
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

// Szczegóły wypożyczenia
exports.showBorrowingDetails = async (req, res) => {
    try {
        const [borrowing] = await req.db.query(
            `SELECT borrowing.id_borrow, borrowing.borrow_date, borrowing.return_date,
                    book.title AS book_title, reader.first_name AS reader_first_name, reader.last_name AS reader_last_name
             FROM borrowing
             JOIN book ON borrowing.id_book = book.id_book
             JOIN reader ON borrowing.id_reader = reader.id_reader
             WHERE borrowing.id_borrow = ?`,
            [req.params.id]
        );

        if (!borrowing.length) {
            return res.status(404).send('Nie znaleziono wypożyczenia');
        }

        res.render('pages/borrowing/details', {
            borrowing: borrowing[0],
            navLocation: 'borrowings',
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

// Formularz dodawania wypożyczenia
exports.showCreateForm = async (req, res) => {
    try {
        const [readers] = await req.db.query('SELECT * FROM reader');
        const [books] = await req.db.query('SELECT * FROM book');

        res.render('pages/borrowing/form', {
            borrowing: {},
            pageTitle: 'Dodaj Nowe Wypożyczenie',
            formMode: 'createNew',
            btnLabel: 'Dodaj Wypożyczenie',
            formAction: '/borrowings/add',
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: [],
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

// Dodaj nowe wypożyczenie
exports.createBorrowing = async (req, res) => {
    const borrowingData = { ...req.body };

    try {
        await req.db.query(
            'INSERT INTO borrowing (book_id, reader_id, borrow_date, return_date) VALUES (?, ?, ?, ?)',
            [borrowingData.book_id, borrowingData.reader_id, borrowingData.borrow_date, borrowingData.return_date]
        );
        res.redirect('/borrowings');
    } catch (error) {
        const [readers] = await req.db.query('SELECT * FROM reader');
        const [books] = await req.db.query('SELECT * FROM book');

        res.render('pages/borrowing/form', {
            borrowing: borrowingData,
            pageTitle: 'Dodaj Nowe Wypożyczenie',
            formMode: 'createNew',
            btnLabel: 'Dodaj Wypożyczenie',
            formAction: '/borrowings/add',
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: [error.message],
        });
    }
};

// Formularz edycji wypożyczenia
exports.showEditForm = async (req, res) => {
    try {
        const [borrowing] = await req.db.query('SELECT * FROM borrowing WHERE id_borrow = ?', [req.params.id]);
        if (!borrowing.length) {
            return res.status(404).send('Nie znaleziono wypożyczenia');
        }

        const [readers] = await req.db.query('SELECT * FROM reader');
        const [books] = await req.db.query('SELECT * FROM book');

        res.render('pages/borrowing/edit', {
            borrowing: borrowing[0],
            pageTitle: 'Edytuj Wypożyczenie',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/borrowings/edit/${req.params.id}`,
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: [],
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

// Zaktualizuj wypożyczenie
exports.updateBorrowing = async (req, res) => {
    const borrowingId = req.params.id;
    const borrowingData = { ...req.body };

    try {
        await req.db.query(
            'UPDATE borrowing SET book_id = ?, reader_id = ?, borrow_date = ?, return_date = ? WHERE id_borrow = ?',
            [borrowingData.book_id, borrowingData.reader_id, borrowingData.borrow_date, borrowingData.return_date, borrowingId]
        );
        res.redirect('/borrowings');
    } catch (error) {
        const [readers] = await req.db.query('SELECT * FROM reader');
        const [books] = await req.db.query('SELECT * FROM book');

        res.render('pages/borrowing/form', {
            borrowing: borrowingData,
            pageTitle: 'Edytuj Wypożyczenie',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/borrowings/edit/${borrowingId}`,
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: [error.message],
        });
    }
};

// Usuń wypożyczenie
exports.deleteBorrowing = async (req, res) => {
    const borrowingId = req.params.id;

    try {
        await req.db.query('DELETE FROM borrowing WHERE id_borrow = ?', [borrowingId]);
        res.redirect('/borrowing');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
