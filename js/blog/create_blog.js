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

document.getElementById("blog_form").addEventListener("submit", function (event) {
    event.preventDefault();
    var title = document.getElementById("title");
    var body = document.getElementById("body");
    var submitBtn = document.getElementById("submit");
    var file = document.getElementById("image").files[0];
    var loader = document.getElementById("container-loader");
    var titleValid = isInputValid(title, false, 3, 100);
    var bodyValid = isInputValid(body, false, 10);

    if (!titleValid || !bodyValid) {
        return
    }

    loader.style.display = "flex";
    var oldText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Creating new article....";
    var today = new Date().toISOString().slice(0, 10)
    var db = firebase.firestore();
    fileUploader(file)
        .then(({imgUrl}) => {
            db.collection("articles").add({
                title: title.value, body: body.value, imgUrl, created_at: today, views: 0, comments: 0, likes: 0
            })
                .then(function (docRef) {
                    submitBtn.innerHTML = oldText;
                    document.getElementById("blog_form").reset();
                    $('#body').trumbowyg('html', "");
                    var alertSuccess = document.getElementsByClassName("alert-success")[0];
                    alertSuccess.innerHTML = "Article created successfully";
                    alertSuccess.style.display = "block";
                    loader.style.display = "none";
                })
                .catch(function (error) {
                    var alertDanger = document.getElementsByClassName("alert-danger")[0];
                    alertDanger.innerHTML = "Error while creating the article.";
                    alertDanger.style.display = "block";
                    loader.style.display = "none";
                });
        })
        .catch(function (error) {
            var alertDanger = document.getElementsByClassName("alert-danger")[0];
            alertDanger.innerHTML = "Error while creating the article.";
            alertDanger.style.display = "block";
            loader.style.display = "none";
        });
});