
var documentsMenu95 = [];
var desktopMouseDown95 = false;

(function( $ ) {

$.fn.desktop95 = function( action, options ) {

var settings = $.extend( {
    'id': null,
    'x': 10,
    'y': 10,
    'region': {'start': {'x': 0, 'y': 0}, 'end': {'x': 0, 'y': 0}},
    'callback': null,
    'cbData': null,
    'deselect': true, // Deselect items not being selected.
}, options );

switch( action.toLowerCase() ) {
case 'propsmonitor':
    var monitor = $('<div class="props-monitor-wrapper"></div>');
    var monitorOuter = $('<div class="props-monitor props-monitor-outer"></div>');
    monitor.append( monitorOuter );
    var monitorInner = $('<div class="props-monitor props-monitor-inner"></div>');
    monitorOuter.append( monitorInner );

    monitor.append( '<div class="props-monitor props-monitor-stand-upper"></div>' );
    monitor.append( '<div class="props-monitor props-monitor-stand-mid"></div>' );
    monitor.append( '<div class="props-monitor props-monitor-stand-lower"></div>' );
    return monitor;

case 'icon':

    var imgTag = $('<div class="desktop-icon-img icon-' + settings.icon + '-32"></div>');
    var iconWrapper = $('<div class="desktop-icon"></div>');
    iconWrapper.append( imgTag );
    
    var iconText = $('<div class="desktop-icon-text-center"><div class="desktop-icon-text">' + settings.caption + '</div></div>');
    iconWrapper.append( iconText );

    this.append( iconWrapper );
    iconWrapper.draggable( {'handle': '.desktop-icon-img', 'containment': this } );

    iconWrapper.css( 'left', settings.x.toString() + 'px' );
    iconWrapper.css( 'top', settings.y.toString() + 'px' );

    /* Setup action handlers. */
    iconWrapper.mousedown( function() {
        $(this).desktop95( 'select' );
    } );
    iconWrapper.on( 'dblclick', function() {
        settings.callback( settings.cbData )
    } );

    iconWrapper.mousemove( function( e ) {
        $(e.target).parents( '.container' ).desktop95( 'moverect', { 'x': e.pageX, 'y': e.pageY } );
    } );

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

    var desktopElement = this;

    this.mousedown( function( e ) {
        desktopMouseDown95 = true;
        if( $(e.target).hasClass( 'container' ) ) {
            $(e.target).closest( '.container' ).desktop95( 'select' );
        }
        $(e.target).menu95( 'close' );
        setTimeout( function() {
            if( desktopMouseDown95 ) {
                $(e.target).desktop95( 'selectrect', { 'x': e.pageX, 'y': e.pageY } );
            }
        }, 250 );
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
                {'caption': 'By name', 'callback': function( m ) {
                }}
            ]},
            {'type': menu95Type.DIVIDER},
            {'caption': 'Paste', 'callback': function( m ) {
            }},
            {'type': menu95Type.DIVIDER},
            {'caption': 'New', 'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'Folder', 'icon': 'folder', 'callback': function( m ) {
                }}
            ]},
            {'type': menu95Type.DIVIDER},
            {'caption': 'Properties', 'callback': function( m ) {
                desktopElement.props95( props95Panel.DISPLAY );
            }}
        ]
    };

    this.contextmenu( function( e ) {
        e.preventDefault();

        if( 
            $(e.target).parents().hasClass( 'menu' ) ||
            $(e.target).parents().hasClass( 'window' )
        ) {
            // Don't call menus on menus.
            return;
        }

        desktopMenu.location = {'x': e.pageX, 'y': e.pageY};
        $(this).menu95( 'open', desktopMenu );
    } );

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
        $(this).systray95( 'update' );
        setInterval( function() { 
            $(this).systray95( 'update' );
        }, 1000 );
    } );

case 'update':
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
