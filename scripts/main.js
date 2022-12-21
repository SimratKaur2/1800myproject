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

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            user_Name = user.displayName;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        } else {
            console.log("No user is signed in.")
        }
    });
}
insertName(); //run the function

/*
The arrow notation (=>) is a shorthand syntax for defining anonymous functions in JS. 
In this case, it is being used to define a function that will be passed as an argument
to the onSnapshot method.
*/
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