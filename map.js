var nodes = [];
var startNode = -1;
var lines = [];
var connections = [];

var mode = "Add";

var editingNode = -1;

var mousedown = false;

var canvasElem = document.getElementById("canvas");
canvasElem.setAttribute('width', $(".canvas-holder").width());
canvasElem.setAttribute('height', $(".canvas-holder").height());

var canvas = canvasElem.getContext("2d");
canvas.imageSmoothingEnabled = false;
canvas.font = "bold 28px Courier";

var wordElem = $(".word-elem");
var editableWord = $('.editable-word');
		

(function init() {

	$("#toolbar div").click(function() {
  		$("#toolbar div[selected]").removeAttr("selected");
  		$(this).attr("selected", "");
  		mode = $(this).html();
  		switch(mode) {
  			case "Add":
  				$(".canvas-holder").css("cursor","crosshair");
  				break;
    		case "Edit":
  				$(".canvas-holder").css("cursor","text");
  				break;
    		case "Draw":
  				$(".canvas-holder").css("cursor",'url("css/pencil.png"), crosshair');
  				break;
  		}
	});

	canvasElem.addEventListener("mousedown", function(event) {
		mouseDown = true;

		var mouse = new Mouse();
		switch(mode) {
			case "Add":
				addNode(mouse.x, mouse.y);
				break;
			case "Edit":
				editNode(mouse.x, mouse.y);
				break;
			case "Draw":
				break;
		}
	}, false);

	canvasElem.addEventListener("mouseup", function(event) {
		mouseDown = false;
		
			// var connection = [startNode, inNode];
			// connections.push(connection);
			// drawLine(nodes[startNode].x, nodes[startNode].y, nodes[inNode].x, nodes[inNode].y, 'black');
			// startNode = -1;
	}, false);

	// canvasElem.addEventListener("mousemove", function(event) {
	// 	mouseDown = false;
	// 	var x = Math.round(event.clientX - canvasElem.getBoundingClientRect().left);
	// 	var y = Math.round(event.clientY - canvasElem.getBoundingClientRect().top);
		
	// 	console.log(x, y);
	// }, false);

})();

function insideNode(x, y) {
	for (var i = 0; i < nodes.length; i++) {
		if (x < nodes[i].x + nodes[i].width/2  && x > nodes[i].x - nodes[i].width/2 && 
			y < nodes[i].y + nodes[i].height/2 && y > nodes[i].y - nodes[i].height/2) {
			console.log("Inside node", i);
			return i;
		}
	}
	
	return -1;
}
	
function drawLine(x, y, x2, y2, color) {
	canvas.beginPath();
	canvas.moveTo(x, y);
	canvas.lineTo(x2, y2);
	canvas.closePath();
	canvas.strokeStyle = color;
	canvas.stroke();
}


function Node(x, y, width, height) {
	this.x = x;
	this.y = y;
	
	this.width = width;
	this.height = height;
	
	this.radius = 5;


	this.textContent = "";

	this.text = function(newText) {
		if (newText.length < this.textContent.length) {
			console.log("smaller");
			var clearWidth = canvas.measureText(this.textContent).width + 28 + 6;
			var clearHeight = this.height + 6
			clearWidth = clearWidth < 175 ? 175 : clearWidth;
			canvas.clearRect(this.x - this.width/2 - 3, this.y - this.height/2 - 3, clearWidth, clearHeight);
		}
		this.textContent = newText;

		nodes[editingNode].draw("noText");
	}
	

	this.draw = function(noText) {
		canvas.strokeStyle = "#23b6b8";
		canvas.fillStyle = "#5DC6BC";
		canvas.lineWidth = 5;

		this.width = canvas.measureText(this.textContent).width + 28;
		this.width = this.width < 175 ? 175 : this.width;


		canvas.beginPath();
		canvas.moveTo(this.x - this.width/2 + this.radius, this.y - this.height/2);
		canvas.lineTo(this.x + this.width/2 - this.radius, this.y - this.height/2);
		canvas.quadraticCurveTo(this.x + this.width/2, this.y - this.height/2, this.x + this.width/2, this.y + this.radius - this.height/2);
		canvas.lineTo(this.x + this.width/2, this.y + this.height/2 - this.radius);
		canvas.quadraticCurveTo(this.x + this.width/2, this.y + this.height/2, this.x + this.width/2 - this.radius, this.y + this.height/2);
		canvas.lineTo(this.x + this.radius - this.width/2, this.y + this.height/2);
		canvas.quadraticCurveTo(this.x - this.width/2, this.y + this.height/2, this.x - this.width/2, this.y + this.height/2 - this.radius);
		canvas.lineTo(this.x - this.width/2, this.y + this.radius - this.height/2);
		canvas.quadraticCurveTo(this.x - this.width/2, this.y - this.height/2, this.x + this.radius - this.width/2, this.y - this.height/2);
		canvas.closePath();
		
		canvas.stroke();
		canvas.fill();

		canvas.fillStyle = "white";

		if (! noText) {
			canvas.textAlign="center";
			canvas.fillText(this.textContent, this.x, this.y + 9);
		}


   
	}
}

function clearCanvas() {
	canvas.clearRect(0 , 0 , canvasElem.width, canvasElem.height);
}
	
function editKeyChange() {
	if (editingNode > -1) {
		var text = editableWord.html();
		nodes[editingNode].text(text);
	}
}

function addNode(x, y) {
	if (insideNode(x, y) > 0) return;
	var node = new Node(x, y, 250, 50);
	node.draw();
	nodes.push(node);
}

function editNode(x, y) {
	var inNode = insideNode(x, y);
	if (inNode < 0) {
		if (editingNode >= 0)
			nodes[editingNode].draw();
		editingNode = -1;
		wordElem.hide();
		return;
	}

	if (editingNode >= 0 && editingNode != inNode) {
		nodes[editingNode].draw();
	}
	nodes[inNode].draw("noText");

	editingNode = inNode;

	var node = nodes[inNode];
	editableWord.html(node.textContent.length > 0 ? node.textContent : "");
	wordElem.css("left", node.x + "px");
	wordElem.css("top",  node.y - (node.height/2)+"px");
	wordElem.show();
	editableWord.focus();
	setTimeout(function() {
		editableWord.focus();
	}, 100);
}

function Mouse() {
	this.x = Math.round(event.clientX - canvasElem.getBoundingClientRect().left);
	this.y = Math.round(event.clientY - canvasElem.getBoundingClientRect().top);
}
	
	
	
	
	
	
