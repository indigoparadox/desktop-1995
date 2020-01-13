
(function( $ ) {
$.fn.cdplayer95 = function( action, options ) {

var settings = $.extend( {
    'caption': 'CD Player',
    'id': null,
    'resizable': true,
    'icoImg': null,
    'icoX': 0,
    'icoY': 0,
    'x': 10,
    'y': 10,
    'w': 480,
    'h': 260,
    'playlist': []
}, options );
    
switch( action.toLowerCase() ) {

case 'enable':

    function windowCDPlayerEnable( winHandle ) {
        btnPlay.attr( 'disabled', false );
    
    }

case 'openmixer':
    options.w = 408;
    options.h = 446;
    options.menu = null;
    options.show = false;
    options.resizable = false;
    var winHandle = $.window95( 'open', options );
    
    winHandle.addClass( 'window-mixer' );

    winHandle.removeClass( 'window-hidden' );
    winHandle.window95( 'activate' );

    return winHandle;

case 'open':

    options.menu = null;
    options.show = false;
    options.resizable = false;

    var winHandle = this.window95( 'open', options );
    
    winHandle.addClass( 'window-cdplayer' );
    
    winHandle.control95( 'statusbar' );
    
    menu = [
        {'caption': 'Disc', 'children': [
            {'type': menu95Type.GROUP, 'id': 'browser-recent'},
            {'text': 'Exit', 'callback': function( m ) {
                winHandle.window95( 'close' );
            }}
        ]},
        {'caption': 'View', 'children': [
        ]},
        {'caption': 'Options', 'children': [
        ]},
        {'caption': 'Help', 'children': [
        ]}
    ];

    // Add the menu now, once winHande is defined, so callbacks above have it
    // in scope.
    windowAddMenuBar( winHandle, menu );

    var controls = $('<div class="window-cdplayer-controls-row"><div class="window-cdplayer-display inset">[00] 00:00</div><div class="window-cdplayer-controls"><div class="window-cdplayer-controls-play-pause-stop"></div><div class="window-cdplayer-controls-tracks-eject"></div></div></div>');
    winHandle.children( '.window-form' ).append( controls );

    var audio = new Audio( options.playlist[0].url );

    var btnPlay = $('<button class="button-play disable-until-load">&#x25b6;</button>');
    controls.find( '.window-cdplayer-controls-play-pause-stop').append( btnPlay );
    btnPlay.click( function( e ) {
        audio.play();
        e.preventDefault();
    } );

    var btnPause = $('<button class="button-pause disable-until-load">&#x23f8;</button>');
    controls.find( '.window-cdplayer-controls-play-pause-stop').append( btnPause );
    btnPause.click( function( e ) {
        audio.pause();
        e.preventDefault();
    } );

    var btnStop = $('<button class="button-stop disable-until-load">' + _htmlCharSVG( '\u23f9' ) + '</button>');
    controls.find( '.window-cdplayer-controls-play-pause-stop').append( btnStop );
    btnStop.click( function( e ) {
        audio.pause();
        audio.currentTime = 0;
        e.preventDefault();
    } );

    var btnPrevTrack = $('<button class="button-track-prev disable-until-load">&#x23ee;</button>');
    controls.find( '.window-cdplayer-controls-tracks-eject').append( btnPrevTrack );
    btnPrevTrack.click( function( e ) {
        e.preventDefault();
    } );

    var btnRewind = $('<button class="button-rewind disable-until-load">&#x23ea;</button>');
    controls.find( '.window-cdplayer-controls-tracks-eject').append( btnRewind );
    btnRewind.click( function( e ) {
        e.preventDefault();
    } );

    var btnFastFwd = $('<button class="button-fast-fwd disable-until-load">&#x23e9;</button>');
    controls.find( '.window-cdplayer-controls-tracks-eject').append( btnFastFwd );
    btnFastFwd.click( function( e ) {
        e.preventDefault();
    } );

    var btnNextTrack = $('<button class="button-track-next">&#x23ee;</button>');
    controls.find( '.window-cdplayer-controls-tracks-eject').append( btnNextTrack );
    btnNextTrack.click( function( e ) {
        e.preventDefault();
    } );

    winHandle.find( '.disable-until-load' ).attr( 'disabled', true );

    var drops = $('<div class="window-cdplayer-drops"></div>');
    winHandle.children( '.window-form' ).append( drops );

    var dropArtist = $('<div class="wrapper window-cdplayer-drop-artist-wrapper"><label>Artist: </label><div class="select-wrapper"><select class="input-select select-artist"></select></div></div>');
    drops.append( dropArtist );

    var dropAlbum = $('<div class="wrapper window-cdplayer-drop-album-wrapper"><label>Title: </label><div class="inset inset-album"></div></div>');
    drops.append( dropAlbum );

    var dropTrack = $('<div class="wrapper window-cdplayer-drop-track-wrapper"><label>Track: </label><div class="select-wrapper"><select class="input-select select-track"></select></div></div>');
    drops.append( dropTrack );

    // Setup the status bar.
    var trayStatusTime = $('<div class="tray tray-status-time"></div>');
    winHandle.children( '.statusbar' ).append( trayStatusTime );

    var trayStatusTrack = $('<div class="tray tray-status-track"></div>');
    winHandle.children( '.statusbar' ).append( trayStatusTrack );

    winHandle.find( '.browser-pane' ).on( 'load', function( e ) {
        winHandle.find( '.tray-status-text' ).text( '' );
    } );

    var mediaLoadComplete = false;

    var jsmediatags = window.jsmediatags;
    try {
        jsmediatags.read( playlist[0].url, {
        'onSuccess': function( tag ) {
            console.log( tag );
            if( mediaLoadComplete ) {
                winHandle.find( '.disable-until-load' ).attr( 'disabled', false );
            } else {
                mediaLoadComplete = true;
            }
        } } );
    } catch( e ) {
        console.log( e );
        if( mediaLoadComplete ) {
            winHandle.find( '.disable-until-load' ).attr( 'disabled', false );
        } else {
            mediaLoadComplete = true;

            dropArtist.find( 'select' ).empty();
            dropArtist.find( 'select' ).append( '<option>' + _htmlEncode( settings.playlist[0].artist ) + '</option>' );
            dropAlbum.find( '.inset-album' ).text( _htmlEncode( settings.playlist[0].album ) );
            dropTrack.find( 'select' ).empty();
            dropTrack.find( 'select' ).append( '<option>' + _htmlEncode( settings.playlist[0].title ) + '</option>' );
        }
    }
            
    audio.volume = 0.3;

    // Setup the audio events.
    $(audio).on( 'canplay', function( e ) {
        if( mediaLoadComplete ) {
            winHandle.find( '.disable-until-load' ).attr( 'disabled', false );
        } else {
            mediaLoadComplete = true;
        }        

        // Show the audio duration now that it's loaded.
        var duration = audio.duration;
        var minutes = Math.floor( duration / 60 ).toString();
        if( 9 >= minutes ) {
            minutes = "0" + minutes;
        }
        var seconds = Math.floor( duration % 60 ).toString();
        if( 9 >= seconds ) {
            seconds = "0" + seconds;
        }
        trayStatusTime.text( 'Total Play: ' + minutes + ':' + seconds + ' m:s' );
    } );
    $(audio).on( 'timeupdate', function( e ) {        
        var currentTime = audio.currentTime;
        var minutes = Math.floor( currentTime / 60 ).toString();
        if( 9 >= minutes ) {
            minutes = "0" + minutes;
        }
        var seconds = Math.floor( currentTime % 60 ).toString();
        if( 9 >= seconds ) {
            seconds = "0" + seconds;
        }
        winHandle.find( '.window-cdplayer-display' ).text( '[00] ' + minutes + ':' + seconds );

    } );
    $(audio).addClass( 'cd-player-audio' );

    // This should probably be global and attached to the mixer.
    winHandle.append( audio );

    winHandle.removeClass( 'window-hidden' );
    winHandle.window95( 'activate' );

    return winHandle;
}; }; }( jQuery ) );
