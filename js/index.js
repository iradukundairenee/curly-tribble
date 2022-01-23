var slideIndex = 1;
showSlides(slideIndex);
setInterval(() => {
    plusSlides(1)
}, 15000)

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slide");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "grid";
}

document.getElementById("contact_form").addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var message = document.getElementById("message");
    var submitBtn = document.getElementById("submit");
    var name_valid = isInputValid(name, false, 3, 20);
    var email_valid = isInputValid(email, true);
    var message_valid = isInputValid(message, false, 10)
    if (!name_valid || !email_valid || !message_valid)
        return;
    var oldText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Sending message....";
    var db = firebase.firestore();
    db.collection("queries").add({
        name: name.value, email: email.value, message: message.value
    })
        .then(function (docRef) {
            submitBtn.innerHTML = oldText;
            document.getElementById("contact_form").reset();
            var alertSuccess = document.getElementsByClassName("alert-success")[0];
            alertSuccess.innerHTML = "Message sent successfully";
            alertSuccess.style.display = "block";
        })
        .catch(function (error) {
            var alertDanger = document.getElementsByClassName("alert-danger")[0];
            alertDanger.innerHTML = "Error while sending the message.";
            alertDanger.style.display = "block";
        });
});
getCurrentUser()

function getCurrentUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(storePosition);
    }
}

function storePosition(position) {
    var db = firebase.firestore();
    const {latitude, longitude} = position.coords;
    var today = new Date().toISOString().slice(0, 10);
    db.collection("visitors").add({
        latitude, longitude, created_at: today
    })

}
