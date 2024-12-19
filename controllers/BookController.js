// const BookRepository = require('../repository/BookRepository');
//
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
// exports.getAllBooks = async (req, res) => {
//     try {
//         const limit = 3;
//         const page = parseInt(req.query.page) || 1;
//         const offset = (page - 1) * limit;
//
//         const { count, rows: books } = await BookRepository.getPaginatedBooks(limit, offset);
//
//         const totalPages = Math.ceil(count / limit);
//
//         res.render('pages/book/list', {
//             books: books,
//             currentPage: page,
//             totalPages: totalPages,
//             navLocation: 'books'
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.showBookDetails = async (req, res) => {
//     try {
//         const book = await BookRepository.getBookById(req.params.id);
//         if (!book) {
//             return res.status(404).send('Nie znaleziono książki');
//         }
//         res.render('pages/book/details', {
//             book: book,
//             navLocation: 'books'
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.showCreateForm = (req, res) => {
//     const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków
//
//     res.render('pages/book/form', {
//         book: {},
//         pageTitle: 'Dodaj Nową Książkę',
//         formMode: 'createNew',
//         btnLabel: 'Dodaj Książkę',
//         formAction: '/books/add',
//         navLocation: 'books',
//         genres: genres,
//         validationErrors: []
//     });
// };
//
//
// exports.createBook = async (req, res) => {
//     const bookData = { ...req.body };
//
//     try {
//         await BookRepository.createBook(bookData);
//         res.redirect('/books');
//     } catch (error) {
//         const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków
//
//         res.render('pages/book/form', {
//             book: bookData,
//             pageTitle: 'Dodaj Nową Książkę',
//             formMode: 'createNew',
//             btnLabel: 'Dodaj Książkę',
//             formAction: '/books/add',
//             navLocation: 'books',
//             genres: genres,
//             validationErrors: error.errors || []
//         });
//     }
// };
//
//
//
// exports.showEditForm = async (req, res) => {
//     try {
//         const book = await BookRepository.getBookById(req.params.id);
//         if (!book) {
//             return res.status(404).send('Nie znaleziono książki');
//         }
//
//         const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków
//         res.render('pages/book/edit', {
//             book: book,
//             pageTitle: 'Edytuj Książkę',
//             formMode: 'edit',
//             btnLabel: 'Zapisz Zmiany',
//             formAction: `/books/edit/${req.params.id}`,
//             navLocation: 'books',
//             genres: genres,
//             validationErrors: []
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.updateBook = async (req, res) => {
//     const bookId = req.params.id;
//     const bookData = { ...req.body };
//
//     try {
//         await BookRepository.updateBook(bookId, bookData);
//         res.redirect('/books');
//     } catch (error) {
//         const book = await BookRepository.getBookById(bookId);
//         const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa'];
//
//         res.render('pages/book/edit', {
//             book: bookData,
//             pageTitle: 'Edytuj Książkę',
//             formMode: 'edit',
//             btnLabel: 'Zapisz zmiany',
//             formAction: `/books/edit/${bookId}`,
//             navLocation: 'books',
//             genres: genres,
//             validationErrors: error.errors || []
//         });
//     }
// };
//
//
// exports.deleteBook = async (req, res) => {
//     const bookId = req.params.id;
//
//     try {
//         await BookRepository.deleteBook(bookId); // Wywołanie metody usuwania w repozytorium
//         res.redirect('/books'); // Powrót na listę książek po usunięciu
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };

// Pobierz wszystkie książki
exports.getAllBooks = async (req, res) => {
    try {
        const [books] = await req.db.query('SELECT * FROM book');
        res.render('pages/book/list', {
            books: books,
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
        res.render('pages/book/details', {
            book: book[0],
            navLocation: 'books',
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
exports.showCreateForm = (req, res) => {
    const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków

    res.render('pages/book/form', {
        book: {}, // Pusty obiekt książki
        pageTitle: 'Dodaj Nową Książkę',
        formMode: 'createNew',
        btnLabel: 'Dodaj Książkę',
        formAction: '/books/add',
        navLocation: 'books',
        genres: genres,
        validationErrors: [], // Puste błędy walidacji
    });
};
exports.createBook = async (req, res) => {
    const bookData = { ...req.body }; // Dane z formularza
    const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków

    try {
        // Wstawienie danych do bazy
        await req.db.query(
            'INSERT INTO book (title, author, publication_year, genre, description) VALUES (?, ?, ?, ?, ?)',
            [
                bookData.title,
                bookData.author,
                bookData.publication_year,
                bookData.genre,
                bookData.description,
            ]
        );
        // Przekierowanie na listę książek po pomyślnym dodaniu
        res.redirect('/books');
    } catch (error) {
        res.render('pages/book/form', {
            book: bookData,
            pageTitle: 'Dodaj Nową Książkę',
            formMode: 'createNew',
            btnLabel: 'Dodaj Książkę',
            formAction: '/books/add',
            navLocation: 'books',
            genres: genres,
            validationErrors: [{ path: 'database', message: 'Nie udało się zapisać książki. Sprawdź dane.' }], // Przykładowy komunikat
        });
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

        // Lista gatunków
        const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa'];

        // Renderowanie widoku edycji
        res.render('pages/book/edit', {
            book: book[0], // Pierwszy wynik zapytania (jeden rekord)
            pageTitle: 'Edytuj Książkę',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/books/edit/${req.params.id}`, // Akcja formularza
            navLocation: 'books',
            genres: genres,
            validationErrors: [], // Puste błędy walidacji
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.updateBook = async (req, res) => {
    const bookId = req.params.id;
    const bookData = { ...req.body };

    try {
        // Aktualizacja danych książki w bazie
        await req.db.query(
            'UPDATE book SET title = ?, author = ?, publication_year = ?, genre = ?, description = ? WHERE id_book = ?',
            [
                bookData.title,
                bookData.author,
                bookData.publication_year,
                bookData.genre,
                bookData.description,
                bookId,
            ]
        );

        // Przekierowanie po pomyślnej aktualizacji
        res.redirect('/books');
    } catch (error) {
        try {
            // Pobierz książkę ponownie, jeśli aktualizacja się nie uda
            const [book] = await req.db.query('SELECT * FROM book WHERE id_book = ?', [bookId]);

            if (!book.length) {
                return res.status(404).send('Nie znaleziono książki do aktualizacji');
            }

            // Lista gatunków
            const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa'];

            // Renderowanie widoku edycji z błędami walidacji
            res.render('pages/book/edit', {
                book: { ...book[0], ...bookData }, // Aktualne dane książki i dane z formularza
                pageTitle: 'Edytuj Książkę',
                formMode: 'edit',
                btnLabel: 'Zapisz zmiany',
                formAction: `/books/edit/${bookId}`,
                navLocation: 'books',
                genres: genres,
                validationErrors: [{ message: 'Błąd aktualizacji danych książki' }], // Przykładowe błędy walidacji
            });
        } catch (innerError) {
            res.status(500).send('Błąd serwera: ' + innerError.message);
        }
    }
};

// Usuń książkę
exports.deleteBook = async (req, res) => {
    const bookId = req.params.id;

    try {
        await req.db.query('DELETE FROM book WHERE id_book = ?', [bookId]);
        res.redirect('/books');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
