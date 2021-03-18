
//sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Prevented default");
    //get user info
    const f_name = signupForm['First_Name'].value;
    console.log("First name");
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
    auth.createUserWithEmailAndPassword(email, password).then(credential => {
        console.log(credential);
    })
})