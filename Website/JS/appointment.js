var firebaseConfig = {
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
db.settings({ timestampsInSnapshots: true });

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
var currentUser = firebase.auth().currentUser;
console.log("The current user is: ", currentUser);

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
                    var anchor_string = "<a href = 'patientEmails.html'>" + patientNames[n] + "</a>";
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

});



const appointmentForm = document.querySelector('#new-appointment');
appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    function clearInput(tags) {
        for (var i = 0; i < tags.length; i++) {
            document.querySelector('#' + tags[i]).value = '';
        }
    }
    var IDs = ['inputEmail4', 'appointment_time', 'dob', 'Reason'];

    //getting the date for indexing the titles of the appointments
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    console.log(today);

    //Getting the currently signed in user (a doctor)
    var user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
        //getting their email
        var user_email = user.email;
        var user_email1 = removePeriods(user_email);
        const patient_email1 = removePeriods(appointmentForm['patient-email'].value);
        const bucketName = "";
        const AlzTestScore = "";
        const MLScore = "";
        const DocScore = "";
        const notes = "";
        const confirmed = "False";
        const MF = firebase.database().ref("Patients/" + patient_email1 + "/Info/Gender");      //database
        console.log(MF);
        var Age = "";     //database
        var dob = firebase.database().ref("Patients/" + patient_email1 + "/Info/Date_Of_Birth");
        console.log(dob);
        var date_elements = dob.split("-");
        var year = date_elements[0];
        var month = date_elements[1];
        var day = date_elements[2];

        dob = new Date(month + "/" + day + "/" + year);
        var month_diff = Date.now() - dob;
        var age_df = new Date(month_diff);
        var years = age_df.getUTCFullYear();
        Age = Math.abs(years - 1970);
        console.log("The patient is: ", years)

        const SES = "";     //Doctor input
        const MMSE = "";    //Doctor input
        const eTIV = "";    //doctor input
        const nWBV = "";    //doctor input
        const ASF = "";     //doctor input
        const reaction_time = "";       //empty as default
        const math_score = "";          //empty as default
        const math_time = "";           //empty as default
        const mood = "";                //empty as default

        var exists = false;
        //Checking if the doctor has a patient with the email that he put in
        //getting the snapshot of the patients folder
        firebase.database().ref('Doctors/' + user_email1 + '/Patients').on('value', function(snapshot) {
            const data = snapshot.val();
            var i;
            for (i in data) {
                if (i == patient_email1) {
                    exists = true;
                }
            }
        });

        if (exists){
            firebase.database().ref("Doctors/" + user_email1 + "/Appointments/" + today).set({
                Patient_Email : patient_email1,
                Bucket_Name : bucketName,
                AlzheimersTestScore : AlzTestScore,
                MLSuggestedScore : MLScore,
                DoctorSuggestedScore : DocScore,
                Notes: notes,
                Confirmed: confirmed, 
                
            });
            window.setTimeout(clearInput(IDs), 2000);
        } else {
            console.log('Patient does not exist')
        }
    } else {
        console.log("Doctor not logged in");
        toast("Please log in as a doctor to add a patient to your profile");
    }
});
