
require('./styles');

var win = window, doc = win.document;

function positionTooltip(event, anchor, tooltip) {

    // Keep the tooltip near where the mouse is
    var mousePos = {x: event.pageX, y: event.pageY};

    // account for the edges of the screen, no need to do left
    var topClip = mousePos.y - tooltip.offsetHeight - 5;
    var rightClip = mousePos.x + tooltip.offsetWidth - win.innerWidth;

    var top = event.pageY - tooltip.offsetHeight - 5;
    var left = event.pageX - 5;

    if(rightClip > 0) 
        left -= rightClip - 5;

    if(topClip < 0)
        top += tooltip.offsetHeight*2 - 5;

    tooltip.style.left = left + 'px';
    tooltip.style.top =  top + 'px';
}

function tooltipDecorator(node, content) {

    var tooltip, handlers, eventName;


    handlers = {
        mouseenter: function(event) {

            if(!content || content.length === 0)
                return;

            // Create the tooltip
            if(!tooltip)
            {
                tooltip = doc.createElement('div');
                tooltip.className = 'ractive-tooltip';
                tooltip.textContent = content;
            }

            positionTooltip(event, node, tooltip);

            doc.body.appendChild(tooltip);
        },

        mousemove: function(event) {
            if(!tooltip)
                return;
            positionTooltip(event, node, tooltip);
        },

        mouseleave: function() {

            if(!tooltip || !tooltip.parentNode)
                return;

            tooltip.parentNode.removeChild(tooltip);
        }
    };

    // Add event handlers to the node
    for(eventName in handlers) {
        if(handlers.hasOwnProperty(eventName)) {
            node.addEventListener(eventName, handlers[eventName], false);
        }
    }

    // Return an object with a `teardown()` method that removes the
    // event handlers when we no longer need them
    return {
        update: function(newContent) {
            content = newContent;

            if(tooltip)
                tooltip.textContent = content;

            if((!content || content.length === 0) && tooltip && tooltip.parentNode)
                tooltip.parentNode.removeChild(tooltip);
        },
        teardown: function() {
            if(tooltip && tooltip.parentNode)
            {
                tooltip.parentNode.removeChild(tooltip);
                tooltip = null;
            }
            for(eventName in handlers) {
                if(handlers.hasOwnProperty(eventName)) {
                    node.removeEventListener(eventName, handlers[eventName], false);
                }
            }
        }
    };
};

module.exports = tooltipDecorator;
