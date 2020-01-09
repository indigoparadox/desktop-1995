
(function( $ ) {
$.fn.control95 = function( control, action='create', options ) {

var settings = $.extend( {
    'caption': '',
    'id': null,
    'parentClass': null,
    'classes': [],
    'icon': null
}, options );

switch( control.toLowerCase() ) {

case 'tab':
    return this.each( function( idx, winHandle ) {
        console.assert( null != settings.id );
        console.assert( 0 >= $('#' + settings.id).length );

        var tabPane = $('<div class="' + settings.parentClass + '-pane"></div>');
        tabPane.attr( 'id', settings.id )
        $(winHandle).find( '.' + settings.parentClass ).append( tabPane );

        var tab = '<li class="' + settings.parentClass + '-tab"><a href="#' + 
            settings.id + '">' + settings.caption + '</a></li>';
        $(winHandle).find( '.' + settings.parentClass + ' > ul' ).append( tab );

        return tabPane;
    } );

case 'statusbar':
    return 'destroy' == action ? this.each( function( idx, winHandle ) {
        $(winHandle).children( '.statusbar' );
        $(winHandle).removeClass( 'window-statusbar' );
    } ) : this.each( function( idx, winHandle ) {
        $(winHandle).addClass( 'window-statusbar' );
        var statusBarHandle = $('<div class="statusbar"></div>');
        $(winHandle).append( statusBarHandle );
    } );

case 'toolbar':
    if( 'destroy' == action ) {
        this.removeClass( 'window-toolbar' );
        return this.children( '.toolbar' ).remove();
    } else if( 'create' == action ) {
        this.addClass( 'window-toolbar' );
        var toolBarHandle = $('<div class="toolbar"></div>');
        toolBarHandle.insertBefore( this.children( '.window-form' ) );
        return toolBarHandle;
    }
    return this;

case 'button':
    return 'destroy' == action ? this.each( function( idx, toolbar ) {

    } ) : this.each( function( idx, toolbar ) {
        console.log( settings );
        var btn = $('<button class="input-button"></button>');
        $(toolbar).append( btn );
        if( null != settings.icon ) {
            var icoSpan = $('<span class="toolbar-button-icon"></span>');
            icoSpan.css( 'background', 'url(' + staticPath + settings.icon.icoImg + 
            ') right ' + settings.icon.icoX.toString() + 'px bottom ' + settings.icon.icoY.toString() + 'px' );
            btn.append( icoSpan );
        }
        if( null != settings.contents ) {
            btn.append( settings.contents );
        }
        if( null != settings.id ) {
            btn.attr( 'id', settings.id );
        }
        for( var i = 0 ; settings.classes.length > i ; i++ ) {
            btn.addClass( settings.classes[i] );
        }
        
        // Attach callback if there is one.
        if( null != settings.callback ) {
            btn.click( function( e ) {
                settings.callback( e );
                e.preventDefault();
            }, settings.cbData );
        }
    } );

}; }; }( jQuery ) );
