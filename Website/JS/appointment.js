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

const appointmentForm = document.querySelector('#new-appointment');
appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //getting the date for indexing the titles of the appointments
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    console.log(today);

    //Getting the currently signed in user (a doctor)
    var user = auth.currentUser;
    console.log(user);
    //getting their email
    var user_email = user.email;
    var user_email1 = removePeriods(user_email);
    const patient_email1 = removePeriods(appointmentForm['patient-email'].value);
    const bucketName = "";
    const AlzTestScore = appointmentForm['alz-test'].value;
    const MLScore = "";
    const DocScore = appointmentForm['doc-score'].value;
    const notes = appointmentForm['notes'].value;
    const confirmed = "False";

    //Checking if the doctor has a patient with the email that he put in
    //getting the snapshot of the patients folder
    firebase.database().ref('Doctors/' + doctor_email_patient1 + '/Patients').on('value', function(snapshot) {
        console.log(snapshot.val());
    })


    /* firebase.database().ref("Doctors/" + user_email1 + "/Appointments/" + today).set({
        Patient_Email = patient_email1,
        Bucket_Name : bucketName,
        AlzheimersTestScore : AlzTestScore,
        MLSuggestedScore : MLScore,
        DoctorSuggestedScore : DocScore,
        Notes: notes,
        Confirmed: confirmed
    }); */
})