function toast(text){
    text = "<span>"+String(text)+"</span>";
    M.toast({html: text});
}

//logout function
const logout = document.querySelector('#logout-btn');
logout.addEventListener('clicked', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("You've successfully signed out");
        toast("You've successfully signed out");
    });
});
