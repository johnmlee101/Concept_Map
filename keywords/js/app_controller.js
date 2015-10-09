app_controller = function () {
	this.layer1 = null;
	this.layer2 = null;
}

app_controller.prototype = {
	init : function(height, width, jsonPath) {
    	this.keyBin = new KeyBin();
    	this.keyBin.init("", height, width);
    	d3.select('#keyBin').insert('h3', ':first-child').text('Word Bank').attr('class', 'text-center');
		this.dragLayer = new DragView();
		this.dragLayer.init(jsonText[0].body);
	}
};