/*
(Back-end) Use the hikeID from local storage and use it to read 
from Firestore Database in the "review.js" page to populate the 
name of the Hike in review.html.

In step 2.4, we passed hikeID to the local storage. It’s time to 
read that info from local storage.

function setHikeData(id) {
    localStorage.setItem('hikeID', id);
}
*/

//visible to all functions on this page
let hikeID = localStorage.getItem("hikeID");    

// function getHikeName(hikeCode){
    db.collection("hikes").where("code", "==", hikeID)
           .get()
           .then(queryHike => {
               //see how many items are returned from the query with ".size"
               size = queryHike.size;
               // get the documents returned from query with ".docs"
               hikes = queryHike.docs;   

               // We want to have one document per hike, so if the the result of 
               //the query is more than one, we can check it right now and clean the DB if needed.
               if (size = 1) {
                   var thisHike = hikes[0].data();
                   var name = thisHike.name;
                   document.getElementById("HikeName").innerHTML = name;
               } else {
                   console.log("Query has more than one data")
               }
           })
           .catch((error) => {
               console.log("Error getting documents: ", error);
           });
// }
// getHikeName(hikeID);

/*
Let's write the code to have access to the user information and from there, 
you can write a new collection called "Reviews" and write the user input in it.
*/
function writeReview() {
    console.log("inside write review")
    //grabbing all values entered by the user.
    let Title = document.getElementById("title").value;
    let Level = document.getElementById("level").value;
    let Season = document.getElementById("season").value;
    let Description = document.getElementById("description").value;

    //for radio buttons we need to use a different code.
    let Flooded = document.querySelector('input[name="flooded"]:checked').value;
    let Scrambled = document.querySelector('input[name="scrambled"]:checked').value;
    console.log(Title, Level, Season, Description, Flooded, Scrambled);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("Reviews").add({
                        code: hikeID,
                        userID: userID,
                        title: Title,
                        level: Level,
                        season: Season,
                        description: Description,
                        flooded: Flooded,
                        scrambled: Scrambled,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(()=>{
                        window.location.href = "thanks.html"; //new line added
                    })
                })
        } else {
            // No user is signed in.
        }
    });
}

