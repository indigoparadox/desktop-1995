
(function( $ ) {
$.fn.control95 = function( control, action='create', options ) {

var settings = $.extend( {
    'caption': '',
    'id': null,
    'parentClass': null,
    'classes': [],
    'icon': null,
    'callback': null,
    'w': 0,
    'h': 0,
}, options );

switch( control.toLowerCase() ) {

case 'tab':
    if( 'create' == action ) {
        console.assert( null != settings.id );
        console.assert( 0 >= $('#' + settings.id).length );

        var tabPane = $('<div class="' + settings.parentClass + '-pane"></div>');
        tabPane.attr( 'id', settings.id )
        this.find( '.' + settings.parentClass ).append( tabPane );

        var tab = '<li class="' + settings.parentClass + '-tab"><a href="#' + 
            settings.id + '">' + settings.caption + '</a></li>';
        this.find( '.' + settings.parentClass + ' > ul' ).append( tab );

        return tabPane;
    }

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

case 'toolbardivider':
    var divider = $('<div class="toolbar-divider"></div>');
    this.children( '.toolbar' ).append( divider );
    return divider;

case 'toolbarbutton':
    settings.w = 20;
    settings.h = 20;
    return this.children( '.toolbar' ).control95( 'button', action, settings );

case 'button':
    if( 'destroy' == action ) {

    } else if( 'create' == action ) {
        var btn = $('<button class="input-button">' + settings.caption + '</button>');
        this.append( btn );
        if( null != settings.icon ) {
            var icoSpan = $('<span class="toolbar-button-icon"></span>');
            icoSpan.css(
                'background', 'url(' + staticPath + settings.icon.icoImg + 
                ') right ' + settings.icon.icoX.toString() + 'px bottom ' +
                settings.icon.icoY.toString() + 'px' );
            btn.append( icoSpan );
        }
        if( null != settings.id ) {
            btn.attr( 'id', settings.id );
        }
        for( var i = 0 ; settings.classes.length > i ; i++ ) {
            btn.addClass( settings.classes[i] );
        }
        if( 0 < settings.w ) {
            btn.css( 'width', settings.w.toString() + 'px' );
        }
        if( 0 < settings.h ) {
            btn.css( 'height', settings.h.toString() + 'px' );
        }
        
        // Attach callback if there is one.
        if( null != settings.callback ) {
            btn.click( function( e ) {
                settings.callback( e );
                e.preventDefault();
            }, settings.cbData );
        }
    }
    return btn;

case 'scrubber':
    if( 'destroy' == action ) {
        return this.each( function( idx, winHandle ) {

        } );

    } else if( 'create' == action ) {
        return this.each( function( idx, winHandle ) {
            var scrubber = $('<div class="scrubber-wrapper"><div class="scrubber-timeline"></div><div class="scrubber-controlbar"></div></div>');

            $(winHandle).append( scrubber );
        } );
    
    } else if( 'scrub' == action ) {


    }


}; }; }( jQuery ) );
