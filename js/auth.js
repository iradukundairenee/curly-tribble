firebase.auth().onAuthStateChanged(function (user) {
    // var loginMenu=document.getElementById("login");
    if (!user) {
        window.location="../login.html"
    }
});

function logout() {
    firebase.auth().signOut().then(function (resp) {
        window.location = "../login.html";
    });
}

