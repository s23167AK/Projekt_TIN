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
        res.render('pages/reader/details', {
            reader: reader[0],
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

    const validationErrors = [];

    if (!readerData.first_name || readerData.first_name.trim().length < 2) {
        validationErrors.push({ path: 'first_name', message: 'Imię musi mieć co najmniej 2 znaki.' });
    }

    if (!readerData.last_name || readerData.last_name.trim().length < 2) {
        validationErrors.push({ path: 'last_name', message: 'Nazwisko musi mieć co najmniej 2 znaki.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!readerData.email || !emailRegex.test(readerData.email)) {
        validationErrors.push({ path: 'email', message: 'Podaj poprawny adres e-mail.' });
    }

    const phoneRegex = /^\d{9}$/;
    if (!readerData.phone || !phoneRegex.test(readerData.phone)) {
        validationErrors.push({ path: 'phone', message: 'Numer telefonu musi zawierać dokładnie 9 cyfr.' });
    }

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
            'INSERT INTO reader (first_name, last_name, email) VALUES (?, ?, ?)',
            [readerData.first_name, readerData.last_name, readerData.email]
        );
        res.redirect('/readers');
    } catch (error) {
        res.render('pages/reader/form', {
            reader: readerData,
            pageTitle: 'Dodaj Nowego Czytelnika',
            formMode: 'createNew',
            btnLabel: 'Dodaj Czytelnika',
            formAction: '/readers/add',
            navLocation: 'readers',
            validationErrors: [{ path: 'database', message: 'Błąd bazy danych: ' + error.message }],
        });
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

    const validationErrors = [];

    if (!readerData.first_name || readerData.first_name.trim().length < 2) {
        validationErrors.push({ path: 'first_name', message: 'Imię musi mieć co najmniej 2 znaki.' });
    }

    // 🛡️ **2. Walidacja Nazwiska**
    if (!readerData.last_name || readerData.last_name.trim().length < 2) {
        validationErrors.push({ path: 'last_name', message: 'Nazwisko musi mieć co najmniej 2 znaki.' });
    }

    // 🛡️ **3. Walidacja E-maila**
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!readerData.email || !emailRegex.test(readerData.email)) {
        validationErrors.push({ path: 'email', message: 'Podaj poprawny adres e-mail.' });
    }

    // 🛡️ **4. Walidacja Numeru Telefonu**
    const phoneRegex = /^\d{9}$/;
    if (!readerData.phone || !phoneRegex.test(readerData.phone)) {
        validationErrors.push({ path: 'phone', message: 'Numer telefonu musi zawierać dokładnie 9 cyfr.' });
    }

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
            'UPDATE reader SET first_name = ?, last_name = ?, email = ? WHERE id_reader = ?',
            [readerData.first_name, readerData.last_name, readerData.email, readerId]
        );
        res.redirect('/readers');

    } catch (error) {
        res.render('pages/reader/edit', {
            reader: readerData,
            pageTitle: 'Edytuj Czytelnika',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/readers/edit/${readerId}`,
            navLocation: 'readers',
            validationErrors: [{ path: 'database', message: 'Błąd bazy danych: ' + error.message }],
        });
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
