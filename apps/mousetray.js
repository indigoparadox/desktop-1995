
(function( $ ) {
$.fn.mousetray95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Explorer',
    'target': null,
    'id': null,
    'callback': null,
    'cbData': null
}, options );

switch( action.toLowerCase() ) {

case 'open':
    
    var mouseIcon = $('<div class="tray-icon icon-mouse-16"></div>')
    
    $('.notification-area').prepend( mouseIcon );

    var _mouseTest = function() {
        if( desktopMouseDown95 && !mouseIcon.hasClass( 'icon-mouse-right-16' ) ) {
            mouseIcon.removeClass( 'icon-mouse-16');
            mouseIcon.addClass( 'icon-mouse-right-16' );
        } else if( !desktopMouseDown95 && mouseIcon.hasClass( 'icon-mouse-right-16' ) ) {
            mouseIcon.removeClass( 'icon-mouse-right-16' );
            mouseIcon.addClass( 'icon-mouse-16');
        }
    };

    $('#desktop').mousemove( function() { _mouseTest(); } );
    $('#desktop').mousedown( function() { _mouseTest(); } );
    $('#desktop').mouseup( function() { _mouseTest(); } );

    return null;
}; }; }( jQuery ) );
    