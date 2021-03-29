firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById('sign-in-state').innerText = "Signed In";
    } else {
        document.getElementById('sign-in-state').innerText = "Signed Out";
    }
})