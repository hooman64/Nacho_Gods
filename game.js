    /* global moment firebase */
    // Initialize Firebase
    // Make sure to match the configuration to the script version number in the HTML
    // (Ex. 3.0 != 3.7.0)
      var config = {
        apiKey: "AIzaSyA-TEiEzBREFFPYneveQR7afqlmVoiJcD8",
        authDomain: "intropresence-10641.firebaseapp.com",
        databaseURL: "https://intropresence-10641.firebaseio.com",
        projectId: "intropresence-10641",
        storageBucket: "intropresence-10641.appspot.com",
        messagingSenderId: "42537892821"
      };

    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
    // connectionsRef references a specific location in our database.
    // All of our connections will be stored in this directory.
    var connectionsRef = database.ref("/connections");

    // '.info/connected' is a special location provided by Firebase that is updated every time
    // the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    var connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    connectedRef.on("value", function(snap) {

      // If they are connected..
      if (snap.val()) {

        // Add user to the connections list.
        var con = connectionsRef.push(true);

        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
      }
    });

    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function(snap) {

      // Display the viewer count in the html.
      // The number of online users is the number of children in the connections list.
      $("#watchers").text(snap.numChildren());
    });

    // -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
    // Set Initial Counter
    var initialValue = 100;
    var clickCounter = initialValue;

    // At the page load and subsequent value changes, get a snapshot of the local data.
    // This callback allows the page to stay updated with the values in firebase node "clicks"
    database.ref("/clicks").on("value", function(snapshot) {

      // Print the local data to the console.
      console.log(snapshot.val());


      // Change the HTML to reflect the local value in firebase.
      clickCounter = snapshot.val().clickCount;

      // Log the value of the clickCounter
      console.log(clickCounter);

      // Change the HTML to reflect the local value in firebase.
      $("#click-value").text(snapshot.val().clickCount);

      // Change the HTML Value using a variable (similar to the above)
      $("#click-value").text(clickCounter);

    // If any errors are experienced, log them to console.
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // --------------------------------------------------------------

    // Whenever a user clicks the click-button
    $("#click-button").on("click", function() {

      // Reduce the clickCounter by 1
      clickCounter--;

      // Alert User and reset the counter
      if (clickCounter === 0) {
        alert("Phew! You made it! That sure was a lot of clicking.");
        clickCounter = initialValue;
      }

      // Save new value to Firebase
      database.ref("/clicks").set({
        clickCount: clickCounter
      });

      // Log the value of clickCounter
      console.log(clickCounter);
    });

    // Whenever a user clicks the restart button
    $("#restart-button").on("click", function() {

      // Set the clickCounter back to initialValue
      clickCounter = initialValue;

      // Save new value to Firebase
      database.ref("/clicks").set({
        clickCount: clickCounter
      });

      // Log the value of clickCounter
      console.log(clickCounter);

      // Change the HTML Values
      $("#click-value").text(clickCounter);
    });


    //-------------------------------------------------------------- Hooman's RPS 

    var options = ['r', 'p', 's'];

    var compscore = 0
    var userscore = 0
    var ties = 0

    document.onkeypress = function (event) {
        var comprand = options[Math.floor(Math.random()*options.length)];
        var userkey = event.key;

        if (options.indexOf(userkey) == -1){
            alert('Choose between \'r\', \'p\', \'s\'!');
        }else if (comprand == userkey){
                ties += 1;
                document.querySelector('#ties').innerHTML = ties;
            }else if ((comprand == 'r' && userkey == 'p') || (comprand == 'p' && userkey == 's') || (comprand == 's' && userkey == 'r')){
                userscore += 1;
                document.querySelector('#wins').innerHTML = userscore;
            }else{
                compscore += 1;
                document.querySelector('#losses').innerHTML = compscore;
            };

            document.querySelector('#userChoice').innerHTML = userkey;
            document.querySelector('#computerChoice').innerHTML = comprand;
            alert('You ' + userscore + ' - ' + compscore + ' Computer');
    }; 

    //-------------------------------------------------------------- Ash's Styling JS

    $next = 1;      // fixed, please do not modfy;
    $current = 0;   // fixed, please do not modfy;
    $interval = 2300; // You can set single picture show time;
    $fadeTime = 300;  // You can set fadeing-transition time;
    $imgNum = 3;    // How many pictures do you have
   
    $(document).ready(function(){
      //NOTE : Div Wrapper should with css: relative;
      //NOTE : img should with css: absolute;
      //NOTE : img Width & Height can change by you;
      $('.fadeImg').css('position','relative');
      $('.fadeImg img').css({'position':'absolute','width':'100%','height':'auto'});
   
      nextFadeIn();
    });
   
    function nextFadeIn(){
      //make image fade in and fade out at one time, without splash vsual;
      $('.fadeImg img').eq($current).delay($interval).fadeOut($fadeTime)
      .end().eq($next).delay($interval).hide().fadeIn($fadeTime, nextFadeIn);
          
      // if You have 5 images, then (eq) range is 0~4 
      // so we should reset to 0 when value > 4; 
      if($next < $imgNum-1){ $next++; } else { $next = 0;}
      if($current < $imgNum-1){ $current++; } else { $current =0; }
    };

    //-------------------------------------------------------------- 


