var db = firebase.firestore();
db.collection("queries").get().then((querySnapshot) => {
    document.getElementById("loader-wrapper").style.display = "none";
    querySnapshot.forEach((doc) => {
        var data = doc.data();

            document.getElementsByClassName("queries")[0].innerHTML += `
        <div class="query">
                <h4>
                    ${data.name}
                </h4>
                <p>
                    ${data.message}
                </p>
                <span>${data.email}</span>
            </div>
                      `
    });
}).catch(function (err) {
    document.getElementById("loader-wrapper").style.display = "none";
        document.getElementsByClassName("queries")[0].innerHTML = `
            <div class="text-danger pt-2 pl-2 pb-2"><h3>Error while fetching articles</h3></div>
            `
});

