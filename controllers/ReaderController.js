const ReaderRepository = require('../repository/ReaderRepository');

exports.getAllReaders = async (req, res) => {
    try {
        const readers = await ReaderRepository.getAllReaders();
        res.status(200).json(readers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReaderById = async (req, res) => {
    try {
        const reader = await ReaderRepository.getReaderById(req.params.id);
        if (!reader) {
            return res.status(404).json({ message: 'Czytelnik nie znaleziony' });
        }
        res.status(200).json(reader);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createReader = async (req, res) => {
    try {
        const newReader = await ReaderRepository.createReader(req.body);
        res.status(201).json(newReader);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateReader = async (req, res) => {
    try {
        const updated = await ReaderRepository.updateReader(req.params.id, req.body);
        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Czytelnik nie znaleziony' });
        }
        res.status(200).json({ message: 'Czytelnik zaktualizowany' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteReader = async (req, res) => {
    try {
        const deleted = await ReaderRepository.deleteReader(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({ message: 'Czytelnik nie znaleziony' });
        }
        res.status(200).json({ message: 'Czytelnik usunięty' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
