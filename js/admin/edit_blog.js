var db = firebase.firestore();
var urlParams = new URLSearchParams(window.location.search);
var article = urlParams.get('article');
loadArticle();
loadComments();

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

function loadArticle() {
    db.collection("articles").doc(article).get().then(doc => {
        document.getElementById("loader-wrapper").style.display = "none";
        if (doc.exists) {
            var data = doc.data();
            document.getElementById("title").value = data.title;
            // document.getElementById("url").value = data.imgUrl;
            $('#body').trumbowyg('html', data.body);
            // document.getElementById("body").value = data.body;
            document.getElementById("likes").innerHTML = data.likes
            document.getElementById("views").innerHTML = data.views
            document.getElementById("comment-number").innerHTML = data.comments
        } else {
            var alertDanger = document.getElementsByClassName("alert-danger")[0];
            alertDanger.innerHTML = "article not found, fill the forms to create a new one.";
            alertDanger.style.display = "block";
        }
    })
        .catch(err => {
            document.getElementById("loader-wrapper").style.display = "none";
            document.getElementsByClassName("article-details")[0].innerHTML = `
            <div class="text-danger pt-2 pl-2 pb-2"><h3>Error while loading article</h3></div>
            `
        })
}

function updateBlog(event) {
    event.preventDefault();
    var title = document.getElementById("title");
    var file = document.getElementById("image").files[0];
    var body = document.getElementById("body");
    var loader = document.getElementById("container-loader");
    var titleValid = isInputValid(title, false, 3, 100);
    var bodyValid = isInputValid(body, false, 10);

    if (!titleValid || !bodyValid) {
        return
    }

    loader.style.display = "flex";
    var values = {title: title.value, body: body.value};
    var submitBtn = document.getElementById("submit");
    submitBtn.innerHTML = "Editing article....";
    fileUploader(file).then(({imgUrl}) => {
        uploadLogic({...values, imgUrl}, submitBtn, loader)
    })
        .catch(err => {
            uploadLogic(values, submitBtn, loader)
        })
}

function uploadLogic(form, submitBtn, loader) {
    console.log(form)
    db.collection("articles").doc(article).update({
        ...form
    })
        .then(function (docRef) {
            submitBtn.innerHTML = "Edit Article";
            var alertSuccess = document.getElementsByClassName("alert-success")[0];
            alertSuccess.innerHTML = "Article updated successfully";
            alertSuccess.style.display = "block";
            loader.style.display = "none";
        })
        .catch(function (error) {
            var alertDanger = document.getElementsByClassName("alert-danger")[0];
            alertDanger.innerHTML = "Error while updating the article.";
            alertDanger.style.display = "block";
            loader.style.display = "none";
        });
}

function loadComments() {
    db.collection("comments").where("article_id", "==", article).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            var id = doc.id;
            document.getElementsByClassName("comments")[0].innerHTML += `
              <div class="comment">
                            <h3 class="comment-name">${data.names}</h3>
                            <div class="comment-body">
                                ${data.content}
                            </div>
                        </div>
            `
        });
    })
}

function deleteArticle(event) {
    event.preventDefault();
    var comments_number = Number(document.getElementById("comment-number").innerText);
    var comment_count = 0;
    if (!confirm("Delete this article?")) return;
    var deleteBtn = document.getElementById("delete");
    deleteBtn.innerText = "Deleting....";
    db.collection("articles").doc(article).delete().then(function () {
        if (comments_number==0) {
            window.location = "index.html"
        }
        db.collection("comments").where("article_id", "==", article).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                comment_count++;
                doc.ref.delete().then(() => {
                    if (comment_count == comments_number) {
                        window.location = "index.html"
                    }
                });
            })
        })
    }).catch(function (error) {
        deleteBtn.innerText = "Delete";
        alert("Error while deleting!")
    });
}