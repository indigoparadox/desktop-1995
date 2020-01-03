
function openWindow( caption, id=null, resizable=false, icoImg=null, x=0, y=0 ) {
    
    var winOuter = $('<div class="window-outer window-active"></div>');
    if( null != id ) {
        winOuter.attr( 'id', id );
    }
    $('#desktop').append( winOuter );

    var winInner = $('<div class="window-inner"><form class="window-form"></form></div>');
    $(winOuter).append( winInner );
    winOuter.draggable( {'handle': '.titlebar'} );
    if( resizable ) {
        winInner.resizable();
    }

    var titlebar = $('<div class="titlebar"><h1 class="titlebar-text">' + caption + '</h1></div>');
    $(winInner).prepend( titlebar );

    /* Add the window icon. */
    var icon = $('<div class="titlebar-icon"></div>');
    $(titlebar).prepend( icon );
    icon.css( 'background', 'url(' + staticPath + icoImg + 
        ') right ' + x.toString() + 'px bottom ' + y.toString() + 'px' );

    /* Add the window close button. */
    var btnClose = $('<button class="titlebar-close">X</button>');
    $(titlebar).append( btnClose );
    $(btnClose).click( function() {
        $(winOuter).remove();
    } );

    return winOuter;
}

function windowCreateInputText( win, label, value='', x='auto', y='auto' ) {

    /* Create a wrapper for the 3D chisel effect. */
    var wrapper = $('<div class="input-text-wrapper"></div>');
    var input = $('<input type="text" value="' + value + '" />');
    $(win).find( '.window-form' ).append( wrapper );
    $(wrapper).append( input );

    if( 'auto' != x ) {
        $(wrapper).css( 'left', x );
    }

    if( 'auto' != y ) {
        $(wrapper).css( 'top', y );
    }
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
    $(iconWrapper).draggable( {'handle': '.desktop-icon-overlay' } );

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

function desktopPopupMenu( container, items, x, y ) {
        
    var menuOuter = $('<div class="menu-outer"></div>');
    $('#desktop').append( menuOuter );
    menuOuter.css( 'left', x.toString() + 'px' );
    menuOuter.css( 'top', y.toString() + 'px' );

    var menuInner = $('<div class="menu-inner"></div>');
    menuOuter.append( menuInner );

    for( var i = 0 ; items.length > i ; i++ ) {
        var menuItem = null;
        if( 'divider' in items[i] && items[i].divider ) {
            menuItem = $('<hr />');
        } else {
            menuItem = $('<a href="#" class="menu-item">' + items[i].text + '</a>');
            menuCallback = items[i].callback;
            menuItem.click( function( e ) {
                menuCallback( menuItem );
                desktopCloseMenu( container, menuOuter );
                e.preventDefault();
            } );
        }
        menuInner.append( menuItem );
    }

    return menuOuter;
}

function desktopCloseMenu( container, menu ) {
    if( null != menu ) {
        menu.remove();
    } else {
        /* Close all menus in this container. */
        $(container).children( '.menu-outer' ).each( function( idx, menuIter ) {
            desktopCloseMenu( container, menuIter );
        } );
    }
}

$(document).ready( function() {
} );
