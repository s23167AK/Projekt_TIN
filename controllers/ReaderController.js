// const ReaderRepository = require('../repository/ReaderRepository');
//
// exports.getAllReaders = async (req, res) => {
//     try {
//         const limit = 3;
//         const page = parseInt(req.query.page) || 1;
//         const offset = (page - 1) * limit;
//
//         // Pobranie danych z repozytorium
//         const { count, rows: readers } = await ReaderRepository.getPaginatedReaders(limit, offset);
//
//         const totalPages = Math.ceil(count / limit);
//
//         res.render('pages/reader/list', {
//             readers: readers,
//             currentPage: page,
//             totalPages: totalPages,
//             navLocation: 'readers'
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.showReaderDetails = async (req, res) => {
//     try {
//         const reader = await ReaderRepository.getReaderById(req.params.id);
//         if (!reader) {
//             return res.status(404).send('Nie znaleziono czytelnika');
//         }
//         res.render('pages/reader/details', {
//             reader: reader,
//             navLocation: 'readers'
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.showCreateForm = (req, res) => {
//     res.render('pages/reader/form', {
//         reader: {}, // Pusty obiekt dla nowego czytelnika
//         pageTitle: 'Dodaj Nowego Czytelnika',
//         formMode: 'createNew',
//         btnLabel: 'Dodaj Czytelnika',
//         formAction: '/readers/add',
//         navLocation: 'readers',
//         validationErrors: [] // Puste błędy walidacji
//     });
// };
//
// exports.createReader = async (req, res) => {
//     const readerData = { ...req.body };
//
//     try {
//         await ReaderRepository.createReader(readerData);
//         res.redirect('/readers');
//     } catch (error) {
//         res.render('pages/reader/form', {
//             reader: readerData,
//             pageTitle: 'Dodaj Nowego Czytelnika',
//             formMode: 'createNew',
//             btnLabel: 'Dodaj Czytelnika',
//             formAction: '/readers/add',
//             navLocation: 'readers',
//             validationErrors: error.errors || []
//         });
//     }
// };
//
// exports.showEditForm = async (req, res) => {
//     try {
//         const reader = await ReaderRepository.getReaderById(req.params.id);
//         if (!reader) {
//             return res.status(404).send('Nie znaleziono czytelnika');
//         }
//         res.render('pages/reader/edit', {
//             reader: reader,
//             pageTitle: 'Edytuj Czytelnika',
//             formMode: 'edit',
//             btnLabel: 'Zapisz Zmiany',
//             formAction: `/readers/edit/${req.params.id}`,
//             navLocation: 'readers',
//             validationErrors: []
//         });
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
//
// exports.updateReader = async (req, res) => {
//     const readerId = req.params.id;
//     const readerData = { ...req.body };
//
//     try {
//         await ReaderRepository.updateReader(readerId, readerData);
//         res.redirect('/readers');
//     } catch (error) {
//         const reader = await ReaderRepository.getReaderById(readerId);
//
//         res.render('pages/reader/edit', {
//             reader: readerData,
//             pageTitle: 'Edytuj Czytelnika',
//             formMode: 'edit',
//             btnLabel: 'Zapisz Zmiany',
//             formAction: `/readers/edit/${readerId}`,
//             navLocation: 'readers',
//             validationErrors: error.errors || []
//         });
//     }
// };
//
// exports.deleteReader = async (req, res) => {
//     const readerId = req.params.id;
//
//     try {
//         await ReaderRepository.deleteReader(readerId);
//         res.redirect('/readers');
//     } catch (error) {
//         res.status(500).send('Błąd serwera: ' + error.message);
//     }
// };
// Pobierz wszystkich czytelników z paginacją
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


// Pobierz szczegóły czytelnika
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

// Formularz dodawania czytelnika
exports.showCreateForm = (req, res) => {
    res.render('pages/reader/form', {
        reader: {}, // Pusty obiekt dla nowego czytelnika
        pageTitle: 'Dodaj Nowego Czytelnika',
        formMode: 'createNew',
        btnLabel: 'Dodaj Czytelnika',
        formAction: '/readers/add',
        navLocation: 'readers',
        validationErrors: [], // Puste błędy walidacji
    });
};

// Dodaj nowego czytelnika
exports.createReader = async (req, res) => {
    const readerData = { ...req.body };

    try {
        await req.db.query(
            'INSERT INTO readers (first_name, last_name, email) VALUES (?, ?, ?)',
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
            validationErrors: [error.message],
        });
    }
};

// Formularz edycji czytelnika
exports.showEditForm = async (req, res) => {
    try {
        const [reader] = await req.db.query('SELECT * FROM readers WHERE id_reader = ?', [req.params.id]);
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

// Zaktualizuj dane czytelnika
exports.updateReader = async (req, res) => {
    const readerId = req.params.id;
    const readerData = { ...req.body };

    try {
        await req.db.query(
            'UPDATE readers SET first_name = ?, last_name = ?, email = ? WHERE id_reader = ?',
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
            validationErrors: [error.message],
        });
    }
};

// Usuń czytelnika
exports.deleteReader = async (req, res) => {
    const readerId = req.params.id;

    try {
        await req.db.query('DELETE FROM readers WHERE id_reader = ?', [readerId]);
        res.redirect('/readers');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
