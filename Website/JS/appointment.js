function removePeriods(input) { // Removes periods from the inputs to avoid confusing firebase and replaces them with "_()"

    return input.replace(/\./g, "_()");
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
    return input.replace(/\_\(\)/g, ".");
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

//HTTP request information
const domainName = "";

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


function populateDropdownMenu() {
    if (currentUser != null){
        const doctor_email1 = removePeriods(currentUser.email);
        const parent = document.getElementById("inputEmail4");
        firebase.database().ref("Doctors/" + doctor_email1 + "/Patients").on('value', function(snapshot) {
            const data = snapshot.val();
            for (patient in data) {
                let list_option = document.createElement('option');
                list_option.innerText = addPeriods(patient);
                parent.appendChild(list_option);
            }
        });
    }
}

//listen for auth status changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
        currentUser = user;
        populateDropdownMenu();
    } else {
        console.log("User logged out");
        currentUser = user;
        populateDropdownMenu();
    }

});



const appointmentForm = document.querySelector('#new-appointment');
appointmentForm.addEventListener('submit', (e) => {
    //Prevent reloading of the page
    e.preventDefault();
    //function for clearing the input fields after a submission
    function clearInput(tags) {
        for (var i = 0; i < tags.length; i++) {
            document.querySelector('#' + tags[i]).value = '';
        }
    }
    //the various IDs of the form's input fields that need to be cleared
    var IDs = ['inputEmail4', 'appointment_time', 'dob', 'Reason'];

    //getting the current date for indexing the titles of the appointments
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;

    if (currentUser != null && currentUser != undefined) {

        var user_email = currentUser.email;
        var user_email1 = removePeriods(user_email);
        const patient_email1 = removePeriods(appointmentForm['inputEmail4'].value);
        if (patient_email1 == null || patient_email1 == "") {
            alert("Email field must be filled out");
        } else {
            /*These variables need to be retrieved from the database:
                date of birth of the current patient
                Check if the patient exists in the patients directory
                Go into appointments folder and see if any existing appointments are on the same day as today
                    If so, copy down the number at the end of the appointment date. If none, 0
                

                Then, populate a new appointment in the Appointments folder

            */ 
            var MLScore, dob, modified_today;
            
            var exists;
            var multiple_appointment = false;
            var last_appointment_index = 0;
            var appointment_indices = [];
            const regex_pattern = /.*\(([0-9]*)\)/;
            var Age = '';
            const time = appointmentForm['appointment_time'].value;
            //const dob = appointmentForm['dob'].value;
            const Reason = appointmentForm['Reason'].value;
            //Various Alzheimer's Metrics
            const SES = appointmentForm['SES'].value;
            const MMSE = appointmentForm['MMSE'].value;
            const eTIV = appointmentForm['eTIV'].value;
            const nWBV = appointmentForm['nWBV'].value;
            const ASF = appointmentForm['ASF'].value;
            //Appointment Notes
            const notes = appointmentForm['notes'].value;
            const DocScore = appointmentForm['doc_score'].value;

            const bucketName = "";
            const AlzTestScore = "";
            
            const confirmed = "False";
            
            //These metrics are empty as default and are filled in by the mobile app
            const reaction_time = "";       //empty as default
            const math_score = "";          //empty as default
            const math_time = "";           //empty as default
            const sleep = "";                //empty as default

            //One big database call
            firebase.database().ref().once('value').then(function(snapshot) {
                const data = snapshot.val();
                dob = data.Patients[patient_email1]['Info']['Date_Of_Birth'];
                console.log("Date of Birth: ", dob);
                //Splitting the string date into parts
                var date_elements = dob.split("-");
                var year = date_elements[0];
                var month = date_elements[1];
                var day = date_elements[2];
                //Concatenating into one cohesive string
                dateString = month + "/" + day + "/" + year;
                //Passing the cohesive string into the function at the top of the file
                Age = getAge(dateString);
                //Age = '73';
                console.log("GetAge: ", Age);

                //var gender = data.Patients[patient_email1]['Info']['Gender'];
                var gender = '0';
                /* if (gender == 'Male') {
                    gender = '1';
                } else {
                    gender = '0';
                } */
                var url = "http://sidsrivastava.pythonanywhere.com/?Gender=" + gender + 
                    "&Age=" + String(Age) + 
                    "&SES=" + String(SES) + 
                    "&MMSE=" + String(MMSE) + 
                    "&eTIV=" + String(eTIV) + 
                    "&nWBV=" + String(nWBV) + 
                    "&ASF=" + String(ASF);
                console.log("API URL: ", url);
                MLScore = fetch(url)
                    .then(response => response.json())
                    .then(json => {
                        console.log("Response JSON: ",json);
                        MLScore = String(json.response);
                        var array = [0, 0.5, 1, 2];
                        MLScore = array[Number(MLScore)];
                    
                        for (a in data.Patients) {
                            if (patient_email1 == a) {
                                exists = true;
                            }
                        }
                        if (data['Doctors'][user_email1]['Appointments'] != null && data['Doctors'][user_email1]['Appointments'] != undefined) {
                            console.log(data['Doctors'][user_email1]['Appointments'][patient_email1]);
                            for (date in data['Doctors'][user_email1]['Appointments'][patient_email1]) {
                                console.log(date);
                                if (date.indexOf(today) != -1) {
                                    multiple_appointment = true;
                                    console.log("Regex Match Result: ", date.match(regex_pattern));
                                    if (date.match(regex_pattern) != null) {
                                        appointment_indices.push(Number(date.match(regex_pattern)[1]));
                                        console.log("Appointment Indices: ", appointment_indices);
                                        last_appointment_index = Number(date.match(regex_pattern)[1]);
                                        console.log("Last Appointment Index: ", last_appointment_index)
                                    } else {
                                        appointment_indices.push(0);
                                        console.log("Appointment Indices: ", appointment_indices);
                                        last_appointment_index = 0;
                                        console.log("Last Appointment Index: ", last_appointment_index);
                                    }
                                }
                            }
                        }
                        if (exists){
                            console.log(multiple_appointment);
                            if (multiple_appointment) {
                                modified_today = today + "(" + String(last_appointment_index+1) + ")";
                                console.log("New today: ", modified_today);
                            } else {
                                modified_today = today;
                            }
                            //Populate a new appointment in the database in the doctor's Appointments folder
                            firebase.database().ref("Doctors/" + user_email1 + "/Appointments/" + patient_email1 + "/" + modified_today).set({
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
                            //Create a folder in the Appointments folder in the just created appointment called "Metrics" to 
                            //house the metrics from the appointment
                            firebase.database().ref("Doctors/" + user_email1 + "/Appointments/" + patient_email1 + "/" + modified_today + "/Metrics").set({
                                SES: SES,
                                MMSE: MMSE,
                                eTIV: eTIV,
                                nWBV: nWBV,
                                ASF: ASF,
                                Reaction_Time: reaction_time,
                                Math_Score: math_score,
                                Math_Time: math_time,
                                Sleep: sleep
                            });
                            //Clear inputs
                            //window.setTimeout(clearInput(IDs), 20000);
                            alert("A new appointment has been created");
                            //loop = false;
                    
                    } else {
                        alert('Patient does not exist. You must create a patient to add an appointment to their profile');
                    }
                });
            });
        }  
    } else {
        console.log("Doctor not logged in");
        alert("Please log in as a doctor to add a patient to your profile");
    }
});

const logout = document.querySelector("#logout");
logout.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut();
})