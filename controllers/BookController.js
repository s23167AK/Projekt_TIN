const BookRepository = require('../repository/BookRepository');

// exports.getAllBooks = async (req, res) => {
//     try {
//         const books = await BookRepository.getAllBooks();
//         res.render('pages/book/list', {
//             books: books,
//             navLocation: 'books'
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
exports.getAllBooks = async (req, res) => {
    try {
        const limit = 3;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { count, rows: books } = await BookRepository.getPaginatedBooks(limit, offset);

        const totalPages = Math.ceil(count / limit);

        res.render('pages/book/list', {
            books: books,
            currentPage: page,
            totalPages: totalPages,
            navLocation: 'books'
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showBookDetails = async (req, res) => {
    try {
        const book = await BookRepository.getBookById(req.params.id);
        if (!book) {
            return res.status(404).send('Nie znaleziono książki');
        }
        res.render('pages/book/details', {
            book: book,
            navLocation: 'books'
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showCreateForm = (req, res) => {
    const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków

    res.render('pages/book/form', {
        book: {},
        pageTitle: 'Dodaj Nową Książkę',
        formMode: 'createNew',
        btnLabel: 'Dodaj Książkę',
        formAction: '/books/add',
        navLocation: 'books',
        genres: genres,
        validationErrors: []
    });
};


exports.createBook = async (req, res) => {
    const bookData = { ...req.body };

    try {
        await BookRepository.createBook(bookData);
        res.redirect('/books');
    } catch (error) {
        const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków

        res.render('pages/book/form', {
            book: bookData,
            pageTitle: 'Dodaj Nową Książkę',
            formMode: 'createNew',
            btnLabel: 'Dodaj Książkę',
            formAction: '/books/add',
            navLocation: 'books',
            genres: genres,
            validationErrors: error.errors || []
        });
    }
};



exports.showEditForm = async (req, res) => {
    try {
        const book = await BookRepository.getBookById(req.params.id);
        if (!book) {
            return res.status(404).send('Nie znaleziono książki');
        }

        const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków
        res.render('pages/book/edit', {
            book: book,
            pageTitle: 'Edytuj Książkę',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/books/edit/${req.params.id}`,
            navLocation: 'books',
            genres: genres,
            validationErrors: []
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.updateBook = async (req, res) => {
    const bookId = req.params.id;
    const bookData = { ...req.body };

    try {
        await BookRepository.updateBook(bookId, bookData);
        res.redirect('/books');
    } catch (error) {
        const book = await BookRepository.getBookById(bookId);
        const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa'];

        res.render('pages/book/edit', {
            book: bookData,
            pageTitle: 'Edytuj Książkę',
            formMode: 'edit',
            btnLabel: 'Zapisz zmiany',
            formAction: `/books/edit/${bookId}`,
            navLocation: 'books',
            genres: genres,
            validationErrors: error.errors || []
        });
    }
};


exports.deleteBook = async (req, res) => {
    const bookId = req.params.id;

    try {
        await BookRepository.deleteBook(bookId); // Wywołanie metody usuwania w repozytorium
        res.redirect('/books'); // Powrót na listę książek po usunięciu
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
