$(function() {
	var wordList = jsonText[0].body[0].split(" ");
	wordList.forEach(function(word) {
		$("#canvas2").append('<div class="draggable">' + word + "&nbsp;</div>");
	});
	$(".draggable").draggable({
		revert: true,
		revertDuration: 0,
		cursor: "pointer",
		scroll: false,
		stop: function( event, ui ) {
			var offset = $(".canvas-holder").offset();
			var width = $(".canvas-holder").width();
			var height = $(".canvas-holder").height();
			if(ui.offset.left > offset.left && ui.offset.left < offset.left + width && ui.offset.top > offset.top && ui.offset.top < offset.top + height) {
				conceptMap.addNode(new Node(ui.offset.left - offset.left, ui.offset.top - offset.top, this.innerText.split(" ")[0].replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")));
			}
		}
	});
});

