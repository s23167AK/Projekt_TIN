const { validateBookData } = require('../helpers/validation');
const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa'];

exports.getAllBooks = async (req, res) => {
    try {
        // Domyślne wartości paginacji
        const page = parseInt(req.query.page) || 1; // Domyślnie strona 1
        const limit = 3; // Stała liczba rekordów na stronę
        const offset = (page - 1) * limit;

        // Pobierz książki z limitem i przesunięciem
        const [books] = await req.db.query(
            'SELECT * FROM book LIMIT ? OFFSET ?',
            [limit, offset]
        );

        // Pobierz całkowitą liczbę rekordów
        const [countResult] = await req.db.query('SELECT COUNT(*) AS count FROM book');
        const totalBooks = countResult[0].count;
        const totalPages = Math.ceil(totalBooks / limit);

        res.render('pages/book/list', {
            books: books,
            currentPage: page,
            totalPages: totalPages,
            limit: limit,
            originalUrl: req.originalUrl,
            currentLanguage: res.locals.currentLanguage,
            navLocation: 'books'
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
exports.showBookDetails = async (req, res) => {
    try {
        const [book] = await req.db.query('SELECT * FROM book WHERE id_book = ?', [req.params.id]);
        if (!book.length) {
            return res.status(404).send('Nie znaleziono książki');
        }
        const [borrowings] = await req.db.query(`
            SELECT borrowing.id_borrow, borrowing.borrow_date, borrowing.return_date,
                   reader.first_name AS reader_first_name, reader.last_name AS reader_last_name
            FROM borrowing
            JOIN reader ON borrowing.id_reader = reader.id_reader
            WHERE borrowing.id_book = ?
        `, [req.params.id]);

        res.render('pages/book/details', {
            book: book[0],
            borrowings: borrowings,
            navLocation: 'books',
            originalUrl: req.originalUrl,
            currentLanguage: res.locals.currentLanguage
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
exports.showCreateForm = (req, res) => {
    res.render('pages/book/form', {
        book: {},
        pageTitle: 'Dodaj Nową Książkę',
        formAction: '/books/add',
        navLocation: 'books',
        genres: genres,
        originalUrl: req.originalUrl,
        currentLanguage: res.locals.currentLanguage,
        validationErrors: [],
    });
};
exports.createBook = async (req, res) => {
    const bookData = { ...req.body };
    const validationErrors = validateBookData(bookData);

    if (validationErrors.length) {
        return res.render('pages/book/form', {
            book: bookData,
            pageTitle: 'Dodaj Nową Książkę',
            formMode: 'createNew',
            btnLabel: 'Dodaj Książkę',
            formAction: '/books/add',
            navLocation: 'books',
            genres: genres,
            originalUrl: req.originalUrl,
            currentLanguage: res.locals.currentLanguage,
            validationErrors: validationErrors,
        });
    }

    try {
        await req.db.query('INSERT INTO book (title, author, publication_year, genre, description) VALUES (?, ?, ?, ?, ?)', [
            bookData.title, bookData.author, bookData.publication_year, bookData.genre, bookData.description
        ]);
        res.redirect('/books');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showEditForm = async (req, res) => {
    try {
        // Pobierz książkę z bazy danych na podstawie ID
        const [book] = await req.db.query('SELECT * FROM book WHERE id_book = ?', [req.params.id]);

        // Jeśli książka nie istnieje, zwróć błąd 404
        if (!book.length) {
            return res.status(404).send('Nie znaleziono książki');
        }

        // Renderowanie widoku edycji
        res.render('pages/book/edit', {
            book: book[0], // Pierwszy wynik zapytania (jeden rekord)
            pageTitle: 'Edytuj Książkę',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/books/edit/${req.params.id}`, // Akcja formularza
            navLocation: 'books',
            genres: genres,
            originalUrl: req.originalUrl,
            currentLanguage: res.locals.currentLanguage,
            validationErrors: [],
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.updateBook = async (req, res) => {
    const bookId = req.params.id; // ID książki z parametru URL
    const bookData = { ...req.body }; // Dane przesłane z formularza
    const validationErrors = validateBookData(bookData);

    if (validationErrors.length) {
        return res.render('pages/book/edit', {
            book: { ...bookData, id_book: bookId },
            pageTitle: 'Edytuj Książkę',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/books/edit/${bookId}`,
            navLocation: 'books',
            genres: genres,
            originalUrl: req.originalUrl,
            currentLanguage: res.locals.currentLanguage,
            validationErrors: validationErrors,
        });
    }

    try {
        await req.db.query('UPDATE book SET title = ?, author = ?, publication_year = ?, genre = ?, description = ? WHERE id_book = ?', [
            bookData.title, bookData.author, bookData.publication_year, bookData.genre, bookData.description, bookId
        ]);
        res.redirect('/books');
    } catch (error) {
        res.status(500).send('Błąd serwera podczas aktualizacji książki: ' + error.message);
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await req.db.query('DELETE FROM book WHERE id_book = ?', [req.params.id]);
        res.redirect('/books');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
