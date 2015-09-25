var nodes = [];
var startNode = -1;
var lines = [];
//var connections = [];

var mode = "Select";

var editingNode = -1;
var selectedNode = -1;
var drawingInterval;
var movingNodeInterval;

var mouse = new Mouse();

var canvasElem = document.getElementById("canvas");
canvasElem.setAttribute('width', $(".canvas-holder").width());
canvasElem.setAttribute('height', $(".canvas-holder").height());

var backgroundCanvasElem = document.getElementById("backgroundCanvas");
backgroundCanvasElem.setAttribute('width', $(".canvas-holder").width());
backgroundCanvasElem.setAttribute('height', $(".canvas-holder").height());

var backgroundCanvas = backgroundCanvasElem.getContext("2d");
backgroundCanvas.imageSmoothingEnabled = false;

var canvas = canvasElem.getContext("2d");
canvas.imageSmoothingEnabled = false;
canvas.font = "28px Oxygen";

var wordElem = $(".word-elem");
var editableWord = $('.editable-word');
editableWord.autoGrowInput({minWidth:30,comfortZone:30});

		

(function init() {

	$("#toolbar div").click(function() {
		$("#toolbar div[selected]").removeAttr("selected");
		$(this).attr("selected", "");
		mode = $(this).html();

		if (editingNode >= 0) {
			nodes[editingNode].draw();
			editingNode = -1;
			wordElem.hide();
		}
	
		switch(mode) {
			case "Select":
				$(".canvas-holder").css("cursor","default");
				break;
			case "Add":
				$(".canvas-holder").css("cursor","copy");
				break;
			case "Edit":
				$(".canvas-holder").css("cursor","text");
				break;
			case "Draw":
				$(".canvas-holder").css("cursor",'url("css/pencil.png"), crosshair');
				break;
			case "Move":
				$(".canvas-holder").css("cursor","move");
				break;
		}

	});

	canvasElem.addEventListener("mousemove", function(event) {
		mouse.setPosition(
			Math.round(event.clientX - canvasElem.getBoundingClientRect().left),
			Math.round(event.clientY - canvasElem.getBoundingClientRect().top)
		);

	});

	canvasElem.addEventListener("mousedown", function(event) {
		console.log("down");
		mouse.mouseDown = true;

		switch(mode) {
			case "Select":
				selectNode(mouse.x, mouse.y);
				break;
			case "Add":
				addNode(mouse.x, mouse.y);
				break;
			case "Edit":
				editNode(mouse.x, mouse.y);
				break;
			case "Draw":
				startDrawing(mouse.x, mouse.y);
				break;
			case "Move":
				moveNode(mouse.x, mouse.y);
				break;
		}
	}, false);

	canvasElem.addEventListener("dblclick", function(event) {
		//window.getSelection().removeAllRanges();
		console.log("doubleClick");
		switch(mode) {
			case "Select":
				if (insideNode(mouse.x, mouse.y) < 0) {
					addNode(mouse.x, mouse.y);
				}

				break;
		}	
	});

	canvasElem.addEventListener("keydown", function(event) {
		
		switch(mode) {
			case "Select":
				if (event.which == 46) {
					deleteNode();
				} else if (selectedNode >= 0 && String.fromCharCode(event.which).match(/[a-zA-Z0-9]/)) {
					editNode(nodes[selectedNode].x, nodes[selectedNode].y);
				}
				break;
			case "Add":
				break;
			case "Edit":
				break;
			case "Draw":
				break;
			case "Move":
				break;
		}
	}, false);

	canvasElem.addEventListener("mouseup", function(event) {
		console.log("up");
		mouse.mouseDown = false;
		
		switch(mode) {
			case "Draw":
				clearInterval(drawingInterval);
				var finishedInNode = insideNode(mouse.x, mouse.y);
				if (finishedInNode >= 0 && startDrawingNode >= 0 && startDrawingNode != finishedInNode) {
					nodes[startDrawingNode].addConnection(finishedInNode);
					nodes[finishedInNode].addConnection(startDrawingNode);
				}
				startDrawingNode = -1;
				renderBackgroundCanvas();
				break;
			case "Move":
				clearInterval(movingNodeInterval);
				break;
				
		}
	}, false);

})();

function insideNode(x, y) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i] === undefined) continue;
		if (x < nodes[i].x + nodes[i].width/2  && x > nodes[i].x - nodes[i].width/2 && 
			y < nodes[i].y + nodes[i].height/2 && y > nodes[i].y - nodes[i].height/2) {
			console.log("Inside node", i);
			return i;
		}
	}
	
	return -1;
}

function startDrawing(x, y) {

	var startX = -1;
	var startY = -1;

	var node = insideNode(x, y);
	if (node >= 0) {
		startDrawingNode = node;
		startX = nodes[node].x;
		startY = nodes[node].y;
		drawingInterval = setInterval(function() {
			renderBackgroundCanvas();
			drawLine(startX, startY, mouse.x, mouse.y, "black");
		}, 20);
	} else {
		startDrawingNode = -1;
	}
}

function renderBackgroundCanvas() {
	backgroundCanvas.clearRect(0, 0, backgroundCanvasElem.width, backgroundCanvasElem.height);
	for (var i = 0; i < nodes.length; i++) {

		var beginNode = nodes[i];
		if (beginNode === undefined) continue;
		for (var j = 0; j < beginNode.connections.length; j++) {
			var endNode = nodes[beginNode.connections[j]];
			drawLine(beginNode.x, beginNode.y, endNode.x, endNode.y, "black");
		}	
	}
}
	
function renderCanvas() {
	canvas.clearRect(0, 0, backgroundCanvasElem.width, backgroundCanvasElem.height);
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i] === undefined) continue;
		nodes[i].draw();
	}
}

function drawLine(x, y, x2, y2, color) {
	backgroundCanvas.beginPath();
	backgroundCanvas.moveTo(x, y);
	backgroundCanvas.lineTo(x2, y2);
	backgroundCanvas.closePath();
	backgroundCanvas.strokeStyle = color;
	backgroundCanvas.stroke()
;}


function Node(x, y, width, height) {
	this.x = x;
	this.y = y;
	
	this.width = width;
	this.height = height;
	
	this.radius = 5;

	this.textContent = "";

	this.selected = false;

	this.connections = [];

	this.addConnection = function(connection) {
		if (this.connections.indexOf(connection) >= 0) return;
		this.connections.push(connection);
	}

	this.removeConnection = function(connection) {
		var removeIdx = this.connections.indexOf(connection);
		if (removeIdx < 0) return;
		
		this.connections.splice(removeIdx, 1);
	}

	this.text = function(newText) {
		this.textContent = newText;
		renderCanvas();
		this.draw("NoText");
	}
	
	this.drawNode = function(fillColor, strokeColor, lineWidth) {
		canvas.fillStyle    =  fillColor;
		canvas.strokeStyle  =  strokeColor;
		canvas.lineWidth    =  lineWidth;

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

	this.drawText = function() {

		//Seems to work the best as the offset
		var topOffset = 9;

		canvas.textAlign = 'center';
		canvas.fillText(this.textContent, this.x, this.y + topOffset);
	}

	this.draw = function(noText) {

		this.width = canvas.measureText(this.textContent).width + 28;
		this.width = this.width < 175 ? 175 : this.width;

		if (this.selected) {
			this.drawNode('black', 'black', 12);
		}

		this.drawNode('#5DC6BC', '#23b6b8' , 5);

		if (! noText) {
			this.drawText();
		}
	}
}


function clearCanvas() {
	canvas.clearRect(0 , 0 , canvasElem.width, canvasElem.height);
}
	
function editKeyChange() {
	if (editingNode >= 0) {
		var text = editableWord.val();
		nodes[editingNode].text(text);
	}
}

function deleteNode() {

	if (selectedNode < 0)  return;

	console.log("delete", selectedNode);

	var node = nodes[selectedNode];
	for (var i = 0; i < node.connections.length; i++) {
		nodes[node.connections[i]].removeConnection(selectedNode);
	}	

	delete nodes[selectedNode];
	renderBackgroundCanvas();
	renderCanvas();
}

function selectNode(x, y) {
	var inNode = insideNode(x, y);
	if (inNode < 0) return;

	if (selectedNode >= 0) {
		if (nodes[selectedNode] !== undefined) {
			nodes[selectedNode].selected = false;
		}
	}

	selectedNode = inNode;

	nodes[inNode].selected = true;
	renderCanvas();
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
	editableWord.val(node.textContent.length > 0 ? node.textContent : "");
	wordElem.css("left", node.x + "px");
	wordElem.css("top",  node.y - (node.height/2)+"px");
	wordElem.show();
	editableWord.focus();
	setTimeout(function() {
		editableWord.focus();
	}, 100);
}

function moveNode(x, y) {
	var moveNode = insideNode(x, y);
	if (moveNode < 0) return;

	movingNodeInterval = setInterval(function() {
		nodes[moveNode].x = mouse.x;
		nodes[moveNode].y = mouse.y;
		renderCanvas();
		renderBackgroundCanvas();
	}, 20);


}

function Mouse() {
	this.x = 0;
	this.y = 0;

	this.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.mouseDown = false;
}
	
	
function save() {
	backgroundCanvas.drawImage(canvasElem, 0, 0);
	console.log(backgroundCanvasElem.toDataURL());
}
	
	
	
	
