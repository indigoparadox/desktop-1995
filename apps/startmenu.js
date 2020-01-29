
(function( $ ) {

$.fn.startmenu95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Windows 95',
    'menuContainer': '#desktop'
}, options );
    
switch( action.toLowerCase() ) {

case 'start-clock':
    return this.each( function() {
        if( 0 < $(this).children( '.systray-clock' ).length ) {
            return;
        }
        $(this).append( '<span class="systray-clock"></span>' );
        $(this).children( '.systray-clock' ).startmenu95( 'update-clock' );
        setInterval( function() { 
            $(this).children( 'systray-clock' ).startmenu95( 'update-clock' );
        }, 1000 );
    } );

case 'update-clock':
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

case 'show-menu':
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
    break;

case 'open':
    var taskbar = $('<div id="taskbar" class="taskbar"><div id="tasks" class="tasks"></div></div>');
    $('body').append( taskbar );

    var startButton = $('<button class="button-start"><span class="icon-start"></span>Start</button>');
    taskbar.prepend( startButton );
    startButton.on( 'click', function( e ) {
        startButton.startmenu95( 'show-menu' );
    } );

    var notificationArea = $('<div class="tray notification-area"></div>');
    taskbar.append( notificationArea );

    $(notificationArea).startmenu95( 'start-clock' );

    return null;
}; };

$.fn.systray95 = function( action, options ) {
switch( action.toLowerCase() ) {


}; };
}( jQuery ) );
