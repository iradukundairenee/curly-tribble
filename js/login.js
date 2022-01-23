firebase.auth().onAuthStateChanged(function (user) {
    // var loginMenu=document.getElementById("login");

    if (user) {
        window.location = "admin";
    }
});

function login(event) {
    event.preventDefault();
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var loginBtn = document.getElementById("login_btn");
    var loader = document.getElementById("container-loader");

    var validEmail = isInputValid(emailInput, true)
    var validPassword = isInputValid(passwordInput)

    if (!validEmail || !validPassword)
        return;
    loader.style.display = "flex";
    loginBtn.innerText = "Logging in...";
    var email = emailInput.value;
    var password = passwordInput.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (resp) {
            loader.style.display = "none";
            window.location = "admin/index.html";
        })
        .catch(function (error) {
            loader.style.display = "none";
            document.getElementById("invalid").style.display = "inline-block";
            emailInput.classList.add("invalid");
            passwordInput.classList.add("invalid");
            loginBtn.innerText = "Login";
        });
}
