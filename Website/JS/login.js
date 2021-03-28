/* function toast(text){
    text = "<span>"+String(text)+"</span>";
    M.toast({html: text});
} */
// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAJkaDmP2xrCFIHzufBhWqKcrRK6kvvtig",
    authDomain: "tsa-software-group-2.firebaseapp.com",
    databaseURL: "https://tsa-software-group-2-default-rtdb.firebaseio.com",
    projectId: "tsa-software-group-2",
    storageBucket: "tsa-software-group-2.appspot.com",
    messagingSenderId: "1009383655239",
    appId: "1:1009383655239:web:7706faf6dcce60f7ea2e62",
    measurementId: "G-ZXHZ4YWP9V"
  };
  firebase.initializeApp(firebaseConfig);

  // make auth and firestore references
  const auth = firebase.auth();
  const db = firebase.firestore();

// update firestore settings
  db.settings({ timestampsInSnapshots: true });

var currentUser = auth.currentUser;

//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User logged in: ", user);
        currentUser = user;
    } else {
        console.log("User logged out");
        currentUser = user;
    }

})

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    function clearInput(tags) {
        for (var i = 0; i < tags.length; i++) {
            document.querySelector('#' + tags[i]).value = '';
        }
    }
    var IDs = ['inputEmail', 'inputPassword'];

    //getting user inputs
    const email = loginForm['inputEmail'].value;
    const password = loginForm['inputPassword'].value;

    console.log(email, password);
    auth.signInWithEmailAndPassword(email, password)
    .then((credential) => {
        console.log(credential.user);
        alert("You've signed in successfully");
        //toast("You've signed in successfully");
        window.setTimeout(clearInput(IDs), 2000);
    })
    .catch((error) => {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
    });
    
});

//logout function
const logout = document.querySelector('#logout-btn');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();

    /* firebase.database().ref("Doctors/esnielsen@ctemc_()org/Patients").set({
        'something@something_()com': 'something123'
    });
    firebase.database().ref('Doctors/esnielsen@ctemc_()org/Patients').on('value', function(snapshot) {
        const data = snapshot.val();
        var i;
        for (i in data) {
            console.log(i);
        }
    }); */
});