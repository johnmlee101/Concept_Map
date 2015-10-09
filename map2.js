
//Set the canvasElem to the correct size, filling out the screen
var canvasElem = document.getElementById("canvas");
canvasElem.setAttribute('width', $(".canvas-holder").width());
canvasElem.setAttribute('height', $(".canvas-holder").height());


var canvas = oCanvas.create({
	canvas: "#canvas",
});

var nodeOptions = {
	fill: "#5DC6BC",
	stroke: "5px #23b6b8",
	highlightedStoke: "6px #125B5C",
	minWidth: 250,
	minHeight: 50
}

var insideNode = undefined;
var selectedNode = undefined;
var selectedLine = undefined;
var editingLine = undefined;
var wasEditing = false;

var connections = [];

var drawPoint = canvas.display.ellipse({
	x: 0,
	y: 0,
	origin: {x: "center", y: "center"},
	radius: 16,
	fill: "#125B5C",
	opacity: 0
});

var image = canvas.display.image({
	x: 0,
	y: 0,
	width: 18,
	height: 18,
	origin: {x: "center", y: "center"},
	align: "center",
	image: "pencil.svg"
})

drawPoint.addChild(image);

drawPoint.bind("mousedown", function() {
	if (selectedNode !== undefined) {


		var line = canvas.display.line({
			start: {x: selectedNode.x, y: selectedNode.y},
			end: {x: canvas.mouse.x, y: canvas.mouse.y},
			stroke: "5px black",
			zIndex: "back",
			opacity: 0
		})

		line.bind("click", function(event) {

			if (selectedNode !== undefined) {
				selectedNode.stroke = nodeOptions.stroke;
				drawPoint.opacity = 0;
				selectedNode = undefined;
			}

			if (selectedLine !== undefined) {
				selectedLine.stroke = "5px black";
			}

			selectedLine = line;
			selectedLine.stroke = "6px #125B5C";
			event.stopPropagation();
		});

		line.startNode = selectedNode;
		line.zIndex = "back";

		canvas.addChild(line);
		editingLine = line;

		$(".canvas-holder").css("cursor",'url("pencil_black.svg"), crosshair');

	}
});

canvas.addChild(drawPoint);


canvas.bind("dblclick", function() {

	//Create a new node on double click
	if (insideNode === undefined && editingLine === undefined) {
		newNode();
	}

});

canvas.bind("click", function() {

	//Deselect a node on blank background
	if (insideNode === undefined && selectedNode !== undefined && wasEditing == false) {
		selectedNode.stroke = nodeOptions.stroke;
		drawPoint.opacity = 0;
		selectedNode = undefined;


		canvas.redraw();
	}

	if (wasEditing) {
		wasEditing = false;
	}

	if (selectedLine !== undefined) {
		selectedLine.stroke = "5px black";
		selectedLine = undefined;
		canvas.redraw();
	}

	$(".canvas-holder").css("cursor",'default');

});

canvas.bind("mouseup", function() {
	if (editingLine !== undefined) {
		editingLine.remove();
		editingLine = undefined;
		wasEditing = true;
	}
});


canvas.bind("keydown", function (event) {

	//Removed on node on keyevents 46 (delete) and backspace (8)
	if (event.which == 46 || event.which == 8) {
		event.preventDefault();
		
		if (selectedNode !== undefined) {

			for (var i = 0; i < connections.length; i++) {
				var item = connections[i];

				if (item.startNode == selectedNode) {
					item.remove();
					connections.splice(i, 1);
					i--;
				} else if (item.endNode == selectedNode) {
					item.remove();
					connections.splice(i, 1);
					i--;
				}
				
			}
			
			selectedNode.remove();
			selectedNode = undefined;
			drawPoint.opacity = 0;
			canvas.redraw();

		} else if (selectedLine !== undefined) {
			var i = connections.indexOf(selectedLine);
			connections.splice(i, 1);
			selectedLine.remove();
			selectedLine = undefined;
		}

	}

});

function newNode(textContent) {

	var node = canvas.display.rectangle({
		x: canvas.mouse.x,
		y: canvas.mouse.y,
		width: nodeOptions.minWidth,
		height: nodeOptions.minHeight,
		origin: {x: "center", y: "center"},
		fill: nodeOptions.fill,
		stroke: nodeOptions.stroke,
		join: "round",
	});

	var text = canvas.display.text({
		x: 0, 
		y: 0,
		origin: {x: "center", y: "center"},
		align: "center",
		font: "28px Oxygen",
		text: (textContent) ? textContent : "",
		fill: "white"
	});

	node.addChild(text);



	node.dragAndDrop({
		changeZindex: true,
		start: function() {
			if (selectedNode !== undefined) {
				selectedNode.stroke = nodeOptions.stroke;
				drawPoint.opacity = 0;
			}

			selectedNode = node;
			node.stroke = nodeOptions.highlightedStoke;

			drawPoint.opacity = 1;
			drawPoint.x = node.x;
			drawPoint.y = node.y - node.height/2 - drawPoint.radius/2;
			drawPoint.zIndex = "front";

			canvas.redraw();
		},
		move: function() {
			drawPoint.x = node.x;
			drawPoint.y = node.y - node.height/2 - drawPoint.radius/2;
			drawPoint.zIndex = "front";
		}
	});

	node.bind("mouseenter", function() {
		insideNode = node;
		canvas.redraw();
	});

	node.bind("mouseleave", function() {
		if (insideNode == node) insideNode = undefined;
		canvas.redraw();
	})

	node.bind("mouseup", function() {
		if (editingLine !== undefined) {


			var duplicateLine = false;

			if (editingLine.startNode === node) {
				duplicateLine = true;
			} else {
				for (var i = 0; i < connections.length; i++) {
					if (connections[i].startNode === editingLine.startNode && connections[i].endNode   === node ||
						connections[i].endNode   === editingLine.startNode && connections[i].startNode === node) {

						duplicateLine = true;
						editingLine.remove();
						break;
					}
				}
			}


			if (duplicateLine == false) {
				editingLine.end.x = node.x;
				editingLine.end.y = node.y;

				editingLine.endNode = node;

				connections.push(editingLine);
				console.log(editingLine.startNode.id, editingLine.endNode.id);
			}

			editingLine = undefined;
		}
	});

	canvas.addChild(node);
}

canvas.setLoop(function() {
	
	if (editingLine !== undefined) {
		editingLine.zIndex = "back";
		editingLine.opacity = 1;
		editingLine.end.x = canvas.mouse.x;
		editingLine.end.y = canvas.mouse.y;
	}

	connections.forEach(function(item) {
		item.start.x = item.startNode.x;
		item.start.y = item.startNode.y;
		item.end.x = item.endNode.x;
		item.end.y = item.endNode.y;
	});

}).start();



$(window).resize(function() {
	canvasElem.setAttribute('width', $(".canvas-holder").width());
	canvasElem.setAttribute('height', $(".canvas-holder").height());
	canvas.width = $(".canvas-holder").width();
	canvas.height = $(".canvas-holder").height();
});