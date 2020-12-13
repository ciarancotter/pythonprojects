//Import Firebase 
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

var myDiv = document.getElementById("methaneGraph");
var questionElements = [];
var dataset = [];
var questionNumber = 41;
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
function questionUpdater()
{
	var questionElements = [];
	var dataset = [];
	questionNumber += 1;
	createArray(questionNumber);
	if(questionNumber == 80)
	{
		questionNumber = 80;
	}
}

createArray("41");


function drawGraph(){
	var data = [
	{
		x:[questionElements[1], questionElements[2], questionElements[3], questionElements[4]],
		y:[dataset[0], dataset[1], dataset[2], dataset[3]],
		type: "bar"
	}
	];
	var layout = {
		autosize: false,
		width: 500,
		height: 500,

	}
	Plotly.newPlot(myDiv, data, layout);
	

}

const updateAll = () => {
	drawGraph();
	requestAnimationFrame(updateAll);
}
requestAnimationFrame(updateAll);