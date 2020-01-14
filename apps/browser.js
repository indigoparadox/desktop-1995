
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
    'w': 600,
    'h': 400,
    'waybackDate': '19981202230410',
    'history': true,
    'home': 'http://google.com'
}, options );

var newBrowserWindow = function( container, browserSettings ) {
    browserSettings.id = browserSettings.id + '-n';
    $(container).browser95( 'open', browserSettings );
};

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

    // Need this for the new window closure.
    var container = this;

    var winHandle = this.window95( 'open', settings );
    
    menu = {
        'type': menu95Type.MENUBAR,
        'caller': winHandle,
        'container': winHandle,
        'items': [
            {'caption': 'File', 'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'New Window', 'callback': function( m ) {
                    newBrowserWindow( container, settings );
                }},
                {'type': menu95Type.DIVIDER},
                {'group': true, 'id': 'browser-recent'},
                {'caption': 'Exit', 'callback': function( m ) {
                    winHandle.window95( 'close' );
                }}
            ]},
            {'caption': 'Edit', 'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'Cut', 'callback': function( m ) {
                }},
                {'caption': 'Copy', 'callback': function( m ) {
                }},
                {'caption': 'Paste', 'callback': function( m ) {
                }},
                {'type': menu95Type.DIVIDER},
                {'caption': 'Select All', 'callback': function( m ) {
                }},
                {'type': menu95Type.DIVIDER},
                {'caption': 'Find...', 'callback': function( m ) {
                }}
            ]},
            {'caption': 'View', 'items': [
            ]},
            {'caption': 'Go', 'items': [
            ]},
            {'caption': 'Favorites', 'items': [
            ]},
            {'caption': 'Help', 'items': [
            ]}
    ]};

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
        //_browserFavoritesMenuAdd( winHandle, menu[4].children, settings.favorites[i] );
    }

    // Add the menu now, once winHande is defined, so callbacks above have it
    // in scope.
    winHandle.menu95( 'open', menu );

    winHandle.addClass( 'window-browser' );

    // This window type still uses wrappers because the pseudo-elements are 
    // rather prone to yet-unexplainable misbehaviors.
    var browserWrapper = $('<div class="pane-wrapper"></div>');
    var browser = $('<iframe class="browser-pane inset-iframe" sandbox="allow-same-origin allow-forms"></iframe>');
    browserWrapper.append( browser );
    winHandle.children( '.window-form' ).append( browserWrapper );

    browser.data( 'home', settings.home );

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
    
    var btnOpen = winHandle.control95( 'toolbarButton', 'create', {
        'icon': settings.buttonImgs.open,
        'classes': ['button-browser-open'],
        'callback': function( e ) {
            
        }
    } );
    
    var btnHome = winHandle.control95( 'toolbarButton', 'create', {
        'icon': settings.buttonImgs.home,
        'classes': ['button-browser-home'],
        'callback': function( e ) {
            winHandle.browser95( 'go', {
                'url': browser.data( 'home' ),
                'useWaybackPrefix': false,
                'history': false } );
        }
    } );
    btnOpen.attr( 'disabled', true );

    winHandle.control95( 'toolbarDivider', 'create' );

    var btnBack = winHandle.control95( 'toolbarButton', 'create', {
        'caption': '&#x2BC7;',
        'classes': ['button-browser-back'],
        'callback': function( e ) {
            browser.data( 'history' ).pop(); // Pop off current URL.
            console.log( browser.data( 'history' ) );
            if( 1 >= browser.data( 'history' ).length ) {
                btnBack.attr( 'disabled', true );
            }
            var history = browser.data( 'history' );
            backURL = history[history.length - 1];
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

    winHandle.control95( 'toolbarDivider', 'create' );

    var btnStop = winHandle.control95( 'toolbarButton', 'create', {
        'icon': settings.buttonImgs.stop,
        'classes': ['button-browser-stop'],
        'callback': function( e ) {
            
        }
    } );
    btnStop.attr( 'disabled', true );

    var btnRefresh = winHandle.control95( 'toolbarButton', 'create', {
        'icon': settings.buttonImgs.refresh,
        'classes': ['button-browser-refresh'],
        'callback': function( e ) {
            var history = browser.data( 'history' );
            var lastURL = history[history.length - 1];
            winHandle.browser95( 'go', {
                'url': lastURL,
                'useWaybackPrefix': false,
                'history': false } );
        }
    } );

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
