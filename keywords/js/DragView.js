DragView = function() {
    this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    this.width = $('#canvas2').width() - this.margin.left - this.margin.right,
    this.height = $('.row').height() - this.margin.top - this.margin.bottom;
    // this.height = Math.max(  
                    // document.body.scrollHeight, document.documentElement.scrollHeight,  
                    // document.body.offsetHeight, document.documentElement.offsetHeight,  
                    // document.body.clientHeight, document.documentElement.clientHeight,  
                    // window.innerHeight)
                    // - this.margin.top - this.margin.bottom;

    this.textHeight = 12;
    this.clickX = null;
    this.clickY = null;
    this.randomized = false;
    this.snapBack = true;

    // this.layout_mode = ;
    // this.canvas_layout = ;
}
var adjustment;
DragView.prototype = {
    
    init: function(text) {
        this.deckManager = new DeckManager(text);
        this.render();
        $("#droppedWords").sortable({
            group: 'draggable',
            onDragStart: function ($item, container, _super) {
                var offset = $item.offset(),
                pointer = container.rootGroup.pointer;

                adjustment = {
                    left: pointer.left - offset.left,
                    top: pointer.top - offset.top
                };

                // Duplicate items of the no drop area
                if(!container.options.drop)
                    $item.clone().insertAfter($item);
                _super($item, container);
            },
            onDrag: function ($item, position) {
                $item.css({
                    left: position.left - adjustment.left,
                    top: position.top - adjustment.top
                });
            }
        });
    },

    render : function() {
        
        this.layout();
    },

    layout : function() {

        var svg = this.buildCanvas();

        var line = svg;

        var h = parseInt(line.attr('y')) | 0;
        var w = parseInt(this.width) | 0;
        var c = this.margin.left;
        

        for (var i = 0; i < this.deckManager.deck.length; i++) {
            paragraph = this.deckManager.deck[i];
            for (var j = 0; j < paragraph.length; j++) {
                
                var nodeWidth = this.deckNode(this.deckManager.deck[i][j], line, c, h);
                c += nodeWidth;

                if (w - this.margin.left - this.margin.right - 45 < c ) {
                    h += this.textHeight;
                    c = this.margin.left;
                }
            };

            line.append('br');
            line.append('br');
        };
    },

    deckNode : function(chunk, line, x, y) {
        line.append('div')    // .append('tspan')
            .attr('class', 'draggable')
            .attr('top', y)
            .attr('left', x)
            .attr('id', 'tag_' + chunk.hashID + chunk.documentIndex + chunk.paragraphIndex)
            // .attr('onclick', 'setDraggable(this)')
            .text(chunk.token);
            // .call(this.drag);
        line.append('div').attr('class', 'filler').html('&nbsp;');
        // console.log(document.getElementsByClassName('text'));
        var s = document.getElementsByClassName('draggable');
        // s[s.length - 1].addEventListener('click', function() {
        //     this.classList.add('draggable');
        // }, false);
        return s[s.length - 1].offsetWidth;
    },

    buildCanvas : function() {
        var svg = d3.select('#canvas2')
            // .append('g')
            // .append('svg')
            .style('width', this.width + this.margin.right + this.margin.left + "px")
            .style('height', this.height + this.margin.top + this.margin.bottom + "px");

        return svg;
    }
};

interact('.draggable')
    .draggable({
        dynamicDrop: true,
        // enable inertial throwing
        // inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: $('.row'),
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onstart: function (event) {
            var target = event.target;
            // var copy = target.cloneNode(true);

            target.classList.add('current');
            // $('.current').replaceWith(copy);
            
            target.setAttribute("origin-x", event.clientX);
            target.setAttribute("origin-y", event.clientY);

            target.setAttribute('z-index', 10);
            target.classList.add('drag-active');
            target.classList.add('draggable');
        },
        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            // var textEl = event.target.querySelector('p');
            var target = event.target;
            toOrigin(target);
            
            if(lastTime == (new Date).getSeconds()){
                console.log(event.target.innerHTML);
                newNode(event.target.innerHTML);
            } 
            if (grp_contains_id($('.dropzone ul#droppedWords li div'), target.getAttribute('id'))) {
                return;
            }

            target.removeAttribute('data-x');
            target.removeAttribute('data-y');
            target.classList.remove('drag-active');
            target.classList.remove('current');
            target.classList.remove('can-drop');
        }

    }).on('tap', function (event) {
        var target = event.target;

        if ($('#droppedWords').has(target).length > 0) {
                     
            var thing = d3.select('#canvas2')
                .select("#" + target.id)
                .style('pointer-events', 'auto')
                .style('color', '#000')
                .attr('origin-x', null)
                .attr('origin-y', null)
                .attr('data-x', null)
                .attr('data-y', null)
                .attr('style', null)
                .attr('z-index', null)
                .attr('class', 'draggable');
            
            toOrigin_s(thing);

            $('#keyBin').find(target).parent().remove();
            // $('#canvas').filter('[visibility=hidden]').attr('visibility', 'initial');
        }
    });

function dragMoveListener (event) {

    //console.log(event.target);
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.webkitTransform =
    target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // console.log('moving');
}

var inCanvas = false;
var canvasMouseX = 0;
var canvasMouseY = 0;
var mouseX = 0;
var mouseY = 0;


function toOrigin(target) {
    target.style.webkitTransform =
    target.style.transform = null;
}

function toOrigin_s(selection) {
    selection.style('transform', null);
}

window.dragMoveListener = dragMoveListener;