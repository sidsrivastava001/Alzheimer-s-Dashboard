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
firebase.initializeApp(firebaseConfig); */
// make auth and firestore references
/* const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true }); */

var currentUser = firebase.auth().currentUser;
console.log("The current user is: ", currentUser);



/* function toast(text){
    text = "<span>"+String(text)+"</span>";
    M.toast({html: text});
} */
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

function populateDropdown() {
    //email with periods removed of the current doctor
    if (currentUser != null && currentUser != undefined){
        console.log("Starting to populate HTML");
        var email1 = removePeriods(currentUser.email);
        //var email1 = 'esnielsen@ctemc_()org';
        //list of the emails of the doctor's patients
        var patientEmails = [];
        //List of names of the doctor's patients
        var patientNames = [];

        var emailsPopulated = false;
        var namesPopulated = false;
        //Iterate through the patients of the doctor and add their emails to the patientEmails list
        firebase.database().ref("Doctors/" + email1 + "/Patients").on('value', function(snapshot) {
            const data = snapshot.val();
            for (i in data) {
                patientEmails.push(data[i]);
                
                
            }
            console.log("Patient Emails: ", patientEmails);
            emailsPopulated = true;
        });
        
        //Iterate through both the patient emails list and the list of patients in the Patients folder, adding the matching emails ['First_Name'] and ['Last_Name'] properties
        firebase.database().ref("Patients").on('value', function(snapshot) {
            const data = snapshot.val();
            for (email in patientEmails) {
                for (i in data) {
                    if (patientEmails[email].Email == data[i].Info.Email) {
                        patientNames.push((data[i].Info.First_Name + " " + data[i].Info.Last_Name));
                        
                        
                    }
                }
            }
            console.log("Patient Names: ", patientNames);
            namesPopulated = true;
            if (emailsPopulated) {
                var pageSubmenu = document.getElementById("pageSubmenu");
                for (var n = 0; n < patientNames.length; n++) {
                    var pageSubmenu = document.getElementById("pageSubmenu");
                    var list_item = document.createElement('LI');
                    var anchor_string = "<a href = 'patientdata.html'>" + patientNames[n] + "</a>";
                    //var anchor = document.createElement("A");
                    list_item.innerHTML = anchor_string;
                    pageSubmenu.appendChild(list_item);
                }
            }

        });

    } else {
        console.log('User object is undefined or null');
    }
}


//listen for auth status changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
        currentUser = user;
        populateDropdown();
    } else {
        console.log("User logged out");
        currentUser = user;
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
    console.log(currentUser);
    
    //if a user is logged in
    if (currentUser != null) {
        console.log(email1);
        
        const doc_email = currentUser.email;
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