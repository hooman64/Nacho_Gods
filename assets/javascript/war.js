// Firebase Stuff

$(".seconddiv").hide()

var randomnumber = 0
console.log('Begining')
var config = {
  apiKey: "AIzaSyABXfW3CaD6D_dFhB0RWT_WK1qZcRFHDAc",
  authDomain: "rpstwopersons.firebaseapp.com",
  databaseURL: "https://rpstwopersons.firebaseio.com",
  storageBucket: "rpstwopersons.appspot.com"
};
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var Util_id_tracker = database.ref("/util_id_tracker");

// Create Full Deck

p1 =[]
p2 =[]
var p1_indexcounter
var p2_indexcounter
faceValue = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14]
var player2_score = 0
var player = 'player1'
var score = 0
var playerID
var p1DrawingLeft = 26;
var p2DrawingLeft = 26;

function buildCard()
{
console.log('here i am')
 var randIndex
for (var i = 0; i < 52; i++)
{
  randIndex = Math.floor(Math.random()*faceValue.length);
  if(i%2 == 0)
  {
    p1.push(faceValue[randIndex])
  }
  else {
    p2.push(faceValue[randIndex])
  }
  faceValue.splice(randIndex, 1)
}
}

// Create Game ID

function getuniqueId()
{

var randnum = Math.floor(Math.random()*100) + 1;
if(gameids.length > 0)
{
  for(k in gameids)
  {
    if(randnum == gameids[k])
    {
      console.log('already existing Number')
      getuniqueId()
    }
    else {
      return randnum
    }
  }
}
else {
return randnum
}
}

var gameids = []
var clkcntr = 0
// Join with Existing Game ID

function player2Action(enteredGameId)
{ 

  var kutilTrackerData = database.ref("util_id_trackerNew")
  kutilTrackerData.orderByChild("gameid").equalTo(enteredGameId).once("value", function(snapshot){
    
      console.log('key found.  Good to go. ')
     })

  kutilTrackerData.once('value',function(snapshot)
    {
      var test = 0
      snapshot.forEach(function(childsnapshot)
      {
        var childKey = childsnapshot.key;
        var childData = childsnapshot.val()
        if (childData.gameid == enteredGameId)
         {
            test = 1 
            gameid = enteredGameId
            var gameIndexName = 'gameIndex_'+enteredGameId
            var gametrackerIndexRef = database.ref().child(gameIndexName)
            gametrackerIndexRef.update({player2: player2_score+1})
            gameid = enteredGameId            
            var gameIndexName = 'gameIndex_'+enteredGameId
            var gametrackerIndexRef = database.ref().child(gameIndexName)
            gametrackerIndexRef.update({player2: player2_score})
            $('.card-heading').hide()
            $('.seconddiv').show()
            $('.gameid').text(gameid)
            $("button").prop("disabled", true)
            $(".p1drawcnt").text(p1DrawingLeft)
            $(".p2drawcnt").text(p2DrawingLeft)
            $("player2").prop("disabled", true)              
            $("#player2").prop("disabled", false)
            $(".drawbutton").on("click", function(){
            p2DrawingLeft--;
            var drawCounterRef = database.ref().child("draw_counter_"+gameid)
            drawCounterRef.update({p2_count: p2DrawingLeft});
            database.ref("draw_counter_"+gameid).on("value", function(snapshot){
            valueof = snapshot.val()
            $(".p1drawcnt").text(snapshot.val().p1_count)
            $(".p2drawcnt").text(snapshot.val().p2_count)
            if(p2DrawingLeft <=0 || snapshot.val().p2_count <= snapshot.val().p1_count )
              $("#player2").prop("disabled", true)
            else 
              {$("#player2").prop("disabled", false)}

            p1_indexcounter=snapshot.val().p1_count
            p2_indexcounter=snapshot.val().p2_count
            compareCard(p1_indexcounter, p2_indexcounter, gameid, 2);
            });
            clkcntr++;
    });
          
  }
      });
      if(test == 0)
      {
        alert('No game found')
      }
      });

  
}

// Game Initiation
//Starts here
console.log('Starting Game')

$('.NewgameButton').on('click', function(event){
    event.preventDefault();
    initGame($(this))

});
//////
function initGame(tmp)
{
   
  var counter = 0
  var emptyflag = 0

  if($(tmp).text() === 'New Game')
  {
    playerID = 1
    player = 'player1'
    var utilTrackerData = database.ref("util_id_trackerNew")
    utilTrackerData.once('value',function(snapshot)
    {
      snapshot.forEach(function(childsnapshot)
      {
        var childKey = childsnapshot.key;
        var childData = childsnapshot.val()

        gameids.push(childsnapshot.val().gameid)

      });
      });
    var gameid = getuniqueId()
    var Util_id_tracker_id_trackerRef = database.ref().child("util_id_trackerNew");
    var Util_id_tracker_tbl = Util_id_tracker_id_trackerRef.push();
    Util_id_tracker_id_trackerRef.push({gameid: gameid})
    var gameIndexRef = database.ref().child("gameIndex_"+gameid)
    gameIndexRef.set({player1: score})
    buildCard()
    var cardIndexRef = database.ref().child("cardIndex_"+gameid)
    cardIndexRef.set({p1cards: p1})
    cardIndexRef.update({p2cards: p2})
    var drawCounterRef = database.ref().child("draw_counter_"+gameid)
    drawCounterRef.set({p1_count: p1DrawingLeft})
    drawCounterRef.update({p2_count: p2DrawingLeft})

  }
  else if ($(tmp).text() === 'Submit')
  {//if player submit gameid initialize game for player 2
   
    playerID = 2
    player = 'player2'
    
    var enteredGameId = $("input").val()
    
    var kutilTrackerData = database.ref("util_id_trackerNew")
   player2Action(enteredGameId)
 
    
  } 
  if (playerID == 1){
    $('.card-heading').hide()
    $('.seconddiv').show()
    $('.gameid').text(gameid)
    $("button").prop("disabled", true)
    $(".p1drawcnt").text(p1DrawingLeft)
    $(".p2drawcnt").text(p2DrawingLeft)
    $("#player1").prop("disabled", false)
  
  
    $(".drawbutton").on("click", function(){

        p1DrawingLeft--;
        var drawCounterRef = database.ref().child("draw_counter_"+gameid)
        drawCounterRef.update({p1_count: p1DrawingLeft})
        database.ref("draw_counter_"+gameid).on("value", function(snapshot){
          valueof = snapshot.val()
          $(".p1drawcnt").text(snapshot.val().p1_count)
          $(".p2drawcnt").text(snapshot.val().p2_count)
          p1_indexcounter = snapshot.val().p1_count
          p2_indexcounter = snapshot.val().p2_count
          if(p1DrawingLeft <= 0 || snapshot.val().p1_count < snapshot.val().p2_count)
              $("#player1").prop("disabled", true)
          else 
              $("#player1").prop("disabled", false)

          compareCard(p1_indexcounter, p2_indexcounter, gameid, 1);
        });

      });
  }
}

// War Logic
function compareCard(p1_indexcounter, p2_indexcounter, gameid, playerID) {
var count_index = 0;
var p1won_cards = [];
var p2won_cards = [];
var p1_scr = 0;
var p2_scr = 0;


database.ref("cardIndex_"+gameid).on("value", function(snapshot){
console.log("player card "+snapshot.val().p1cards[0])
var p1fb = snapshot.val().p1cards
var p2fb = snapshot.val().p2cards
  var drawnCardIndex = 26-p1_indexcounter-1

console.log("drawnCardIndex---"+drawnCardIndex)
p1_scr = 0
p2_scr = 0
if (playerID == 1 )
  var drawnCardIndex = 26-p1_indexcounter-1
else if (playerID == 2)
  var drawnCardIndex = 26-p2_indexcounter-1

var suit = ['diamonds','hearts','clubs','spades'];
var suitnum = Math.floor(Math.random() * 3);
var img = $('<img>');
var img2 = $('<img>');

if (playerID == 1) 
{
      img.attr('src','assets/Images/playingcards/' + p1fb[drawnCardIndex] + '_of_' + suit[suitnum] + '.png');
      img.attr('class','playingcard');
      $('.playercard1').empty();
      $('.playercard1').append(img);
      img2.attr('src','assets/Images/playingcards/' + p2fb[drawnCardIndex] + '_of_' + suit[suitnum] + '.png');
      img2.attr('class','playingcard');
      $('.playercard2').empty();
      $('.playercard2').append(img2);
  } 
  else if (playerID == 2) 
  {
      img.attr('src','assets/Images/playingcards/' + p1fb[drawnCardIndex] + '_of_' + suit[suitnum] + '.png');
      img.attr('class','playingcard');
      $('.playercard1').empty();;
      $('.playercard1').append(img);
      console.log(p1fb[drawnCardIndex]);

      img2.attr('src','assets/Images/playingcards/' + p2fb[drawnCardIndex] + '_of_' + suit[suitnum] + '.png');
      img2.attr('class','playingcard');
      $('.playercard2').empty();
      $('.playercard2').append(img2);
      console.log(p2fb[drawnCardIndex]);
    } else {}
//// -------------------------------------------------------------------------------- Ash end

if (p1_indexcounter == p2_indexcounter && playerID == 1)
{
  if (p1fb[drawnCardIndex + count_index] > p2fb[drawnCardIndex + count_index]) {
    database.ref("gameIndex_"+gameid).once("value", function(score){
    database.ref().child("gameIndex_"+gameid).update({player1: score.val().player1 +1 })
    });

  } 
  else if (p1fb[drawnCardIndex + count_index] < p2fb[drawnCardIndex + count_index]) {  
    database.ref("gameIndex_"+gameid).once("value", function(score){
    database.ref().child("gameIndex_"+gameid).update({player2: score.val().player2 +1 })
    });
 }
}
else
{
  console.log("not comparing!!") 
}
});  
}