function toast(text){
    text = "<span>"+String(text)+"</span>";
    M.toast({html: text});
}

//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
    } else {
        console.log("User logged out");
    }

})

//logout function
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});
