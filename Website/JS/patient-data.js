function Appointment(date, patient_email, bucket_name, alz_test_score, ml_score, doc_score, notes, confirmed, reason, time, metrics) {
    this.getalz_test_score = function() {
        return alz_test_score;
    };
    this.ml_score = function() {
        return ml_score;
    }
    this.doc_score = function() {
        return doc_score;
    };
    this.notes = function() {
        return notes;
    };
    this.confirmed = function() {
        return confirmed;
    };
    this.reason = function() {
        return reason;
    };
    this.time = function() {
        return time;
    };
    this.metrics = function() {
        return metrics;
    };
    this.date = function() {
        return date;
    }
    this.patient_email = function() {
        return patient_email;
    }
    this.bucket_name = function() {
        return bucket_name;
    }
    return this;
}

var currentUser = firebase.auth().currentUser;
console.log("The current user is: ", currentUser);

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

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
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
    var container = document.getElementById('content');
    
    var appointments = [];
    var doc_email1 = removePeriods(currentUser.email);
    var currentPatientEmail;
    firebase.database().ref("Current_patient").on('value', function(snapshot) {
        currentPatientEmail = snapshot.val().email1;
        firebase.database().ref("Doctors/" + doc_email1 + "/Appointments").on('value', function(snapshot) {
            const appointmentdata = snapshot.val();

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
                removeAllChildNodes(container);
                var patientName = document.createElement('h2');
                patientName.id = 'patient-name-header';
                patientName.innerText = 'Patient: ' + first_name + " " + last_name;
                var headerbr = document.createElement('br');
                var headeranchor = document.createElement('a');
                headeranchor.className = 'link-sect-box';
                var headerdiv = document.createElement('div');
                headerdiv.className = 'link-sect';
                var headerh3 = document.createElement('h3');
                headerh3.innerText = 'General Data';
                var headerAge = document.createElement('ul');
                headerAge.id = 'general-data-age';
                headerAge.innerText = 'Age: ' + age;
                var headerGender = document.createElement('ul');
                headerGender.innerText = 'Gender: ' + gender;
                var headerf_name = document.createElement('ul');
                headerf_name.innerText = 'First Name: ' + first_name;
                var headerl_name = document.createElement('ul');
                headerl_name.innerText = 'Last Name: ' + last_name;
                headerdiv.appendChild(headerh3);
                headerdiv.appendChild(headerAge);
                headerdiv.appendChild(headerGender);
                headerdiv.appendChild(headerf_name);
                headerdiv.appendChild(headerl_name);
                headeranchor.appendChild(headerdiv);
                container.appendChild(patientName);
                container.appendChild(headerbr);
                container.appendChild(headeranchor);
                //document.getElementById('patient-name-header').innerText = 'Patient: ' + first_name + " " + last_name;
                //document.getElementById('general-data-age').innerText = 'Age: ' + age;
                //document.getElementById('general-data-gender').innerText = 'Gender: ' + gender;
                //document.getElementById('general-data-f_name').innerText = 'First Name: ' + first_name;
                //document.getElementById('general-data-l_name').innerText = 'Last Name: ' + last_name;

                for (a in appointmentdata) {
                    if (appointmentdata[a].Patient_Email == currentPatientEmail){
                        appointments.push(Appointment(appointmentdata[a].Date, appointmentdata[a].Patient_Email, appointmentdata[a].Bucket_Name, appointmentdata[a].AlzheimersTestScore, appointmentdata[a].MLSuggestedScore, appointmentdata[a].DoctorSuggestedScore, 
                            appointmentdata[a].Notes, appointmentdata[a].Confirmed, appointmentdata[a].Reason, appointmentdata[a].Time, appointmentdata[a].Metrics));
                        //Adding horizontal line
                        var newlinediv = document.createElement('div');
                        newlinediv.className = 'line';
                        container.appendChild(newlinediv);
        
                        //Creating data display structure
                        var appointmentanchor = document.createElement('a');
                        appointmentanchor.className ='link-sect-box';
                        var appointmentdiv = document.createElement('div');
                        appointmentdiv.className = 'link-sect';
                        var appointmenth3 = document.createElement('h3');
                        appointmenth3.className = 'rsrc-link';
                        appointmenth3.innerText = "Appointment " + appointmentdata[a].Date;
                        var reactionul = document.createElement('ul');
                        reactionul.innerText = 'Reaction Time: ' + appointmentdata[a].Metrics.Reaction_Time + " s";
                        var math_score_ul = document.createElement('ul');
                        math_score_ul.innerText = "Math Score: " + appointmentdata[a].Metrics.Math_Score;
                        var math_time_ul = document.createElement('ul');
                        math_time_ul.innerText = "Math Time: " + appointmentdata[a].Metrics.Math_Time + " min.";
                        var mood_ul = document.createElement('ul');
                        mood_ul.innerText = "Mood: " + appointmentdata[a].Metrics.Mood;
                        appointmentdiv.appendChild(appointmenth3);
                        appointmentdiv.appendChild(reactionul);
                        appointmentdiv.appendChild(math_score_ul);
                        appointmentdiv.appendChild(math_time_ul);
                        appointmentdiv.appendChild(mood_ul);
                        appointmentanchor.appendChild(appointmentdiv);
                        container.appendChild(appointmentanchor);
                    }
                }
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