
(function( $ ) {
$.fn.explorer95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Explorer',
    'id': null,
    'x': 10,
    'y': 10,
    'w': 320,
    'h': 260,
    'callback': null,
    'cbData': null
}, options );

switch( action.toLowerCase() ) {

case 'open':

    settings.menu = {
        'type': menu95Type.MENUBAR,
        'items': [
            {'caption': 'File',
            'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'Close', 'callback': function( m ) {
                    winHandle.window95( 'close' );
                }}
        ]}
    ]};
    settings.show = false;
    settings.resizable = true;
    settings.icon = 'folder';

    var winHandle = $('#desktop').window95( 'open', settings );

    winHandle.addClass( 'window-folder' );

    winHandle.control95( 'statusbar' );

    var container = $('<div class="window-folder-container container"></div>');
    winHandle.find( '.window-form' ).append( container );

    // Mousedown/Mousemove are handled by desktop events.

    container.mouseup( function( e ) {
        $(e.target).desktop95( 'completerect' );
    } );

    container.mouseleave( function( e ) {
        $(e.target).desktop95( 'completerect' );
    } );

    container.on( 'selectstart', function( e ) {
        return false;
    } );

    var trayObjects = $('<div class="tray tray-objects"></div>');
    winHandle.children( '.statusbar' ).append( trayObjects );

    var trayBytes = $('<div class="tray tray-bytes"></div>');
    winHandle.children( '.statusbar' ).append( trayBytes );

    winHandle.addClass( 'window-scroll-contents' );

    console.assert( 1 == winHandle.length );
    console.assert( winHandle.hasClass( 'window-hidden' ) );

    winHandle.removeClass( 'window-hidden' );

    console.assert( 1 == winHandle.length );

    return winHandle;
}; }; }( jQuery ) );
