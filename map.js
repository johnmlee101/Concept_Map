var nodes = [];
var startNode = -1;
var lines = [];
var connections = [];

var editing = false;

var mousedown = false;

var canvasElem = document.getElementById("canvas");
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
			var node = new rectangle(x, y, 60, 25, 'blue');
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


function rectangle(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	this.deltaX = 0;
	this.deltaY = 0;
	this.angle = 0;
	this.deltaAngle = 0;
	
	this.width = width;
	this.height = height;
	this.deltaWidth = 0;
	this.deltaHeight = 0;
	
	this.color = color;
	
	this.radAngle = function() {
		return (this.angle*Math.PI)/180;
	}

	this.draw = function() {
		canvas.save();
		canvas.translate(this.x, this.y);
		canvas.rotate(this.radAngle());
		
		canvas.fillStyle = color;
		canvas.fillRect(-(this.width/2), -(this.height/2), this.width, this.height);
		
		canvas.restore();
	}
}

function clearCanvas() {
	canvas.clearRect(0 , 0 , canvasElem.width, canvasElem.height);
}
	
	
	
	
	
	
	
	
	
