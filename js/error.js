function displayError(e) {
	if(typeof e !== 'undefined') {	
		$(".error").css("display", "block");
		$(".error").html(e);
	}
	else {
		$(".error").css("display", "none");
	}
}