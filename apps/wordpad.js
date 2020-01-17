
function _wordpadFormatText( text ) {

    text = _htmlEntities( text );

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

var fontsList = [
    'Arial',
    'Times New Roman',
    'Courier New'
];

var sizeList = [
    '8',
    '9',
    '10',
    '11',
    '12',
    '14',
    '16',
    '18',
    '20',
    '22',
    '24',
    '26',
    '28',
    '36',
    '48',
    '72'
];

var settings = $.extend( {
    'caption': 'Wordpad',
    'id': null,
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
    
    // Add document to documents menu.
    // TODO: Be a bit smarter about getting window ID, icons, etc.
    var found = false;
    for( var i = 0 ; documentsMenu95.length > i ; i++ ) {
        console.log( documentsMenu95[i] );
        if( documentsMenu95[i].caption == settings.url ) {
            found = true;
        }
    }
    if( !found ) {
        documentsMenu95.push( { 'caption': settings.url, 'icon': 'rtf', 'callback': function() {
            try {
                var winText = $('#desktop').wordpad95( 'open', settings );
                winText.wordpad95( 'readURL', { 'url': settings.url } );
            } catch( e ) {
                console.log( 'existing wordpad instance found.' );
            }
        } } );
    }

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
    settings.icon = 'rtf';
    settings.resizable = true;

    // We specifically do not catch the possible exceptions here.
    // Let the caller handle them.
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

    var text = $('<div class="input-rtf"></textarea>');

    var sb = winHandle.control95( 'statusbar', 'create' );
    sb.children( '.statusbar' ).text( 'For Help, press F1' );

    var tbFile = winHandle.control95( 'toolbar', 'create', {'classes': ['toolbar-file']} );
    var btnNew = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'new', 'callback':
        function( e ) { winHandle.wordpad95( 'newfile' ); } } );

    var btnOpen = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'open', 'callback':
    function( e ) {  } } );

    var btnSave = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'save', 'callback':
    function( e ) {  } } );

    tbFile.control95( 'toolbarDivider', 'create' );

    var btnPrint = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'print', 'callback':
    function( e ) {  } } );

    var btnPreview = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'preview', 'callback':
    function( e ) {  } } );

    tbFile.control95( 'toolbarDivider', 'create' );
    
    var btnSearch = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'search', 'callback':
    function( e ) {  } } );

    tbFile.control95( 'toolbarDivider', 'create' );

    var btnCut = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'cut', 'callback':
    function( e ) {  } } );

    var btnCopy = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'copy', 'callback':
    function( e ) {  } } );

    var btnPaste = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'paste', 'callback':
    function( e ) {  } } );

    var btnUndo = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'undo', 'callback':
    function( e ) {  } } );

    tbFile.control95( 'toolbarDivider', 'create' );

    var btnDateTime = tbFile.control95( 'toolbarButton', 'create', { 'icon': 'date-time', 'callback':
    function( e ) {
        
    } } );

    var tbFormat = winHandle.control95( 'toolbar', 'create', {'classes': ['toolbar-format']} );
    
    var dropFontName = tbFormat.control95( 'toolbarDropdown', 'create', {'items': fontsList } );
    dropFontName.change( function( e ) {
        text.focus();
        document.execCommand( 'fontname', false, dropFontName.children( 'option:selected' ).text() );
    } );

    tbFormat.control95( 'toolbarDivider', 'create' );

    var dropFontSize = tbFormat.control95( 'toolbarDropdown', 'create', {'items': sizeList } );
    dropFontSize.change( function( e ) {
        text.focus();
        document.execCommand( 'fontsize', false, parseInt( dropFontSize.children( 'option:selected' ).text() ) );
    } );

    tbFormat.control95( 'toolbarDivider', 'create' );

    var btnBold = tbFormat.control95( 'toolbarButton', 'create', {'caption': 'B', 'classes':['button-bold'], 'callback':
    function( e ) {
        text.focus();
        document.execCommand( 'bold' );
    } } );

    var btnItalic = tbFormat.control95( 'toolbarButton', 'create', {'caption': 'I', 'classes':['button-italic'], 'callback':
    function( e ) {
        text.focus();
        document.execCommand( 'italic' );
    } } );

    var btnUnderline = tbFormat.control95( 'toolbarButton', 'create', {'caption': 'U', 'classes':['button-underline'], 'callback':
    function( e ) {
        text.focus();
        document.execCommand( 'underline' );
    } } );

    tbFormat.control95( 'toolbarDivider', 'create' );

    winHandle.append( '<div class="ruler inset"></div>' );

    // This window type still uses wrappers because the pseudo-elements are 
    // rather prone to yet-unexplainable misbehaviors.
    var wrapper = $('<div class="textarea-wrapper inset"></div>');
    winHandle.children( '.window-form' ).append( wrapper );

    text.attr( 'contenteditable', 'true' );
    wrapper.append( text );

    winHandle.addClass( 'window-scroll-contents' );
    winHandle.removeClass( 'window-hidden' );

    if( null != settings.url ) {
        winHandle.wordpad95( 'readurl', settings );
    }

    winHandle.window95( 'activate' );

    return winHandle;
}; }; }( jQuery ) );
