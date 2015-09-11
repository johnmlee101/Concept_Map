var nodes = [];
var startNode = -1;
var lines = [];
var connections = [];

var editing = false;

var mousedown = false;

var canvasElem = document.getElementById("canvas");
canvasElem.setAttribute('width', $("#center").width());
canvasElem.setAttribute('height', $("#center").height());
var canvas = canvasElem.getContext("2d");
canvas.imageSmoothingEnabled = false;

var wordElem = $(".wordElem");
		

(function init() {
	canvasElem.addEventListener("mousedown", function(event) {
		mouseDown = true;
		
		var x = Math.round(event.clientX - canvasElem.getBoundingClientRect().left);
		var y = Math.round(event.clientY - canvasElem.getBoundingClientRect().top);
		
		var inNode = insideNode(x, y);

		if (inNode < 0) {
			var node = new Node(x, y, 60, 25, 'blue');
			node.draw();
			nodes.push(node);
		} else {
			startNode = inNode;
		}
	}, false);

	canvasElem.addEventListener("mouseup", function(event) {
		mouseDown = false;
		var x = Math.round(event.clientX - canvasElem.getBoundingClientRect().left);
		var y = Math.round(event.clientY - canvasElem.getBoundingClientRect().top);
		
		console.log(x, y);
		
		var inNode = insideNode(x, y);
		
		if (inNode == startNode) {
			var node = nodes[inNode];
			wordElem.css("width", node.width + "px");
			wordElem.css("left", node.x - (node.width/2)+"px");
			wordElem.css("top",  node.y + (node.height/2)+"px");
			wordElem.show();
		} else if (inNode >= 0 && startNode >= 0) {
			var connection = [startNode, inNode];
			connections.push(connection);
			drawLine(nodes[startNode].x, nodes[startNode].y, nodes[inNode].x, nodes[inNode].y, 'black');
			startNode = -1;
		}
	}, false);
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


function Node(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	
	this.width = width;
	this.height = height;
	
	this.color = color;
	this.radius = 5;

	this.text = "";
	

	this.draw = function() {
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
   
	}
}

function clearCanvas() {
	canvas.clearRect(0 , 0 , canvasElem.width, canvasElem.height);
}
	
	
	
	
	
	
	
	
	
