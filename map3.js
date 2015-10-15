
//Set the canvasElem to the correct size, filling out the screen
var canvasElem = document.getElementById("canvas");
canvasElem.setAttribute('width', $(".canvas-holder").width());
canvasElem.setAttribute('height', $(".canvas-holder").height());

var wordElem = $(".word-elem");
var editableWord = $('.editable-word');
editableWord.autoGrowInput({minWidth:30,comfortZone:30});

var canvas = oCanvas.create({
	canvas: "#canvas",
});

var conceptMap = new ConceptMap();

canvas.bind("dblclick", function() {

	//Create a new node on double click
	if (conceptMap.insideNode === undefined) {
		conceptMap.addNode(new Node(canvas.mouse.x, canvas.mouse.y, "Test text"));
	}

	if (conceptMap.selectedNode)
			conceptMap.selectedNode.normal()

});

canvas.bind("click", function() {

	if (conceptMap.selectedNode && conceptMap.selectedNode.editing == false)
		conceptMap.selectedNode.normal()

	if (conceptMap.selectedNode && conceptMap.selectedNode.editing == true)
		conceptMap.selectedNode.editing = false
	// if (textEditing) {
	// 	wordElem.hide();
	// 	if (selectedNode !== undefined) selectedNode.children[0].opacity = 1;
	// 	textEditing = false;
	// }

	// //Deselect a node on blank background
	// if (insideNode === undefined && selectedNode !== undefined && wasEditing == false) {
	// 	selectedNode.stroke = nodeOptions.stroke;
	// 	drawPoint.opacity = 0;
	// 	editPoint.opacity = 0;
	// 	removePoint.opacity = 0;
	// 	selectedNode = undefined;


	// 	canvas.redraw();
	// }

	// if (wasEditing) {
	// 	wasEditing = false;
	// }


	// if (selectedLine !== undefined) {
	// 	selectedLine.stroke = "5px black";
	// 	selectedLine = undefined;
	// 	canvas.redraw();
	// }

	// $(".canvas-holder").css("cursor",'default');

});

canvas.bind("mouseup", function() {
	if (conceptMap.editingConnection !== undefined) {
		if (conceptMap.insideNode !== undefined) {
			conceptMap.editingConnection.setEndNode(conceptMap.insideNode)
			conceptMap.addConnection(conceptMap.editingConnection)

			conceptMap.editingConnection.startNode.addConnection(conceptMap.editingConnection)
			conceptMap.insideNode.addConnection(conceptMap.editingConnection)

			conceptMap.editingConnection = undefined;
		} else {
			conceptMap.editingConnection.remove();
			conceptMap.editingConnection = undefined;
		}
	}
});


canvas.bind("keydown", function (event) {

	//Removed on node on keyevents 46 (delete) and backspace (8)
	if (event.which == 46 || event.which == 8) {
		//if (!textEditing) event.preventDefault();
		event.preventDefault()

		if (conceptMap.selectedNode) {
			conceptMap.removeSelected()
			ConceptMap.selectedNode = undefined
		}
		
	}

});



canvas.setLoop(function() {
	
	if (conceptMap.editingConnection !== undefined) {
		conceptMap.editingConnection.end = {
			x: canvas.mouse.x, 
			y: canvas.mouse.y 
		}
	}
	canvas.redraw

}).start();


$(window).resize(function() {
	canvasElem.setAttribute('width', $(".canvas-holder").width());
	canvasElem.setAttribute('height', $(".canvas-holder").height());
	canvas.width = $(".canvas-holder").width();
	canvas.height = $(".canvas-holder").height();
});