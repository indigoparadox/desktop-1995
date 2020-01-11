
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

    var controls = $('<div class="mpvideo-controls"></div>');

    var btnPlayPause = $('<button class="button-play disable-until-load">&#x25b6;</button>');
    controls.append( btnPlayPause );

    var btnStop = $('<button class="button-stop disable-until-load">&#x23f9</button>');
    controls.append( btnStop );

    controls.control95( 'scrubber', 'create' );

    var ytube = $('<div class="mpvideo-wrapper"><div id="mpvideo-yt-' +
        settings.id + '" class="mpvideo-placeholder"></div>')

    winHandle.children( '.window-form' ).append( ytube );
    winHandle.children( '.window-form' ).append( controls );

    winHandle.removeClass( 'window-hidden' );

    console.log( settings );

    ytubePlayer = new YT.Player( 'mpvideo-yt-' + settings.id, {
        'width': '100%',
        'height': '100%',
        'videoId': settings.ytube,
        'playerVars': {
            'modestbranding': true,
            'controls': 0,
            //'autoplay': 1
        },
        'events': {
            'onReady': function() {

            }
        }
    });

    btnPlayPause.click( function( e ) {
        ytubePlayer.playVideo();
        e.preventDefault();
    } );

    btnStop.click( function( e ) {
        ytubePlayer.pauseVideo();
        e.preventDefault();
    } );

    winHandle.window95( 'activate' );

    return winHandle;
}; }; }( jQuery ) );
