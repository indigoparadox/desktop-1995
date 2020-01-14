
const props95Panel = {
    'DISPLAY': 'display',
};

(function( $ ) {

$.fn.props95 = function( panel, options ) {

var settings = $.extend( {
    'caption': null,
    'id': null,
}, options );

switch( panel ) {

case props95Panel.DISPLAY: // Display Settings
    if( null == settings.caption ) {
        settings.caption = 'Display Properties';
    }
    if( null == settings.id ) {
        settings.id = 'w-props-display';
    }

    var props = this.window95( 'properties', { 'caption': settings.caption,
        'id': settings.id } );

    // Create tabs.
    var tabBG = props.control95( 'tab', 'create', { 'caption': 'Background', 'id': 't-display-background', 'parentClass': 'window-properties-tabs' } );
    props.control95( 'tab', 'create', { 'caption': 'Screen Saver', 'id': 't-display-screensaver', 'parentClass': 'window-properties-tabs' } );
    props.control95( 'tab', 'create', { 'caption': 'Appearance', 'id': 't-display-appearance', 'parentClass': 'window-properties-tabs' } );
    props.control95( 'tab', 'create', { 'caption': 'Settings', 'id': 't-display-settings', 'parentClass': 'window-properties-tabs' } );
    props.find( '.window-properties-tabs' ).tabs();

    // Create monitor.
    tabBG.append( this.desktop95( 'propsMonitor' ) );
    return props;
    
} };

}( jQuery ) );