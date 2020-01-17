
var documentsMenu95 = [];

(function( $ ) {

$.fn.desktop95 = function( action ) {
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

case 'enable':

    var desktopElement = this;

    this.mousedown( function( e ) {
        if( $(e.target).hasClass( 'container' ) ) {
            $(e.target).explorer95( 'select' );
        }
        $(e.target).menu95( 'close' );
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
                {'caption': 'Folder', 'callback': function( m ) {
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
                {'caption': 'Programs', 'type': menu95Type.EVENTMENU, 'forceIcon': true,
                    'trigger': 'programs'},
                {'caption': 'Documents', 'type': menu95Type.SUBMENU, 'forceIcon': true,
                    'items': documentsMenu95},
                {'caption': 'Settings', 'type': menu95Type.EVENTMENU, 'forceIcon': true,
                    'trigger': 'settings'},
                {'caption': 'Find', 'forceIcon': true, 'callback': function( m ) {
                    
                }},
                {'caption': 'Help', 'forceIcon': true, 'callback': function( m ) {
                    
                }},
                {'caption': 'Run...', 'forceIcon': true, 'callback': function( m ) {
                    
                }},
                {'type': menu95Type.DIVIDER},
                {'caption': 'Shut Down...', 'forceIcon': true, 'callback': function( m ) {
                    
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
