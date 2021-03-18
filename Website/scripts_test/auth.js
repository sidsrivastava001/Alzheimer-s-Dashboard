
//sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    console.log(email, password);

    //sign up the user
    //create User With Email And Password is an asynchronous task, so the then() method tells JS what to do afterward
    auth.createUserWithEmailAndPassword(email, password).then(credential => {
        console.log(credential);
    })
})