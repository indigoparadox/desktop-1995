
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

function menuPopup( container, items, x, y, show=true, caller=null ) {

    var menu = $('<div class="menu"></div>');
    if( !show ) {
        menu.hide();
    }
    $(container).append( menu );
    menu.css( 'left', x.toString() + 'px' );
    menu.css( 'top', y.toString() + 'px' );

    menu.data( 'caller', caller );
    if( null != menu.data( 'caller' ) ) {
        menu.data( 'caller' ).addClass( 'menu-caller-active' );
    }

    _menuPopulate( container, menu, items );
    
    return menu;
}

function menuClose( container, menu ) {
    if( null != menu ) {
        if( null != $(menu).data( 'caller' ) ) {
            $(menu).data( 'caller' ).removeClass( 'menu-caller-active' );
        }
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
                
            }}
        ];

        menuClose( '#desktop', null );
        var menu = menuPopup( '#desktop', menu,
            $('.button-start').offset().left,
            $('.button-start').offset().top, false, $('.button-start') );
        menu.addClass( 'logo-menu' );

        var stripe = '<div class="logo-stripe-wrapper"><div class="logo-stripe">Windows 95</div></div>';
        menu.append( stripe );

        menu.css( 'top', ($('.button-start').offset().top - menu.height() - 5).toString() + 'px' );

        menu.show();
    } );
} );
