const ReaderRepository = require('../repository/ReaderRepository');

exports.getAllReaders = async (req, res) => {
    try {
        const readers = await ReaderRepository.getAllReaders();
        res.render('pages/reader/list', {
            readers: readers,
            navLocation: 'readers'
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showReaderDetails = async (req, res) => {
    try {
        const reader = await ReaderRepository.getReaderById(req.params.id);
        if (!reader) {
            return res.status(404).send('Nie znaleziono czytelnika');
        }
        res.render('pages/reader/details', {
            reader: reader,
            navLocation: 'readers'
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.showCreateForm = (req, res) => {
    res.render('pages/reader/form', {
        reader: {}, // Pusty obiekt dla nowego czytelnika
        pageTitle: 'Dodaj Nowego Czytelnika',
        formMode: 'createNew',
        btnLabel: 'Dodaj Czytelnika',
        formAction: '/readers/add',
        navLocation: 'readers',
        validationErrors: [] // Puste błędy walidacji
    });
};

exports.createReader = async (req, res) => {
    const readerData = { ...req.body };

    try {
        await ReaderRepository.createReader(readerData);
        res.redirect('/readers');
    } catch (error) {
        res.render('pages/reader/form', {
            reader: readerData,
            pageTitle: 'Dodaj Nowego Czytelnika',
            formMode: 'createNew',
            btnLabel: 'Dodaj Czytelnika',
            formAction: '/readers/add',
            navLocation: 'readers',
            validationErrors: error.errors || []
        });
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const reader = await ReaderRepository.getReaderById(req.params.id);
        if (!reader) {
            return res.status(404).send('Nie znaleziono czytelnika');
        }
        res.render('pages/reader/edit', {
            reader: reader,
            pageTitle: 'Edytuj Czytelnika',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/readers/edit/${req.params.id}`,
            navLocation: 'readers',
            validationErrors: []
        });
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};

exports.updateReader = async (req, res) => {
    const readerId = req.params.id;
    const readerData = { ...req.body };

    try {
        await ReaderRepository.updateReader(readerId, readerData);
        res.redirect('/readers');
    } catch (error) {
        const reader = await ReaderRepository.getReaderById(readerId);

        res.render('pages/reader/edit', {
            reader: readerData,
            pageTitle: 'Edytuj Czytelnika',
            formMode: 'edit',
            btnLabel: 'Zapisz Zmiany',
            formAction: `/readers/edit/${readerId}`,
            navLocation: 'readers',
            validationErrors: error.errors || []
        });
    }
};

exports.deleteReader = async (req, res) => {
    const readerId = req.params.id;

    try {
        await ReaderRepository.deleteReader(readerId);
        res.redirect('/readers');
    } catch (error) {
        res.status(500).send('Błąd serwera: ' + error.message);
    }
};
