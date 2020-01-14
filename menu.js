
const menu95Location = {
    'CURSOR': 'cursor',
    'RIGHT': 'right',
    'TOP': 'top',
    'BOTTOM': 'bottom',
};

const menu95Type = {
    'ITEM': 'item',
    'DIVIDER': 'divider',
    'GROUP': 'group',
    'SUBMENU': 'submenu',
    'MENUBAR': 'menubar',
};

(function( $ ) {
$.fn.menu95 = function( action, options ) {

var menuSettings = $.extend( {
    'caption': '',
    'id': null,
    'items': [],
    'classes': [],
    'show': true,
    'caller': null,
    'location': menu95Location.BOTTOM,
    'menubarRoot': null,
    'container': null,
    'type': menu95Type.SUBMENU,
}, options );

/* This wrapper function limits the scope of the onClick handler closure, so
 * that the callback set for the last assigned menu item in a loop isn't
 * also inadvertantly assigned to all previous menu items handled in that loop
 * due to the changing value of i in the loop control.
 */
var _menuBuildItem = function( itemOptions ) {
    var itemSettings = $.extend( {
        'caption': '',
        'id': null,
        'type': menu95Type.ITEM,
        'location':  null == menuSettings.menubarRoot ? menu95Location.RIGHT : menu95Location.BOTTOM,
        'menubarRoot': menuSettings.menubarRoot,
        'container': menuSettings.container,
    }, itemOptions );

    var menuElement = null;

    // Close other menus at the same level before opening this one.
    $(menuSettings.caller).siblings( '.menu-item' ).each( function() {
        if( null != $(this).data( 'submenu-element' ) ) {
            $($(this).data( 'submenu-element' )).menu95( 'close' );
        }
    } );

    switch( itemSettings.type ) {
    case menu95Type.DIVIDER:
        menuElement = $('<hr />');
        break;

    case menu95Type.GROUP:
        menuElement = $('<div class="menu-group""></div>');
        break;

    case menu95Type.SUBMENU:
        menuElement = $('<a href="#" class="menu-item"><span class="menu-icon"></span>' +
             itemSettings.caption + '</a>');
        menuElement.addClass( 'menu-item-' + _htmlStrToClass( itemSettings.caption ) );
        menuElement.addClass( 'menu-parent' );

        menuElement.data( 'submenu-element', null );
        itemSettings.caller = menuElement;

        // Setup submenu open handlers.
        menuElement.mouseover( function( e ) {
            if( 
                menuElement.parent().hasClass( 'menubar' ) ||
                menuElement.hasClass( 'menu-caller-active' )
            ) {
                return;
            }
            menuElement.menu95( 'open', itemSettings );
        } );
        menuElement.click( function( e ) {
            if( menuElement.hasClass( 'menu-caller-active' ) ) {
                return;
            }
            menuElement.menu95( 'open', itemSettings );
        } );
        break;
        
    case menu95Type.ITEM:
        menuElement = $('<a href="#" class="menu-item"><span class="menu-icon"></span>' +
            itemSettings.caption + '</a>');
        menuElement.addClass( 'menu-item-' + _htmlStrToClass( itemSettings.caption ) );
        
        menuElement.click( function( e ) {
            itemSettings.callback( itemSettings );
            $(itemSettings.container).menu95( 'close' );
            e.preventDefault();
        } );
        break;
    }

    if( null != itemSettings.id ) {
        menuElement.attr( 'id', itemSettings.id );
    }

    return menuElement;
};

switch( action.toLowerCase() ) {

case 'close':
    return this.each( function() {
        if( $(this).hasClass( 'menu' ) ) {
            // TODO: Close children, as well.
            if( null != $(this).data( 'caller' ) ) {
                $($(this).data( 'caller' )).data( 'submenu-element', null );
                $($(this).data( 'caller' )).removeClass( 'menu-caller-active' );
            }
            $(this).remove();
        } else {
            // Close all menus in this container.
            $(this).find( '.menu' ).each( function( idx, menuIter ) {
                $(this).menu95( 'close' );
            } );
        }
    } );

case 'open':

    var menu = $('<div></div>');
    if( menu95Type.MENUBAR == menuSettings.type ) {
        menuSettings.menubarRoot = menu;
    }
    
    if( !menuSettings.show ) {
        menu.hide();
    }

    menu.data( 'caller', menuSettings.caller );
    if( null != menu.data( 'caller' ) ) {
        $(menu.data( 'caller' )).addClass( 'menu-caller-active' );
        $(menu.data( 'caller' )).data( 'submenu-element', menu );
    }

    // Add classes.
    for( var i = 0 ; menuSettings.classes.length > i ; i++ ) {
        menu.addClass( menuSettings.classes[i] );
    }

    // Iterate the list of menu items and append them to the menu.
    for( var i = 0 ; menuSettings.items.length > i ; i++ ) {

        menuElement = _menuBuildItem( menuSettings.items[i] );

        menu.append( menuElement );
    }
    
    // Set the location of this menu.
    if( menu95Type.MENUBAR == menuSettings.type ) {
        menu.addClass( 'menubar' );
        this.addClass( 'window-menubar' );
        $(menuSettings.container).prepend( menu );

    } else {
        menu.addClass( 'menu' );
        $(menuSettings.container).append( menu );

        var containerLeft = $(menuSettings.container).offset().left;
        var containerTop = $(menuSettings.container).offset().top;
        var callerLeft = 0;
        var callerTop = 0;
        if( null != menuSettings.caller ) {
            callerLeft = $(menuSettings.caller).offset().left;
            callerTop = $(menuSettings.caller).offset().top;
        }
        var callerWidth = $(menuSettings.caller).outerWidth();
        var callerHeight = $(menuSettings.caller).outerHeight();
    
        switch( menuSettings.location ) { 
        case menu95Location.RIGHT:
            menu.css( 'left', (callerLeft + callerWidth) - containerLeft );
            menu.css( 'top', callerTop - containerTop );
            break;

        case menu95Location.TOP:    
            menu.css( 'left', $(menuSettings.caller).offset().left );
            menu.css( 'top', (callerTop - menu.outerHeight()) - containerTop );
            break;

        case menu95Location.BOTTOM:    
            menu.css( 'left', callerLeft - containerLeft );
            menu.css( 'top', (callerTop + callerHeight) - containerTop );
            break;

        default:
            menu.css( 'left', menuSettings.location.x.toString() + 'px' );
            menu.css( 'top', menuSettings.location.y.toString() + 'px' );
        }
    }

    return menu;

}; }; }( jQuery ) );
