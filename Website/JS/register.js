
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

//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
    } else {
        console.log("User logged out");
    }

})

//sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    function clearInput(tags) {
        for (var i = 0; i < tags.length; i++) {
            document.querySelector('#' + tags[i]).value = '';
        }
    }
    var IDs = ['patient-email', 'alz-test', 'doc-score', 'notes'];

    //get user info
    const f_name = signupForm['First_Name'].value;
    const l_name = signupForm['Last_Name'].value;
    var email = signupForm['inputEmail4'].value;
    var email1 = removePeriods(email);
    const password = signupForm['inputPassword4'].value;
    const address = signupForm['inputAddress'].value;
    const address2 = signupForm['inputAddress2'].value;
    const city = signupForm['inputCity'].value;
    const state = signupForm['inputState'].value;
    const zip = signupForm['inputZip'].value;
    const cred = signupForm['credentials'].value;

    console.log(email, password);
    console.log("Email with periods removed: ", email1);
    //sign up the user
    //create User With Email And Password is an asynchronous task, so the then() method tells JS what to do afterward
    auth.createUserWithEmailAndPassword(email, password)
    .then(credential => {
        console.log(credential.user);
        toast('Congrats! You have been signed up!');
    })
    .catch((error) => {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
        if (error.code == "auth/email-already-in-use") {
            toast(error.message + " Please use another email address.");
        }
        else if (error.code == "auth/invalid-email") {
            toast(error.message + " Please use a valid email");
        }
        else if (error.code == "auth/operation-not-allowed") {
            toast(error.message + " Signing in with email and password not allowed. Contact site admin");
        }
        else if (error.code == "auth/weak-password") {
            toast(error.message + " Password is not strong enough");
        }

    });

    //Add user to the database Doctors folder
    firebase.database().ref("Doctors/" + email1 + "/Doctor_Info").set({
        First_Name: f_name,
        Last_Name: l_name,
        Password: password,
        Email: email1,
        Credentials: cred,
        Address: address,
        Address2: address2,
        City: city,
        State: state,
        Zip_Code: zip
    });
    function clearInput(tags) {
        for (var i = 0; i < tags.length; i++) {
            document.querySelector('#' + tags[i]).value = '';
        }
    }
    var IDs = ['First_Name', 'Last_Name', 'inputEmail4', 'inputPassword4', 'inputAddress', 'inputAddress2', 'inputCity', 'inputState', 'inputZip', 'credentials'];
    window.setTimeout(clearInput(IDs), 5000);
});

//logout function
const logout = document.querySelector('#logout-btn');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});