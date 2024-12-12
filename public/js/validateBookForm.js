function validateForm() {
    let isValid = true;
    let errorSummary = "";

    const title = document.getElementById("title").value.trim();
    const errorTitle = document.getElementById("errorTitle");
    const author = document.getElementById("author").value.trim();
    const errorAuthor = document.getElementById("errorAuthor");
    const year = document.getElementById("year").value.trim();
    const errorYear = document.getElementById("errorYear");
    const genre = document.getElementById("genre").value.trim();
    const errorGenre = document.getElementById("errorGenre");
    const description = document.getElementById("description").value.trim();
    const errorDescription = document.getElementById("errorDescription");

    const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/u;
    const digitsPattern = /\d/;
    const specialCharsPattern = /[^a-zA-Z0-9\s.-]/;
    const yearPattern = /^\d{1,4}$/;

    errorTitle.textContent = "";
    errorAuthor.textContent = "";
    errorYear.textContent = "";
    errorGenre.textContent = "";
    errorDescription.textContent = "";

    if (title.length < 2) {
        errorTitle.textContent = "Tytuł musi mieć co najmniej 2 znaki.";
        errorSummary += "Błąd w polu Tytuł.\n";
        isValid = false;
    } else if (title.length > 60) {
        errorTitle.textContent = "Tytuł może mieć maksymalnie 60 znaków.";
        errorSummary += "Błąd w polu Tytuł.\n";
        isValid = false;
    }else if (emojiPattern.test(title)) {
        errorTitle.textContent = "Tytuł nie może zawierać emotikonów.";
        errorSummary += "Błąd w polu Tytuł.\n";
        isValid = false;
    }

    if (author.length < 2) {
        errorAuthor.textContent = "Pole Autor musi mieć co najmniej 2 znaki.";
        errorSummary += "Błąd w polu Autor.\n";
        isValid = false;
    } else if (author.length > 60) {
        errorAuthor.textContent = "Pole Autor może mieć maksymalnie 60 znaków.";
        errorSummary += "Błąd w polu Autor.\n";
        isValid = false;
    } else if (emojiPattern.test(author)) {
        errorAuthor.textContent = "Pole Autor nie może zawierać emotikonów.";
        errorSummary += "Błąd w polu Autor.\n";
        isValid = false;
    } else if (digitsPattern.test(author)) {
        errorAuthor.textContent = "Pole Autor nie może zawierać cyfr.";
        errorSummary += "Błąd w polu Autor.\n";
        isValid = false;
    }
    if (!year) {
        errorYear.textContent = "Pole Rok publikacji jest wymagane.";
        errorSummary += "Błąd w polu Rok publikacji.\n";
        isValid = false;
    } else if (isNaN(year)) {
        errorYear.textContent = "Pole Rok musi zawierać liczbę.";
        errorSummary += "Błąd w polu Rok publikacji.\n";
        isValid = false;
    } else if (!yearPattern.test(year)) {
        errorYear.textContent = "Rok publiikacju musi być liczbą całkowitą od 0 do 9999.";
        errorSummary += "Błąd w polu Rok publikacji.\n";
        isValid = false;
    }else if(specialCharsPattern.test(year)){
        errorYear.textContent = "Rok publikacji nie może zawierać znaków specjalnych.";
        errorSummary += "Błąd w polu Rok publikacji.\n";
        isValid = false;
    }
    if (genre === "") {
        errorGenre.textContent = "Wybierz odpowiedni gatunek książki.";
        errorSummary += "Błąd w polu Gatunek.\n";
        isValid = false;
    }
    if (description.length < 10) {
        errorDescription.textContent = "Opis musi mieć co najmniej 10 znaków.";
        errorSummary += "Błąd w polu Opis.\n";
        isValid = false;
    } else if (description.length > 500) {
        errorDescription.textContent = "Opis może mieć maksymalnie 500 znaków.";
        errorSummary += "Błąd w polu Opis.\n";
        isValid = false;
    } else if (emojiPattern.test(description)) {
        errorDescription.textContent = "Opis nie może zawierać emotikonów.";
        errorSummary += "Błąd w polu Opis.\n";
        isValid = false;
    }

    document.getElementById("errorSummary").innerHTML = errorSummary.replace(/\n/g, "<br>");

    return isValid;
}