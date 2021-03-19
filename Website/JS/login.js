function toast(text){
    text = "<span>"+String(text)+"</span>";
    M.toast({html: text});
}

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Prevented default');
    //getting user inputs
    const email = loginForm['inputEmail'].value;
    const password = loginForm['inputPassword'].value;

    console.log(email, password);
    auth.signInWithEmailAndPassword(email, password)
    .then((credential) => {
        console.log(credential.user);
        toast("You've signed in successfully");
    })
    .catch((error) => {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
    });
});

//logout function
const logout = document.querySelector('#logout-btn');
logout.addEventListener('clicked', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("You've successfully signed out");
        toast("You've successfully signed out");
    });
});