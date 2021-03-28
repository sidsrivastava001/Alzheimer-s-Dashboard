var currentUser = firebase.auth().currentUser;
console.log("The current user is: ", currentUser);

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
    firebase.database().ref("Doctors/" + removePeriods(currentUser.email) + "/Doctor_Info").on("value", function(snapshot) {
        const data = snapshot.val();
        document.getElementById('doctor-name-header').innerText = "Doctor: " + data.First_Name + " " + data.Last_Name;
        document.getElementById("general-data-f_name").innerText = 'First Name: ' + data.First_Name;
        document.getElementById('general-data-l_name').innerText = 'Last Name: ' + data.Last_Name;
        document.getElementById('general-data-email').innerText = 'Email Address: ' + addPeriods(data.Email);
        document.getElementById('general-data-address').innerText = 'Address: ' + data.Address + ' ' + data.City + ", " + data.State + " " + data.Zip_Code;
        document.getElementById('general-data-Credentials').innerText = 'Credentials: ' + data.Credentials;
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