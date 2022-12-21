//put this right after you start script tag before writing any functions.

/*
<aside>
💡 We need to update the user's document in `users` collection later in step1.4.
 In this step, we declare a "`currentUser"` reference to a user document that includes
  all user data.

In order to avoid repetition in our code, we can use this reference.. 

In order to do so, we will define a "`currentUser`" as a global variable
 OUTSIDE of all our functions,  BEFORE any of our JS functions. 

</aside>
*/
var currentUser  

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userSchool = userDoc.data().school;
                    var userCity = userDoc.data().city;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }
    });
}

//call the function to run it 
populateInfo();

function editUserInfo() {
    //enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
    console.log("Editing initiated.")
}

function saveUserInfo() {
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userSchool = document.getElementById('schoolInput').value;     //get the value of the field with id="schoolInput"
    userCity = document.getElementById('cityInput').value;       //get the value of the field with id="cityInput"


    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    
    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity
    })
    .then(() => {
        console.log("Document successfully updated!");
    })

    document.getElementById('personalInfoFields').disabled = true;

}