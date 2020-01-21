
(function( $ ) {
$.fn.explorer95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Explorer',
    'target': null,
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

    /*
    // Mousedown/Mousemove are handled by desktop events.

    container.mouseup( function( e ) {
        $(e.target).desktop95( 'completerect' );
    } );

    container.mouseleave( function( e ) {
        $(e.target).desktop95( 'completerect' );
    } );

    container.on( 'selectstart', function( e ) {
        return false;
    } ); */

    container.desktop95( 'enable' );

    var trayObjects = $('<div class="tray tray-objects"></div>');
    winHandle.children( '.statusbar' ).append( trayObjects );

    var trayBytes = $('<div class="tray tray-bytes"></div>');
    winHandle.children( '.statusbar' ).append( trayBytes );

    winHandle.addClass( 'window-scroll-contents' );

    console.assert( 1 == winHandle.length );
    console.assert( winHandle.hasClass( 'window-hidden' ) );

    if( null != settings.target ) {
        winHandle.addClass( 'explore-' + _htmlStrToClass( settings.target ) );
    }

    var folderMenu = {
        'items': [
            {'caption': 'Arrange Icons', 'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'By Name', 'callback': function( m ) {
                    container.trigger( 'arrange-icons', [{'criteria': 'name'}] );
                }},
                {'caption': 'By Type', 'callback': function( m ) {
                    container.trigger( 'arrange-icons', [{'criteria': 'type'}] );
                }},
                {'caption': 'By Size', 'callback': function( m ) {
                    container.trigger( 'arrange-icons', [{'criteria': 'size'}] );
                }},
                {'caption': 'By Date', 'callback': function( m ) {
                    container.trigger( 'arrange-icons', [{'criteria': 'date'}] );
                }},
                {'type': menu95Type.DIVIDER},
                {'caption': 'Auto Arrange', 'callback': function( m ) {
                    container.trigger( 'arrange-icons', [{'criteria': 'auto'}] );
                }}
            ]},
            {'caption': 'Line up Icons', 'callback': function( m ) {
                container.trigger( 'line-up-icons' );
            }},
            {'type': menu95Type.DIVIDER},
            {'caption': 'Paste', 'callback': function( m ) {
                container.trigger( 'paste', [{'reference': 'shortcut'}] );
            }},
            {'caption': 'Paste Shortcut', 'callback': function( m ) {
                container.trigger( 'paste', [{'reference': 'shortcut'}] );
            }},
            {'type': menu95Type.DIVIDER},
            {'caption': 'New', 'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'Folder', 'icon': 'folder', 'callback': function( m ) {
                    container.trigger( 'new-folder' );
                }}
            ]},
            {'type': menu95Type.DIVIDER},
            {'caption': 'Properties', 'callback': function( m ) {
                container.props95( props95Panel.DISPLAY );
            }}
        ]
    };

    container.menu95( 'context', {'menu': folderMenu, 'context': _htmlStrToClass( settings.target )} );

    winHandle.removeClass( 'window-hidden' );

    console.assert( 1 == winHandle.length );

    return winHandle;
}; }; }( jQuery ) );
