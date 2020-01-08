
(function( $ ) {
$.fn.window95 = function( action, options ) {

var settings = $.extend( {
    'caption': '',
    'id': null,
    'resizable': false,
    'icoImg': null,
    'icoX': 0,
    'icoY': 0,
    'menu': null,
    'x': 10,
    'y': 10,
    'w': 300,
    'h': 200,
    'show': true,
    'statusBar': false,
    'taskBar': true
}, options );

switch( action ) {

case 'activate':
    return this.each( function( idx, winHandle ) {

        if( $(winHandle).hasClass( 'window-active' ) ) {
            return;
        }

        // Re-sort inactive siblings on z-index from 50 up.
        var lastZ = 50;
        $(winHandle).parent().children( '.window:not( .window-active )' )
        .sort( function( a, b ) {
            var aInt = parseInt( $(a).css( 'z-index' ) );
            var bInt = parseInt( $(b).css( 'z-index' ) );
            return  aInt - bInt;
        } )
        .each( function( idx, winIter ) {
            lastZ += 1;
            $(winIter).css( 'z-index', lastZ );
        } );

        //  Make sure the current active window is the next lowest.
        $('.window-active').css( 'z-index', lastZ + 1 );
        $('.window-active').removeClass( 'window-active' );

        // Make the incoming window the highest (and unminimize if applicable).
        $(winHandle).removeClass( 'window-minimized' );
        $(winHandle).addClass( 'window-active' );
        $(winHandle).css( 'z-index', lastZ + 2 );

        if( null != $(winHandle).data( 'taskbar-button' ) ) {
            $('#taskbar > .tasks > button').removeClass( 'task-button-active' );
            $(winHandle).data( 'taskbar-button' ).addClass( 'task-button-active' );
        }

        return;
    } );

case 'maximize':
    return this.each( function( idx, winHandle ) {
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

        $(winHandle).removeClass( 'window-minimized' );
        $(winHandle).addClass( 'window-maximized' );

        $(winHandle).find( '.titlebar-restore' ).css( 'display', 'inline-block' );
        $(winHandle).find( '.titlebar-maximize' ).css( 'display', 'none' );

        return;
    } );

case 'minimize':
    return this.each( function( idx, winHandle ) {
        if( $(winHandle).hasClass( 'window-minimized' ) ) {
            return;
        }

        $(winHandle).addClass( 'window-minimized' );
    } );

case 'restore':
    return this.each( function( idx, winHandle ) {
        if(
            !$(winHandle).hasClass( 'window-maximized' ) &&
            !$(winHandle).hasClass( 'window-minimized' )
        ) {
            return;
        }
        
        if( $(winHandle).hasClass( 'window-minimized' ) ) {
            $(winHandle).removeClass( 'window-minimized' );
        } else if( $(winHandle).hasClass( 'window-maximized' ) ) {
            $(winHandle).css( 'left', $(winHandle).data( 'restore-left' ) );
            $(winHandle).css( 'top', $(winHandle).data( 'restore-top' ) );
            $(winHandle).css( 'width', $(winHandle).data( 'restore-width' ) );
            $(winHandle).css( 'height', $(winHandle).data( 'restore-height' ) );

            $(winHandle).resizable( 'enable' );
            $(winHandle).draggable( 'enable' );

            $(winHandle).removeClass( 'window-maximized' );

            $(winHandle).find( '.titlebar-restore' ).css( 'display', 'none' );
            $(winHandle).find( '.titlebar-maximize' ).css( 'display', 'inline-block' );
        }
    } );

case 'close':
    return this.each( function( idx, winHandle ) {
        if( null != $(winHandle).data( 'taskbar-button' ) ) {
            $(winHandle).data( 'taskbar-button' ).remove();
        }
        $(winHandle).remove();
        return;
    } );

case 'open':

    if( 0 < $('#' + settings.id).length ) {
        /* The requested window is already open. */
        $('#' + settings.id).window95( 'activate' );
        return $('#' + settings.id);
    }

    var winHandle = $('<div class="window"><form class="window-form"></form></div>');
    if( null != settings.id ) {
        winHandle.attr( 'id', settings.id );
    }
    if( !settings.show ) {
        winHandle.addClass( 'window-hidden' );
    } else {
        winHandle.window95( 'activate' );
    }
    this.append( winHandle );

    winHandle.draggable( {'handle': '.titlebar', 'containment': '#desktop'} );
    if( settings.resizable ) {
        winHandle.resizable();
        winHandle.addClass( 'window-resizable' );
    }

    winHandle.css( 'width', settings.w.toString() + 'px' );
    winHandle.css( 'height', settings.h.toString() + 'px' );

    if( null != settings.menu ) {
        windowAddMenuBar( winHandle, settings.menu );
    }

    var titlebar = $('<div class="titlebar"><h1 class="titlebar-text">' + settings.caption + '</h1></div>');
    winHandle.prepend( titlebar );

    _menuAddWindowMenu( winHandle, titlebar, false );
    titlebar.children( '.titlebar-text' ).click( function( e ) {
        /* Plain clicks on the titlebar close all menus. */
        menuClose( winHandle, null );
    } );

    /* Add the window icon. */
    if( null != settings.icoImg ) {
        var icon = $('<div class="titlebar-icon"></div>');
        $(titlebar).prepend( icon );
        icon.css( 'background', 'url(' + staticPath + settings.icoImg + 
            ') right ' + settings.icoX.toString() + 'px bottom ' + settings.icoY.toString() + 'px' );

        _menuAddWindowMenu( winHandle, icon, true );
    } else {
        titlebar.addClass( 'titlebar-no-icon' );
    }

    // Add the window control buttons.
    var btnMin = $('<button class="titlebar-minimize">_</button>');
    $(titlebar).append( btnMin );
    $(btnMin).click( function() {
        winHandle.window95( 'minimize' );
    } );

    var btnMax = $('<button class="titlebar-maximize">&#x25a1;</button>');
    $(titlebar).append( btnMax );
    $(btnMax).click( function() {
        winHandle.window95( 'maximize' );
    } );

    var btnRestore = $('<button class="titlebar-restore">&#x29C9;</button>');
    $(titlebar).append( btnRestore );
    btnRestore.css( 'display', 'none' );
    $(btnRestore).click( function() {
        winHandle.window95( 'restore' );
    } );

    var btnClose = $('<button class="titlebar-close">x</button>');
    $(titlebar).append( btnClose );
    $(btnClose).click( function() {
        winHandle.window95( 'close' );
    } );

    $(winHandle).mousedown( function( e ) {
        $(e.target).parents( '.window' ).window95( 'activate' );
    } );

    if( settings.statusBar ) {
        winHandle.addClass( 'window-statusbar' );
        var statusBarHandle = $('<div class="statusbar"></div>');
        winHandle.append( statusBarHandle );
    }

    if( settings.taskBar ) {
        var taskIcon = $('<span class="task-icon"></span>');
        taskIcon.css( 'background', 'url(' + staticPath + settings.icoImg + 
        ') right ' + settings.icoX.toString() + 'px bottom ' + settings.icoY.toString() + 'px' );

        var taskButton = $('<button class="button-task" id="button-task-' + settings.id + '">' + settings.caption + '</button>' );
        taskButton.prepend( taskIcon );
        taskButton.click( function( e ) {
            if( winHandle.hasClass( 'window-minimized' ) ) {
                winHandle.window95( 'restore' );
                winHandle.window95( 'activate' );
            } else if( !taskButton.hasClass( 'task-button-active' ) ) {
                winHandle.window95( 'activate' );
            } else {
                winHandle.window95( 'minimize' );
            }
        } );
        $('#taskbar > .tasks').append( taskButton );
        winHandle.data( 'taskbar-button', taskButton );
    }
    winHandle.window95( 'activate' );

    // Return the newly created window.
    return winHandle;

}; }; }( jQuery ) );

function windowAddMenuBar( winHandle, menu ) {
    var menuBar = $('<div class="menubar"></div>');
    winHandle.prepend( menuBar );
    winHandle.addClass( 'window-menubar' );
    _menuPopulate( winHandle, menuBar, menu, false );
}
