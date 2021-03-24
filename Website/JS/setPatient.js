var currentUser = firebase.auth().currentUser;

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

//listen for auth status changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
    } else {
        currentUser = user;
    }

})

/* function setCurrentPatient(patient_name) {
    //convert argument to string
    var components = patient_name.split(" ");
    var f_name = components[0];
    var l_name = components[1];
    var patient_email1;
    firebase.database().ref("Patients").on('value', function(snapshot) {
        const data = snapshot.val();
        for (patient in data){
            if (data[patient].Info.First_Name == f_name && data[patient].Info.Last_Name == l_name) {
                patient_email1 = data[patient].Info.Email;
            }
        }
    })
    
    
    
    console.log("Current Patient from set patient: ", patient_email1);
    if (patient_email1 != null) {
        firebase.database().ref("Current_patient/Info").set({
            email1 : patient_email1
        });
    }
} */