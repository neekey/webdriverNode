/**
 * Manager for plugins.
 */

var Path = require( 'path' );
var Fs = require( 'fs' );
var PLUGIN_PATH = '../plugins';

/**
 * The extension that make a file be recognized as a plugin.
 * @type {String}
 */
var PLUGIN_ENTRY = 'index.js';

var PluginManager = function( host ){

    var pluginCon = host._plugins;
    var pluginsPath = Path.resolve( __dirname, PLUGIN_PATH );

    // Only read the first level files as plugin.
    var pluginPaths = Fs.readdirSync( pluginsPath );
    pluginPaths.forEach(function( path ){

        path = Path.resolve( pluginsPath, path );

        var stat = Fs.statSync( path );
        if( stat.isDirectory() ){
            try{
                var plugin = require( Path.resolve( path, PLUGIN_ENTRY ));
            }
            catch( e ) {
                // Just leave it...
            }
            var pluginName = Path.basename( path );

            // If pluginName is already, just skip.
            if( !( pluginName in pluginCon ) ){

                pluginCon[ pluginName ] = {};
                plugin( host, pluginCon[ pluginName ]);
            }
        }
    });
};

module.exports = PluginManager;