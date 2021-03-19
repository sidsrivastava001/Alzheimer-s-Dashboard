  firebase.auth().onAuthStateChanged(function(user) {
    window.user = user; // user is undefined if no user signed in
   });
  
//variables
var reg_f_name, reg_l_name, reg_email, reg_password, reg_address, reg_address2, reg_city, reg_state, reg_zip

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
  reg_f_name = document.getElementById('First_Name');
  toast('Got first name');
  reg_l_name = document.getElementById('Last_Name');
  toast('Got last name');
  reg_email = document.getElementById('inputEmail4');
  toast("Got email");
  reg_password = document.getElementById('inputPassword4');
  toast("Got password");
  reg_address = document.getElementById('inputAddress');
  toast("got address");
  reg_address2 = document.getElementById('inputAddress2');
  toast("got second address");
  reg_city = document.getElementById('inputCity');
  toast("got city");
  reg_state = document.getElementById('inputState');
  toast('got state');
  reg_zip = document.getElementById('inputZip');
  toast('got zip');
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
document.getElementById('register-btn').onclick = function() {
  //dataPrepRegister();
  var email = "esnielsen@ctemc.org";
  var password = "something123";
  toast('Variables collected');
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.Message;
  });

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