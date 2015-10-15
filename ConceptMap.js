function ConceptMap() {

	this.nodes = []
	this.connections = []
	this.insideNode = undefined
	this.selectedNode = undefined
	this.editingLine = undefined

	this.drawPoint = canvas.display.ellipse({
		x: 0,
		y: 0,
		origin: {x: "center", y: "center"},
		align: "center",
		radius: 16,
		fill: "#125B5C",
		opacity: 0
	});

	this.pencil = canvas.display.image({
		x: 0,
		y: 0,
		width: 18,
		height: 18,
		origin: {x: "center", y: "center"},
		align: "center",
		image: "pencil.svg"
	})

	this.drawPoint.addChild(this.pencil)
	this.drawPoint.conceptMap = this

	this.drawPoint.bind("mousedown", function(event) {
		if (this.conceptMap.selectedNode) {

			event.stopPropagation()

			this.conceptMap.selectedNode.editing = true

			this.conceptMap.editingConnection = new Connection(this.conceptMap.selectedNode)
		}
	})


};

ConceptMap.prototype = {

	addNode: function(node) {
		this.nodes.push(node)
	},

	removeNode: function(node) {
		var i = this.nodes.indexOf(node)
		this.nodes.splice(i, 1)
		node.remove()
	},

	addConnection: function(connection) {
		this.connections.push(connection)
	}, 

	removeConnection: function(connection) {
		var i = this.connections.indexOf(connection)
		this.connections.splice(i, 1)
	},

	removeSelected: function() {
		this.removeNode(this.selectedNode)
	}
}