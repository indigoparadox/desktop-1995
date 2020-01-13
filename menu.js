
const menu95Location = {
    'CURSOR': 'cursor',
    'RIGHT': 'right',
    'TOP': 'top',
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

// Private function.
var _menuPopulate = function( menu, menuSettings ) {
    // Iterate the list of menu items and append them to the provided menu.
    for( var i = 0 ; settings.items.length > i ; i++ ) {

        var itemSettings = $.extend( {
            'caption': '',
            'id': null,
            'type': menu95Type.ITEM,
        }, menuSettings.items[i] );

        var menuElement = null;

        // Close other menus at the root level before opening this one.
        if( null != menuSettings.menubarRoot ) {
            menuClose( menuSettings.menubarRoot );
        }

        console.log( itemSettings );

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
            //_menuAssignItemChildren( 
            //    container, menuElement, itemSettings.children, true, menubarRoot );
            break;
            
        case menu95Type.ITEM:
            menuElement = $('<a href="#" class="menu-item"><span class="menu-icon"></span>' +
                itemSettings.caption + '</a>');
            menuElement.addClass( 'menu-item-' + _htmlStrToClass( itemSettings.caption ) );
            
            //_menuAssignItemCallback( container, menuElement, items[i].callback );
            break;
        }

        if( null != itemSettings.id ) {
            menuElement.attr( 'id', itemSettings.id );
        }

        console.log( menuElement );

        menu.append( menuElement );
    }
};

var settings = $.extend( {
    'caption': '',
    'id': null,
    'parentClass': null,
    'items': [],
    'classes': [],
    'show': true,
    'caller': null,
    'location': menu95Location.CURSOR,
    'menubarRoot': null,
    'type': menu95Type.SUBMENU,
    'x': 0,
    'y': 0,
    'w': 0,
    'h': 0,
}, options );

switch( action.toLowerCase() ) {

case 'open':

    var menu = $('<div class="menu"></div>');
    if( !settings.show ) {
        menu.hide();
    }

    this.append( menu );
    
    switch( settings.location ) { 
    case menu95Location.RIGHT:
        menu.css( 'left', '0' );
        menu.css( 'top', '0' );
        break;
    default:
        menu.css( 'left', settings.location.x.toString() + 'px' );
        menu.css( 'top', settings.location.y.toString() + 'px' );
    }

    menu.data( 'caller', settings.caller );
    if( null != menu.data( 'caller' ) ) {
        menu.data( 'caller' ).addClass( 'menu-caller-active' );
    }

    _menuPopulate( menu, settings );
    
    return menu;

}; }; }( jQuery ) );