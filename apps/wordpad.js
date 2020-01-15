
function _wordpadFormatText( text ) {

    var lines = text.split( /[\r\n]/g );
    var newText = '';

    // State flags.
    var prevLineIsList = false;
    
    for( var i = 0 ; lines.length > i ; i++ ) {
        
        var newLine = lines[i];
        var lineIsList = false;

        newLine = newLine.replace( /^ \* (.*)/g,
            function( match, $1, offset, original ) {
                var out = '<li>' + $1 + '</li>';
                if( !prevLineIsList ) {
                    // A list is beginning.
                    out = '<ul>' + out;
                }
                prevLineIsList = true;
                lineIsList = true;
                return out;
            } );

        if( !lineIsList ) {
            // If line isn't anything, it's a paragraph.
            newLine = '<p>' + newLine + '</p>';
        }

        if( prevLineIsList && !lineIsList ) {
            // Close the list.
            newLine = '</ul>' + newLine;
        }

        newText += newLine;
    }
    
    return newText;
}

(function( $ ) {
$.fn.wordpad95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Wordpad',
    'id': null,
    'resizable': true,
    'icoImg': null,
    'icoX': 0,
    'icoY': 0,
    'menu': null,
    'x': 10,
    'y': 10,
    'w': 480,
    'h': 260,
    'url': null,
    'contents': null,
    'buttonImgs': {},
    'callback': null,
    'cbData': null
}, options );

switch( action.toLowerCase() ) {
case 'readurl':
    return this.each( function( idx, winHandle ) {
        $.get( settings.url, function( data ) {
            $(winHandle).find( '.input-rtf' ).html( _wordpadFormatText( data ) );
        } );
    } );

case 'readcontents':
    return this.each( function( idx, winHandle ) {
        $(winHandle).find( '.input-rtf' ).html( _wordpadFormatText( settings.contents ) );
    } );

case 'newfile':
    return this.each( function( idx, winHandle ) {
        // Clear the window ID (while not colliding with siblings).
        var desktop = $(winHandle).parent();
        $(winHandle).attr( 'id', desktop.window95( 'nextFreeId',
            {'id': 'wordpad-new'} ) );

        // Clear document data.
        $(winHandle).find( '.input-rtf' ).html( '' );
    } );

case 'open':

    settings.menu = null;
    settings.show = false;

    var winHandle = this.window95( 'open', settings );
    
    menu = {
        'type': menu95Type.MENUBAR,
        'caller': winHandle,
        'container': winHandle,
        'items': [
            {'caption': 'File', 'type': menu95Type.SUBMENU, 'items': [
                {'caption': 'New...', 'callback': function( m ) {
                    winHandle.wordpad95( 'newfile' );
                }},
                {'type': menu95Type.DIVIDER},
                {'type': menu95Type.GROUP, 'id': 'browser-recent'},
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
            {'caption': 'View', 'type': menu95Type.SUBMENU, 'children': [
            ]},
            {'caption': 'Insert', 'type': menu95Type.SUBMENU, 'children': [
            ]},
            {'caption': 'Format', 'type': menu95Type.SUBMENU, 'children': [
            ]},
            {'caption': 'Help', 'type': menu95Type.SUBMENU, 'children': [
            ]}
        ]
    };

    // Add the menu now, once winHande is defined, so callbacks above have it
    // in scope.
    winHandle.menu95( 'open', menu );

    winHandle.addClass( 'window-wordpad' );

    var sb = winHandle.control95( 'statusbar', 'create' );
    sb.children( '.statusbar' ).text( 'For Help, press F1' );

    var tb = winHandle.control95( 'toolbar', 'create' );
    var btnNew = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.new, 'callback':
        function( e ) { winHandle.wordpad95( 'newfile' ); } } );

    var btnOpen = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.open, 'callback':
    function( e ) {  } } );

    var btnSave = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.save, 'callback':
    function( e ) {  } } );

    winHandle.control95( 'toolbarDivider', 'create' );

    var btnPrint = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.print, 'callback':
    function( e ) {  } } );

    var btnPreview = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.preview, 'callback':
    function( e ) {  } } );

    winHandle.control95( 'toolbarDivider', 'create' );
    
    var btnSearch = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.search, 'callback':
    function( e ) {  } } );

    winHandle.control95( 'toolbarDivider', 'create' );

    var btnCut = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.cut, 'callback':
    function( e ) {  } } );

    var btnCopy = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.copy, 'callback':
    function( e ) {  } } );

    var btnPaste = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.paste, 'callback':
    function( e ) {  } } );

    var btnUndo = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.undo, 'callback':
    function( e ) {  } } );

    winHandle.control95( 'toolbarDivider', 'create' );

    var btnDateTime = winHandle.control95( 'toolbarButton', 'create', { 'icon': settings.buttonImgs.dateTime, 'callback':
    function( e ) {  } } );

    // This window type still uses wrappers because the pseudo-elements are 
    // rather prone to yet-unexplainable misbehaviors.
    var wrapper = $('<div class="textarea-wrapper inset"></div>');
    winHandle.children( '.window-form' ).append( wrapper );

    var text = $('<div class="input-rtf"></textarea>');
    text.attr( 'contenteditable', 'true' );
    wrapper.append( text );

    winHandle.addClass( 'window-scroll-contents' );
    winHandle.removeClass( 'window-hidden' );

    winHandle.window95( 'activate' );

    return winHandle;
}; }; }( jQuery ) );
