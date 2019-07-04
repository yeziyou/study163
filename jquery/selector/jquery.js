(function(root){
    var rootjQuery;
    var readyList;
    // Define a local copy of jQuery
	var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
    };
    
    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: '2.0.3',
    
        constructor: jQuery,
        init: function( selector, context, rootjQuery ) {
            var match, elem;

            // HANDLE: $(""), $(null), $(undefined), $(false)
            if ( !selector ) {
                return this;
            }
            if ( selector.nodeType ) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
    
            // HANDLE: $(function)
            // Shortcut for document ready
            } else if ( jQuery.isFunction( selector ) ) {
                return rootjQuery.ready( selector );
            }
        },
        ready: function( fn ) {
            // Add the callback
            jQuery.ready.promise().done( fn );
    
            return this;
        },
    }

    // Handle when the DOM is ready
	jQuery.ready = function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
    }

    jQuery.ready.promise = function( obj ) {
        if ( !readyList ) {
    
            readyList = jQuery.Deferred();
    
            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if ( document.readyState === "complete" ) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                setTimeout( jQuery.ready );
    
            } else {
    
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", completed, false );
    
                // A fallback to window.onload, that will always work
                window.addEventListener( "load", completed, false );
            }
        }
        return readyList.promise( obj );
    };

    // All jQuery objects should point back to these
    rootjQuery = jQuery(document);
})(this)