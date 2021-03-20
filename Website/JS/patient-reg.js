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
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
    } else {
        console.log("User logged out");
    }

})

const createPatientForm = document.querySelector("#patient-register");
createPatientForm.addEventListener('submit', (e) => {
    
    function clearInput(tags) {
        for (var i = 0; i < tags.length; i++) {
            document.querySelector('#' + tags[i]).value = '';
        }
    }
    var IDs = ['First_Name', 'Last_Name', 'inputEmail4', 'patient-password', 'doc_email'];
    e.preventDefault();
    //get patient info from the form
    const f_name = createPatientForm['First_Name'].value;
    const l_name = createPatientForm['Last_Name'].value;
    var email = createPatientForm['inputEmail4'].value;
    var email1 = removePeriods(email);
    const password = createPatientForm['patient-password'].value;
    const doc_email = createPatientForm['doc_email'].value;
    const birthdate = createPatientForm['birthdate'].value;

    //getting the doctor currently logged in
    var user = auth.curentUser;
    //if a user is logged in
    if (user) {
        console.log(email, password);
    
        //Adding patient to the Patients folder
        firebase.database().ref("Patients/" + email1 + "/Info").set({
            First_Name: f_name,
            Last_Name: l_name,
            Password: password,
            Email: email1,
            Doc_Email: doc_email
        });
        toast("A new patient has been registered")
        window.setTimeout(clearInput(IDs), 2000);
    } else {
        toast("You are not logged in as a verified doctor. Register or sign in to add a new patient");
    }

});