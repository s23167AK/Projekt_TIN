function isValidDate(dateString) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}
function validateForm() {
    let isValid = true;
    let errorSummary = "";

    const book = document.getElementById("book").value.trim();
    const errorBook = document.getElementById("errorBook");
    const reader = document.getElementById("reader").value.trim();
    const errorReader = document.getElementById("errorReader");
    const borrowDate = document.getElementById("borrow_date").value.trim();
    const errorBorrowDate = document.getElementById("errorBorrowDate");
    const returnDate = document.getElementById("return_date").value.trim();
    const errorReturnDate = document.getElementById("errorReturnDate");
    const isEdit = document.getElementById("isEdit").value === "true";

    errorBook.textContent = "";
    errorReader.textContent = "";
    errorBorrowDate.textContent = "";
    errorReturnDate.textContent = "";

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (!book) {
        errorBook.textContent = "Wybierz książkę.";
        errorSummary += "Błąd w polu Książka.\n";
        isValid = false;
    }

    if (!reader) {
        errorReader.textContent = "Wybierz czytelnika.";
        errorSummary += "Błąd w polu Czytelnik.\n";
        isValid = false;
    }
    if (!borrowDate) {
        errorBorrowDate.textContent = "Pole Data wypożyczenia jest wymagane.";
        errorSummary += "Błąd w polu Data wypożyczenia.\n";
        isValid = false;
    } else if (!isValidDate(borrowDate)) {
        errorBorrowDate.textContent = "Podaj poprawną datę wypożyczenia (YYYY-MM-DD).";
        errorSummary += "Błąd w polu Data wypożyczenia.\n";
        isValid = false;
    } else {
        const borrow = new Date(borrowDate);

        if (!isEdit && borrow < currentDate) { // Jeśli nie jest to edycja, sprawdzamy datę
            errorBorrowDate.textContent = "Data wypożyczenia nie może być wcześniejsza niż dzisiejsza data.";
            errorSummary += "Błąd w polu Data wypożyczenia.\n";
            isValid = false;
        }
    }
    if (!returnDate) {
        errorReturnDate.textContent = "Pole Data oddania jest wymagane.";
        errorSummary += "Błąd w polu Data oddania.\n";
        isValid = false;
    } else if (!isValidDate(returnDate)) {
        errorReturnDate.textContent = "Podaj poprawną datę oddania (YYYY-MM-DD).";
        errorSummary += "Błąd w polu Data oddania.\n";
        isValid = false;
    } else if (borrowDate && isValidDate(borrowDate) && isValidDate(returnDate)) {
        const borrow = new Date(borrowDate);
        const returnD = new Date(returnDate);
        if (returnD < borrow) {
            errorReturnDate.textContent = "Data oddania nie może być wcześniejsza niż data wypożyczenia.";
            errorSummary += "Błąd w polu Data oddania.\n";
            isValid = false;
        }
    }

    document.getElementById("errorSummary").innerHTML = errorSummary.replace(/\n/g, "<br>");

    return isValid;
}