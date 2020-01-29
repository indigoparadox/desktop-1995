
var documentsMenu95 = [];
var desktopMouseDown95 = false;
var desktop95Desktop = null;

(function( $ ) {

$.fn.origAppendDesktop95 = $.fn.append;
$.fn.append = function( element ) {
    this.origAppendDesktop95( element );
    if( this.hasClass( 'container' ) && $(element).hasClass( 'desktop-icon' ) ) {
        // (Re-)Enable dragging.
        $(element).draggable( {
            'handle': '.desktop-icon-img',
            'helper': function() {
                let clone = $(this).clone();
                desktop95Desktop.data( 'drag-icon-original', $(this) );

                clone.css( 'opacity', 0.5 );

                return clone;
            },
            'appendTo': 'body',
        } );
    } else if( this.hasClass( 'desktop' ) && $(element).hasClass( 'window' ) ) {
        $(element).trigger( 'window-attach' );
    }
};

$.fn.desktop95 = function( action, options ) {
    'use strict';

var settings = $.extend( {
    'id': null,
    'x': 10,
    'y': 10,
    'region': {'start': {'x': 0, 'y': 0}, 'end': {'x': 0, 'y': 0}},
    'callback': null,
    'context': null,
    'classes': [],
    'data': {},
    'cbData': null,
    'deselect': true, // Deselect items not being selected.
}, options );

switch( action.toLowerCase() ) {
case 'icon':

    var imgTag = $('<div class="desktop-icon-img icon-' + settings.icon + '-32"></div>');
    var iconWrapper = $('<div class="desktop-icon"></div>');
    iconWrapper.append( imgTag );
    
    var iconText = $('<div class="desktop-icon-text-center"><div class="desktop-icon-text">' + settings.caption + '</div></div>');
    iconWrapper.append( iconText );

    this.append( iconWrapper );

    iconWrapper.css( 'left', settings.x.toString() + 'px' );
    iconWrapper.css( 'top', settings.y.toString() + 'px' );

    for( var classIter in settings.classes ) {
        console.log( settings.classes[classIter] );
        iconWrapper.addClass( settings.classes[classIter] );
    }

    // Setup action handlers.
    /*
    if( null == settings.context ) {
        settings.context = {
            'items': [
                {'caption': 'Properties', 'callback': function( m, d ) {
                    iconWrapper.trigger( 'properties' );
                }}
            ]
        };
    }

    if( null == settings.context ) {
        settings.context = {};
    }

    if( !('cbData' in settings.context) ) {
        settings.context.cbData = iconWrapper;
    }

    imgTag.menu95( 'context', {
        'menu': settings.context,
        'context': _htmlStrToClass( settings.target )} ); */

    return iconWrapper;

case 'select':

    return this.each( function( idx, element ) {
        if( $(element).hasClass( 'desktop-icon' ) ) {
            if( settings.deselect ) {
                // A specific icon was provided. Deselect all peer icons.
                $(element).parent().children('.desktop-icon').removeClass( 'desktop-icon-selected' );
            }

            // Select this icon.
            $(element).addClass( 'desktop-icon-selected' );
        } else {
            if( settings.deselect ) {
                // A container was provided. Deselect all icons inside.
                $(element).children('.desktop-icon').removeClass( 'desktop-icon-selected' );
            }

            // Select icons in the provided region.
            $(element).children( '.desktop-icon' ).each( function() {
                if( 
                    parseInt( $(this).css( 'left' ) ) > settings.region.start.x &&
                    parseInt( $(this).css( 'left' ) ) + parseInt( $(this).css( 'width' ) ) < settings.region.end.x &&
                    parseInt( $(this).css( 'top' ) ) > settings.region.start.y &&
                    parseInt( $(this).css( 'top' ) ) + parseInt( $(this).css( 'height' ) ) < settings.region.end.y
                ) {
                    $(this).desktop95( 'select', {'deselect': false} );
                }
            } );
        }    
    } );

case 'rerect':
    var leftXReal = Math.min( this.data( 'origin-x' ), settings.x );
    var rightXReal = Math.max( this.data( 'origin-x' ), settings.x );
    var topYReal = Math.min( this.data( 'origin-y' ), settings.y );
    var bottomYReal = Math.max( this.data( 'origin-y' ), settings.y );
    this.css( 'left', leftXReal.toString() + 'px' );
    this.css( 'top', topYReal.toString() + 'px' );
    this.css( 'width', (rightXReal - leftXReal).toString() + 'px' );
    this.css( 'height', (bottomYReal - topYReal).toString() + 'px' );
    return this;

case 'completerect':
    var selectRect = this.data( 'select-rect' );
    if( null == selectRect && this.hasClass( 'select-rect' ) ) {
        selectRect = this;
    }
    if( null != selectRect ) {
        this.data( 'select-rect', null );
        selectRect.remove();
    }
    return selectRect;

case 'moverect':
    // Grab the select-rect if the mouse is over the desktop.
    var selectRect = this.data( 'select-rect' );
    var x = settings.x - this.offset().left;
    var y = settings.y - this.offset().top;
    
    if( null == selectRect && this.hasClass( 'select-rect' ) ) {
        // Grab the select-rect if the mouse is over it proper.
        selectRect = this;
        x = settings.x - this.parent().offset().left;
        y = settings.y - this.parent().offset().top;
    }

    if( null != selectRect ) {
        // Select icons in the selected region.
        this.desktop95( 'select', {'region': {
            'start': {'x': parseInt( selectRect.css( 'left' ) ),
                'y': parseInt( selectRect.css( 'top' ) )},
            'end': {'x': parseInt( selectRect.css( 'left' ) ) + parseInt( selectRect.css( 'width' ) ),
                'y': parseInt( selectRect.css( 'top' ) ) + parseInt( selectRect.css( 'height' ) )},
        } } );
    
        // Redraw select-rect.
        selectRect.desktop95( 'rerect', {'x': x, 'y': y} );
    }
    return selectRect;

case 'selectrect':
    if( this.hasClass( 'container' ) ) {
        var selectRect = $('<div class="select-rect"></div>');
        this.data( 'select-rect', selectRect );
        this.append( selectRect );

        var x = settings.x - this.offset().left;
        var y = settings.y - this.offset().top;

        selectRect.data( 'origin-x', x );
        selectRect.data( 'origin-y', y );
        selectRect.desktop95( 'rerect', { 'x': x, 'y': y } );
    }
    return selectRect;

case 'enable':

    // Root container becomes the desktop.

    var containerElement = this;
    if( 0 < $(this).parents( '.container' ).length ) {
        desktop95Desktop = $(this.parents( '.container' ).last() );
    } else {
        desktop95Desktop = this;
        this.addClass( 'desktop' );
    }

    // Events for mouse handling:

    this.mousedown( function( e ) {
        desktopMouseDown95 = true;
        if( $(e.target).hasClass( 'container' ) ) {
            $(e.target).closest( '.container' ).desktop95( 'select' );
        }
        $(e.target).menu95( 'close' );
        if( $(e.target).hasClass( 'container' ) ) {
            setTimeout( function() {
                if( desktopMouseDown95 ) {
                    $(e.target).desktop95( 'selectrect', { 'x': e.pageX, 'y': e.pageY } );
                }
            }, 250 );

            // Don't propagate up to the desktop.
            e.stopPropagation();
        }
    } );

    this.mousemove( function( e ) {
        $(e.target).desktop95( 'moverect', { 'x': e.pageX, 'y': e.pageY } );
    } );

    this.mouseup( function( e ) {
        desktopMouseDown95 = false;
        $(e.target).desktop95( 'completerect' );
    } );

    this.mouseleave( function( e ) {
        desktopMouseDown95 = false;
        $(e.target).desktop95( 'completerect' );
    } );

    // Delegated devents for icon handling:

    this.on( 'mousedown', '.desktop-icon', function( e ) {
        $(e.target).closest( '.desktop-icon' ).desktop95( 'select' );
    } );

    this.on( 'dblclick', '.desktop-icon', function( e ) {
        $(e.target).trigger( 'desktop-double-click' );
    } );

    this.on( 'mousemove', '.desktop-icon', function( e ) {
        $(e.target).closest( '.container' ).desktop95( 'moverect', { 'x': e.pageX, 'y': e.pageY } );
    } );

    this.droppable( {
        'greedy': true,
        'accept': '.desktop-icon',
        'drop': function( e, ui ) {
            let incomingClone = $(ui.draggable);

            // We only care about the topost window.
            // TODO: Ignore minimized windows and non-overlapping windows.
            var dropTargetZ = parseInt( $(this).closest( '.window' ).css( 'z-index' ) );
            var cancel = false;
            desktop95Desktop.children( '.window' ).each( function() {
                if( parseInt( $(this).css( 'z-index') ) > dropTargetZ ) {
                    cancel = true;
                }
            } );
            if( cancel ) {
                return;
            }

            let data = {
                'incoming': desktop95Desktop.data( 'drag-icon-original' ),
                'target': $(this),
                'source': desktop95Desktop.data( 'drag-icon-original' ).parent( '.container' )
            };

            // Reset the drag icon to be safe.
            desktop95Desktop.data( 'drag-icon-original', null );

            data['incoming'].trigger( 'icon-drag', data );
            data['target'].trigger( 'icon-drop', data );
            data['source'].trigger( 'icon-drag', data );

            data['source'].trigger( 'desktop-populate' );
            data['target'].trigger( 'desktop-populate' );

            e.stopPropagation();
        }
    } );

    // Only allow text selects in text elements.
    this.on( 'selectstart', function( e ) {
        if( 
            !$(e.target).hasClass( 'input-rtf' ) &&
            !$(e.target).hasClass( 'input-text' ) &&
            !$(e.target).hasClass( 'input-textarea' )
        ) {
            return false;
        }
    } );

    for( var datum in settings.data ) {
        this.data( datum, settings.data[datum] );
    }

    // No point in calling this before implementation hooks.
    //this.trigger( 'desktop-populate' );

    return this;
} };

}( jQuery ) );
