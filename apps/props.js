
(function( $ ) {

$.fn.props95 = function( action, options ) {

var settings = $.extend( {
    'caption': null,
    'id': null,
    'panel': null,
    'fileIcon': 'generic',
    'fileName': 'Some File',
    'fileType': 'Generic File',
    'fileLocation': 'Somewhere',
    'fileSize': 0,
    'fileCreated': new Date(),
    'fileModified': new Date(),
    'fileAccessed': new Date(),
    'fileAttributes': {
        'readOnly': false,
        'archive': false,
        'hidden': false,
        'system': false,
    }
}, options );

$('head').append( '<link rel="stylesheet" href="src/static/desktop-1995/apps/props.css" />'  )

switch( settings.panel ) {

case 'display': // Display Settings
    if( null == settings.caption ) {
        settings.caption = 'Display Properties';
    }
    if( null == settings.id ) {
        settings.id = 'w-props-display';
    }

    var _furnitureMonitor = function() {
        var monitor = $('<div class="props-monitor-wrapper"></div>');
        var monitorOuter = $('<div class="props-monitor props-monitor-outer"></div>');
        monitor.append( monitorOuter );
        var monitorInner = $('<div class="props-monitor props-monitor-inner"></div>');
        monitorOuter.append( monitorInner );
    
        monitor.append( '<div class="props-monitor props-monitor-stand-upper"></div>' );
        monitor.append( '<div class="props-monitor props-monitor-stand-mid"></div>' );
        monitor.append( '<div class="props-monitor props-monitor-stand-lower"></div>' );
        return monitor;
    };

    var props = this.window95( 'properties', { 'caption': settings.caption,
        'id': settings.id } );

    // Create tabs.
    var tabBG = props.control95( 'tab', 'create', { 'caption': 'Background', 'id': 't-display-background', 'parentClass': 'window-properties-tabs' } );
    props.control95( 'tab', 'create', { 'caption': 'Screen Saver', 'id': 't-display-screensaver', 'parentClass': 'window-properties-tabs' } );
    props.control95( 'tab', 'create', { 'caption': 'Appearance', 'id': 't-display-appearance', 'parentClass': 'window-properties-tabs' } );
    props.control95( 'tab', 'create', { 'caption': 'Settings', 'id': 't-display-settings', 'parentClass': 'window-properties-tabs' } );
    props.find( '.window-properties-tabs' ).tabs();

    // Create monitor.
    tabBG.append( _furnitureMonitor() );

    props.removeClass( 'window-hidden' );
    props.window95( 'activate' );

    return props;

case 'file':

    var props = this.window95( 'properties', { 'caption': settings.caption,
        'id': settings.id } );

    // Create tabs.
    var tabGeneral = props.control95( 'tab', 'create', { 'caption': 'General', 'id': 't-file-general', 'parentClass': 'window-properties-tabs' } );
    props.find( '.window-properties-tabs' ).tabs();

    var row = $('<div class="properties-row"></div>');
    row.append( '<div class="properties-field props-file-icon"><div class="icon-' + settings.fileIcon + '-32"></div></div>' );
    row.append( '<div class="properties-field props-file-name">' + settings.fileName + '</div>' );
    tabGeneral.append( row );

    var row = $('<div class="properties-row"><hr /></div>');
    tabGeneral.append( row );
    
    var row = $('<div class="properties-row"></div>');
    row.append( '<div class="properties-label">Type:</div>' );
    row.append( '<div class="properties-field props-file-type">' + settings.fileType + '</div>' );
    tabGeneral.append( row );

    var row = $('<div class="properties-row"></div>');
    row.append( '<div class="properties-label">Location:</div>' );
    row.append( '<div class="properties-field props-file-location">' + settings.fileLocation + '</div>' );
    tabGeneral.append( row );

    var row = $('<div class="properties-row"></div>');
    row.append( '<div class="properties-label">Size:</div>' );
    row.append( '<div class="properties-field props-file-size">' + settings.fileSize.toString() + ' bytes (' + settings.fileSize.toString() + ' bytes)</div>' );
    tabGeneral.append( row );

    var row = $('<div class="properties-row"><hr /></div>');
    tabGeneral.append( row );

    var row = $('<div class="properties-row"></div>');
    row.append( '<div class="properties-label">Created:</div>' );
    row.append( '<div class="properties-field props-file-created">' + settings.fileCreated + '</div>' );
    tabGeneral.append( row );

    var row = $('<div class="properties-row"></div>');
    row.append( '<div class="properties-label">Modified:</div>' );
    row.append( '<div class="properties-field props-file-modified">' + settings.fileModified + '</div>' );
    tabGeneral.append( row );

    var row = $('<div class="properties-row"></div>');
    row.append( '<div class="properties-label">Accessed:</div>' );
    row.append( '<div class="properties-field props-file-accessed">' + settings.fileAccessed + '</div>' );
    tabGeneral.append( row );

    props.removeClass( 'window-hidden' );
    props.window95( 'activate' );

    return props;
    
} };

}( jQuery ) );