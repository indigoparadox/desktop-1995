
const window95Exceptions = {
    'WINDOW_EXISTS': 'window_exists',
};

const window95Buttons = {
    'OK': 'ok',
};

const window95Decorations = {
    'CLOSE': 'close',
    'MIN': 'min',
    'MAX': 'max',
    'ICON': 'icon',
    'TITLE': 'title',
    'RESTORE': 'restore',
};

(function( $ ) {

$(document).ready( function() {
    var windowJsPath = $('script[src$="/window.js"]' ).attr( 'src' );
    $('head').append( '<link rel="stylesheet" href="' + windowJsPath.replace( '\/src\/', '\/themes\/' + platform_name + '\/' ).replace( '.js', '.css' ) + '" />' );
} );

$.fn.window95 = function( action, options ) {

var settings = $.extend( {
    'caption': '',
    'id': null,
    'resizable': false,
    'menu': null,
    'message': '',
    'x': 10,
    'y': 10,
    'w': null,
    'h': null,
    'show': true,
    'taskBar': true,
    'decorations': [
        window95Decorations.ICON,
        window95Decorations.TITLE,
        window95Decorations.MIN,
        window95Decorations.MAX,
        window95Decorations.RESTORE,
        window95Decorations.CLOSE
    ],
    'buttons': {'OK': window95Buttons.OK},
}, options );

switch( action.toLowerCase() ) {

case 'activate':
    return this.each( function( idx, winHandle ) {

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

        $(winHandle).trigger( 'activate' );
    } );

case 'maximize':
    return this.each( function( idx, winHandle ) {
        if( $(winHandle).hasClass( 'window-maximized' ) ) {
            return;
        }

        // Save the window's current size for restoring later.
        $(winHandle).data( 'restore-left', $(winHandle).css( 'left' ) );
        $(winHandle).data( 'restore-top', $(winHandle).css( 'top' ) );
        $(winHandle).data( 'restore-width', $(winHandle).css( 'width' ) );
        $(winHandle).data( 'restore-height', $(winHandle).css( 'height' ) );

        // Turn off dragging/resizing.
        $(winHandle).resizable( 'disable' );
        $(winHandle).draggable( 'disable' );

        // Get rid of manual sizing so CSS class takes effect.
        $(winHandle).css( 'left', '' );
        $(winHandle).css( 'top', '' );
        $(winHandle).css( 'width', '' );
        $(winHandle).css( 'height', '' );

        // Make sure we're using the right class.
        $(winHandle).removeClass( 'window-minimized' );
        $(winHandle).addClass( 'window-maximized' );

        $(winHandle).find( '.titlebar-restore' ).css( 'display', 'inline-block' );
        $(winHandle).find( '.titlebar-maximize' ).css( 'display', 'none' );

        $(winHandle).trigger( 'maximize' );
    } );

case 'minimize':
    return this.each( function( idx, winHandle ) {
        if( $(winHandle).hasClass( 'window-minimized' ) ) {
            return;
        }

        $(winHandle).addClass( 'window-minimized' );

        $(winHandle).trigger( 'minimize' );
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
            $(winHandle).trigger( 'restore-up' );

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


            $(winHandle).trigger( 'restore-down' );
        }
    } );

case 'dialog':

    settings.menu = null;
    settings.show = false;
    settings.resizable = false;
    settings.x = null;
    settings.y = null;

    // We specifically do not catch the possible exceptions here.
    // Let the caller handle them.
    var dlgHandle = this.window95( 'open', settings );

    dlgHandle.addClass( 'window-dialog' );

    var dlgDisplay = $('<div class="dialog-display"></div>');
    dlgHandle.children( '.window-form' ).append( dlgDisplay );

    var dlgIcon = $('<div class="dialog-icon"></div>');
    dlgIcon.addClass( 'icon-' + settings.icon + '-32' );
    dlgDisplay.append( dlgIcon );

    var dlgMessage = $('<div class="dialog-message">' + settings.message + '</div>');
    dlgDisplay.append( dlgMessage );

    var dlgButtons = $('<div class="dialog-buttons"></div>');
    dlgHandle.children( '.window-form' ).append( dlgButtons );

    for( var btn in settings.buttons ) {
        var btnElement = $('<button data-trigger="' + settings.buttons[btn] + '" class="button-' + settings.buttons[btn] + '">' + btn + '</button>');
        dlgButtons.append( btnElement );

        btnElement.click( function( e ) {
            e.preventDefault();

            dlgHandle.trigger( 'button-' + $(e.target).data( 'trigger' ) );
        } );
    }

    dlgHandle.removeClass( 'window-hidden' );

    return dlgHandle;

case 'close':
    return this.each( function( idx, winHandle ) {
        try {
            $(winHandle).trigger( 'closing' );
        } catch( e ) {
            return;
        }
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
        throw { 'type': window95Exceptions.WINDOW_EXISTS, 'window': $('#' + settings.id) };
    }

    // Create the bare window and append it to the container.
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

    // Only use dragging/resizing if they're available.
    if( typeof( winHandle.draggable ) === 'function' ) {
        winHandle.draggable( {'handle': '.titlebar', 'containment': this} );
    }
    if( typeof( winHandle.resizable ) === 'function' ) {
        if( settings.resizable ) {
            winHandle.resizable();
            winHandle.addClass( 'window-resizable' );
        }
    }

    if( null != settings.w ) {
        winHandle.css( 'width', settings.w.toString() + 'px' );
    }
    if( null != settings.h ) {
        winHandle.css( 'height', settings.h.toString() + 'px' );
    }

    if( null != settings.x ) {
        $(winHandle).css( 'left', settings.x.toString() + 'px' );
    }
    if( null != settings.y ) {
        $(winHandle).css( 'top', settings.y.toString() + 'px' );
    }

    if( null != settings.menu ) {
        settings.menu.type = menu95Type.MENUBAR;
        settings.menu.caller = winHandle;
        settings.menu.container = winHandle;
        winHandle.menu95( 'open', settings.menu );
    }

    var titlebar = $('<div class="titlebar titlebar-no-icon"></div>');
    winHandle.prepend( titlebar );

    // Add the window titlebar decorations/furniture/etc.
    for( var decoIter in settings.decorations ) {
        switch( settings.decorations[decoIter] ) {

        case window95Decorations.TITLE:
            var titleText = $('<h1 class="titlebar-text">' + settings.caption + '</h1>');
            $(titlebar).append( titleText );
            break;

        case window95Decorations.ICON:
            var icon = $('<div class="titlebar-icon icon-' + settings.icon + '-16"></div>');
            $(titlebar).append( icon );
            titlebar.removeClass( 'titlebar-no-icon' );
            break;

        case window95Decorations.MIN:
            var btnMin = $('<button class="titlebar-minimize">_</button>');
            $(titlebar).append( btnMin );
            $(btnMin).click( function() {
                winHandle.window95( 'minimize' );
            } );
            break;
        
        case window95Decorations.MAX:
            var btnMax = $('<button class="titlebar-maximize">&#x25a1;</button>');
            $(titlebar).append( btnMax );
            $(btnMax).click( function() {
                winHandle.window95( 'maximize' );
            } );
            break;

        case window95Decorations.RESTORE:
            var btnRestore = $('<button class="titlebar-restore">&#x29C9;</button>');
            $(titlebar).append( btnRestore );
            btnRestore.css( 'display', 'none' );
            $(btnRestore).click( function() {
                winHandle.window95( 'restore' );
            } );
            break;

        case window95Decorations.CLOSE:
            var btnClose = $('<button class="titlebar-close">x</button>');
            $(titlebar).append( btnClose );
            $(btnClose).click( function() {
                winHandle.window95( 'close' );
            } );
            break;
        }
    }

    $(winHandle).mousedown( function( e ) {
        $(e.target).parents( '.window' ).window95( 'activate' );
    } );

    if( settings.taskBar ) {
        var taskIcon = $('<span class="task-icon icon-' + settings.icon + '-16"></span>');

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

case 'properties':

    settings.resizable = false;
    settings.statusBar = false;
    settings.taskBar = false;
    settings.menu = null;
    settings.w = 408;
    settings.h = 446;
    settings.decorations = [window95Decorations.TITLE, window95Decorations.CLOSE];
    settings.max = false;
    var winHandle = this.window95( 'open', settings );

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
        winHandle.window95( 'close' );
    } );

    var btnOK = $('<button class="button-ok">OK</button>');
    buttons.append( btnOK );
    $(btnOK).click( function( e ) {
        e.preventDefault();
    } );

    winHandle.removeClass( 'window-hidden' );
    winHandle.window95( 'activate' );

    return winHandle;

}; }; }( jQuery ) );
