DeckManager = function(text) {
	this.init(text);
};

DeckManager.prototype = {
	init : function(text) {
		this.deck = this.tokenize(text);
	},

	tokenize : function (text, n) {
		var paragraphs = [];

		for (var i = 0; i < text.length; i++) {
			paragraphs.push(text[i].split(/[ \(\):\n]+/));
		};
		 
	    ret = [];

	    for (var i = 0; i < paragraphs.length; i++) {
		    for (var j = paragraphs[i].length - 1; j >= 0; j--) {
		        var token = paragraphs[i][j];
		        var index = j;
		        
		        // if (j > 0)
		        // 	index += paragraphs[i].length;

		        var key = this.hashCode(token).toString();
		        
		        paragraphs[i][j] = { 'hashID': key, 'token' : token, 'paragraphIndex' : index, 'documentIndex' : i };
		    }
	    };

    	return paragraphs;
	},

    shuffleDeck : function() {
        if (randomized == true)
            this.deck = fisher_yates_shuffle(this.deck);
    },

    hashCode : function(string) {
	    var hash = 0, i, chr, len;
	    if (string.length == 0)
	    	return hash;

	    for (i = 0, len = string.length; i < len; i++) {
	        chr   = string.charCodeAt(i);
	        hash  = ((hash << 5) - hash) + chr;
	        hash |= 0;
	    }

    	return hash;
	},

	checkKeys : function() {

		var matches = new Array(this.keys.length);
		
		for (var i = 0; i < matches.length; ++i)
			matches[i] = false;

		for (var i = this.state.length - 1; i >= 0; i--) {
			for (var j = this.keys.length - 1; j >= 0; j--) {
				if (this.state[i] == this.keys[j])
					matches[i] = true;
			};
		};

		for (var i = matches.length - 1; i >= 0; i--) {
			if (matches[i] == false)
				return false;
		};

		return true;
	}
};