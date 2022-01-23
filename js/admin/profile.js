var image = document.getElementById("image");
var submitBtn = document.getElementById("submit");
var loader = document.getElementById("container-loader");
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById("loader-wrapper").style.display = "none";
        document.getElementById("email").value = user.email;
        document.getElementById("name").value = user.displayName;
        var photoUrl = user.photoURL;
        if (photoUrl != null) {
            document.getElementById("profile-image").setAttribute("src", photoUrl)
        }
    } else {
        window.location = "../login.html"
    }
});

function fileUploader(file) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref();
        var thisRef = storageRef.child(file.name);
        thisRef.put(file).then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(imgUrl => {
                resolve({imgUrl})
            }).catch(function () {
                reject()
            })
        }).catch(function () {
            reject()
        })
    })
}

function submitProfile(event) {
    event.preventDefault()
    if (!emailUpdater() || !passwordUpdater())
        return;
    var displayNameInput = document.getElementById("name");
    var nameValid = isInputValid(displayNameInput, false, 3)
    if (!nameValid)
        return;
    loader.style.display = "flex";
    submitBtn.innerHTML = "Updating profile....";
    fileUploader(image.files[0])
        .then(({imgUrl}) => {
            document.getElementById("profile-image").setAttribute("src", imgUrl)
            profileUpdateLogic({photoURL: imgUrl, displayName: displayNameInput.value})
        })
        .catch(() => {
            profileUpdateLogic({displayName: displayNameInput.value})
        })
}

function emailUpdater() {
    var user = firebase.auth().currentUser;
    var email = document.getElementById("email");
    var emailValid = isInputValid(email, true);
    if (!emailValid)
        return false;
    user.updateEmail(email.value).then(function () {
        console.log("Email updated")
    }).catch(function (error) {
        var alertDanger = document.getElementsByClassName("alert-danger")[0];
        alertDanger.innerHTML = error.message;
        alertDanger.style.display = "block";
    });
    return true
}

function passwordUpdater() {
    var password = document.getElementById("password");
    var password_confirmation = document.getElementById("password_confirmation");
    if ((password.value).trim() == "") return true;

    if (password.value != password_confirmation.value) {
        password.classList.add("invalid");
        password_confirmation.classList.add("invalid")
        var password_invalid = document.getElementById("password_invalid")
        password_invalid.style.display = "block"
        password_invalid.innerText = "Password confirmation doesn't match."
        return false
    }
    var passwordInvalid = isInputValid(password, false, 6)
    if (!passwordInvalid)
        return false
    var user = firebase.auth().currentUser;
    user.updatePassword(password.value).then(function () {

    }).catch(function (error) {
        var alertDanger = document.getElementsByClassName("alert-danger")[0];
        alertDanger.innerHTML = "Logout then log in again to update your password.";
        alertDanger.style.display = "block";
    });
    return true

}

function profileUpdateLogic(data) {
    var user = firebase.auth().currentUser;
    if (user) {
        console.log("Data: ", data)
        user.updateProfile(data)
            .then(resp => {
                loader.style.display = "none"
                submitBtn.innerText = "Submit"
                var alertSuccess = document.getElementsByClassName("alert-success")[0];
                alertSuccess.innerHTML = "Profile updated successfully";
                alertSuccess.style.display = "block";
            })
            .catch(() => {
                var alertDanger = document.getElementsByClassName("alert-danger")[0];
                alertDanger.innerHTML = "Error while updating profile.";
                alertDanger.style.display = "block";
                loader.style.display = "none"
                submitBtn.innerText = "Submit"
            })

    }
}

function logout() {
    firebase.auth().signOut().then(function (resp) {
        window.location = "../login.html";
    });
}