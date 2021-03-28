var currentUser = firebase.auth().currentUser;

//listen for auth status changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        populateDropdown();
    } else {
        currentUser = user;
        populateDropdown();
    }

})

function populateDropdown() {
    //email with periods removed of the current doctor
    if (currentUser != null && currentUser != undefined){
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
            namesPopulated = true;
            if (emailsPopulated) {
                var pageSubmenu = document.getElementById("pageSubmenu");
                for (var n = 0; n < patientNames.length; n++) {
                    let email2 = patientEmails[n].Email;
                    var name = patientNames[n];
                    var pageSubmenu = document.getElementById("pageSubmenu");
                    var list_item = document.createElement('LI');
                    var anchor = document.createElement("A");
                    anchor.href = 'patientdata.html';
                    anchor.innerText = name;
                    anchor.id = 'patient' + String(n);
                    anchor.addEventListener('click', function() {
                        setCurrentPatient(email2);
                    });
                    //anchor.onclick = "setCurrentPatient(document.getElementById("+anchor.id+")).innerText";
                    //var anchor = document.createElement("A");
                    list_item.appendChild(anchor);
                    pageSubmenu.appendChild(list_item);
                }
            }

        });

    /* } else {
        console.log('User object is undefined or null');
    } */
    }
    if (currentUser != null && currentUser != undefined) {
        document.getElementById("sign-in-state").innerText = "Signed In";
    } else {
        document.getElementById("sign-in-state").innerText = "Signed Out";
    }
}

function setCurrentPatient(patient_email) {
    //convert argument to string
    var patient_email1 = removePeriods(String(patient_email));
    console.log("Current Patient: ", patient_email1);
    firebase.database().ref("Current_patient").set({
        email1 : patient_email1
    });
}