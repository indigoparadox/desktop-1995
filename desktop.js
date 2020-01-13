
(function( $ ) {
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
            'caller': '.button-start',
            'classes': ['logo-menu'],
            'items': [
                {'caption': 'Programs', 'callback': function( m ) {

                }},
                {'caption': 'Documents', 'callback': function( m ) {
                    
                }},
                {'caption': 'Settings', 'callback': function( m ) {
                    
                }},
                {'caption': 'Find', 'callback': function( m ) {
                    
                }},
                {'caption': 'Help', 'callback': function( m ) {
                    
                }},
                {'caption': 'Run...', 'callback': function( m ) {
                    
                }},
                {'type': menu95Type.DIVIDER},
                {'caption': 'Shut Down...', 'callback': function( m ) {
                    
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
