
//Set the canvasElem to the correct size, filling out the screen
var canvasElem = document.getElementById("canvas")
canvasElem.setAttribute('width', $(".canvas-holder").width())
canvasElem.setAttribute('height', $(".canvas-holder").height())

var wordElem = $(".word-elem")
var editableWord = $('.editable-word')
editableWord.autoGrowInput({minWidth:30,comfortZone:30})

var canvas = oCanvas.create({
	canvas: "#canvas",
})

var conceptMap = new ConceptMap()

canvas.bind("dblclick", function() {

	//Create a new node on double click
	if (conceptMap.insideNode === undefined && !conceptMap.lock) {
		conceptMap.addNode(new Node(canvas.mouse.x, canvas.mouse.y, ""))
	}

	conceptMap.deselect()

})

canvas.bind("click", function() {

	if (conceptMap.selectedNode && conceptMap.selectedNode.editing == false)
		conceptMap.deselect()

	if (conceptMap.selectedNode && conceptMap.selectedNode.editing == true)
		conceptMap.selectedNode.editing = false

	if (conceptMap.selectedLine)
		conceptMap.deselect()
})

canvas.bind("mouseup", function() {
	if (conceptMap.editingConnection !== undefined) {
		if (conceptMap.insideNode !== undefined) {
			conceptMap.editingConnection.setEndNode(conceptMap.insideNode)
			conceptMap.addConnection(conceptMap.editingConnection)

			conceptMap.editingConnection.startNode.addConnection(conceptMap.editingConnection)
			conceptMap.insideNode.addConnection(conceptMap.editingConnection)

			conceptMap.editingConnection = undefined
		} else {
			conceptMap.editingConnection.remove()
			conceptMap.editingConnection = undefined
		}

		$(".canvas-holder").css("cursor",'default');
	}
})


canvas.bind("keydown", function (event) {

	//Removed on node on keyevents 46 (delete) and backspace (8)
	if (event.which == 46 || event.which == 8) {

		if (!conceptMap.textEditing) {

			event.preventDefault()

			if (!conceptMap.lock) {
				if (conceptMap.selectedNode) {
					conceptMap.removeSelected()
					ConceptMap.selectedNode = undefined
				}
			}

			if (conceptMap.selectedLine) {
				conceptMap.removeLine()
				ConceptMap.selectedLine = undefined
			}
		}	

	} else if (String.fromCharCode(event.which).match(/[a-zA-Z0-9]/)) {
		if (conceptMap.selectedNode) {
			conceptMap.selectedNode.edit()
		}
	} else if (event.which == 13) {
		if (conceptMap.textEditing) {
			conceptMap.deselect()
			event.preventDefault()
		}
	}

})



canvas.setLoop(function() {

	if (conceptMap.editingConnection !== undefined) {
		conceptMap.editingConnection.end = {
			x: canvas.mouse.x,
			y: canvas.mouse.y
		}
	}
	canvas.redraw

}).start()

function editKeyChange() {
	if (conceptMap.selectedNode !== undefined) {
		var text = editableWord.val();
		conceptMap.selectedNode.text = text;
	}
}


function getRootNode(node) {
	var root = conceptMap.nodes.filter(function(x) {
				return rootCheckNode.root == x.text
	})[0]
}

function grade() {
	$.getJSON("assets/grade.json", function(data) {
		conceptMap.reset()

		for (var i = 0; i < data.length; i++) {
			var rootCheckNode = data[i];

			//Find the first root node
			var root = conceptMap.nodes.filter(function(x) {
				return rootCheckNode.root == x.text
			})[0]

			if (root === undefined) {
				console.log("Missing node", rootCheckNode.root)
				return
			}

			//Check all the leafs
			
			var errors = []

			root.connections.forEach(function(connection) {
				var rootLeaf = undefined

				if (connection.startNode == root) {
					rootLeaf = connection.endNode
				} else {
					rootLeaf = connection.startNode
				}

				console.log(rootLeaf.text)
				var leaf = rootCheckNode.connections.indexOf(rootLeaf.text)
				if (leaf >= 0) {
					rootCheckNode.connections.splice(leaf, 1)
					errors.push(rootCheckNode.errors[leaf])
					rootCheckNode.errors.splice(leaf, 1)
				}

			})

			if (rootCheckNode.connections.length > 0) {
				console.log(rootCheckNode.root, "is missing ", rootCheckNode.connections)
				console.log(rootCheckNode.errors)
				root.error()
				return
			}

		}
		console.log("verified mostly!")
	})
}

$(window).resize(function() {
	canvasElem.setAttribute('width', $(".canvas-holder").width())
	canvasElem.setAttribute('height', $(".canvas-holder").height())
	canvas.width = $(".canvas-holder").width()
	canvas.height = $(".canvas-holder").height()
})
