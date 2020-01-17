
/* Internal Utility Functions */

// Again, a named function to isolate the closure scope, designed to be called
// from a loop below.
function _browserFavoritesMenuAdd( winHandle, menu, favorite ) {
    menu.push( {
        'text': favorite.name,
        'callback': function( m ) {
            winHandle.browser95( 'go', { 'url': favorite.url } );
        }
    } );
}

function _htmlStrToClass( input ) {
    return input.replace( /[ "\'!@#:$%\^&\*\(\)\.,]/g, '' ).replace( / /g, '-' ).toLowerCase();
}

function _htmlEncode( input ) {
    return input.replace( /[\u00A0-\u9999<>\&]/gim, function( c ) {
        return '&#' + c.charCodeAt( 0 ) + ';';
    } );
}

function _htmlEntities( text ) {
    return String( text )
        .replace( /&/g, '&amp;' )
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' )
        .replace( /"/g, '&quot;' );
}

function _htmlCharSVG( u ) {
    var svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="header" viewBox="0 0 20 30">
<defs></defs><g id="0" visibility="visible">
<text id="gText_11081308229940" name="-1" x="0" y="12"  
    font="Arial"  rotate="0" horizAnchor="middle" vertAnchor="middle" 
    scale="4,4" width="1" stroke="0x000000">` + u + `</text> 
</g></svg>`;
    return svg;
}

/* Public Functions */

