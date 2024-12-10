function validateBookForm() {
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const yearInput = document.getElementById("year");
    const genreInput = document.getElementById("genre");
    const descriptionInput = document.getElementById("description");

    const errorTitle = document.getElementById("errorTitle");
    const errorAuthor = document.getElementById("errorAuthor");
    const errorYear = document.getElementById("errorYear");
    const errorGenre = document.getElementById("errorGenre");
    const errorDescription = document.getElementById("errorDescription");

    const errorsSummary = document.getElementById("errorsSummary");

    resetErrors(
        [titleInput, authorInput, yearInput, genreInput, descriptionInput],
        [errorTitle, errorAuthor, errorYear, errorGenre, errorDescription],
        errorsSummary
    );

    let valid = true;

    if (!checkRequired(titleInput.value)) {
        valid = false;
        titleInput.classList.add("error-input");
        errorTitle.innerText = "Pole 'Tytuł' jest wymagane";
    } else if (!checkTextLenghtRange(titleInput.value, 2, 255)) {
        valid = false;
        titleInput.classList.add("error-input");
        errorTitle.innerText = "Pole 'Tytuł' powinno zawierać od 2 do 255 znaków";
    }

    if (!checkRequired(authorInput.value)) {
        valid = false;
        authorInput.classList.add("error-input");
        errorAuthor.innerText = "Pole 'Autor' jest wymagane";
    } else if (!checkTextLenghtRange(authorInput.value, 2, 255)) {
        valid = false;
        authorInput.classList.add("error-input");
        errorAuthor.innerText = "Pole 'Autor' powinno zawierać od 2 do 255 znaków";
    }

    const currentYear = new Date().getFullYear();
    if (!checkRequired(yearInput.value)) {
        valid = false;
        yearInput.classList.add("error-input");
        errorYear.innerText = "Pole 'Rok publikacji' jest wymagane";
    } else if (!checkNumber(yearInput.value)) {
        valid = false;
        yearInput.classList.add("error-input");
        errorYear.innerText = "Pole 'Rok publikacji' musi być liczbą całkowitą";
    } else if (!checkNumberRange(yearInput.value, 1000, currentYear)) {
        valid = false;
        yearInput.classList.add("error-input");
        errorYear.innerText = `Pole 'Rok publikacji' musi być liczbą pomiędzy 1000 a ${currentYear}`;
    }

    if (!checkRequired(genreInput.value)) {
        valid = false;
        genreInput.classList.add("error-input");
        errorGenre.innerText = "Pole 'Gatunek' jest wymagane";
    }

    if (!checkTextLenghtRange(descriptionInput.value, 0, 1000)) {
        valid = false;
        descriptionInput.classList.add("error-input");
        errorDescription.innerText = "Pole 'Opis' nie może przekraczać 1000 znaków";
    }

    if (!valid) {
        errorsSummary.innerText = "Formularz zawiera błędy";
    }

    return valid;
}
