
//listen for auth status changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
    } else {
        console.log("User logged out");
    }
});

//logout function
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut();
});
