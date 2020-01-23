
(function( $ ) {
    $.fn.paint95 = function( action, options ) {
    
    var settings = $.extend( {
        'caption': 'Paint',
        'id': null,
        'resizable': true,
        'menu': null,
        'x': 10,
        'y': 10,
        'w': 480,
        'h': 260,
        'canvasW': 300,
        'canvasH': 300,
        'url': null,
        'contents': null
    }, options );
    
    switch( action.toLowerCase() ) {
    case 'readurl':
        return this.each( function( idx, winHandle ) {
            $.get( settings.url, function( data ) {
                $(winHandle).find( '.input-textarea' ).text( data );
            } );
        } );
    
    case 'readcontents':
        return this.each( function( idx, winHandle ) {
            $(winHandle).find( '.input-textarea' ).text( settings.contents );
        } );
    
    case 'open':
    
        settings.menu = null;
        settings.show = false;
        settings.icon = 'bmp';
    
        var winHandle = this.window95( 'open', settings );
        
        menu = {
            'type': menu95Type.MENUBAR,
            'caller': winHandle,
            'container': winHandle,
            'items': [
                {'caption': 'File', 'type': menu95Type.SUBMENU, 'items': [
                    {'caption': 'New Window', 'callback': function( m ) {
                        settings.id = settings.id + 'n';
                        this.notepad95( 'open', settings );
                    }},
                    {'type': menu95Type.DIVIDER},
                    {'group': true, 'id': 'browser-recent'},
                    {'caption': 'Exit', 'callback': function( m ) {
                        winHandle.window95( 'close' );
                    }}
                ]},
                {'caption': 'Edit', 'type': menu95Type.SUBMENU, 'items': [
                    {'caption': 'Undo', 'callback': function( m ) {
                    }},
                    {'type': menu95Type.DIVIDER},
                    {'caption': 'Cut', 'callback': function( m ) {
                    }},
                    {'caption': 'Copy', 'callback': function( m ) {
                    }},
                    {'caption': 'Paste', 'callback': function( m ) {
                    }},
                    {'caption': 'Delete', 'callback': function( m ) {
                    }},
                    {'type': menu95Type.DIVIDER},
                    {'caption': 'Select All', 'callback': function( m ) {
                    }},
                    {'caption': 'Time/Date', 'callback': function( m ) {
                    }},
                    {'type': menu95Type.DIVIDER},
                    {'caption': 'Word Wrap', 'callback': function( m ) {
                    }}
                ]},
                {'text': 'View', 'children': [
                ]},
                {'text': 'Search', 'children': [
                ]},
                {'text': 'Help', 'children': [
                ]}
            ]
        };
    
        // Add the menu now, once winHande is defined, so callbacks above have it
        // in scope.
        winHandle.menu95( 'open', menu );
    
        winHandle.addClass( 'window-paint' );
    
        // This window type still uses wrappers because the pseudo-elements are 
        // rather prone to yet-unexplainable misbehaviors.
        /*var wrapper = $('<div class="textarea-wrapper"></div>');
        winHandle.children( '.window-form' ).append( wrapper );
    
        var text = $('<textarea class="input-textarea"></textarea>');
        wrapper.append( text );*/

        canvas = $('<canvas class="paint-canvas" width="' + settings.canvasW.toString() + '" height="' +
            settings.canvasH.toString() + '"></canvas>');
        winHandle.children( '.window-form' ).append( canvas );
    
        winHandle.addClass( 'window-scroll-contents' );
        winHandle.removeClass( 'window-hidden' );

        var ctx = canvas[0].getContext( '2d' );

        // Background
        ctx.fillstyle = '#ffffff';
        ctx.fillRect( 0, 0, settings.canvasW, settings.canvasH );

        // Foreground
        ctx.fillstyle = '#000000';

        canvas.mousedown( function( e ) {
            $(e.target).data( 'painting', true );
        } );

        canvas.mousemove( function( e ) {
            if( $(e.target).data( 'painting' ) ) {
                ctx.fillRect( e.pageX - canvas.offset().left, e.pageY - canvas.offset().top, 1, 1 );
            }
        } );

        canvas.mouseup( function( e ) {
            $(e.target).data( 'painting', false );
        } );
    
        /*
        if( null != settings.url ) {
            winHandle.notepad95( 'readurl', settings );
        } else if( null != settings.contents ) {
            winHandle.notepad95( 'readcontents', settings );
        }
        */
    
        winHandle.window95( 'activate' );
    
        return winHandle;
    }; }; }( jQuery ) );
    