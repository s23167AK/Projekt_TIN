const { validateBorrowingData } = require('../helpers/validation');

// Pomocnicza funkcja do pobrania książek i czytelników
const fetchBooksAndReaders = async (db) => {
    const [readers] = await db.query('SELECT * FROM reader');
    const [books] = await db.query('SELECT * FROM book');
    return { readers, books };
};
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const localTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return localTime.toISOString().split('T')[0]; // YYYY-MM-DD
};

//pobranie wszystkich wypożyczeń
exports.getAllBorrowings = async (req, res) => {
    try {
        const [borrowings] = await req.db.query(`
            SELECT borrowing.id_borrow, borrowing.borrow_date, borrowing.return_date,
                   book.title AS book_title, reader.first_name AS reader_first_name, reader.last_name AS reader_last_name
            FROM borrowing
            JOIN book ON borrowing.id_book = book.id_book
            JOIN reader ON borrowing.id_reader = reader.id_reader
        `);
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
        const [borrowing] = await req.db.query(`
            SELECT borrowing.id_borrow, borrowing.borrow_date, borrowing.return_date,
                   book.title AS book_title, reader.first_name AS reader_first_name, reader.last_name AS reader_last_name
            FROM borrowing
            JOIN book ON borrowing.id_book = book.id_book
            JOIN reader ON borrowing.id_reader = reader.id_reader
            WHERE borrowing.id_borrow = ?
        `, [req.params.id]);

        if (!borrowing.length) return res.status(404).send('Nie znaleziono wypożyczenia');

        res.render('pages/borrowing/details',
            {
                borrowing: borrowing[0],
                navLocation: 'borrowings'
            });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

// Formularz dodawania wypożyczenia
exports.showCreateForm = async (req, res) => {
    const { readers, books } = await fetchBooksAndReaders(req.db);
    res.render('pages/borrowing/form', {
        borrowing: {},
        pageTitle: 'Dodaj Nowe Wypożyczenie',
        formMode: 'createNew',
        btnLabel: 'Dodaj Wypożyczenie',
        formAction: '/borrowings/add',
        navLocation: 'borrowings',
        readers: readers,
        books: books,
        validationErrors: []
    });
};

// Tworzenie nowego wypożyczenia
exports.createBorrowing = async (req, res) => {
    const validationErrors = validateBorrowingData(req.body);
    const { readers, books } = await fetchBooksAndReaders(req.db);

    if (validationErrors.length > 0) {
        return res.render('pages/borrowing/form', {
            borrowing: req.body,
            pageTitle: 'Dodaj Nowe Wypożyczenie',
            formMode: 'createNew',
            btnLabel: 'Dodaj Wypożyczenie',
            formAction: '/borrowings/add',
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: validationErrors
        });
    }

    try {
        await req.db.query(`
            INSERT INTO borrowing (id_book, id_reader, borrow_date, return_date) 
            VALUES (?, ?, ?, ?)`,
            [req.body.id_book, req.body.id_reader, req.body.borrow_date, req.body.return_date]
        );
        res.redirect('/borrowings');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

// Formularz edycji wypożyczenia
exports.showEditForm = async (req, res) => {
    const [borrowing] = await req.db.query('SELECT * FROM borrowing WHERE id_borrow = ?', [req.params.id]);
    if (!borrowing.length) return res.status(404).send('Nie znaleziono wypożyczenia');

    borrowing[0].borrow_date = formatDateForInput(borrowing[0].borrow_date);
    borrowing[0].return_date = formatDateForInput(borrowing[0].return_date);

    const { readers, books } = await fetchBooksAndReaders(req.db);

    res.render('pages/borrowing/edit', {
        borrowing: borrowing[0],
        pageTitle: 'Edytuj Wypożyczenie',
        formMode: 'edit',
        btnLabel: 'Zapisz Zmiany',
        formAction: `/borrowings/edit/${req.params.id}`,
        navLocation: 'borrowings',
        readers: readers,
        books: books,
        validationErrors: []
    });
};

// Aktualizacja wypożyczenia
exports.updateBorrowing = async (req, res) => {
    const validationErrors = validateBorrowingData(req.body, true);
    const { readers, books } = await fetchBooksAndReaders(req.db);

    if (validationErrors.length > 0) {
        return res.render('pages/borrowing/form', {
            borrowing: req.body,
            pageTitle: 'Edytuj Wypożyczenie',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/borrowings/edit/${req.params.id}`,
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: validationErrors
        });
    }

    try {
        await req.db.query(`
            UPDATE borrowing SET id_book = ?, id_reader = ?, borrow_date = ?, return_date = ? 
            WHERE id_borrow = ?`,
            [req.body.id_book, req.body.id_reader, req.body.borrow_date, req.body.return_date, req.params.id]
        );
        res.redirect('/borrowings');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

// Usuwanie wypożyczenia
exports.deleteBorrowing = async (req, res) => {
    try {
        await req.db.query('DELETE FROM borrowing WHERE id_borrow = ?', [req.params.id]);
        res.redirect('/borrowings');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
