
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

var settings = $.extend( {
    'id': null,
    'x': 10,
    'y': 10,
    'region': {'start': {'x': 0, 'y': 0}, 'end': {'x': 0, 'y': 0}},
    'callback': null,
    'context': null,
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

    /* Setup action handlers. */
    /* iconWrapper.mousedown( function() {
        $(this).desktop95( 'select' );
    } );
    iconWrapper.on( 'dblclick', function() {
        settings.callback( settings.cbData )
    } );

    iconWrapper.mousemove( function( e ) {
        $(e.target).parents( '.container' ).desktop95( 'moverect', { 'x': e.pageX, 'y': e.pageY } );
    } );

    iconWrapper.children( '.desktop-icon-img' ).on( 'dragenter', function( e, ui ) {
        console.log( $(e.target) );
    } ); */

    if( null == settings.context ) {
        settings.context = {
            'items': [
                {'caption': 'Properties', 'callback': function( m, d ) {
                    iconWrapper.trigger( 'properties' );
                }}
            ]
        };
    }

    if( !('cbData' in settings.context) ) {
        settings.context.cbData = iconWrapper;
    }

    imgTag.menu95( 'context', {
        'menu': settings.context,
        'context': _htmlStrToClass( settings.target )} );

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

    var containerElement = this;
    if( 0 < $(this).parents( '.container' ).length ) {
        desktop95Desktop = $(this.parents( '.container' ).last() );
    } else {
        desktop95Desktop = this;
        this.addClass( 'desktop' );
    }

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

            /* if( null == desktop95Desktop.data( 'drag-icon-original' ) ) {
                return;
            } */

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

    var desktopMenu = {
        'items': [
            {'caption': 'Arrange Icons', 'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'By Name', 'callback': function( m ) {
                    containerElement.trigger( 'arrange-icons', [{'criteria': 'name'}] );
                }},
                {'caption': 'By Type', 'callback': function( m ) {
                    containerElement.trigger( 'arrange-icons', [{'criteria': 'type'}] );
                }},
                {'caption': 'By Size', 'callback': function( m ) {
                    containerElement.trigger( 'arrange-icons', [{'criteria': 'size'}] );
                }},
                {'caption': 'By Date', 'callback': function( m ) {
                    containerElement.trigger( 'arrange-icons', [{'criteria': 'date'}] );
                }},
                {'type': menu95Type.DIVIDER},
                {'caption': 'Auto Arrange', 'callback': function( m ) {
                    containerElement.trigger( 'arrange-icons', [{'criteria': 'auto'}] );
                }}
            ]},
            {'caption': 'Line up Icons', 'callback': function( m ) {
                containerElement.trigger( 'line-up-icons' );
            }},
            {'type': menu95Type.DIVIDER},
            {'caption': 'Paste', 'callback': function( m ) {
                containerElement.trigger( 'paste', [{'reference': 'shortcut'}] );
            }},
            {'caption': 'Paste Shortcut', 'callback': function( m ) {
                containerElement.trigger( 'paste', [{'reference': 'shortcut'}] );
            }},
            {'type': menu95Type.DIVIDER},
            {'caption': 'New', 'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'Folder', 'icon': 'folder', 'callback': function( m ) {
                    containerElement.trigger( 'new-folder' );
                }}
            ]},
            {'type': menu95Type.DIVIDER},
            {'caption': 'Properties', 'callback': function( m ) {
                if( this == desktopElement ) {
                    containerElement.properties95( props95Panel.DISPLAY );
                }
            }}
        ]
    };
    
    this.menu95( 'context', {'menu': desktopMenu, 'context': 'desktop'} );

    for( var datum in settings.data ) {
        this.data( datum, settings.data[datum] );
    }

    // No point in calling this before implementation hooks.
    //this.trigger( 'desktop-populate' );

    return this;
} };

$.fn.startmenu95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Windows 95',
    'menuContainer': '#desktop'
}, options );
    
switch( action.toLowerCase() ) {

case 'enable':
    return this.click( function( e ) { 

        e.preventDefault();

        // Close the menu if it's presently open.
        if( $(this).hasClass( 'menu-caller-active' ) ) {
            $('.logo-menu').menu95( 'close' );
            return; // Stop after closing.
        }

        // Build and show the menu.
        var menu = {
            'location': menu95Location.TOP,
            'container': '#desktop',
            'caller': '.button-start',
            'classes': ['logo-menu'],
            'items': [
                {'caption': 'Programs', 'type': menu95Type.EVENTMENU, 'icon': 'programs', 'large': true,
                    'trigger': 'programs'},
                {'caption': 'Documents', 'type': menu95Type.SUBMENU, 'icon': 'documents', 'large': true,
                    'items': documentsMenu95},
                {'caption': 'Settings', 'type': menu95Type.EVENTMENU, 'icon': 'settings', 'large': true,
                    'trigger': 'settings'},
                {'caption': 'Find', 'icon': 'find', 'large': true, 'callback': function( m ) {
                    
                }},
                {'caption': 'Help', 'icon': 'help', 'large': true, 'callback': function( m ) {
                    
                }},
                {'caption': 'Run...', 'icon': 'run', 'large': true, 'callback': function( m ) {
                    
                }},
                {'type': menu95Type.DIVIDER},
                {'caption': 'Shut Down...', 'icon': 'shutdown', 'large': true, 'callback': function( m ) {
                    
                }}
            ]
        };

        $(settings.menuContainer).menu95( 'close' );
        var menu = $(settings.menuContainer).menu95( 'open', menu );

        var stripe = '<div class="logo-stripe-wrapper"><div class="logo-stripe">' +
            settings.caption + '</div></div>';
        menu.append( stripe );

        menu.show();
    } );
}; };

$.fn.systray95 = function( action, options ) {
switch( action.toLowerCase() ) {

case 'enable':
    return this.each( function() {
        if( 0 < $(this).children( '.systray-clock' ).length ) {
            return;
        }
        $(this).append( '<span class="systray-clock"></span>' );
        $(this).children( '.systray-clock' ).systray95( 'updateClock' );
        setInterval( function() { 
            $(this).children( 'systray-clock' ).systray95( 'updateClock' );
        }, 1000 );
    } );

case 'updateclock':
    var now = new Date();
    
    var minuteString = now.getMinutes();
    if( 9 >= minuteString ) {
        minuteString = '0' + minuteString.toString();
    } else {
        minuteString = minuteString.toString();
    }
    
    var amPm = 'AM';
    var hourString = now.getHours();
    if( 12 < hourString ) {
        hourString -= 12;
        amPm = 'PM';
    }
    hourString = hourString.toString();
    
    this.text( hourString + ':' + minuteString + ' ' + amPm );
    return this;

}; };
}( jQuery ) );
