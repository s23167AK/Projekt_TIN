// Funkcja walidacji danych książki
exports.validateBookData = (bookData) => {
    const currentYear = new Date().getFullYear();
    const errors = [];

    if (!bookData.title || bookData.title.trim().length < 2) errors.push('Tytuł musi mieć co najmniej 2 znaki.');
    if (!bookData.author || bookData.author.trim().length < 2) errors.push('Autor musi mieć co najmniej 2 znaki.');
    if (!bookData.publication_year || bookData.publication_year < 1000 || bookData.publication_year > currentYear)
        errors.push(`Rok publikacji musi być pomiędzy 1000 a ${currentYear}.`);
    if (!genres.includes(bookData.genre)) errors.push('Nieprawidłowy gatunek książki.');
    if (!bookData.description || bookData.description.trim().length < 10) errors.push('Opis musi zawierać co najmniej 10 znaków.');

    return errors;
};

// Funkcja walidacji danych wypożyczenia
exports.validateBorrowingData = (data, isEdit = false) => {
    const errors = [];
    const borrowDate = new Date(data.borrow_date);
    const today = new Date();
    const returnDate = data.return_date ? new Date(data.return_date) : null;

    // Walidacja id_reader
    if (!data.id_reader || isNaN(data.id_reader)) {
        errors.push({ path: 'id_reader', message: 'Musisz wybrać poprawnego czytelnika.' });
    }

    // Walidacja id_book
    if (!data.id_book || isNaN(data.id_book)) {
        errors.push({ path: 'id_book', message: 'Musisz wybrać poprawną książkę.' });
    }

    // Walidacja borrow_date
    if (!data.borrow_date || isNaN(borrowDate.getTime())) {
        errors.push({ path: 'borrow_date', message: 'Musisz podać poprawną datę wypożyczenia.' });
    } else if (!isEdit && borrowDate.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) {
        // Jeśli nie edytujemy, data wypożyczenia musi być dzisiejsza
        errors.push({ path: 'borrow_date', message: 'Data wypożyczenia musi być dzisiejsza.' });
    }

    // Walidacja return_date
    if (returnDate && (isNaN(returnDate.getTime()) || returnDate <= borrowDate)) {
        errors.push({ path: 'return_date', message: 'Data zwrotu musi być późniejsza niż data wypożyczenia.' });
    }

    return errors;
};

exports.validateReaderData = (readerData) => {
    const errors = [];

    if (!readerData.first_name || readerData.first_name.trim().length < 2) {
        errors.push({ path: 'first_name', message: 'Imię musi mieć co najmniej 2 znaki.' });
    }

    if (!readerData.last_name || readerData.last_name.trim().length < 2) {
        errors.push({ path: 'last_name', message: 'Nazwisko musi mieć co najmniej 2 znaki.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!readerData.email || !emailRegex.test(readerData.email)) {
        errors.push({ path: 'email', message: 'Podaj poprawny adres e-mail.' });
    }

    const phoneRegex = /^\d{9}$/;
    if (!readerData.phone || !phoneRegex.test(readerData.phone)) {
        errors.push({ path: 'phone', message: 'Numer telefonu musi zawierać dokładnie 9 cyfr.' });
    }

    return errors;
};
