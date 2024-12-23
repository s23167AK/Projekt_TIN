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

exports.createBorrowing = async (req, res) => {
    const borrowingData = { ...req.body };

    const validationErrors = [];

    if (!borrowingData.id_reader || isNaN(borrowingData.id_reader)) {
        validationErrors.push({ path: 'id_reader', message: 'Musisz wybrać poprawnego czytelnika.' });
    }

    if (!borrowingData.id_book || isNaN(borrowingData.id_book)) {
        validationErrors.push({ path: 'id_book', message: 'Musisz wybrać poprawną książkę.' });
    }

    const borrowDate = new Date(borrowingData.borrow_date);
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    if (!borrowingData.borrow_date || isNaN(borrowDate.getTime())) {
        validationErrors.push({ path: 'borrow_date', message: 'Musisz podać poprawną datę wypożyczenia.' });
    } else if (borrowingData.borrow_date !== todayString) {
        validationErrors.push({ path: 'borrow_date', message: 'Data wypożyczenia musi być dzisiejsza.' });
    }

    if (borrowingData.return_date) {
        const returnDate = new Date(borrowingData.return_date);
        if (isNaN(returnDate.getTime())) {
            validationErrors.push({ path: 'return_date', message: 'Musisz podać poprawną datę zwrotu.' });
        } else if (returnDate <= borrowDate) {
            validationErrors.push({ path: 'return_date', message: 'Data zwrotu musi być późniejsza niż data wypożyczenia.' });
        }
    }

    if (validationErrors.length > 0) {
        const [readers] = await req.db.query('SELECT * FROM reader');
        const [books] = await req.db.query('SELECT * FROM book');

        return res.render('pages/borrowing/form', {
            borrowing: borrowingData,
            pageTitle: 'Dodaj Nowe Wypożyczenie',
            formMode: 'createNew',
            btnLabel: 'Dodaj Wypożyczenie',
            formAction: '/borrowings/add',
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: validationErrors,
        });
    }

    try {
        await req.db.query(
            'INSERT INTO borrowing (id_book, id_reader, borrow_date, return_date) VALUES (?, ?, ?, ?)',
            [borrowingData.id_book, borrowingData.id_reader, borrowingData.borrow_date, borrowingData.return_date]
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
            validationErrors: [{ path: 'database', message: 'Błąd bazy danych: ' + error.message }],
        });
    }
};

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

exports.updateBorrowing = async (req, res) => {
    const borrowingId = req.params.id;
    const borrowingData = { ...req.body };

    const validationErrors = [];

    if (!borrowingData.id_reader || isNaN(borrowingData.id_reader)) {
        validationErrors.push({ path: 'id_reader', message: 'Musisz wybrać poprawnego czytelnika.' });
    }

    if (!borrowingData.id_book || isNaN(borrowingData.id_book)) {
        validationErrors.push({ path: 'id_book', message: 'Musisz wybrać poprawną książkę.' });
    }

    if (!borrowingData.borrow_date) {
        validationErrors.push({ path: 'borrow_date', message: 'Musisz podać datę wypożyczenia.' });
    } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(borrowingData.borrow_date)) {
            validationErrors.push({ path: 'borrow_date', message: 'Data wypożyczenia musi być w formacie YYYY-MM-DD.' });
        }
    }
    if (borrowingData.return_date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(borrowingData.return_date)) {
            validationErrors.push({ path: 'return_date', message: 'Data zwrotu musi być w formacie YYYY-MM-DD.' });
        } else if (new Date(borrowingData.return_date) <= new Date(borrowingData.borrow_date)) {
            validationErrors.push({
                path: 'return_date',
                message: 'Data zwrotu musi być późniejsza niż data wypożyczenia.',
            });
        }
    }

    if (validationErrors.length > 0) {
        const [readers] = await req.db.query('SELECT * FROM reader');
        const [books] = await req.db.query('SELECT * FROM book');
        const [borrowing] = await req.db.query('SELECT * FROM borrowing WHERE id_borrow = ?', [borrowingId]);

        return res.render('pages/borrowing/edit', {
            borrowing: { ...borrowingData, id_borrow: borrowingId },
            pageTitle: 'Edytuj Wypożyczenie',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/borrowings/edit/${borrowingId}`,
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: validationErrors,
        });
    }

    try {
        await req.db.query(
            'UPDATE borrowing SET id_book = ?, id_reader = ?, borrow_date = ?, return_date = ? WHERE id_borrow = ?',
            [borrowingData.id_book, borrowingData.id_reader, borrowingData.borrow_date, borrowingData.return_date, borrowingId]
        );
        res.redirect('/borrowings');
    } catch (error) {
        const [readers] = await req.db.query('SELECT * FROM reader');
        const [books] = await req.db.query('SELECT * FROM book');
        const [borrowing] = await req.db.query('SELECT * FROM borrowing WHERE id_borrow = ?', [borrowingId]);

        res.render('pages/borrowing/edit', {
            borrowing: borrowingData,
            pageTitle: 'Edytuj Wypożyczenie',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/borrowings/edit/${borrowingId}`,
            navLocation: 'borrowings',
            readers: readers,
            books: books,
            validationErrors: [{ path: 'database', message: 'Błąd bazy danych: ' + error.message }],
        });
    }
};


exports.deleteBorrowing = async (req, res) => {
    const borrowingId = req.params.id;
    try {
        await req.db.query('DELETE FROM borrowing WHERE id_borrow = ?', [borrowingId]);
        res.redirect('/borrowings');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
