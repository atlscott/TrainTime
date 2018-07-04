$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCKdlnxiNcQ6WU3s9g1XjFOhq8jErpTxkc",
        authDomain: "atl-scott.firebaseapp.com",
        databaseURL: "https://atl-scott.firebaseio.com",
        projectId: "atl-scott",
        storageBucket: "atl-scott.appspot.com",
        messagingSenderId: "618929975709"
    };
   firebase.initializeApp(config);
   
    var database = firebase.database();
   
     // Capture Button Click
    $("#addTrain").on("click", function (event) {
        event.preventDefault();
   
       // Grabbed values from text boxes
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#firstTrain").val().trim();
        var frequency = $("#frequency").val().trim();
   
       // Code for handling the push
       database.ref().push({
         trainName: trainName,
         destination: destination,
         firstTrain: firstTrain,
         frequency: frequency
       });
     });
   
   
     // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
     database.ref().on("child_added", function (childSnapshot) {
   
       var newTrain = childSnapshot.val().trainName;
       var newLocation = childSnapshot.val().destination;
       var newFirstTrain = childSnapshot.val().firstTrain;
       var newFrequency = childSnapshot.val().frequency;
   
       // First Time (pushed back 1 year to make sure it comes before current time)
       var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
   
       // Current Time
       var currentTime = moment();
   
       // Difference between the times
       var diffTime = moment().diff(moment(startTimeConverted), "minutes");
   
       // Time apart (remainder)
       var tRemainder = diffTime % newFrequency;
   
       // Minute(s) Until Train
       var tMinutesTillTrain = newFrequency - tRemainder;
   
       // Next Train
       var nextTrain = moment().add(tMinutesTillTrain, "minutes");
       var catchTrain = moment(nextTrain).format("HH:mm");
   
       // Display On Page
       $("#all-display").append(
         ' <tr><td>' + newTrain +
         ' </td><td>' + newLocation +
         ' </td><td>' + newFrequency +
         ' </td><td>' + catchTrain +
         ' </td><td>' + tMinutesTillTrain + ' </td></tr>');
   
       // Clear input fields
       $("#trainName, #destination, #firstTrain, #frenquency").val("");
       return false;
     },
       //Handle the errors
       function (errorObject) {
         console.log("Errors handled: " + errorObject.code);
       });
   
   }); //end document ready