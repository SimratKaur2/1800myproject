/*
To make our code cleaner let’s add some code at the top of our JS file to always
check if someone is logged in. If yes, then assign a global variable for the user. 
If no, then re-direct to the login page. 
*/

var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        readQuote();
        insertName();
        populateCardsDynamically();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});








//write a JS function in "main.js" to grab the name of the user from
//the from the Authentication Database.

/*first we check is the iser is logged in , if yes then the name of the
user would be displayed in the place we defined in span.
*/

//What’s the name of the user who’s logged in?

/*To get this, we will call the “`firebase.auth().onAuthStateChanged()`” function 
from the Firebase Version 8 SDK library.   It returns a call-back function object 
called “`user`”.

This pre-defined `user` object contains a few helpful fields, such as:  

- `.displayName`
- `.uid`
- `.email`

*/


// Insert name function using the global variable "currentUser"
// function insertName() {
//     currentUser.get().then(userDoc => {
//         //get the user name
//         var user_Name = userDoc.data().name;
//         console.log(user_Name);
//         $("#name-goes-here").text(user_Name); //jquery
//         // document.getElementByID("name-goes-here").innetText=user_Name;
//     })
// }
function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get().then((userDoc) => {
                //get the user name
                var user_Name = userDoc.data().name;
                console.log(user_Name);
                $("#name-goes-here").text(user_Name); //jquery
                //document.getElementByID("name-goes-here").innerText = user_Name;
            })
            console.log(user.displayName);  //print the user name in the browser console

            user_Name = user.displayName;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        }
    });
}
insertName(); //run the function

/*
The arrow notation (=>) is a shorthand syntax for defining anonymous functions in JS. 
In this case, it is being used to define a function that will be passed as an argument
to the onSnapshot method.
*/

//Change the Tuesday quote in your Firestore (in the console) and see your HTML updates accordingly!  
//The function .onSnapshot() is a real-time listener!

function readQuote() {
    db.collection("quotes").doc("Tuesday")                                                      //name of the collection and documents should matach excatly with what you have in Firestore
      .onSnapshot(somedoc => {                                                               //arrow notation
           console.log("current document data: " + somedoc.data());                          //.data() returns data object
           document.getElementById("quote-goes-here").innerHTML = somedoc.data().quote;      //using javascript to display the data on the right place
           
           //Here are other ways to access key:value data fields
           //$('#quote-goes-here').text(tuesdayDoc.data().quote);                                       //using jquery object dot notation
           //$("#quote-goes-here").text(tuesdayDoc.data()["quote"]);                                    //using json object indexing
      })
}
readQuote();        //calling the function

function writeHikes() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("hikes");

    hikesRef.add({
        code: "BBY01",
        name: "Burnaby Lake Park Trail", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        level: "easy",
        length: 10,          //number value
        length_time: 60,     //number value
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    hikesRef.add({
        code: "AM01",
        name: "Buntzen Lake Trail", //replace with your own city?
        city: "Anmore",
        province: "BC",
        level: "moderate",
        length: 10.5,      //number value
        length_time: 80,   //number value
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    hikesRef.add({
        code: "NV01",
        name: "Mount Seymour Trail", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        length: 8.2,        //number value
        length_time: 120,   //number value
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2022"))
    });
}
 writeHikes();

//-----------------------------------------------
// Create a "max" number of hike document objects
//-----------------------------------------------
// function writeHikeData() {
//     max = 21;
//     //define a variable for the collection you want to create in Firestore to populate data
//     var hikesRef = db.collection("hikes");
//     for (i = 1; i <= max; i++) {
//         hikesRef.add({ //add to database, autogen ID
//             name: "hike" + i,
//             details: "Elmo says this hike is amazing!  You will love going on hike" + i,
//             last_updated: firebase.firestore.FieldValue.serverTimestamp()
//         })
//    }
// }

// writeHikeData();

function displayCards(collection) {
    let cardTemplate = document.getElementById("hikeCardTemplate");

    db.collection(collection).get()
        .then(snap => {
            //var i = 1;  //if you want to use commented out section
            snap.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;        // get value of the "name" key
                var details = doc.data().details;   // get value of the "details" key
								var hikeID = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${hikeID}.jpg`; //Example: NV01.jpg

                //give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery
                document.getElementById(collection + "-go-here").appendChild(newcard);
                //i++;   //if you want to use commented out section
            })
        })
}

//displayCards("hikes");

function populateCardsDynamically() {
    let hikeCardTemplate = document.getElementById("hikeCardTemplate");
    let hikeCardGroup = document.getElementById("hikeCardGroup");
    
    db.collection("hikes").get()
        .then(allHikes => {
            allHikes.forEach(doc => {
                var hikeName = doc.data().name; //gets the name field
                var hikeID = doc.data().code; //gets the unique CODE field
                var hikeLength = doc.data().length; //gets the length field
                let testHikeCard = hikeCardTemplate.content.cloneNode(true);
                testHikeCard.querySelector('.card-title').innerHTML = hikeName;     //equiv getElementByClassName
                testHikeCard.querySelector('.card-length').innerHTML = hikeLength;  //equiv getElementByClassName
                testHikeCard.querySelector('a').onclick = () => setHikeData(hikeID);//equiv getElementByTagName

                //next two lines are new for demo11
                //this line sets the id attribute for the <i> tag in 
                //the format "save-hikID"
                //so later we know which hike to bookmark based on what 
                //hike was clicked.
                testHikeCard.querySelector('i').id = 'save-' + hikeID;

                //this line will call a function to save the hikes to the user's document
                testHikeCard.querySelector('i').onclick = () => saveBookmark(hikeID);
                

                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(hikeID)) {
                      document.getElementById('save-' + hikeID).innerText = 'bookmark';
                    }
             })

                testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;   //equiv getElementByTagName
                testHikeCard.querySelector('.read-more').href = "eachHike.html?hikeName="+hikeName +"&id=" + hikeID;
                hikeCardGroup.appendChild(testHikeCard);
            })

        })

        
}
populateCardsDynamically();

function setHikeData(id) {
    localStorage.setItem('hikeID', id);
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------

/*
These are the functions to use: 

- We use "`FieldValue.arrayUnion`" to add each item to the availability array.
To read more:  [https://cloud.google.com/firestore/docs/manage-data/add-data#update_elements_in_an_array](https://cloud.google.com/firestore/docs/manage-data/add-data#update_elements_in_an_array)
- We use "`.set()"`, with `"{merge:true}"`  to only update this one field.
To read more:  [https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document](https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document) ``
- We use the `hikeID` to get a pointer to the bookmark icon tag, so that we 
can change the icon from “`bookmark_border`” (name of the hollow bookmark from 
material design) to “`bookmark`” (name of the solid bookmark from material design).
*/
function saveBookmark(hikeID) {
    currentUser.set({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeID)
        }, {
            merge: true
        })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + hikeID;
            //console.log(iconID);
			//this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}

function removeBookmark(hikeID) {
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayRemove(hikeID)
    }, {
        merge: true
    })
    .then(function () {
        console.log("bookmark has been removed for: " + currentUser);
        var iconID = 'save-' + hikeID;
        //console.log(iconID);
        //this is to change the icon of the hike that was removed to "empty"
        document.getElementById(iconID).innerText = 'bookmark';
    })
}

function toggleBookmark(hikeID) {
    if(isBookmarked(hikeID)) {
        removeBookmark(hikeID);
    } else {
        saveBookmark(hikeID);
    }
}


