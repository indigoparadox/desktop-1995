
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

var settings = $.extend( {
    'caption': '',
    'id': null,
    'items': [],
    'classes': [],
    'show': true,
    'caller': null,
    'location': menu95Location.RIGHT,
    'container': this,
    'type': menu95Type.ITEM,
}, options );

switch( action.toLowerCase() ) {

case 'item':
    
    var menuElement = null;

    // Close other menus at the same level before opening this one.
    $(settings.caller).siblings( '.menu-item' ).each( function() {
        if( null != $(this).data( 'submenu-element' ) ) {
            $($(this).data( 'submenu-element' )).menu95( 'close' );
        }
    } );

    switch( settings.type ) {
    case menu95Type.DIVIDER:
        menuElement = $('<hr />');
        break;

    case menu95Type.GROUP:
        menuElement = $('<div class="menu-group""></div>');
        break;

    case menu95Type.SUBMENU:
        menuElement = $('<a href="#" class="menu-item"><span class="menu-icon"></span>' +
            settings.caption + '</a>');
        menuElement.addClass( 'menu-item-' + _htmlStrToClass( settings.caption ) );
        menuElement.addClass( 'menu-parent' );

        menuElement.data( 'submenu-element', null );
        settings.caller = menuElement;

        // Setup submenu open handlers.
        menuElement.mouseover( function( e ) {
            if( 
                menuElement.parent().hasClass( 'menubar' ) ||
                menuElement.hasClass( 'menu-caller-active' )
            ) {
                return;
            }
            menuElement.parents( '.menubar' ).each( function() {
                if( null != $(this).data( 'submenu-element' ) ) {
                    $($(this).data( 'submenu-element' )).menu95( 'close' );
                }
            } );
            menuElement.menu95( 'open', settings );
        } );
        menuElement.click( function( e ) {
            if( menuElement.hasClass( 'menu-caller-active' ) ) {
                return;
            }
            menuElement.menu95( 'open', settings );
        } );
        break;
        
    case menu95Type.ITEM:
        menuElement = $('<a href="#" class="menu-item"><span class="menu-icon"></span>' +
            settings.caption + '</a>');
        menuElement.addClass( 'menu-item-' + _htmlStrToClass( settings.caption ) );
        
        menuElement.click( function( e ) {
            settings.callback( settings );
            $(settings.container).menu95( 'close' );
            e.preventDefault();
        } );
        break;
    }

    if( null != settings.id ) {
        menuElement.attr( 'id', settings.id );
    }

    this.append( menuElement );

    return menuElement;

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
    if( menu95Type.MENUBAR == settings.type ) {
        settings.menubarRoot = menu;
    }
    
    if( !settings.show ) {
        menu.hide();
    }

    menu.data( 'caller', settings.caller );
    if( null != menu.data( 'caller' ) ) {
        $(menu.data( 'caller' )).addClass( 'menu-caller-active' );
        $(menu.data( 'caller' )).data( 'submenu-element', menu );
    }

    // Add classes.
    for( var i = 0 ; settings.classes.length > i ; i++ ) {
        menu.addClass( settings.classes[i] );
    }

    // Iterate the list of menu items and append them to the menu.
    for( var i = 0 ; settings.items.length > i ; i++ ) {
        settings.items[i].container = settings.container;
        if( menu95Type.MENUBAR == settings.type ) {
            // All immediate children of a menubar become location.BOTTOM.
            settings.items[i].location = menu95Location.BOTTOM;
        }
        settings.items[i].caller = settings.caller;
        menuElement = menu.menu95( 'item', settings.items[i] );
    }
    
    // Set the location of this menu.
    if( menu95Type.MENUBAR == settings.type ) {
        menu.addClass( 'menubar' );
        this.addClass( 'window-menubar' );
        $(settings.container).prepend( menu );

    } else {
        menu.addClass( 'menu' );
        $(settings.container).append( menu );

        var containerLeft = $(settings.container).offset().left;
        var containerTop = $(settings.container).offset().top;
        var callerLeft = 0;
        var callerTop = 0;
        if( null != settings.caller ) {
            callerLeft = $(settings.caller).offset().left;
            callerTop = $(settings.caller).offset().top;
        }
        var callerWidth = $(settings.caller).outerWidth();
        var callerHeight = $(settings.caller).outerHeight();
    
        switch( settings.location ) { 
        case menu95Location.RIGHT:
            menu.css( 'left', (callerLeft + callerWidth) - containerLeft );
            menu.css( 'top', callerTop - containerTop );
            break;

        case menu95Location.TOP:    
            menu.css( 'left', $(settings.caller).offset().left );
            menu.css( 'top', (callerTop - menu.outerHeight()) - containerTop );
            break;

        case menu95Location.BOTTOM:    
            menu.css( 'left', callerLeft - containerLeft );
            menu.css( 'top', (callerTop + callerHeight) - containerTop );
            break;

        default:
            menu.css( 'left', settings.location.x.toString() + 'px' );
            menu.css( 'top', settings.location.y.toString() + 'px' );
        }
    }

    return menu;

}; }; }( jQuery ) );
