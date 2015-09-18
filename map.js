var nodes = [];
var startNode = -1;
var lines = [];
var connections = [];

var mode = "Add";

var editingNode = -1;
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
		mouse.mouseDown = true;

		switch(mode) {
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

	canvasElem.addEventListener("mouseup", function(event) {
		mouse.mouseDown = false;
		
		switch(mode) {
			case "Draw":
				clearInterval(drawingInterval);
				var finishedInNode = insideNode(mouse.x, mouse.y);
				if (finishedInNode >= 0 && startDrawingNode >= 0 && startDrawingNode != finishedInNode) {

					var connection = {
						start: startDrawingNode,
						end: finishedInNode
					};

					if (finishedInNode < startDrawingNode) {
						connection.start = finishedInNode;
						connection.end = startDrawingNode;
					} 

					var found = false;
					connections.forEach(function(item) {
						if (item.start == connection.start && item.end == connection.end) {
							found = true;
						}
					});

					if (!found) {
						connections.push(connection);
					}

					console.log(connections);
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
	for (var i = 0; i < connections.length; i++) {
		var beginNode = nodes[connections[i].start];
		var endNode = nodes[connections[i].end];
		drawLine(beginNode.x, beginNode.y, endNode.x, endNode.y, "black");
	}
}
	
function renderCanvas() {
	canvas.clearRect(0, 0, backgroundCanvasElem.width, backgroundCanvasElem.height);
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].draw();
	}
}

function drawLine(x, y, x2, y2, color) {
	backgroundCanvas.beginPath();
	backgroundCanvas.moveTo(x, y);
	backgroundCanvas.lineTo(x2, y2);
	backgroundCanvas.closePath();
	backgroundCanvas.strokeStyle = color;
	backgroundCanvas.stroke();
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
			//var clearWidth = canvas.measureText(this.textContent).width + 28 + 6;
			//var clearHeight = this.height + 6
			//clearWidth = clearWidth < 175 ? 175 : clearWidth;
			//canvas.clearRect(this.x - this.width/2 - 3, this.y - this.height/2 - 3, clearWidth, clearHeight);
			this.textContent = newText;
			renderCanvas();
			this.draw("NoText");
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
	if (editingNode >= 0) {
		var text = editableWord.val();
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
	
	
	
	
