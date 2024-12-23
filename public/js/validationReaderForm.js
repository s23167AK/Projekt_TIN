function validateForm() {
    let isValid = true;
    let errorSummary = "";

    const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/u;
    const specialCharsPattern = /[^a-zA-Z0-9]/;
    const digitsPattern = /\d/;
    const phonePattern = /^[0-9]{9}$/;

    const firstName = document.getElementById("first_name").value.trim();
    const errorFirstName = document.getElementById("errorFirstName");
    const lastName = document.getElementById("last_name").value.trim();
    const errorLastName = document.getElementById("errorLastName");
    const email = document.getElementById("email").value.trim();
    const errorEmail = document.getElementById("errorEmail");
    const phone = document.getElementById("phone").value.trim();
    const errorPhone = document.getElementById("errorPhone");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    errorEmail.textContent = "";
    errorLastName.textContent = "";
    errorFirstName.textContent = "";
    errorPhone.textContent = "";

    if (firstName.length < 2) {
        errorFirstName.textContent = "Imię musi mieć co najmniej 2 znaki.";
        errorSummary += "Błąd w polu Imię.\n";
        isValid = false;
    } else if (firstName.length > 60) {
        errorFirstName.textContent = "Imię może mieć maksymalnie 60 znaków.";
        errorSummary += "Błąd w polu Imię.\n";
        isValid = false;
    } else if (digitsPattern.test(firstName)) {
        errorFirstName.textContent = "Imię nie może zawierać cyfr.";
        errorSummary += "Błąd w polu Imię.\n";
        isValid = false;
    } else if (emojiPattern.test(firstName)) {
        errorFirstName.textContent = "Imię nie może zawierać emotikonów.";
        errorSummary += "Błąd w polu Imię.\n";
        isValid = false;
    } else if (specialCharsPattern.test(firstName)) {
        errorFirstName.textContent = "Imię nie może zawierać specjalnych znaków.";
        errorSummary += "Błąd w polu Imię.\n";
        isValid = false;
    }

    if (lastName.length < 2) {
        errorLastName.textContent = "Nazwisko musi mieć co najmniej 2 znaki.";
        errorSummary += "Błąd w polu Nazwisko.\n";
        isValid = false;
    } else if (lastName.length > 60) {
        errorLastName.textContent = "Nazwisko może mieć maksymalnie 60 znaków.";
        errorSummary += "Błąd w polu Nazwisko.\n";
        isValid = false;
    } else if (digitsPattern.test(lastName)) {
        errorLastName.textContent = "Nazwisko nie może zawierać cyfr.";
        errorSummary += "Błąd w polu Nazwisko.\n";
        isValid = false;
    } else if (emojiPattern.test(lastName)) {
        errorLastName.textContent = "Nazwisko nie może zawierać emotikonów.";
        errorSummary += "Błąd w polu Nazwisko.\n";
        isValid = false;
    } else if (specialCharsPattern.test(lastName)) {
        errorLastName.textContent = "Nazwisko nie może zawierać specjalnych znaków.";
        errorSummary += "Błąd w polu Nazwisko.\n";
        isValid = false;
    }

    if (!emailPattern.test(email)) {
        errorEmail.textContent = "Podaj poprawny adres e-mail.";
        errorSummary += "Błąd w polu e-mail.\n";
        isValid = false;
    } else if (emojiPattern.test(email)) {
        errorEmail.textContent = "Adres e-mail nie może zawierać emotikonów.";
        errorSummary += "Błąd w polu e-mail.\n";
        isValid = false;
    }

    if (!phonePattern.test(phone)) {
        errorPhone.textContent = "Numer telefonu musi zawierać dokładnie 9 cyfr.";
        errorSummary += "Błąd w polu Telefon.\n";
        isValid = false;
    } else if (emojiPattern.test(phone)) {
        errorPhone.textContent = "Numer telefonu nie może zawierać emotikonów.";
        errorSummary += "Błąd w polu Telefon.\n";
        isValid = false;
    }

    document.getElementById("errorSummary").innerHTML = errorSummary.replace(/\n/g, "<br>");

    return isValid;
}
