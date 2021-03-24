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

function Appointment(date, patient_email, bucket_name, alz_test_score, ml_score, doc_score, notes, confirmed) {
    this.date = date;
    this.patient_email = patient_email;
    this.bucket_name = bucket_name;
    this.alz_test_score = alz_test_score;
    this.ml_score = ml_score;
    this.doc_score = doc_score;
    this.notes = notes;
    this.confirmed = confirmed;
}


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

function populateData() {
    var container = document.getElementById("content");
    var appointments = [];
    var doc_email1 = removePeriods(currentUser.email);
    var currentPatientEmail;
    firebase.database().ref("Current_patient/Info").on('value', function(snapshot) {
        currentPatientEmail = snapshot.val().email1;
        firebase.database().ref("Doctors/" + doc_email1 + "/Appointments").on('value', function(snapshot) {
            const data = snapshot.val();
            for (var n = 0; n < data.length; n++) {
                
            }
            var date_of_birth, doc_email, email, first_name, gender, last_name, preexisting_conditions, age;
            firebase.database().ref("Patients/" + currentPatientEmail + "/Info").on('value', function(snapshot) {
                const data = snapshot.val();
                console.log("Patient Info: ", data)
                date_of_birth = snapshot.val().Date_Of_Birth;
                doc_email = snapshot.val().Doc_Email;
                email = snapshot.val().Email;
                first_name = snapshot.val().First_Name;
                gender = snapshot.val().Gender;
                last_name = snapshot.val().Last_Name;
                preexisting_conditions = snapshot.val().PreExistingConditions;
    
                var components = date_of_birth.split("-");
                var year = components[0];
                var month = components[1];
                var day = components[2];
                var dateString = month + "/" + day + "/" + year;
                age = getAge(dateString);
                document.getElementById('general-data-age').innerText = 'Age: ' + age;
                document.getElementById('general-data-gender').innerText = 'Gender: ' + gender;
                document.getElementById('general-data-f_name').innerText = 'First Name: ' + first_name;
                document.getElementById('general-data-l_name').innerText = 'Last Name: ' + last_name;
    
            })
        });
    });

    
    
    

}

//listen for auth status changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
        currentUser = user;
        populateData();
    } else {
        console.log("User logged out");
        currentUser = user;
    }

})



//logout function
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut();
});