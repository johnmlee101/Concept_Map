function displayError(e) {
	if(typeof e !== 'undefined') {	
		$(".error").css("display", "block");
		$(".error").html(e);
	}
	else {
		$(".error").css("display", "none");
	}
}

function finish() {
	$(".error").addClass("finishBox")
	$(".finishBox").addClass("error")
	$(".finishBox").html("Congratulations, looks liked you finished! Click next to move on.")
	$(".finishBox").html("Congratulations, looks liked you finished! Click next to move on.")
	$(".finish").attr("onclick", "next()");
	$(".finish").html("Next!")
	$(".finishBox").css("display", "block");
}

function getRootNode(node) {
	var root = conceptMap.nodes.filter(function(x) {
				return rootCheckNode.root == x.text
	})[0]
}

function grade() {
	$.getJSON("assets/apache_grade.json", function(data) {
		conceptMap.reset()

		for (var i = 0; i < data.length; i++) {
			var rootCheckNode = data[i]

			//Find the first root node
			var root = conceptMap.nodes.filter(function(x) {
				return rootCheckNode.root == x.text.toLowerCase()
			})[0]

			//Couldn't find an instance of a node with the root text
			if (root === undefined) {
				displayError("Looks like you're missing the node " + rootCheckNode.root + ".")
				return
			}

			//Check all the leafs
			
			var errors = []
			var leftOvers = []

			//Loop over the concept map connections
			root.connections.forEach(function(connection) {
				var rootLeaf = undefined

				//Find the leaf of the root for each connection
				if (connection.startNode == root) {
					rootLeaf = connection.endNode
				} else {
					rootLeaf = connection.startNode
				}

				//Get the leaf that matches the node's child text
				var leaf = rootCheckNode.connections.indexOf(rootLeaf.text.toLowerCase())
				if (leaf >= 0) {
					rootCheckNode.connections.splice(leaf, 1)
					errors.push(rootCheckNode.errors[leaf])
					rootCheckNode.errors.splice(leaf, 1)
				} else {
					console.log(root.text, rootLeaf.text)
					if (rootLeaf.text.toLowerCase() != rootCheckNode.parent) {
						leftOvers.push(rootLeaf.text.toLowerCase())
					}
				}

			})

			if (rootCheckNode.connections.length > 0) {
				displayError(rootCheckNode.root + "is missing " + rootCheckNode.connections)
				displayError(rootCheckNode.errors[0])
				root.error()
				return
			}

			if (leftOvers.length > 0) {
				displayError(root.text + " and " + leftOvers[0] + " should not be connected.")
				root.error()
				return
			}

		}
		displayError()
		finish("Everything looks great!")
	})
}