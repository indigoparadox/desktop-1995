
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
            menuClose( settings.menuContainer, null );
            return; // Stop after closing.
        }

        // Build and show the menu.
        var menu = [
            {'text': 'Programs', 'callback': function( m ) {

            }},
            {'text': 'Documents', 'callback': function( m ) {
                
            }},
            {'text': 'Settings', 'callback': function( m ) {
                
            }},
            {'text': 'Find', 'callback': function( m ) {
                
            }},
            {'text': 'Help', 'callback': function( m ) {
                
            }},
            {'text': 'Run...', 'callback': function( m ) {
                
            }},
            {'divider': true },
            {'text': 'Shut Down...', 'callback': function( m ) {
                
            }}
        ];

        menuClose( settings.menuContainer, null );
        var menu = menuPopup( settings.menuContainer, menu,
            $('.button-start').offset().left,
            $('.button-start').offset().top, false, $('.button-start') );
        menu.addClass( 'logo-menu' );

        var stripe = '<div class="logo-stripe-wrapper"><div class="logo-stripe">' +
            settings.caption + '</div></div>';
        menu.append( stripe );

        menu.css( 'top', ($('.button-start').offset().top - menu.height() - 5).toString() + 'px' );

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
        minuteString = "0" + minuteString.toString();
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
