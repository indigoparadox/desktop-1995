
(function( $ ) {
$.fn.explorer95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Explorer',
    'id': null,
    'icoImg': null,
    'icoX': 0,
    'icoY': 0,
    'icoW': 32,
    'icoH': 32,
    'menu': null,
    'x': 10,
    'y': 10,
    'w': 320,
    'h': 260,
    'callback': null,
    'cbData': null
}, options );

switch( action.toLowerCase() ) {
case 'icon':

    var imgTag = $('<div class="desktop-icon-img icon-' + settings.icon + '-32"></div>');
    var iconWrapper = $('<div class="desktop-icon"><div class="desktop-icon-overlay"></div>');
    iconWrapper.append( imgTag );
    
    var iconText = $('<div class="desktop-icon-text-center"><div class="desktop-icon-text">' + settings.caption + '</div></div>');
    iconWrapper.append( iconText );

    this.append( iconWrapper );
    iconWrapper.draggable( {'handle': '.desktop-icon-overlay', 'containment': this } );

    iconWrapper.css( 'left', settings.x.toString() + 'px' );
    iconWrapper.css( 'top', settings.y.toString() + 'px' );

    /* Setup action handlers. */
    iconWrapper.mousedown( function() {
        $(this).explorer95( 'select' );
    } );
    iconWrapper.on( 'dblclick', settings.cbData, settings.callback );

    return iconWrapper;

case 'select':

    return this.each( function( idx, element ) {
        if( $(element).hasClass( 'desktop-icon' ) ) {
            // A specific icon was provided. Deselect all peer icons.
            $(element).parent().children('.desktop-icon').removeClass( 'desktop-icon-selected' );

            // Select this icon.
            $(element).addClass( 'desktop-icon-selected' );
        } else {
            // A container was provided. Deselect all icons inside.
            $(element).children('.desktop-icon').removeClass( 'desktop-icon-selected' );
        }    
    } );


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
