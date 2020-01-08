
(function( $ ) {
$.fn.browser95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Browser 95',
    'id': null,
    'resizable': true,
    'icoImg': null,
    'icoX': 0,
    'icoY': 0,
    'url': null,
    'favorites': null,
    'x': 10,
    'y': 10,
    'w': 640,
    'h': 480,
    'waybackDate': '19981202230410'
}, options );

switch( action.toLowerCase() ) {

case 'go':
    return this.each( function( idx, winHandle ) {
        var newLoc = 'http://web.archive.org/web/' + settings.waybackDate + '/' + settings.url;
        $(winHandle).find( '.input-url' ).val( settings.url );
        $(winHandle).find( '.tray-status-text' ).text( 'Opening ' + settings.url + '...' );
        $(winHandle).find( '.browser-pane' ).attr( 'src', newLoc );
    } );

case 'open':
    if( 0 < $('#' + settings.id).length ) {
        /* The requested window is already open. */
        $('#' + settings.id).window95( 'activate' );
        return $('#' + settings.id);
    }

    settings.menu = null;
    settings.show = false;

    var winHandle = this.window95( 'open', settings );
    
    menu = [
        {'text': 'File', 'children': [
            {'text': 'New Window', 'callback': function( m ) {
                settings.id = settings.id + 'n';
                this.browser95( 'open', settings );
            }},
            {'divider': true},
            {'group': true, 'id': 'browser-recent'},
            {'text': 'Exit', 'callback': function( m ) {
                windowClose( winHandle );
            }}
        ]},
        {'text': 'Edit', 'children': [
            {'text': 'Cut', 'callback': function( m ) {
            }},
            {'text': 'Copy', 'callback': function( m ) {
            }},
            {'text': 'Paste', 'callback': function( m ) {
            }},
            {'divider': true},
            {'text': 'Select All', 'callback': function( m ) {
            }},
            {'divider': true},
            {'text': 'Find...', 'callback': function( m ) {
            }}
        ]},
        {'text': 'View', 'children': [
        ]},
        {'text': 'Go', 'children': [
        ]},
        {'text': 'Favorites', 'children': [
        ]},
        {'text': 'Help', 'children': [
        ]}
    ];

    if( null == settings.favorites ) {
        settings.favorites = [
            {'name': 'Altavista', 'url': 'http://altavista.com'},
            {'name': 'BBSpot', 'url': 'http://bbspot.com'},
            {'name': 'Microsoft', 'url': 'http://microsoft.com'},
            {'name': 'Slashdot', 'url': 'http://slashdot.org'},
            {'name': 'Yahoo', 'url': 'http://yahoo.com'},
        ];
    }
    
    // Roll the favorites into the favorites menu.
    for( var i = 0 ; settings.favorites.length > i ; i++ ) {
        _browserFavoritesMenuAdd( winHandle, menu[4].children, settings.favorites[i] );
    }

    // Add the menu now, once winHande is defined, so callbacks above have it
    // in scope.
    windowAddMenuBar( winHandle, menu );

    winHandle.addClass( 'window-browser' );

    // This window type still uses wrappers because the pseudo-elements are 
    // rather prone to yet-unexplainable misbehaviors.
    var browser = $('<div class="pane-wrapper"><iframe class="browser-pane" sandbox="allow-same-origin allow-forms"></iframe></div>');
    winHandle.children( '.window-form' ).append( browser );

    // Setup the browser toolbar.

    var browserToolbar = $('<div class="browser-toolbar"></div>');
    var browserToolbarLeft = $('<div class="browser-toolbar-left"></div>');
    browserToolbar.append( browserToolbarLeft );

    var urlBox = $('<div class="url-bar"><span class="label">Address:</span> <span class="input-url-wrapper"><input type="text" class="input-url" /></span></div>');
    browserToolbarLeft.prepend( urlBox );
    browserToolbarLeft.prepend( '<hr />' );

    var buttons = $('<div class="browser-buttons"><button /></div>')
    browserToolbarLeft.prepend( buttons );
    browserToolbarLeft.prepend( '<hr />' );

    winHandle.children( '.window-form' ).prepend( browserToolbar );

    winHandle.control95( 'statusbar' );

    // Setup the status bar.
    var trayStatusText = $('<div class="tray tray-status-text"></div>');
    winHandle.children( '.statusbar' ).append( trayStatusText );

    var trayMisc = $('<div class="tray tray-misc"></div>');
    winHandle.children( '.statusbar' ).append( trayMisc );

    var trayStatusIcon = $('<div class="tray tray-status-icon"></div>');
    winHandle.children( '.statusbar' ).append( trayStatusIcon );

    winHandle.find( '.browser-pane' ).on( 'load', function( e ) {
        winHandle.find( '.tray-status-text' ).text( '' );
    } );

    // Associate the event handlers and load start page.
    winHandle.find( '.input-url' ).keypress( function( e ) {
        if( 13 == e.keyCode ) {
            // Enter was pressed.
            e.preventDefault();
            winHandle.browser95( 'go', winHandle.find( '.input-url' ).val() );
        }
    } );
    winHandle.browser95( 'go', settings );

    winHandle.removeClass( 'window-hidden' );

    return winHandle;

}; }; }( jQuery ) );
