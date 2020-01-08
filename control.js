
(function( $ ) {
$.fn.control95 = function( control, action='create', options ) {

var settings = $.extend( {
    'caption': '',
    'id': null
}, options );

switch( control.toLowerCase() ) {

case 'tab':
    return this.each( function( idx, winHandle ) {
        console.assert( null != settings.id );
        console.assert( 0 >= $('#' + settings.id).length );

        var tabPane = $('<div class="window-properties-tab-pane"></div>');
        tabPane.attr( 'id', settings.id )
        this.find( '.window-properties-tabs' ).append( tabPane );

        var tab = '<li class="window-properties-tab-tab"><a href="#' + settings.id +
            '">' + settings.caption + '</a></li>';
        this.find( '.window-properties-tabs > ul' ).append( tab );

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

}; }; }( jQuery ) );
