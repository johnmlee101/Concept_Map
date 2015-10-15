function Connection(startNode) {

	this.startNode = startNode
	this._start = {
		x: startNode.x, 
		y: startNode.y
	}

	this.endNode = undefined
	this._end = {
		x: undefined, 
		y: undefined
	}
	
	this.stroke = "5px black"
	this.highlightedStoke  = "6px #125B5C"

	this._selected = false

	//init
	this.lineObject = canvas.display.line({
		start: this._start,
		end: {
			x: canvas.mouse.x, 
			y: canvas.mouse.y
		},
		stroke: this.stroke,
		zIndex: "back",
		opacity: 0
	})

	canvas.addChild(this.lineObject)
}

Connection.prototype = {
	constructor: Connection,

	set start(val) {
		this.lineObject.start = val

		this.lineObject.zIndex = "back"

		if (this.lineObject.opacity == 0) 
			this.lineObject.opacity = 1

		this._start = val
	},

	get start() {
		return this._start
	},

	set end(val) {
		this.lineObject.end = val

		this.lineObject.zIndex = "back"

		if (this.lineObject.opacity == 0) 
			this.lineObject.opacity = 1

		this._end = val
	},

	get end() {
		return this._end
	},

	remove: function() {
		this.lineObject.remove()
	},

	setEndNode: function(endNode) {
		this.endNode = endNode
		this.end = {
			x: endNode.x,
			y: endNode.y
		}
	}
}

