
(function( $ ) {
$.fn.prompt95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'Prompt',
    'id': null,
    'resizable': true,
    'icoImg': null,
    'icoX': 0,
    'icoY': 0,
    'menu': null,
    'promptText': 'C:\\>',
    'x': 10,
    'y': 10,
    'w': 480,
    'h': 260,
    'lineHandler': null,
    'lineHandlerData': null,
    'text': ''
}, options );

switch( action.toLowerCase() ) {

case 'enter':
    return this.each( function( idx, winHandle ) {
        // Put the old line in the backbuffer.
        var line = $('<span class="input-line">' + settings.text + '</span>');
        var cmd = $(winHandle).children( '.window-form' );
        cmd = cmd.children( '.input-prompt' );
        cmd.children( '.backbuffer' ).append( line );
        cmd.children( '.backbuffer' ).append( '<br />' );
    } );

case 'open':

    var winHandle = this.window95( 'open', settings );

    var cmd = $('<div class="input-prompt"><div class="backbuffer"></div>' +
        '<div class="input-line-caret">' +
        '<span class="input-line"></span><div class="input-caret"></div></div></div>');

    // Add prompt text if one was provided.
    if( null != settings.promptText ) {
        cmd.children( '.input-line-caret' ).prepend(
            '<span class="prompt-text">' + settings.promptText + '</span>' );
        cmd.children( '.input-line-caret' ).data( 'prompt-text', settings.promptText );
    }

    var cmdInput = $('<input type="text" class="input-textarea" />');

    winHandle.children( '.window-form' ).append( cmd );
    winHandle.children( '.window-form' ).append( cmdInput );

    $(cmd).click( function() {
        $(cmdInput).focus();
    } );

    /* Suppress form submission. */
    $(cmdInput).keypress( function( e ) {
        if( 13 == e.keyCode ) {
            /* Don't submit form on enter. */
            e.preventDefault();
        }
    } );

    /* Handle line input. */
    $(cmdInput).keyup( function( e ) {
        if( 13 == e.keyCode ) {
            /* Enter was pressed. */

            var lineCaretBundle = $(cmd).children( '.input-line-caret' );

            $(this).val( '' ); /* Clear virtual input. */
            var prevPrompt = lineCaretBundle.children( '.prompt-text' ).remove();
            
            /* Put the old line in the backbuffer. */
            var line = $(cmd)
                .children( '.input-line-caret' )
                .children( '.input-line' )
                .remove();
            winHandle.prompt95( 'enter', { 'text': prevPrompt.text() + line.text() } );

            /* Process line input. */
            if( null != settings.lineHandler ) {
                lineHandler( settings.lineHandlerData, winHandle );
            }

            /* Create a new input line. */
            lineCaretBundle.prepend( '<span class="input-line"></span>' );
            if( 0 < prevPrompt.length ) {
                lineCaretBundle.prepend( '<span class="prompt-text">' +
                    lineCaretBundle.data( 'prompt-text' ) + '</span>' );
            }

            e.preventDefault();
        } else {
            $(cmd)
                .children( '.input-line-caret' )
                .children( '.input-line' )
                .text( $(this).val() );
        }
    } );

    winHandle.addClass( 'window-scroll-contents' );

    winHandle.addClass( 'window-command' );
    winHandle.removeClass( 'window-hidden' );
    winHandle.window95( 'activate' );

    return winHandle;
}; }; }( jQuery ) );