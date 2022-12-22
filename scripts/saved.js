/*
Now we need to get the `hikeID` from the array saved for each user and then query from the database to populate the information.

As this page can only show saved hike for the logged-in user, we want to first find out who is the user who is logged in. Similar to part 2.1, we will put this step in a different function. To show you a different variation of writing functions, this time we will pass the user info to the next function.

Check if the user is logged in and get the “user” info to pass it to the next function:
*/

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        getBookmarks(user)
    } else {
        console.log("No user is signed in");
    }
});

function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            let CardTemplate = document.getElementById("CardTemplate");
            bookmarks.forEach(thisHikeID => {
                console.log(thisHikeID);
                db.collection("hikes").where("code", "==", thisHikeID).get().then(snap => {
                    size = snap.size;
                    queryData = snap.docs;
                    
                    if (size != 1) {
                        var doc = queryData[0].data();
                        var hikeName = doc.name; //gets the name field
                        var hikeID = doc.code; //gets the unique ID field
                        var hikeLength = doc.length; //gets the length field
                        let newCard = CardTemplate.content.cloneNode(true);
                        newCard.querySelector('.card-title').innerHTML = hikeName;
                        newCard.querySelector('.card-length').innerHTML = hikeLength;
                        newCard.querySelector('a').onclick = () => setHikeData(hikeID);
                        newCard.querySelector('img').src = `./images/${hikeID}.jpg`;
                        hikeCardGroup.appendChild(newCard);
                    } else {
                        console.log("Query has more than one data")
                    }

                })

            });
        })
}