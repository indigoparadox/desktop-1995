
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

function _menuAssignItemChildren( container, item, children, followMouse ) {
    item.click( function( e ) {
        var x = item.offset().left - $(container).offset().left;
        var y = item.offset().top - $(container).offset().top + item.height();

        /* Context menus follow mouse, not element. */
        if( followMouse ) {
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
        if( 'divider' in items[i] && items[i].divider ) {
            menuItem = $('<hr />');
        } else {
            menuItem = $('<a href="#" class="menu-item">' + items[i].text + '</a>');
            if( 'callback' in items[i] ) {
                _menuAssignItemCallback( container, menuItem, items[i].callback );
            } else if( 'children' in items[i] ) {
                _menuAssignItemChildren( 
                    container, menuItem, items[i].children, followMouse );
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

/* Public Functions */

function windowActivate( container, winHandle ) {
    $(container).children( '.window' ).each( function( idx, winIter ) {
        $(winIter).removeClass( 'window-active' );
    } );

    if( null != winHandle ) {
        $(winHandle).addClass( 'window-active' );
    }
}

function windowOpen( caption, id=null, resizable=false, icoImg=null, icoX=0, icoY=0, menu=null, x=10, y=10, w=300, h=200, show=true ) {
    
    var winHandle = $('<div class="window"><form class="window-form"></form></div>');
    if( null != id ) {
        winHandle.attr( 'id', id );
    }
    if( !show ) {
        winHandle.css( 'display', 'none' );
    }
    $('#desktop').append( winHandle );

    winHandle.draggable( {'handle': '.titlebar'} );
    if( resizable ) {
        //winHandle.resizable();
        winHandle.addClass( 'window-resizable' );
    }

    winHandle.css( 'width', w.toString() + 'px' );
    winHandle.css( 'height', h.toString() + 'px' );

    /* Close any menus opened by clicking in parent elements. */
    /* winHandle.click( function( e ) {
        menuClose( winHandle, null );
    } ); */

    if( null != menu ) {
        var menuBar = $('<div class="menubar"></div>');
        winHandle.prepend( menuBar );
        winHandle.addClass( 'window-menubar' );
        _menuPopulate( winHandle, menuBar, menu, false );
    }

    var titlebar = $('<div class="titlebar"><h1 class="titlebar-text">' + caption + '</h1></div>');
    $(winHandle).prepend( titlebar );

    _menuAddWindowMenu( winHandle, titlebar, false );
    titlebar.children( '.titlebar-text' ).click( function( e ) {
        /* Plain clicks on the titlebar close all menus. */
        menuClose( winHandle, null );
    } );

    /* Add the window icon. */
    var icon = $('<div class="titlebar-icon"></div>');
    $(titlebar).prepend( icon );
    icon.css( 'background', 'url(' + staticPath + icoImg + 
        ') right ' + icoX.toString() + 'px bottom ' + icoY.toString() + 'px' );

    _menuAddWindowMenu( winHandle, icon, true );

    /* Add the window close button. */
    var btnClose = $('<button class="titlebar-close">x</button>');
    $(titlebar).append( btnClose );
    $(btnClose).click( function() {
        $(winHandle).remove();
    } );

    $(winHandle).mousedown( function( e ) {
        windowActivate( '#desktop', $(e.target).parents( '.winHandle' ) );
    } );

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

    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, menu, x, y, w, h, false );
    
    winHandle.addClass( 'window-folder' );

    var container = $('<div class="window-folder-container container"></div>');
    winHandle.find( '.window-form' ).append( container );

    winHandle.show();

    return winHandle;
}

function windowCreateInputText( win, label, value='', x='auto', y='auto' ) {

    /* Create a wrapper for the 3D chisel effect. */
    var input = $('<input class="input-text" type="text" value="' + value + '" />');
    $(win).children( '.window-form' ).append( input );
    
    if( 'auto' != x ) {
        $(input).css( 'left', x );
    }

    if( 'auto' != y ) {
        $(input).css( 'top', y );
    }
}

function windowOpenCommand( caption, id=null, icoImg=null, icoX=0, icoY=0, menu=null, x=0, y=0, w=480, h=260 ) {

    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, menu, x, y, w, h, false );

    var cmd = $('<div class="input-prompt"><div class="backbuffer"></div><div class="input-line-caret"><span class="input-line"></span><div class="input-caret"></div></div></div>');

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

            $(this).val( '' ); /* Clear virtual input. */
            
            /* Put the old line in the backbuffer. */
            var line = $(cmd)
                .children( '.input-line-caret' )
                .children( '.input-line' )
                .remove();
            $(cmd).children( '.backbuffer' ).append( line );
            $(cmd).children( '.backbuffer' ).append( '<br />' );

            /* TODO: Process line input. */

            /* Create a new input line. */
            $(cmd).children( '.input-line-caret' )
                .prepend( '<span class="input-line"></span>' );

            e.preventDefault();
        } else {
            $(cmd)
                .children( '.input-line-caret' )
                .children( '.input-line' )
                .text( $(this).val() );
        }
    } );

    winHandle.addClass( 'window-command' );
    winHandle.show();

    return winHandle;
}

function windowOpenNotepad() {
    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, menu, x, y, w, h, false );
    
    winHandle.addClass( 'window-notepad' );

    var prompt = $('<textarea class="input-textarea"></textarea>');
    winHandle.children( '.window-form' ).append( prompt );

    return winHandle;
}

function windowOpenProperties( caption, id=null, icoImg=null, icoX=0, icoY=0, x=0, y=0 ) {
    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, null, x, y, 408, 446, false );
    
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

    return winHandle;
}

function windowPropertiesAddTab( winHandle, caption, id ) {
    
    var tabPane = $('<div class="window-properties-tab-pane" id="' + id + '"></div>');
    $(winHandle).find( '.window-properties-tabs' ).append( tabPane );

    var tab = '<li class="window-properties-tab-tab"><a href="#' + id + '">' + caption + '</a></li>';
    var tabs = $(winHandle).find( '.window-properties-tabs > ul' ).append( tab );

    return tabPane;
}

function desktopCreateIcon( text, imgPath, imgX, imgY, x, y, callback, container='#desktop' ) {
    var icoWidth = 32;
    var icoHeight = 32;
    
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
    $(iconWrapper).draggable( {'handle': '.desktop-icon-overlay'/* , 'containment': container */ } );

    /* Setup action handlers. */
    $(iconWrapper).mousedown( function() {
        desktopSelectIcon( container, this );
    } );
    $(iconWrapper).dblclick( callback );

    return iconWrapper;
}

function desktopSelectIcon( container, icon ) {

    /* Deselect all icons. */
    $(container).children('.desktop-icon').removeClass( 'desktop-icon-selected' );
    $(container).children('.desktop-icon').each( function( idx, iterIcon ) {
        console.log( $(iterIcon).data( 'icon-bg' ) );
        $(iterIcon).children( '.desktop-icon-img' ).css(
            'background', $(iterIcon).data( 'icon-bg' ) );
    } );

    if( null == icon ) {
        /* No icon to select, do just leave it at that. */
        return;
    }

    /* Select this icon. */
    $(icon).addClass( 'desktop-icon-selected' );
    console.log( 'linear-gradient(to bottom, rgba(0, 0, 127, 0.3), rgba(0, 0, 127, 0.3)),' + $(icon).data( 'icon-bg' ) );
    $(icon).children( '.desktop-icon-img' ).css(
        'background', 'linear-gradient(to bottom, rgba(0, 0, 127, 0.3), rgba(0, 0, 127, 0.3)),' +
        $(icon).data( 'icon-bg' ) );
}

function menuPopup( container, items, x, y ) {

    var menu = $('<div class="menu"></div>');
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
} );
