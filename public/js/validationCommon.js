function checkRequired(value) {
    return value && value.trim() !== '';
}

function checkTextLenghtRange(value, min, max) {
    return value.length >= min && value.length <= max;
}

function checkNumber(value) {
    return !isNaN(value);
}

function checkNumberRange(value, min, max) {
    const number = parseInt(value, 10);
    return number >= min && number <= max;
}

function resetErrors(inputs, errorTexts, errorSummary) {
    inputs.forEach(input => input.classList.remove('error-input'));
    errorTexts.forEach(errorText => errorText.innerText = '');
    errorSummary.innerText = '';
}
