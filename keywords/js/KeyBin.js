KeyBin = function() {
// var margin = {top: 20, right: 120, bottom: 20, left: 120};
};

KeyBin.prototype = {
    init : function(keys, height, width) {
        this.height = height;
        this.width = width;

        d3.select('#keyBin')
            .append('div')
            .attr('class', 'dropzone')
            .append('ul')
            .attr('id', 'droppedWords');

        d3.select('.dropzone')
            .style('height', height + 'px');

        d3.select('#keyBin')
            .append('div')
            .attr('class', 'text-center')
            .append('button')
            .attr('class', "btn btn-primary")
            .attr('onclick', 'submitKeywords()')
            .text('Submit');

        this.keys = keys;
        this.state = [];
    },

    complete : function() {

    },

    collide : function(rect) {
        r1 = $('#keyBox').getBoundingClientRect();
        r2 = rect.getBoundingClientRect();

                return !(r2.right > r1.right ||
                        r2.right < r1.left ||
                        r2.top > r1.bottom ||
                        r2.bottom < r1.top);
    }
};

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.draggable',
    // Require a 85% element overlap for a drop to be possible
    overlap: 0.85,

    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');

    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');


        // draggableElement.textContent = 'Dragged in';

    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        // event.relatedTarget.textContent = 'Dragged out';
    },
    ondrop: function (event) {
        var target = event.relatedTarget;

        console.log('dropped');

        target.classList.remove('can-drop');
        target.classList.remove('current');
        var id = '#droppedWords li div#' + event.relatedTarget.getAttribute('id');
        if ($(id).length > 0) {
                d3.select(id)
                .attr('origin-x', null)
                .attr('origin-y', null)
                .attr('data-x', null)
                .attr('data-y', null)
                .attr('style', null)
                .attr('z-index', null);
            
            console.log('prevent duplicate drop');
            
            return;
        }

        var x = event.clientX, y = event.clientY,
        elementMouseIsOver = document.elementFromPoint(x, y);
        console.log(elementMouseIsOver);

        var selection = document.querySelectorAll(':hover');
        // selection = selection[selection.length - 1];
        console.log(selection);

        d3.select('#droppedWords')
            .append('li')
            .append('div')
            .attr('class', target.getAttribute('class'))
            .attr('data-x', null)
            .attr('data-y', null)
            .attr('origin-x', target.getAttribute('origin-x'))
            .attr('origin-y', target.getAttribute('origin-y'))
            .attr('id', target.id)
            .text(target.textContent);

        // event.relatedTarget.classList.remove('can-drop');
        //event.relatedTarget.style.visibility = 'hidden';

        event.relatedTarget.style.color = '#29e';
        event.relatedTarget.style.pointerEvents='none';
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
        event.target.classList.remove('can-drop');
    }
});

function grp_contains_id(group, id) {
    for (var i = 0; i < group.length; i++) {
        // console.log(group[i]);
        if (group[i].getAttribute('id') == id)
            return true;
    };

    return false;
}

function submitKeywords() {
    var words = $('#droppedWords li');
    
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].textContent;
    };

    console.log(words);
}