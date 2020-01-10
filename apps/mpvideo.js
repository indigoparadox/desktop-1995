
(function( $ ) {
    $.fn.mpvideo95 = function( action, options ) {
    
    var settings = $.extend( {
        'caption': 'Video Player',
        'id': null,
        'resizable': true,
        'icoImg': null,
        'icoX': 0,
        'icoY': 0,
        'x': 10,
        'y': 10,
        'w': 480,
        'h': 260,
        'ytube': null
    }, options );
        
    switch( action.toLowerCase() ) {

case 'open':

    options.menu = null;
    options.show = false;
    options.resizable = true;

    var winHandle = this.window95( 'open', options );
    
    winHandle.addClass( 'window-mpvideo' );
        
    menu = [
        {'text': 'Disc', 'children': [
            {'group': true, 'id': 'browser-recent'},
            {'text': 'Exit', 'callback': function( m ) {
                winHandle.window95( 'close' );
            }}
        ]},
        {'text': 'View', 'children': [
        ]},
        {'text': 'Options', 'children': [
        ]},
        {'text': 'Help', 'children': [
        ]}
    ];

    // Add the menu now, once winHande is defined, so callbacks above have it
    // in scope.
    windowAddMenuBar( winHandle, menu );

    var controls = $('<div class="mpvideo-controls"></div>');

    var btnPlayPause = $('<button class="button-play disable-until-load">&#x25b6;</button>');
    controls.append( btnPlayPause );
    btnPlayPause.click( function( e ) {
        e.preventDefault();
    } );

    var btnStop = $('<button class="button-stop disable-until-load">&#x23f9</button>');
    controls.append( btnStop );
    btnStop.click( function( e ) {
        e.preventDefault();
    } );
    
    var ytube = $('<div class="mpvideo-wrapper"><iframe width="100%" height="100%" src="' +
        settings.ytube + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>')
    winHandle.children( '.window-form' ).append( ytube );
    winHandle.children( '.window-form' ).append( controls );

    winHandle.removeClass( 'window-hidden' );
    winHandle.window95( 'activate' );

    return winHandle;
}; }; }( jQuery ) );