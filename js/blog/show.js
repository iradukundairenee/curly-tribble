var db = firebase.firestore();
var urlParams = new URLSearchParams(window.location.search);
var article = urlParams.get('article');
loadArticle();
loadRecommended();
addView();
loadComments();

function loadArticle() {
    db.collection("articles").doc(article).get().then(doc => {
        document.getElementById("loader-wrapper").style.display = "none";
        if (doc.exists) {
            var data = doc.data();
            document.getElementsByClassName("article-text")[0].innerHTML = data.body
            document.getElementsByClassName("article-title")[0].innerHTML = data.title
            document.getElementsByClassName("article-image")[0].setAttribute("src", data.imgUrl)
            document.getElementById("likes").innerHTML = data.likes
            document.getElementById("comment-number").innerHTML = data.comments
        } else {
            document.getElementsByClassName("article-details")[0].innerHTML = `
            <div class="text-danger pt-2 pl-2 pb-2"><h3>Article not found</h3></div>
            `
        }
    })
        .catch(err => {
            document.getElementById("loader-wrapper").style.display = "none";
            document.getElementsByClassName("article-details")[0].innerHTML = `
            <div class="text-danger pt-2 pl-2 pb-2"><h3>Error while loading article</h3></div>
            `
        })
}

function loadRecommended() {
    db.collection("articles").limit(6).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            var id = doc.id;
            if (id != article) {
                document.getElementsByClassName("recommended-list")[0].innerHTML += `
             <a href="blog_details.html?article=${id}" class="recommended-article">
                    <img src="${data.imgUrl}" class="recommended-image" />
                    <div class="recommended-title">
                        ${data.title}
                    </div>
                </a>
            `
            }
        });
    })
}

function addView() {
    firebase
        .firestore()
        .collection('articles')
        .doc(article)
        .update({
            views: firebase.firestore.FieldValue.increment(1)
        })
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

function addComment(event) {
    event.preventDefault();
    var names = document.getElementById("names");
    var content = document.getElementById("content");
    var submitBtn = document.getElementById("submitBtn");
    var namesValid = isInputValid(names, false, 3, 100);
    var contentValid = isInputValid(content, false, 5);
    if (!namesValid || !contentValid) return;

    var oldText = submitBtn.innerText;
    submitBtn.innerText = "Commenting..."
    db.collection("comments").add({
        names: names.value, content: content.value, article_id: article
    })
        .then(function (docRef) {
            submitBtn.innerHTML = oldText;
            document.getElementsByClassName("comments")[0].innerHTML += `
              <div class="comment">
                            <h3 class="comment-name">${names.value}</h3>
                            <div class="comment-body">
                                ${content.value}
                            </div>
                        </div>
            `
            document.getElementById("comment-form").reset();

        })

    incrementComment();
}

function incrementComment() {
    firebase
        .firestore()
        .collection('articles')
        .doc(article)
        .update({
            comments: firebase.firestore.FieldValue.increment(1)
        })
        .then(resp => {
            var comments = document.getElementById("comment-number");
            comments.innerText = Number(comments.innerText) + 1
        })
}

function addLike() {
    firebase
        .firestore()
        .collection('articles')
        .doc(article)
        .update({
            likes: firebase.firestore.FieldValue.increment(1)
        })
        .then(resp => {
            var likes = document.getElementById("likes");
            likes.innerText = Number(likes.innerText) + 1
        })
}