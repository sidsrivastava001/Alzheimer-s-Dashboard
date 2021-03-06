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
var something

function dataPrep() {

}

function toast(text){
  text = "<span>"+String(text)+"</span>";
  M.toast({html: text});
}
//Insert Appointment into the database
document.getElementById("insert_appointment").onclick = function() {
  dataPrep();
  firebase.database().ref('doctor1/Appointments/' + String(Date)).set( {
    Patient_Name: patient_name,
    Bucket_Name: bucket_name,
    Alzheimer_Test_Score: test_score,
    ML_Score: ml_score,
    Doctor_Score: doc_score
  })
};

document.getElementById('some-other-button').onclick = function() {

};

