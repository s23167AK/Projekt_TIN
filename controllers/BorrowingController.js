const BorrowingRepository = require('../repository/BorrowingRepository');

exports.getAllBorrowings = async (req, res) => {
    try {
        const borrowings = await BorrowingRepository.getAllBorrowings();
        res.status(200).json(borrowings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBorrowingById = async (req, res) => {
    try {
        const borrowing = await BorrowingRepository.getBorrowingById(req.params.id);
        if (!borrowing) {
            return res.status(404).json({ message: 'Wypożyczenie nie znalezione' });
        }
        res.status(200).json(borrowing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBorrowing = async (req, res) => {
    try {
        const newBorrowing = await BorrowingRepository.createBorrowing(req.body);
        res.status(201).json(newBorrowing);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateBorrowing = async (req, res) => {
    try {
        const updated = await BorrowingRepository.updateBorrowing(req.params.id, req.body);
        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Wypożyczenie nie znalezione' });
        }
        res.status(200).json({ message: 'Wypożyczenie zaktualizowane' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteBorrowing = async (req, res) => {
    try {
        const deleted = await BorrowingRepository.deleteBorrowing(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({ message: 'Wypożyczenie nie znalezione' });
        }
        res.status(200).json({ message: 'Wypożyczenie usunięte' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
