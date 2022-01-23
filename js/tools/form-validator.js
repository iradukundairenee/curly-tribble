function isInputValid(input, is_email = false, min_chars = 0, max_chars = 0) {
    var is_valid = true
    var message = "";
    var inputId = input.getAttribute("id");
    var messageInvalid = document.getElementById(inputId + "_invalid")
    if (input.value.trim("") == "") {
        message = inputId + " is required";
        is_valid = false;
    }
    if (is_email) {
        if (!validateEmail(input.value)) {
            message = "Invalid email";
            is_valid = false;
        }
    }
    if (min_chars > 0) {
        if (input.value.trim().length < (Number(min_chars)+1)) {
            message = inputId + " must be greater than " + min_chars + " characters.";
            is_valid = false;
        }
    }
    if (max_chars > 0) {
        if (input.value.trim().length > max_chars) {
            message = inputId + " must be less than " + max_chars + " characters.";
            is_valid = false;
        }
    }
    if (is_valid) {
        input.classList.remove("invalid");
        messageInvalid.style.display = "none";
    } else {
        input.classList.add("invalid");
        messageInvalid.style.display = "block";
        messageInvalid.innerText = message
    }

    return is_valid;
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
