$(function() {
	loadWordList(1);
});

function loadWordList(index) {
	var wordList = jsonText[index].body[0].split(" ");
	$("#left-card > h3").remove();
	$("#canvas2").empty();
	$("#left-card > h1").after('<h3>' + jsonText[index].title + '</h3>')
	wordList.forEach(function(word) {
		$("#canvas2").append('<div class="draggable">' + word + "&nbsp;</div>");
	});
	$(".draggable").each(function(element) {
		$(this).css("font-weight", "bold");
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
				$(this).draggable("disable");
				$(this).css("cursor", "default");
				$(this).css("font-weight", "300");
			}
		}
	});
}