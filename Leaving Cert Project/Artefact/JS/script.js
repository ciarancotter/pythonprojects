//Import Firebase 
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

  //Assorted variables
const canvas = document.getElementById("cvs");
var myDiv = document.getElementById("bar-chart");
var player;
const speed = 0.2;
var questionElements = [];
var dataset = [];
var qNumber = 1;
var ansUp = false;
var ansDown = false;
var ansLeft = false;
var ansRight = false;
var rightAnswer = true;
var myImage = new Image();
myImage.src = "../IMG/testSprite.png";
var textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: false})
  .add({
    targets: '.ml3 .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 2250,
    delay: (el, i) => 100 * (i+1)
  });
  
//Creates the question string
function questionGeneration(year, questionNumber)
{
	var Q = (questionNumber < 41) ? ("In " + year + "," + " which country had the highest carbon emissions?") : ("In " + year + "," + " which country had the highest methane emissions?");

	return Q;
}

//Fetches Firebase data and pushes them into arrays
function createArray(number){
	questionElements = [];
	dataset = [];
	var root = firebase.database().ref();
	var query = root.child(number);
	query.once("value")
		.then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			questionElements.push(childSnapshot.key);
			childSnapshot.forEach(function(babySnapshot) {
				questionElements.push(babySnapshot.key);
				dataset.push(babySnapshot.val());
				console.log(babySnapshot.val());
			});
		
		
		});
	});
}
createArray(qNumber);
//Listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Keyboard presses and player movement
function keyDownHandler(event) {
  if (event.keyCode == 39 || event.keyCode == 68) {
	player.input.x = speed;
	myImage.src = "../IMG/testSprite3.png";
  } else if (event.keyCode == 37 || event.keyCode == 65) {
	player.input.x = -1 * speed;
	myImage.src = "../IMG/testSprite2.png";
  }

  if (event.keyCode == 40 || event.keyCode == 83) {
	player.input.y = speed;
	myImage.src = "../IMG/testSprite.png";
  } else if (event.keyCode == 38 || event.keyCode == 87) {
	player.input.y = -1 * speed;
	myImage.src = "../IMG/testSprite1.png";
  }
}

function keyUpHandler(event) {
  if (event.keyCode == 39 || event.keyCode == 68) {
	player.input.x = 0;
  } else if (event.keyCode == 37 || event.keyCode == 65) {
	player.input.x = 0;
  }
  if (event.keyCode == 40 || event.keyCode == 83) {
	player.input.y = 0;
  } else if (event.keyCode == 38 || event.keyCode == 87) {
	player.input.y = 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
	player = new gameObject(80, 80, 700, 350, "red");
	
	updateTerrain();
}, false)

//Create the player
function gameObject(width, height, _x, _y, colour) {
  this.width = width;
  this.height = height;
  this.vel = {x:0, y: 1};
  this.pos = {x:_x, y: _y};
  this.colour = colour;
  this.input = {x:0,y:0};
  
}

//Draws the text onto the canvas
function drawText(context, index)
{
	context.font = "40px Times New Roman";
	context.fillText(questionGeneration(questionElements[0], index), 300, 100);
    context.fillText(questionElements[4], 650, 600);
    context.fillText(questionElements[3], 1000, 400);
    context.fillText(questionElements[2], 300, 400);
    context.fillText(questionElements[1], 650, 200);
}

//Redraw the canvas
const updateTerrain = () => {
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0, canvas.width, canvas.height);
  
  player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;
  
  player.vel.x *= 0.9;
  player.vel.y *= 0.9;
  
  player.vel.x += player.input.x;
  player.vel.y += player.input.y;
  
  ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);
  
  drawText(ctx, qNumber);
  rightAnswer = Math.max(dataset[0], dataset[1], dataset[2], dataset[3]);
 
  //Check answer 
  if (player.pos.y < 200)
  {
	  if(dataset[0] == rightAnswer)
	  {
		  qNumber += 1;
		  ctx.clearRect(0, 0,  canvas.width, canvas.height);
		  player.pos.x = 700;
		  player.pos.y = 350;
		  createArray(qNumber);
		  drawText(ctx, qNumber);
		  ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);

		  document.getElementById("notification").innerHTML = "You are correct";
		  document.getElementById("counter").innerHTML = "Question " + qNumber + "/80";

	  } else {
		  ctx.clearRect(0, 0,  canvas.width, canvas.height);
		  player.pos.x = 700;
		  player.pos.y = 350;
		  drawText(ctx, qNumber);
		  ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);

		  drawGraph();
		  document.getElementById("notification").innerHTML = "You are incorrect";
		  document.getElementById("counter").innerHTML = "Question " + qNumber + "/80";
	  }
  }
  
  if(player.pos.y > 600)
  {
	if(dataset[3] == rightAnswer)
	{
		qNumber += 1;
		ctx.clearRect(0, 0,  canvas.width, canvas.height);
		player.pos.x = 700;
		player.pos.y = 350;
		createArray(qNumber);
		drawText(ctx, qNumber);
		ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);

		document.getElementById("notification").innerHTML = "You are correct";
		document.getElementById("counter").innerHTML = "Question " + qNumber + "/80";
	} else {
		  ctx.clearRect(0, 0,  canvas.width, canvas.height);
		  player.pos.x = 700;
		  player.pos.y = 350;
		  drawText(ctx, qNumber);
		  ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);
		  drawGraph();
		  document.getElementById("notification").innerHTML = "You are incorrect";
		  document.getElementById("counter").innerHTML = "Question " + qNumber + "/80";
	  }
  }
  
  if(player.pos.x < 300)
  {
	  if(dataset[1] == rightAnswer)
	  {
		 qNumber += 1;
		 ctx.clearRect(0, 0,  canvas.width, canvas.height);
		 player.pos.x = 700;
		 player.pos.y = 350;
		 createArray(qNumber);
		 drawText(ctx, qNumber);
		 ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);
		 document.getElementById("notification").innerHTML = "You are correct";
		 document.getElementById("counter").innerHTML = "Question " + qNumber + "/80";
	  } else {
		  ctx.clearRect(0, 0,  canvas.width, canvas.height);
		  player.pos.x = 700;
		  player.pos.y = 350;
		  drawText(ctx, qNumber);
		  ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);
		  drawGraph();
		  document.getElementById("notification").innerHTML = "You are incorrect";
		  document.getElementById("counter").innerHTML = "Question " + qNumber + "/80";
	  }
	 
	 
  }
  
  if(player.pos.x > 1000)
  {
	  if(dataset[2] == rightAnswer)
	  {
		  qNumber += 1;
		  ctx.clearRect(0, 0,  canvas.width, canvas.height);
		  player.pos.x = 700;
		  player.pos.y = 350;
		  createArray(qNumber);
		  drawText(ctx, qNumber);
		  ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);
		  document.getElementById("notification").innerHTML = "You are correct";
		  document.getElementById("counter").innerHTML = "Question " + qNumber + "/80";
	  } else {
		  ctx.clearRect(0, 0,  canvas.width, canvas.height);
		  player.pos.x = 700;
		  player.pos.y = 350;
		  drawText(ctx, qNumber);
		  ctx.drawImage(myImage, player.pos.x, player.pos.y, player.width, player.height);
		  drawGraph();
		  document.getElementById("notification").innerHTML = "You are incorrect";
		  document.getElementById("counter").innerHTML = "Question " + qNumber + "/80";
	  }


	  
  }
  
  

	
    requestAnimationFrame(updateTerrain);
	

	
}

//Draw a graph of the four values
function drawGraph(){
	
	var data = [
	{
		x:[questionElements[1], questionElements[2], questionElements[3], questionElements[4]],
		y:[dataset[0], dataset[1], dataset[2], dataset[3]],
		type: "bar"
	}
	];
	var layout = {
		title: {
			text: questionElements[0],
			font: {
			family: 'Courier New, monospace',
			size: 24
				},
		autosize: false,
		width: 600,
		height: 500,
	
	}
	}
	Plotly.newPlot(myDiv, data, layout);
	

}



requestAnimationFrame(updateTerrain);