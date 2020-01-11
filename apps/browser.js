
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
    'waybackDate': '19981202230410',
    'history': true
}, options );

switch( action.toLowerCase() ) {

case 'go':
    return this.each( function( idx, winHandle ) {
        var newLoc = 'http://web.archive.org/web/' + settings.waybackDate + '/' + settings.url;
        $(winHandle).find( '.input-url' ).val( settings.url );
        $(winHandle).find( '.tray-status-text' ).text( 'Opening ' + settings.url + '...' );
        
        if( settings.history ) {
            if( null == $(winHandle).find( '.browser-pane' ).data( 'history' ) ) {
                $(winHandle).find( '.browser-pane' ).data( 'history', [] );
            }
            var history = $(winHandle).find( '.browser-pane' ).data( 'history' );
            history.push( settings.url );
            if( 1 < history.length ) {
                $(winHandle).find( '.button-browser-back' ).attr( 'disabled', false );
            }
        }
            
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
    ]

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
    var browserWrapper = $('<div class="pane-wrapper"></div>');
    var browser = $('<iframe class="browser-pane inset-iframe" sandbox="allow-same-origin allow-forms"></iframe>');
    browserWrapper.append( browser );
    winHandle.children( '.window-form' ).append( browserWrapper );

    // Setup the browser toolbar.

    var browserToolbar = $('<div class="browser-toolbar"></div>');
    var browserToolbarLeft = $('<div class="browser-toolbar-left"></div>');
    browserToolbar.append( browserToolbarLeft );

    var urlBox = $('<div class="url-bar"><span class="label">Address:</span> <span class="input-url-wrapper"><input type="text" class="input-url" /></span></div>');
    browserToolbarLeft.prepend( urlBox );
    //browserToolbarLeft.prepend( '<hr />' );

    /*
    var buttons = $('<div class="browser-buttons"><button /></div>')
    browserToolbarLeft.prepend( buttons );
    browserToolbarLeft.prepend( '<hr />' );
    */
    winHandle.control95( 'toolbar', 'create' );
    var btnBack = winHandle.control95( 'toolbarButton', 'create', {
        'caption': '&#x2BC7;',
        'classes': ['button-browser-back'],
        'callback': function( e ) {
            browser.data( 'history' ).pop(); // Pop off current URL.
            var backURL = browser.data( 'history' ).pop();
            if( 0 >= browser.data( 'history' ).length ) {
                btnBack.attr( 'disabled', true );
            }
            winHandle.browser95( 'go', {
                'url': backURL,
                'useWaybackPrefix': false,
                'history': false } );
        }
    } );
    btnBack.attr( 'disabled', true );
    
    var btnFwd = winHandle.control95( 'toolbarButton', 'create', {
        'caption': '&#x2BC8;',
        'classes': ['button-browser-forward'],
        'callback': function( e ) {

        }
    } );
    btnFwd.attr( 'disabled', true );

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
            winHandle.browser95( 'go', { 'url': winHandle.find( '.input-url' ).val() } );
        }
    } );
    winHandle.browser95( 'go', settings );

    winHandle.removeClass( 'window-hidden' );

    return winHandle;

}; }; }( jQuery ) );
