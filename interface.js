
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
    $(item).mouseenter( function( e ) {
        if( $(this).hasClass( 'menu-expanded' ) ) {
            return;
        }
        $(this).addClass( 'menu-expanded' );
        
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
    $(item).mouseleave( function( e ) {
        menuClose( item );
    } );
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

