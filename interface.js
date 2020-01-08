
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
                $(winHandle).window95( 'close' );
            }}
        ];

        menuClose( $(winHandle), null );
        menuPopup( $(winHandle), menu,
            e.pageX - $(winHandle).offset().left,
            e.pageY - $(winHandle).offset().top );
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
            winHandle.browser95( 'go', { 'url': favorite.url } );
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

function windowOpenFolder( options ) {

    options.menu = [
        {'text': 'File', 'children': [
            {'text': 'Close', 'callback': function( m ) {
                winHandle.window95( 'close' );
            }}
        ]}
    ];
    options.show = false;

    var winHandle = $('#desktop').window95( 'open', options );

    console.log( winHandle );
    console.assert( winHandle.attr( 'id' ) == options.id );
    
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
}

function windowOpenWordpad( caption, id=null, icoImg=null, icoX=0, icoY=0, url='', x=0, y=0, w=480, h=260 ) {
    var winHandle = windowOpen( caption, id, true, icoImg, icoX, icoY, null, x, y, w, h, false );
    
    menu = [
        {'text': 'File', 'children': [
            {'text': 'New Window', 'callback': function( m ) {
                windowOpenBrowser( caption, id + '-new', icoImg, icoX, icoY, url, favorites, x + 20, y + 20, w, h );
            }},
            {'divider': true},
            {'group': true, 'id': 'browser-recent'},
            {'text': 'Exit', 'callback': function( m ) {
                windowClose( winHandle );
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

    console.log( url );
    $.get( url, function( data ) {
        text.text( data );
    
        winHandle.show();
        winHandle.window95( 'activate' );
    } );

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
    // Build the start menu if one is provided.
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
                windowClose( winHandle );
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
