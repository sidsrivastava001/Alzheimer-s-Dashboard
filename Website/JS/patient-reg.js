/* var firebaseConfig = {
    apiKey: "AIzaSyAJkaDmP2xrCFIHzufBhWqKcrRK6kvvtig",
    authDomain: "tsa-software-group-2.firebaseapp.com",
    databaseURL: "https://tsa-software-group-2-default-rtdb.firebaseio.com",
    projectId: "tsa-software-group-2",
    storageBucket: "tsa-software-group-2.appspot.com",
    messagingSenderId: "1009383655239",
    appId: "1:1009383655239:web:7706faf6dcce60f7ea2e62",
    measurementId: "G-ZXHZ4YWP9V"
};
firebase.initializeApp(firebaseConfig);
// make auth and firestore references
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true }); */

var CurrentUser;



function toast(text){
    text = "<span>"+String(text)+"</span>";
    M.toast({html: text});
}
function removePeriods(input) { // Removes periods from the inputs to avoid confusing firebase and replaces them with "_()"
    //check if email contains periods
    if (input.indexOf(".") > -1) {
        //split email address at the periods
        var length = input.split(".");
        //variable to hold the final email address
        var concatenating = '';
        //iterate through the list of string fragments
        for(var i = 0; i < length.length; i++) {
            //build the string up using the string fragments and the proprietary character combination
            if (i < length.length-1){
                concatenating += length[i].valueOf() + "_()";
            }
            else {
                //leave out the proprietary character combination after the last string fragment
                concatenating += length[i].valueOf();    
            }
        }
        //ensure that email2 is a string
        email2 = concatenating.valueOf();
    }
    else {
        email2 = input;
    }
    //return email2
    return email2
}
function addPeriods(input) {    // Re-adds periods back in to the emails for correct representation
    //check if email contains periods
    input = String(input);
    if (input.indexOf("_()") > -1) {
        //split email address at the periods
        var length = input.split("_()");
        //variable to hold the final email address
        var concatenating = '';
        //iterate through the list of string fragments
        for(var i = 0; i < length.length; i++) {
            //build the string up using the string fragments and the proprietary character combination
            if (i < length.length-1){
                concatenating += length[i].valueOf() + ".";
            }
            else {
                //on the last string, don't add the period to the end of it
                concatenating += length[i].valueOf();    
            }
        }
        //ensure that concatenating is a string and put it into the email2 variable
        email2 = concatenating.valueOf();
    }
    //if the input string does not contain any "_()"
    else {
        //set email2 equal to the input
        email2 = input;
    }
    //return email2 to the caller
    return email2
}

//listen for auth status changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
        CurrentUser = user;
    } else {
        console.log("User logged out");
        CurrentUser = user;
    }

})

const createPatientForm = document.querySelector("#patient-register");
createPatientForm.addEventListener('submit', (e) => {
    
    function clearInput(tags) {
        for (var i = 0; i < tags.length; i++) {
            document.querySelector('#' + tags[i]).value = "";
        }
    }
    var IDs = ['First_Name', 'Last_Name', 'inputEmail4', 'inputGender', 'dob', 'conditions'];
    e.preventDefault();
    //get patient info from the form
    const f_name = createPatientForm['First_Name'].value;
    const l_name = createPatientForm['Last_Name'].value;
    var email = createPatientForm['inputEmail4'].value;
    var email1 = removePeriods(email);
    const gender = createPatientForm['inputGender'].value;
    const birthdate = createPatientForm['dob'].value;
    const conditions = createPatientForm['conditions'].value;

    //getting the doctor currently logged in
    console.log(CurrentUser);
    
    //if a user is logged in
    if (CurrentUser != null) {
        console.log(email1);
        
        const doc_email = CurrentUser.email;
        const doc_email1 = removePeriods(doc_email);
        console.log(doc_email1);
        firebase.database().ref("Patients/" + email1 + "/Info").set({
            First_Name: f_name,
            Last_Name: l_name,
            Email: email1,
            Doc_Email: doc_email1,
            Gender: gender,
            Date_Of_Birth : birthdate,
            PreExistingConditions : conditions
        });
        //Adding patient to the Patients folder within the currently logged in doctor
        firebase.database().ref("Doctors/" + doc_email1 + "/Patients/" + email1).set({
            Email: email1
        });
        console.log("A new patient has been registered")
        alert("A new patient has been registered");
        window.setTimeout(clearInput(IDs), 1000);
        
    } else {
        console.log("You are not logged in as a verified doctor. Register or sign in to add a new patient");
        alert('You are not logged in as a verified doctor. Register or sign in to add a new patient');
    }

});

//logout function
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut();
});