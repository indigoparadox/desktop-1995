
/* Internal Utility Functions */

/* This wrapper function limits the scope of the onClick handler closure, so
 * that the callback set for the last assigned menu item in a loop isn't
 * also inadvertantly assigned to all previous menu items handled in that loop
 * due to the changing value of i in the loop control.
 */
function _menuAssignItemCallback( container, item, callback ) {
    item.click( function( e ) {
        callback( item );
        menuClose( container );
        e.preventDefault();
    } );
}

function _menuAssignItemChildren( container, item, children, followMouse, closeOtherMenus=false ) {
    item.click( function( e ) {
        var x = item.offset().left - $(container).offset().left;
        var y = item.offset().top - $(container).offset().top + item.height();

        // Close all sibling menus.
        /* $(item).siblings( '.menu' ).each( function( idx, menuIter ) {
            menuClose( container, menuIter );
        } ); */
        if( closeOtherMenus ) {
            menuClose( container );
        }

        if( followMouse ) {
            // Context menus follow mouse, not element.
            x = e.pageX;
            y = e.pageY;
        }

        menuPopup( container, children, x, y );
        e.preventDefault();
    } );
}

function _menuPopulate( container, menu, items, followMouse=true ) {
    /* Iterate the list of menu items and append them to the provided menu. */
    for( var i = 0 ; items.length > i ; i++ ) {
        var menuItem = null;

        // Close other menus at the root level before opening this one.
        var menubarRoot = false;
        if( $(menu).hasClass( 'menubar') ) {
            menubarRoot = true;
        }

        if( 'divider' in items[i] && items[i].divider ) {
            menuItem = $('<hr />');
        } else if( 'group' in items[i] && items[i].group ) {
            menuItem = $('<div class="menu-group" id="' + items[i].group.id + '"></div>');
        } else {
            menuItem = $('<a href="#" class="menu-item"><span class="menu-icon"></span>' + items[i].text + '</a>');
            menuItem.addClass( 'menu-item-' + _htmlStrToClass( items[i].text ) );
            if( 'callback' in items[i] ) {
                _menuAssignItemCallback( container, menuItem, items[i].callback );
            } else if( 'children' in items[i] ) {
                _menuAssignItemChildren( 
                    container, menuItem, items[i].children, followMouse, menubarRoot );
            }
        }
        menu.append( menuItem );
    }
}

function _menuAddWindowMenu( winHandle, element, leftClick=false ) {
    var popupHandler = function( e ) {
        var menu = [
            {'text': 'Restore', 'callback': function( m ) {

            }},
            {'text': 'Move', 'callback': function( m ) {
                
            }},
            {'text': 'Size', 'callback': function( m ) {
                
            }},
            {'text': 'Minimize', 'callback': function( m ) {
                
            }},
            {'text': 'Maximize', 'callback': function( m ) {
                
            }},
            {'text': 'Close', 'callback': function( m ) {
                winHandle.remove();
            }}
        ];

        menuClose( winHandle, null );
        menuPopup( winHandle, menu,
            e.pageX - winHandle.offset().left,
            e.pageY - winHandle.offset().top );
    };

    if( leftClick ) {
        $(element).click( popupHandler );
    } else {
        $(element).contextmenu( popupHandler );
    }
}

// Again, a named function to isolate the closure scope, designed to be called
// from a loop below.
function _browserFavoritesMenuAdd( winHandle, menu, favorite ) {
    menu.push( {
        'text': favorite.name,
        'callback': function( m ) {
            browserOpenURL( winHandle, favorite.url );
        }
    } );
}

function _htmlStrToClass( input ) {
    return input.replace( /[ "\'!@#$%\^&\*\(\)\.,]/g, '' ).replace( / /g, '-' ).toLowerCase();
}

function _htmlEncode( input ) {
    return input.replace( /[\u00A0-\u9999<>\&]/gim, function( c ) {
        return '&#' + c.charCodeAt( 0 ) + ';';
    } );
}

function _htmlCharSVG( u ) {
    var svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="header" viewBox="0 0 20 30">
<defs></defs><g id="0" visibility="visible">
<text id="gText_11081308229940" name="-1" x="0" y="12"  
    font="Arial"  rotate="0" horizAnchor="middle" vertAnchor="middle" 
    scale="4,4" width="1" stroke="0x000000">` + u + `</text> 
</g></svg>`;
    return svg;
}

/* Public Functions */

function windowAddMenuBar( winHandle, menu ) {
    var menuBar = $('<div class="menubar"></div>');
    winHandle.prepend( menuBar );
    winHandle.addClass( 'window-menubar' );
    _menuPopulate( winHandle, menuBar, menu, false );
}

function windowActivate( container, winHandle ) {

    if( $(winHandle).hasClass( 'window-active' ) ) {
        return;
    }

    var lastZ = 50;
    $(container).children( '.window:not( .window-active )' )
    .sort( function( a, b ) {
        var aInt = parseInt( $(a).css( 'z-index' ) );
        var bInt = parseInt( $(b).css( 'z-index' ) );
        return  aInt - bInt;
    } )
    .each( function( idx, winIter ) {
        lastZ += 1;
        $(winIter).css( 'z-index', lastZ );
    } );

    $('.window-active').css( 'z-index', lastZ + 1 );
    $('.window-active').removeClass( 'window-active' );

    $(winHandle).addClass( 'window-active' );
    $(winHandle).css( 'z-index', lastZ + 2 );

    $('#taskbar > .tasks > button').removeClass( 'task-button-active' );
    $(winHandle).data( 'taskbar-button' ).addClass( 'task-button-active' );
}

function windowMaximize( winHandle ) {

    if( $(winHandle).hasClass( 'window-maximized' ) ) {
        return;
    }

    $(winHandle).data( 'restore-left', $(winHandle).css( 'left' ) );
    $(winHandle).data( 'restore-top', $(winHandle).css( 'top' ) );
    $(winHandle).data( 'restore-width', $(winHandle).css( 'width' ) );
    $(winHandle).data( 'restore-height', $(winHandle).css( 'height' ) );

    $(winHandle).resizable( 'disable' );
    $(winHandle).draggable( 'disable' );
    $(winHandle).css( 'left', '-1px' );
    $(winHandle).css( 'top', '-1px' );
    $(winHandle).css( 'width', '100%' );
    $(winHandle).css( 'height', '100%' );

    var btnRestore = $('<button class="titlebar-restore">&#x29C9;</button>');
    $(btnRestore).click( function() {
        windowRestore( winHandle );
    } );

    $(winHandle).addClass( 'window-maximized' );

    $(winHandle).find( '.titlebar-maximize' ).replaceWith( btnRestore );
}

function windowRestore( winHandle ) {

    if( !$(winHandle).hasClass( 'window-maximized' ) ) {
        return;
    }

    $(winHandle).css( 'left', $(winHandle).data( 'restore-left' ) );
    $(winHandle).css( 'top', $(winHandle).data( 'restore-top' ) );
    $(winHandle).css( 'width', $(winHandle).data( 'restore-width' ) );
    $(winHandle).css( 'height', $(winHandle).data( 'restore-height' ) );

    $(winHandle).resizable( 'enable' );
    $(winHandle).draggable( 'enable' );

    var btnMax = $('<button class="titlebar-maximize">&#x25a1;</button>');
    $(btnMax).click( function() {
        windowMaximize( winHandle );
    } );

    winHandle.find( '.titlebar-restore' ).replaceWith( btnMax );
}

function windowOpen( caption, id=null, resizable=false, icoImg=null, icoX=0, icoY=0, menu=null, x=10, y=10, w=300, h=200, show=true, statusBar=false, taskBar=true ) {
    
    if( 0 < $('#' + id).length ) {
        /* The requested window is already open. */
        windowActivate( '#desktop', '#' + id );
        return $('#' + id);
    }

    var winHandle = $('<div class="window"><form class="window-form"></form></div>');
    if( null != id ) {
        winHandle.attr( 'id', id );
    }
    if( !show ) {
        winHandle.css( 'display', 'none' );
    } else {
        windowActivate( '#desktop', winHandle );
    }
    $('#desktop').append( winHandle );

    winHandle.draggable( {'handle': '.titlebar', 'containment': '#desktop'} );
    if( resizable ) {
        winHandle.resizable();
        winHandle.addClass( 'window-resizable' );
    }

    winHandle.css( 'width', w.toString() + 'px' );
    winHandle.css( 'height', h.toString() + 'px' );

    if( null != menu ) {
        windowAddMenuBar( winHandle, menu );
    }

    var titlebar = $('<div class="titlebar"><h1 class="titlebar-text">' + caption + '</h1></div>');
    $(winHandle).prepend( titlebar );

    _menuAddWindowMenu( winHandle, titlebar, false );
    titlebar.children( '.titlebar-text' ).click( function( e ) {
        /* Plain clicks on the titlebar close all menus. */
        menuClose( winHandle, null );
    } );

    /* Add the window icon. */
    if( null != icoImg ) {
        var icon = $('<div class="titlebar-icon"></div>');
        $(titlebar).prepend( icon );
        icon.css( 'background', 'url(' + staticPath + icoImg + 
            ') right ' + icoX.toString() + 'px bottom ' + icoY.toString() + 'px' );

        _menuAddWindowMenu( winHandle, icon, true );
    } else {
        titlebar.addClass( 'titlebar-no-icon' );
    }

    // Add the window control buttons.
    var btnMax = $('<button class="titlebar-maximize">&#x25a1;</button>');
    $(titlebar).append( btnMax );
    $(btnMax).click( function() {
        windowMaximize( winHandle );
    } );

    var btnClose = $('<button class="titlebar-close">x</button>');
    $(titlebar).append( btnClose );
    $(btnClose).click( function() {
        $(winHandle).remove();
    } );

    $(winHandle).mousedown( function( e ) {
        windowActivate( '#desktop', $(e.target).parents( '.window' ) );
    } );

    if( statusBar ) {
        winHandle.addClass( 'window-statusbar' );
        var statusBarHandle = $('<div class="statusbar"></div>');
        winHandle.append( statusBarHandle );
    }

    if( taskBar ) {
        var taskIcon = $('<span class="task-icon"></span>');
        taskIcon.css( 'background', 'url(' + staticPath + icoImg + 
        ') right ' + icoX.toString() + 'px bottom ' + icoY.toString() + 'px' );

        var taskButton = $('<button class="button-task">' + caption + '</button>' );
        taskButton.prepend( taskIcon );
        winHandle.bind( 'DOMNodeRemoved', function( e ) {
            taskButton.remove();
        } );
        taskButton.click( function( e ) {
            windowRestore( winHandle );
            windowActivate( '#desktop', winHandle );
        } );
        $('#taskbar > .tasks').append( taskButton );
        winHandle.data( 'taskbar-button', taskButton );
    }

    windowActivate( '#desktop', winHandle );

    return winHandle;
}

function windowOpenFolder( caption, id=null, icoImg=null, icoX=0, icoY=0, menu=null, x=10, y=10, w=300, h=200 ) {

    if( null == menu ) {
        menu = [
            {'text': 'File', 'children': [
                {'text': 'Close', 'callback': function( m ) {
                    winHandle.remove();
                }}
            ]}
        ];
    }

    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, menu, x, y, w, h, false, true );
    
    winHandle.addClass( 'window-folder' );

    var container = $('<div class="window-folder-container container"></div>');
    winHandle.find( '.window-form' ).append( container );

    var trayObjects = $('<div class="tray tray-objects"></div>');
    winHandle.children( '.statusbar' ).append( trayObjects );

    var trayBytes = $('<div class="tray tray-bytes"></div>');
    winHandle.children( '.statusbar' ).append( trayBytes );

    winHandle.addClass( 'window-scroll-contents' );

    winHandle.show();

    return winHandle;
}

function browserURLWaybackify( url ) {
    return 'http://web.archive.org/web/19981202230410/' + url;
}

function browserOpenURL( winHandle, url ) {
    var newLoc = browserURLWaybackify( url );
    winHandle.find( '.input-url' ).val( url );
    winHandle.find( '.tray-status-text' ).text( 'Opening ' + url + '...' );
    winHandle.find( '.browser-pane' ).attr( 'src', newLoc );
}

function windowOpenBrowser( caption, id=null, icoImg=null, icoX=0, icoY=0, url='', favorites=null, x=10, y=10, w=640, h=480 ) {

    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, null, x, y, w, h, false, true );
    
    menu = [
        {'text': 'File', 'children': [
            {'text': 'New Window', 'callback': function( m ) {
                windowOpenBrowser( caption, id + '-new', icoImg, icoX, icoY, url, favorites, x + 20, y + 20, w, h );
            }},
            {'divider': true},
            {'group': true, 'id': 'browser-recent'},
            {'text': 'Exit', 'callback': function( m ) {
                winHandle.remove();
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

    if( null == favorites ) {
        favorites = [
            {'name': 'Altavista', 'url': 'http://altavista.com'},
            {'name': 'BBSpot', 'url': 'http://bbspot.com'},
            {'name': 'Microsoft', 'url': 'http://microsoft.com'},
            {'name': 'Slashdot', 'url': 'http://slashdot.org'},
            {'name': 'Yahoo', 'url': 'http://yahoo.com'},
        ];
    }
    
    // Roll the favorites into the favorites menu.
    for( var i = 0 ; favorites.length > i ; i++ ) {
        _browserFavoritesMenuAdd( winHandle, menu[4].children, favorites[i] );
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

    var urlBox = $('<div class="url-bar"><span class="label">Address:</span> <span class="input-url-wrapper"><input type="text" class="input-url" value="' + url + '" /></span></div>');
    browserToolbarLeft.prepend( urlBox );
    browserToolbarLeft.prepend( '<hr />' );

    var buttons = $('<div class="browser-buttons"><button /></div>')
    browserToolbarLeft.prepend( buttons );
    browserToolbarLeft.prepend( '<hr />' );

    winHandle.children( '.window-form' ).prepend( browserToolbar );

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
            browserOpenURL( winHandle, winHandle.find( '.input-url' ).val() );
        }
    } );
    browserOpenURL( winHandle, url );

    winHandle.show();

    return winHandle;
}

function windowCommandEnterLine( winHandle, text ) {
    /* Put the old line in the backbuffer. */
    var line = $('<span class="input-line">' + text + '</span>');
    var cmd = $(winHandle).children( '.window-form' );
    cmd = cmd.children( '.input-prompt' );
    cmd.children( '.backbuffer' ).append( line );
    cmd.children( '.backbuffer' ).append( '<br />' );
}

function windowOpenCommand( caption, id=null, icoImg=null, icoX=0, icoY=0, menu=null, promptText=null, x=0, y=0, w=480, h=260, lineHandler=null, lineHandlerData=null ) {

    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, menu, x, y, w, h, false );

    var cmd = $('<div class="input-prompt"><div class="backbuffer"></div>' +
        '<div class="input-line-caret">' +
        '<span class="input-line"></span><div class="input-caret"></div></div></div>');

    // Add prompt text if one was provided.
    if( null != promptText ) {
        cmd.children( '.input-line-caret' ).prepend(
            '<span class="prompt-text">' + promptText + '</span>' );
        cmd.children( '.input-line-caret' ).data( 'prompt-text', promptText );
    }

    var cmdInput = $('<input type="text" class="input-textarea" />');

    winHandle.children( '.window-form' ).append( cmd );
    winHandle.children( '.window-form' ).append( cmdInput );

    $(cmd).click( function() {
        $(cmdInput).focus();
    } );

    /* Suppress form submission. */
    $(cmdInput).keypress( function( e ) {
        if( 13 == e.keyCode ) {
            /* Don't submit form on enter. */
            e.preventDefault();
        }
    } );

    /* Handle line input. */
    $(cmdInput).keyup( function( e ) {
        if( 13 == e.keyCode ) {
            /* Enter was pressed. */

            var lineCaretBundle = $(cmd).children( '.input-line-caret' );

            $(this).val( '' ); /* Clear virtual input. */
            var prevPrompt = lineCaretBundle.children( '.prompt-text' ).remove();
            
            /* Put the old line in the backbuffer. */
            var line = $(cmd)
                .children( '.input-line-caret' )
                .children( '.input-line' )
                .remove();
            windowCommandEnterLine( winHandle, prevPrompt.text() + line.text() );

            /* Process line input. */
            if( null != lineHandler ) {
                lineHandler( lineHandlerData, winHandle );
            }

            /* Create a new input line. */
            lineCaretBundle.prepend( '<span class="input-line"></span>' );
            if( 0 < prevPrompt.length ) {
                lineCaretBundle.prepend( '<span class="prompt-text">' +
                    lineCaretBundle.data( 'prompt-text' ) + '</span>' );
            }

            e.preventDefault();
        } else {
            $(cmd)
                .children( '.input-line-caret' )
                .children( '.input-line' )
                .text( $(this).val() );
        }
    } );

    winHandle.addClass( 'window-scroll-contents' );

    winHandle.addClass( 'window-command' );
    winHandle.show();
    windowActivate( '#desktop', winHandle );

    return winHandle;
}

function windowOpenNotepad( caption, id=null, icoImg=null, icoX=0, icoY=0, contents='', x=0, y=0, w=480, h=260 ) {
    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, null, x, y, w, h, false );
    
    menu = [
        {'text': 'File', 'children': [
            {'text': 'New Window', 'callback': function( m ) {
                windowOpenBrowser( caption, id + '-new', icoImg, icoX, icoY, url, favorites, x + 20, y + 20, w, h );
            }},
            {'divider': true},
            {'group': true, 'id': 'browser-recent'},
            {'text': 'Exit', 'callback': function( m ) {
                winHandle.remove();
            }}
        ]},
        {'text': 'Edit', 'children': [
            {'text': 'Undo', 'callback': function( m ) {
            }},
            {'divider': true},
            {'text': 'Cut', 'callback': function( m ) {
            }},
            {'text': 'Copy', 'callback': function( m ) {
            }},
            {'text': 'Paste', 'callback': function( m ) {
            }},
            {'text': 'Delete', 'callback': function( m ) {
            }},
            {'divider': true},
            {'text': 'Select All', 'callback': function( m ) {
            }},
            {'text': 'Time/Date', 'callback': function( m ) {
            }},
            {'divider': true},
            {'text': 'Word Wrap', 'callback': function( m ) {
            }}
        ]},
        {'text': 'View', 'children': [
        ]},
        {'text': 'Search', 'children': [
        ]},
        {'text': 'Help', 'children': [
        ]}
    ];

    // Add the menu now, once winHande is defined, so callbacks above have it
    // in scope.
    windowAddMenuBar( winHandle, menu );

    winHandle.addClass( 'window-notepad' );

    // This window type still uses wrappers because the pseudo-elements are 
    // rather prone to yet-unexplainable misbehaviors.
    var wrapper = $('<div class="textarea-wrapper"></div>');
    winHandle.children( '.window-form' ).append( wrapper );

    var text = $('<textarea class="input-textarea"></textarea>');
    wrapper.append( text );

    winHandle.addClass( 'window-scroll-contents' );

    text.text( contents );

    winHandle.show();
    windowActivate( '#desktop', winHandle );

    return winHandle;
}

function windowOpenProperties( caption, id=null, x=0, y=0 ) {
    var winHandle = windowOpen( caption, id, false, null, 0, 0, null, x, y, 408, 446, false, false, false );
    
    winHandle.addClass( 'window-properties' );
    
    /*
    var tabsWrapper = $('<div class="window-properties-tabs-wrapper"></div>');
    winHandle.find( '.window-form' ).append( tabsWrapper );*/

    var tabs = $('<div class="window-properties-tabs"><ul></ul></div>');
    winHandle.children( '.window-form' ).append( tabs );

    var buttons = $('<div class="window-properties-buttons"></div>');
    winHandle.children( '.window-form' ).append( buttons );

    var btnCancel = $('<button class="button-cancel">Cancel</button>');
    buttons.append( btnCancel );
    $(btnCancel).click( function( e ) {
        e.preventDefault();
    } );

    var btnOK = $('<button class="button-ok">OK</button>');
    buttons.append( btnOK );
    $(btnOK).click( function( e ) {
        e.preventDefault();
    } );

    winHandle.show();
    windowActivate( '#desktop', winHandle );

    return winHandle;
}

function windowPropertiesAddTab( winHandle, caption, id ) {
    
    var tabPane = $('<div class="window-properties-tab-pane" id="' + id + '"></div>');
    $(winHandle).find( '.window-properties-tabs' ).append( tabPane );

    var tab = '<li class="window-properties-tab-tab"><a href="#' + id + '">' + caption + '</a></li>';
    var tabs = $(winHandle).find( '.window-properties-tabs > ul' ).append( tab );

    return tabPane;
}

function windowOpenCDPlayer( caption, id=null, icoImg=null, icoX=0, icoY=0, playlist=[], x=0, y=0 ) {
    
    var winHandle = windowOpen( caption, id, false, icoImg, icoX, icoY, null, x, y, 300, 200, false, true );
    
    winHandle.addClass( 'window-cdplayer' );
    
    menu = [
        {'text': 'Disc', 'children': [
            {'group': true, 'id': 'browser-recent'},
            {'text': 'Exit', 'callback': function( m ) {
                winHandle.remove();
            }}
        ]},
        {'text': 'View', 'children': [
        ]},
        {'text': 'Options', 'children': [
        ]},
        {'text': 'Help', 'children': [
        ]}
    ];

    // Add the menu now, once winHande is defined, so callbacks above have it
    // in scope.
    windowAddMenuBar( winHandle, menu );

    var controls = $('<div class="window-cdplayer-controls-row"><div class="window-cdplayer-display">[00] 00:00</div><div class="window-cdplayer-controls"><div class="window-cdplayer-controls-play-pause-stop"></div><div class="window-cdplayer-controls-tracks-eject"></div></div></div>');
    winHandle.children( '.window-form' ).append( controls );

    var audio = new Audio( playlist[0].url );

    var btnPlay = $('<button class="button-play disable-until-load">&#x25b6;</button>');
    controls.find( '.window-cdplayer-controls-play-pause-stop').append( btnPlay );
    btnPlay.click( function( e ) {
        audio.play();
        e.preventDefault();
    } );

    var btnPause = $('<button class="button-pause disable-until-load">&#x23f8;</button>');
    controls.find( '.window-cdplayer-controls-play-pause-stop').append( btnPause );
    btnPause.click( function( e ) {
        audio.pause();
        e.preventDefault();
    } );

    var btnStop = $('<button class="button-stop disable-until-load">' + _htmlCharSVG( '\u23f9' ) + '</button>');
    controls.find( '.window-cdplayer-controls-play-pause-stop').append( btnStop );
    btnStop.click( function( e ) {
        audio.pause();
        audio.currentTime = 0;
        e.preventDefault();
    } );

    var btnPrevTrack = $('<button class="button-track-prev disable-until-load">&#x23ee;</button>');
    controls.find( '.window-cdplayer-controls-tracks-eject').append( btnPrevTrack );
    btnPrevTrack.click( function( e ) {
        e.preventDefault();
    } );

    var btnRewind = $('<button class="button-rewind disable-until-load">&#x23ea;</button>');
    controls.find( '.window-cdplayer-controls-tracks-eject').append( btnRewind );
    btnRewind.click( function( e ) {
        e.preventDefault();
    } );

    var btnFastFwd = $('<button class="button-fast-fwd disable-until-load">&#x23e9;</button>');
    controls.find( '.window-cdplayer-controls-tracks-eject').append( btnFastFwd );
    btnFastFwd.click( function( e ) {
        e.preventDefault();
    } );

    var btnNextTrack = $('<button class="button-track-next">&#x23ee;</button>');
    controls.find( '.window-cdplayer-controls-tracks-eject').append( btnNextTrack );
    btnNextTrack.click( function( e ) {
        e.preventDefault();
    } );

    winHandle.find( '.disable-until-load' ).attr( 'disabled', true );

    var drops = $('<div class="window-cdplayer-drops"></div>');
    winHandle.children( '.window-form' ).append( drops );

    var dropArtist = $('<div class="wrapper window-cdplayer-drop-artist-wrapper"><label>Artist: </label><div class="select-wrapper"><select class="input-select select-artist"></select></div></div>');
    drops.append( dropArtist );

    var dropAlbum = $('<div class="wrapper window-cdplayer-drop-album-wrapper"><label>Title: </label><div class="inset inset-album"></div></div>');
    drops.append( dropAlbum );

    var dropTrack = $('<div class="wrapper window-cdplayer-drop-track-wrapper"><label>Track: </label><div class="select-wrapper"><select class="input-select select-track"></select></div></div>');
    drops.append( dropTrack );

    // Setup the status bar.
    var trayStatusTime = $('<div class="tray tray-status-time"></div>');
    winHandle.children( '.statusbar' ).append( trayStatusTime );

    var trayStatusTrack = $('<div class="tray tray-status-track"></div>');
    winHandle.children( '.statusbar' ).append( trayStatusTrack );

    winHandle.find( '.browser-pane' ).on( 'load', function( e ) {
        winHandle.find( '.tray-status-text' ).text( '' );
    } );

    var mediaLoadComplete = false;

    var jsmediatags = window.jsmediatags;
    try {
        jsmediatags.read( playlist[0].url, {
        'onSuccess': function( tag ) {
            console.log( tag );
            if( mediaLoadComplete ) {
                winHandle.find( '.disable-until-load' ).attr( 'disabled', false );
            } else {
                mediaLoadComplete = true;
            }
        } } );
    } catch( e ) {
        console.log( e );
        if( mediaLoadComplete ) {
            winHandle.find( '.disable-until-load' ).attr( 'disabled', false );
        } else {
            mediaLoadComplete = true;

            dropArtist.find( 'select' ).empty();
            dropArtist.find( 'select' ).append( '<option>' + _htmlEncode( playlist[0].artist ) + '</option>' );
            dropAlbum.find( '.inset-album' ).text( _htmlEncode( playlist[0].album ) );
            dropTrack.find( 'select' ).empty();
            dropTrack.find( 'select' ).append( '<option>' + _htmlEncode( playlist[0].title ) + '</option>' );
        }
    }
            
    audio.volume = 0.3;

    // Setup the audio events.
    $(audio).on( 'canplay', function( e ) {
        if( mediaLoadComplete ) {
            winHandle.find( '.disable-until-load' ).attr( 'disabled', false );
        } else {
            mediaLoadComplete = true;
        }        

        // Show the audio duration now that it's loaded.
        var duration = audio.duration;
        var minutes = Math.floor( duration / 60 ).toString();
        if( 9 >= minutes ) {
            minutes = "0" + minutes;
        }
        var seconds = Math.floor( duration % 60 ).toString();
        if( 9 >= seconds ) {
            seconds = "0" + seconds;
        }
        trayStatusTime.text( 'Total Play: ' + minutes + ':' + seconds + ' m:s' );
    } );
    $(audio).on( 'timeupdate', function( e ) {        
        var currentTime = audio.currentTime;
        var minutes = Math.floor( currentTime / 60 ).toString();
        if( 9 >= minutes ) {
            minutes = "0" + minutes;
        }
        var seconds = Math.floor( currentTime % 60 ).toString();
        if( 9 >= seconds ) {
            seconds = "0" + seconds;
        }
        winHandle.find( '.window-cdplayer-display' ).text( '[00] ' + minutes + ':' + seconds );

    } );
    $(audio).addClass( 'cd-player-audio' );

    // This should probably be global and attached to the mixer.
    winHandle.append( audio );

    winHandle.show();
    windowActivate( '#desktop', winHandle );

    return winHandle;
}

function windowCDPlayerEnable( winHandle ) {
    btnPlay.attr( 'disabled', false );

}

function windowOpenMixer( caption, id=null, icoImg=null, icoX=0, icoY=0, x=0, y=0 ) {
    var winHandle = windowOpen( caption, id, false, icoImg, icoX, icoY, null, x, y, 408, 446, false );
    
    winHandle.addClass( 'window-mixer' );

    winHandle.show();
    windowActivate( '#desktop', winHandle );

    return winHandle;
}

function desktopCreateIcon( text, imgPath, imgX, imgY, x, y, callback, container='#desktop', cbData=null ) {
    var icoWidth = 32;
    var icoHeight = 32;

    console.assert( $(container).length == 1 );
    
    var icoImg = $('<div class="desktop-icon-img"></div>');

    var iconWrapper = $('<div class="desktop-icon"><div class="desktop-icon-overlay"></div>');
    iconWrapper.append( icoImg );

    /* Setup the icon image and save it for reuse later. */
    var bgURL = 'url(' + staticPath + imgPath + 
        ') right ' + imgX.toString() + 'px bottom ' + imgY.toString() + 'px';
    icoImg.css( 'background', bgURL );
    iconWrapper.data( 'icon-bg', bgURL ); /* Save for later. */
    iconWrapper.hide(); /* Hide until loaded. */

    /* Setup a clipping mask to limit the highlight overlay. */
    var spritesheetImg = new Image();
    spritesheetImg.onload = function() {
        /* We need to know the spritesheet dimensions for the math, so load
         * the spritesheet temporarily to get them.
         */
        var spritesheetWidth = this.width;
        var spritesheetHeight = this.height;
        
        icoImg.css( '-webkit-mask-image', 'url(' + staticPath + imgPath + ')' );
        icoImg.css( '-webkit-mask-position-x', (spritesheetWidth - (imgX - icoWidth)).toString() + 'px' );
        icoImg.css( '-webkit-mask-position-y', (spritesheetHeight - (imgY - icoHeight)).toString() + 'px' );

        iconWrapper.show();
    };
    spritesheetImg.src = staticPath + imgPath;
    
    var iconText = $('<div class="desktop-icon-text-center"><div class="desktop-icon-text">' + text + '</div></div>');
    iconWrapper.append( iconText );

    $(container).append( iconWrapper );
    $(iconWrapper).draggable( {'handle': '.desktop-icon-overlay', 'containment': container } );

    $(iconWrapper).css( 'left', x.toString() + 'px' );
    $(iconWrapper).css( 'top', y.toString() + 'px' );

    /* Setup action handlers. */
    $(iconWrapper).mousedown( function() {
        desktopSelectIcon( container, this );
    } );
    $(iconWrapper).on( 'dblclick', cbData, callback );

    return iconWrapper;
}

function desktopSelectIcon( container, icon ) {

    /* Deselect all icons. */
    $(container).children('.desktop-icon').removeClass( 'desktop-icon-selected' );
    $(container).children('.desktop-icon').each( function( idx, iterIcon ) {
        $(iterIcon).children( '.desktop-icon-img' ).css(
            'background', $(iterIcon).data( 'icon-bg' ) );
    } );

    if( null == icon ) {
        /* No icon to select, do just leave it at that. */
        return;
    }

    /* Select this icon. */
    $(icon).addClass( 'desktop-icon-selected' );
    $(icon).children( '.desktop-icon-img' ).css(
        'background', 'linear-gradient(to bottom, rgba(0, 0, 127, 0.3), rgba(0, 0, 127, 0.3)),' +
        $(icon).data( 'icon-bg' ) );
}

function menuPopup( container, items, x, y, show=true ) {

    var menu = $('<div class="menu"></div>');
    if( !show ) {
        menu.hide();
    }
    $(container).append( menu );
    menu.css( 'left', x.toString() + 'px' );
    menu.css( 'top', y.toString() + 'px' );

    _menuPopulate( container, menu, items );
    
    return menu;
}

function menuClose( container, menu ) {
    if( null != menu ) {
        menu.remove();
    } else {
        /* Close all menus in this container. */
        $(container).find( '.menu' ).each( function( idx, menuIter ) {
            menuClose( container, menuIter );
        } );
    }
}

$(document).ready( function() {

    $('.button-start').click( function( e ) {
            
        e.preventDefault();

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
                winHandle.remove();
            }}
        ];

        menuClose( '#desktop', null );
        var menu = menuPopup( '#desktop', menu,
            $('.button-start').offset().left,
            $('.button-start').offset().top, false );
        menu.addClass( 'logo-menu' );

        var stripe = '<div class="logo-stripe-wrapper"><div class="logo-stripe">Windows 95</div></div>';
        menu.append( stripe );

        menu.css( 'top', ($('.button-start').offset().top - menu.height() - 5).toString() + 'px' );

        menu.show();
    } );
} );
