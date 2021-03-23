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

function getAge(dateString) {
    var today = new Date();
    var birthdate = new Date(dateString)
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

//listen for auth status changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
        currentUser = user;
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

    //getting the current date for indexing the titles of the appointments
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;

    //Getting the currently signed in user (a doctor)
    console.log(currentUser);
    if (currentUser != null && currentUser != undefined) {
        //getting their email
        //From the form
        var user_email = currentUser.email;
        var user_email1 = removePeriods(user_email);
        const patient_email1 = removePeriods(appointmentForm['inputEmail4'].value);
        const time = appointmentForm['appointment_time'].value;
        //const dob = appointmentForm['dob'].value;
        const Reason = appointmentForm['Reason'].value;
        const SES = appointmentForm['SES'].value;
        const MMSE = appointmentForm['MMSE'].value;
        const eTIV = appointmentForm['eTIV'].value;
        const nWBV = appointmentForm['nWBV'].value;
        const ASF = appointmentForm['ASF'].value;
        const notes = appointmentForm['notes'].value;
        const DocScore = appointmentForm['doc_score'].value;

        const bucketName = "";
        const AlzTestScore = "";
        const MLScore = "";

        const confirmed = "False";

        var Age = "";
        var dob;
        firebase.database().ref("Patients/" + patient_email1 + "/Info").on('value', function(snapshot) {
            const data = snapshot.val();
            dob = data.Date_Of_Birth;
        });
        var date_elements = dob.split("-");
        var year = date_elements[0];
        var month = date_elements[1];
        var day = date_elements[2];

        dateString = month + "/" + day + "/" + year;
        Age = getAge(dateString);
        console.log("GetAge: ", Age);

        
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
                Date: today,
                Patient_Email : patient_email1,
                Bucket_Name : bucketName,
                AlzheimersTestScore : AlzTestScore,
                MLSuggestedScore : MLScore,
                DoctorSuggestedScore : DocScore,
                Notes: notes,
                Confirmed: confirmed, 
                Age: Age,
                Time: time,
                Reason: Reason,
            });
            firebase.database().ref("Doctors/" + user_email1 + "/Appointments/" + today + "/Metrics").set({
                SES: SES,
                MMSE: MMSE,
                eTIV: eTIV,
                nWBV: nWBV,
                ASF: ASF,
                Reaction_Time: reaction_time,
                Math_Score: math_score,
                Math_Time: math_time,
                Mood: mood
            })
            //window.setTimeout(clearInput(IDs), 2000);
            alert("A new appointment has been created");
        } else {
            console.log('Patient does not exist. You must create a patient to add an appointment to their profile');
        }
    } else {
        console.log("Doctor not logged in");
        toast("Please log in as a doctor to add a patient to your profile");
    }
});
