const { validateReaderData } = require('../helpers/validation');

exports.getAllReaders = async (req, res) => {
    try {
        const [readers] = await req.db.query('SELECT * FROM reader');
        res.render('pages/reader/list', {
            readers: readers,
            navLocation: 'readers',
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showReaderDetails = async (req, res) => {
    try {
        const [reader] = await req.db.query('SELECT * FROM reader WHERE id_reader = ?', [req.params.id]);
        if (!reader.length) {
            return res.status(404).send('Nie znaleziono czytelnika');
        }
        const [borrowings] = await req.db.query(`
            SELECT borrowing.id_borrow, borrowing.borrow_date, borrowing.return_date,
                   book.title AS book_title
            FROM borrowing
            JOIN book ON borrowing.id_book = book.id_book
            WHERE borrowing.id_reader = ?
        `, [req.params.id]);

        res.render('pages/reader/details', {
            reader: reader[0],
            borrowings: borrowings,
            navLocation: 'readers',
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showCreateForm = (req, res) => {
    res.render('pages/reader/form', {
        reader: {},
        pageTitle: 'Dodaj Nowego Czytelnika',
        formMode: 'createNew',
        btnLabel: 'Dodaj Czytelnika',
        formAction: '/readers/add',
        navLocation: 'readers',
        validationErrors: [],
    });
};

exports.createReader = async (req, res) => {
    const readerData = { ...req.body };
    const validationErrors = validateReaderData(readerData);

    if (validationErrors.length > 0) {
        return res.render('pages/reader/form', {
            reader: readerData,
            pageTitle: 'Dodaj Nowego Czytelnika',
            formMode: 'createNew',
            btnLabel: 'Dodaj Czytelnika',
            formAction: '/readers/add',
            navLocation: 'readers',
            validationErrors: validationErrors,
        });
    }

    try {
        await req.db.query(
            'INSERT INTO reader (first_name, last_name, email,phone) VALUES (?, ?, ?)',
            [readerData.first_name, readerData.last_name, readerData.email,readerData.phone]
        );
        res.redirect('/readers');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const [reader] = await req.db.query('SELECT * FROM reader WHERE id_reader = ?', [req.params.id]);
        if (!reader.length) {
            return res.status(404).send('Nie znaleziono czytelnika');
        }
        res.render('pages/reader/edit', {
            reader: reader[0],
            pageTitle: 'Edytuj Czytelnika',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/readers/edit/${req.params.id}`,
            navLocation: 'readers',
            validationErrors: [],
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.updateReader = async (req, res) => {
    const readerId = req.params.id;
    const readerData = { ...req.body };
    const validationErrors = validateReaderData(readerData);


    if (validationErrors.length > 0) {
        return res.render('pages/reader/edit', {
            reader: { ...readerData, id_reader: readerId },
            pageTitle: 'Edytuj Czytelnika',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/readers/edit/${readerId}`,
            navLocation: 'readers',
            validationErrors: validationErrors,
        });
    }

    try {
        await req.db.query(
            'UPDATE reader SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id_reader = ?',
            [readerData.first_name, readerData.last_name, readerData.email, readerData.phone, readerId]
        );
        res.redirect('/readers');

    } catch (error) {
        res.status(500).send('Błąd serwera podczas aktualizacji czytelnika: ' + error.message);
    }
};

exports.deleteReader = async (req, res) => {
    const readerId = req.params.id;
    try {
        await req.db.query('DELETE FROM reader WHERE id_reader = ?', [readerId]);
        res.redirect('/readers');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
