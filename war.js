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

// Create Game ID

function getuniqueId()
{
console.log('genrating RandNum')
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
gameids = []

// Create Player Decks

faceValue = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14]
p1 =[]
p2 =[]

function buildCard() {
    console.log('here i am')
    var randIndex
    for (var i = 0; i < 52; i++) {
        // console.log(faceValue.length)
        randIndex = Math.floor(Math.random()*faceValue.length);
        console.log('rand index is: '+ randIndex)
        console.log('rand Number is' + faceValue[randIndex])

        if(i%2 == 0) {
            p1.push(faceValue[randIndex])
        } else {
            p2.push(faceValue[randIndex])
        }
        faceValue.splice(randIndex, 1)
    }

    console.log(p1)
    console.log(p2)
};

// War Logic

var count_index = 0;
var p1won_cards = [];
var p2won_cards = [];
var p1_scr = 0;
var p2_scr = 0;

function compareCard(){

    while (p1[count_index] === p2[count_index] && p1.length > 4) {
  
      count_index += 4;
      alert('WAR BEGINS!');
    };
  
    if (p1[count_index] > p2[count_index]) {
        p1_scr +=1;
          for (i=0; i<=count_index; i++) {
            p1won_cards.push(p1[i], p2[i])
          }      
      } else if (p1[count_index] < p2[count_index]) {
        p2_scr +=1;
          for (i=0; i<=count_index; i++) {
            p2won_cards.push(p1[i], p2[i])
          }
      } else if (p1.length === 0) {
  
        alert ('Game is Over!')
  
      };
  
      p1.splice(0, count_index+1);
      p2.splice(0, count_index+1);
      count_index = 0;
  
      console.log(p1_scr)
      console.log(p2_scr)
  
      console.log(p1)
      console.log(p2)
    };

// Initiate Game

var player2_score = 0
var player = 'player1'
var score = 0
var playerID
var p1DrawingLeft = 10;
var p2DrawingLeft = 10;

function initGame(tmp)
{
  console.log($(tmp).text()  )
  if($(tmp).text() === 'New Game')
  {
    playerID = 1
    player = 'player1'
    var utilTrackerData = database.ref("util_id_trackerNew")
    utilTrackerData.once('value',function(snapshot)
    {
      console.log('====')
      snapshot.forEach(function(childsnapshot)
      {
        var childKey = childsnapshot.key;
        var childData = childsnapshot.val()
        console.log(childKey + " "+ childData.gamid)
        gameids.push(childsnapshot.val().gameid)
        console.log(gameids)
      });
      });
      var gameid = getuniqueId()
    console.log('New Game!!')
    console.log('creating util_id_tracker')
    var Util_id_tracker_id_trackerRef = database.ref().child("util_id_trackerNew");
    var Util_id_tracker_tbl = Util_id_tracker_id_trackerRef.push();
    Util_id_tracker_tbl.set({gameid: gameid})
    var gameIndexRef = database.ref().child("gameIndex_"+gameid)
    gameIndexRef.set({player1: score})
    buildCard()
    var cardIndexRef = database.ref().child("cardIndex_"+gameid)
    cardIndexRef.set({p1cards: p1})
    cardIndexRef.update({p2cards: p2})
  }
  else if ($(tmp).text() === 'Submit')
  {//if player submit gameid initialize game for player 2
    playerID = 2
    player = 'player2'
    var enteredGameId = $("input").val()
    gameid = enteredGameId
    console.log($("input").val())
    var gameIndexName = 'gameIndex_'+enteredGameId
      console.log(gameIndexName)
     var gametrackerIndexRef = database.ref().child(gameIndexName)
    gametrackerIndexRef.update({player2: player2_score+1})
  }
  $('.card-heading').hide()
  $('.seconddiv').show()
  $('.gameid').text(gameid)
  $("button").prop("disabled", true)
  $(".p1drawcnt").text(p1DrawingLeft)
  $(".p2drawcnt").text(p2DrawingLeft)
if(playerID == 1)
{
  console.log('!!!hello!!!' )
 $("#player1").prop("disabled", false)
}
else if(playerID  == 2)
{
  console.log('!!!hallo!!!' )
  $("#player2").prop("disabled", false)
}
$(".drawbutton").on("click", function(){
        console.log('Started');
        if(playerID == 1)
        {
          console.log('helloo')
                p1DrawingLeft--;
        }
        else if(playerID == 2 )
        {
                console.log('hallooo')
                p2DrawingLeft--;
        }
        // $(".p1drawcnt").text(p1DrawingLeft)
        // $(".p2drawcnt").text(p2DrawingLeft)
        // if(p1DrawingLeft <=0 )
        //   {$("#player1").prop("disabled", true)}
        // else if(p2DrawingLeft <=0 )
        //     {$("#player2").prop("disabled", true)}

            compareCard();
////End TEMP:
});
}

console.log('Starting Game')
//$('.NewgameButton').on('click', function(){
$('.NewgameButton').on('click', function(){
initGame($(this))
})