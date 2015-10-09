
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

var drawPoint = canvas.display.rectangle({
	x: 0,
	y: 0,
	origin: {x: "center", y: "bottom"},
	width: 50,
	height: 20,
	fill: "black",
	opacity: 0
});

drawPoint.bind("mousedown", function() {
	if (selectedNode !== undefined) {
		var line = canvas.display.line({
			start: {x: selectedNode.x, y: selectedNode.y},
			end: {x: canvas.mouse.x, y: canvas.mouse.y},
			stroke: "5px black"
		})
		canvas.addChild(line);
	}
});

canvas.addChild(drawPoint);


canvas.bind("dblclick", function() {

	//Create a new node on double click
	if (insideNode === undefined) {
		newNode();
	}

});

canvas.bind("click", function() {

	//Deselect a node on blank background
	if (insideNode === undefined && selectedNode !== undefined) {
		selectedNode.stroke = nodeOptions.stroke;
		drawPoint.opacity = 0;
		selectedNode = undefined;
		canvas.redraw();
	}

});


canvas.bind("keydown", function (event) {

	//Removed on node on keyevents 46 (delete) and backspace (8)
	if (selectedNode !== undefined) {
		if (event.which == 46 || event.which == 8) {
			event.preventDefault();
			selectedNode.remove();
			selectedNode = undefined;
			drawPoint.opacity = 0;
			canvas.redraw();
		}
	}

});

function newNode() {

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
		text: node.id,
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
			drawPoint.y = node.y - node.height/2 - 3;

			canvas.redraw();
		},
		move: function() {
			drawPoint.x = node.x;
			drawPoint.y = node.y - node.height/2 - 3;
		}
	});

	node.bind("mouseenter", function() {
		insideNode = node;
		text.text = "Inside Node " + node.id;
		canvas.redraw();
	});

	node.bind("mouseleave", function() {
		if (insideNode == node) insideNode = undefined;

		text.text = node.id;
		canvas.redraw();
	})

	canvas.addChild(node);
}



$(window).resize(function() {
	canvasElem.setAttribute('width', $(".canvas-holder").width());
	canvasElem.setAttribute('height', $(".canvas-holder").height());
	canvas.width = $(".canvas-holder").width();
	canvas.height = $(".canvas-holder").height();
});