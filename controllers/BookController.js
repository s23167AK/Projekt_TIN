
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
    const bookData = { ...req.body }; // Dane przesłane z formularza
    const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków

    const validationErrors = [];

    if (!bookData.title || bookData.title.trim().length < 2) {
        validationErrors.push({ path: 'title', message: 'Tytuł musi mieć co najmniej 2 znaki.' });
    }

    if (!bookData.author || bookData.author.trim().length < 2) {
        validationErrors.push({ path: 'author', message: 'Autor musi mieć co najmniej 2 znaki.' });
    }

    const currentYear = new Date().getFullYear();
    if (!bookData.publication_year || bookData.publication_year < 1000 || bookData.publication_year > currentYear) {
        validationErrors.push({ path: 'publication_year', message: `Rok publikacji musi być pomiędzy 1000 a ${currentYear}.` });
    }

    if (!genres.includes(bookData.genre)) {
        validationErrors.push({ path: 'genre', message: 'Nieprawidłowy gatunek książki.' });
    }

    if (!bookData.description || bookData.description.trim().length < 10) {
        validationErrors.push({ path: 'description', message: 'Opis musi zawierać co najmniej 10 znaków.' });
    }

    if (validationErrors.length > 0) {
        return res.render('pages/book/form', {
            book: bookData,
            pageTitle: 'Dodaj Nową Książkę',
            formMode: 'createNew',
            btnLabel: 'Dodaj Książkę',
            formAction: '/books/add',
            navLocation: 'books',
            genres: genres,
            validationErrors: validationErrors,
        });
    }
    try {
        await req.db.query(
            'INSERT INTO book (title, author, publication_year, genre, description) VALUES (?, ?, ?, ?, ?)',
            [bookData.title, bookData.author, bookData.publication_year, bookData.genre, bookData.description]
        );
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
    const bookId = req.params.id; // ID książki z parametru URL
    const bookData = { ...req.body }; // Dane przesłane z formularza
    const genres = ['Powieść', 'Dramat', 'Fantasy', 'Historyczna', 'Sci-Fi', 'Przygodowa']; // Lista gatunków

    const validationErrors = [];

    // 🛡️ **1. Walidacja Tytułu**
    if (!bookData.title || bookData.title.trim().length < 2) {
        validationErrors.push({ path: 'title', message: 'Tytuł musi mieć co najmniej 2 znaki.' });
    }

    // 🛡️ **2. Walidacja Autora**
    if (!bookData.author || bookData.author.trim().length < 2) {
        validationErrors.push({ path: 'author', message: 'Autor musi mieć co najmniej 2 znaki.' });
    }

    // 🛡️ **3. Walidacja Roku Publikacji**
    const currentYear = new Date().getFullYear();
    if (!bookData.publication_year || bookData.publication_year < 1000 || bookData.publication_year > currentYear) {
        validationErrors.push({ path: 'publication_year', message: `Rok publikacji musi być pomiędzy 1000 a ${currentYear}.` });
    }

    // 🛡️ **4. Walidacja Gatunku**
    if (!genres.includes(bookData.genre)) {
        validationErrors.push({ path: 'genre', message: 'Nieprawidłowy gatunek książki.' });
    }

    // 🛡️ **5. Walidacja Opisu**
    if (!bookData.description || bookData.description.trim().length < 10) {
        validationErrors.push({ path: 'description', message: 'Opis musi zawierać co najmniej 10 znaków.' });
    }

    // 🛑 **Jeśli występują błędy walidacji, zwróć formularz edycji z błędami**
    if (validationErrors.length > 0) {
        return res.render('pages/book/edit', {
            book: { ...bookData, id_book: bookId }, // Zachowanie danych użytkownika
            pageTitle: 'Edytuj Książkę',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/books/edit/${bookId}`,
            navLocation: 'books',
            genres: genres,
            validationErrors: validationErrors,
        });
    }

    // ✅ **Jeśli walidacja się powiodła, wykonaj aktualizację w bazie**
    try {
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

        res.redirect('/books'); // Przekierowanie po pomyślnej aktualizacji
    } catch (error) {
        // 🛑 **Obsługa błędu bazy danych**
        return res.status(500).send('Błąd serwera podczas aktualizacji książki: ' + error.message);
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
