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
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

//variables


function dataPrepLogin() {
  var doctor_email = document.getElementById('inputEmail4');
  var doctor_password = document.getElementById('inputPassword4');
  toast(doctor_email + ", " + doctor_password);
  return doctor_email, doctor_password
}
function dataPrepAppointment() {
  var patient_email = document.getElementById('patient_email');
  var bucket_name = 0;
  var alz_test = document.getElementById('Alz-test-score');
  var ml_score = document.getElementById('ml-score');
  var doc_score = document.getElementById('doc_score');
  return patient_email, bucket_name, alz_test, ml_score, doc_score

}
function dataPrepPatient() {

}
function dataPrepRegister() {
  var f_name = document.getElementById('First_Name');
  var l_name = document.getElementById('Last_Name');
  var email = document.getElementById('inputEmail4');
  var password = document.getElementById('inputPassword4');
  var address = document.getElementById('inputAddress');
  var address2 = document.getElementById('inputAddress2');
  var city = document.getElemementById('inputCity');
  var state = document.getElementById('inputState');
  var zip = document.getElementById('inputZip');
  return f_name, l_name, email, password, address, address2, city, state, zip
}

function toast(text){
  text = "<span>"+String(text)+"</span>";
  M.toast({html: text});
}
//Insert Appointment into the database
document.getElementById("insert_appointment").onclick = function() {
  patient_email, bucket_name, alz_test, ml_score, doc_score = dataPrepAppointment();
  firebase.database().ref('doctor1/Appointments/' + String(Date)).set( {
    Patient_Email: patient_email,
    Bucket_Name: bucket_name,
    Alzheimer_Test_Score: alz_test,
    ML_Score: ml_score,
    Doctor_Score: doc_score
  })
};

//Function to register
document.getElementById('register_btn').onclick = function() {
  var f_name, l_name, email, password, address, address2, city, state, zip = dataPrepRegister();
  toast('Variables collected');
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    //Signed in
    var user = userCredential.user;
    //...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.Message;
  })

}

//Function to login
document.getElementById('login_button').onclick = function() {
  var email, password = dataPrepLogin();
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
};  

//Signing Out
firebase.auth().signOut().then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});