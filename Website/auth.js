function toast(text){
    text = "<span>"+String(text)+"</span>";
    M.toast({html: text});
}
//sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Prevented default");
    //get user info
    const f_name = signupForm['First_Name'].value;
    const l_name = signupForm['Last_Name'].value;
    const email = signupForm['inputEmail4'].value;
    const password = signupForm['inputPassword4'].value;
    const address = signupForm['inputAddress'].value;
    const address2 = signupForm['inputAddress2'].value;
    const city = signupForm['inputCity'].value;
    const state = signupForm['inputState'].value;
    const zip = signupForm['inputZip'].value;

    console.log(email, password);

    //sign up the user
    //create User With Email And Password is an asynchronous task, so the then() method tells JS what to do afterward
    auth.createUserWithEmailAndPassword(email, password)
    .then(credential => {
        console.log(credential);
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
})