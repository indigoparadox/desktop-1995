
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
    'EVENTMENU': 'eventmenu',
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
    'root': null,
    'path': null != options && null != options.caption ? options.caption : '',
    'callback': null,
    'cbData': null,
    'iconImg16': null,
    'iconX16': null,
    'iconY16': null,
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

    var menuIcon = $('<span class="menu-icon"></span>');
    console.log( settings );
    if( null != settings.iconImg16 ) {
        var bgURL = 'url(' + staticPath + settings.iconImg16 + 
            ') right ' + settings.iconX16.toString() + 'px bottom ' + settings.iconY16.toString() + 'px';
        menuIcon.css( 'background', bgURL );
    }

    switch( settings.type ) {
    case menu95Type.DIVIDER:
        menuElement = $('<hr />');
        break;

    case menu95Type.GROUP:
        menuElement = $('<div class="menu-group""></div>');
        break;

    case menu95Type.SUBMENU:
        menuElement = $('<a href="#" class="menu-item"></span>' +
            settings.caption + '</a>');
        menuElement.addClass( 'menu-item-' + _htmlStrToClass( settings.caption ) );
        menuElement.addClass( 'menu-parent' );
        menuElement.prepend( menuIcon );

        menuElement.data( 'submenu-element', null );

        // The menu that we open below has this menu element as a caller.
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

            // Open the new menu using the new settings.
            menuElement.menu95( 'open', settings );
        } );
        menuElement.click( function( e ) {
            if( menuElement.hasClass( 'menu-caller-active' ) ) {
                return;
            }

            // Open the new menu using the new settings.
            menuElement.menu95( 'open', settings );
        } );
        break;

    case menu95Type.EVENTMENU:
        menuElement = $('<a href="#" class="menu-item"></span>' +
            settings.caption + '</a>');
        menuElement.addClass( 'menu-item-' + _htmlStrToClass( settings.caption ) );
        menuElement.addClass( 'menu-parent' );
        menuElement.prepend( menuIcon );

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

            // Call the custom menu event for this menu.
            settings.type = menu95Type.SUBMENU;
            $(settings.root).trigger( 'menu', [menuElement, settings] );
        } );
        menuElement.click( function( e ) {
            if( menuElement.hasClass( 'menu-caller-active' ) ) {
                return;
            }
            settings.type = menu95Type.SUBMENU;
            $(settings.root).trigger( 'menu', [menuElement, settings] );
        } );
        break;
        
    case menu95Type.ITEM:
        menuElement = $('<a href="#" class="menu-item">' + settings.caption + '</a>');
        menuElement.addClass( 'menu-item-' + _htmlStrToClass( settings.caption ) );
        menuElement.prepend( menuIcon );
        
        menuElement.click( function( e ) {
            settings.data = settings.cbData;
            settings.callback( settings );
            $(settings.container).menu95( 'close' );
            e.preventDefault();
        } );
        break;
    }

    if( null != settings.icoImg ) {
        menuElement.css( 'background', 'url (' + settings.icoImg + ')' );
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

    var menuClassname = 'menu-menu-' + _htmlStrToClass( settings.caption );
    
    if( !settings.show ) {
        menu.hide();
    }

    // The caller is the menu item that triggered opening this menu box (parent).
    menu.data( 'caller', settings.caller );
    if( null != menu.data( 'caller' ) ) {
        $(menu.data( 'caller' )).addClass( 'menu-caller-active' );
        $(menu.data( 'caller' )).data( 'submenu-element', menu );
    }

    // The root is the element that triggered opening all of this box's parents.
    if( null == settings.root ) {
        settings.root = settings.caller;
    }
    menu.data( 'root', settings.root );

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
        settings.items[i].root = settings.root;
        settings.items[i].path = settings.path + '/' + settings.items[i].caption;
        menuElement = menu.menu95( 'item', settings.items[i] );
    }
    
    // Set the location of this menu.
    if( menu95Type.MENUBAR == settings.type ) {
        menu.addClass( 'menubar' );
        this.addClass( 'window-menubar' );
        $(settings.container).prepend( menu );

    } else {
        menu.addClass( 'menu' );
        menu.addClass( menuClassname );
        $(settings.container).append( menu );

        var containerLeft = $(settings.container).offset().left;
        var containerTop = $(settings.container).offset().top;
        var callerLeft = 0;
        var callerTop = 0;
        if( null != settings.caller ) {
            callerLeft = $(settings.caller).offset().left;
            callerTop = $(settings.caller).offset().top - 2;
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
