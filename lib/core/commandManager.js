/*!
 * @description
 * @author Neekey <ni184775761@gmail.com>
 * @date 2012.08
 */

var Path = require( 'path' );
var DirWater  = require( 'DirWatcher' );
var _ = require( 'underscore' );
var SyncRun = require( 'SyncRun' );

var COMMAND_PATH = '../commands/';

// Get the path separator.
// Note the latest version of NodeJS is already has this attribute.
if( !Path.sep ){

    // linux
    if( __dirname.indexOf( '/' ) > -1 ){
        Path.sep = '/';
    // windows
    } else {
        Path.sep = '\\';
    }
}

/**
 * Command Class, reading directory and add commands.
 *
 * @param host                  The host where the command read will be added to.
 * @param {SyncRun} syncRun     The instance of SyncRun.
 * @param {String} commandPath  The directory to read.
 * @constructor
 */
var CommandManager = function( host, syncRun, commandPath ){

    this._host = host;
    this._syncRun = syncRun || SyncRun.newQueue();
    this._commandPath = commandPath || COMMAND_PATH;
    this._commandAbsolutePath = Path.resolve( __dirname, this._commandPath );

    /**
     * Store all read commands.
     *
     * @type {Object}
     * @private
     */
    this._commands = {};

    this.readCommandDirectory();
};

/**
 * Methods.
 *
 * @type {Object}
 */
CommandManager.prototype = {

    /**
     * Read an specified directory and add the commands to the host.
     *
     * @param commandDir
     */
    readCommandDirectory: function( commandDir ){

        var self = this;
        commandDir = commandDir || self._commandAbsolutePath;

        DirWater.readDir( commandDir, function( err, path, ifDir ){

            if( err ){

                throw new Error( 'An error occurs when reading commands directory: ' + JSON.stringify( err ) );
            }

            if( ifDir === false ){

                self.readCommand( path );
            }
        });
    },

    /**
     * Parse the specified file path, and add command to host.
     *
     * @param commandPath
     * @example
     *      `readCommand( 'command/base/path/specified/path/filename.js' );` will add command to host like:
     *      `host.specified.path.filename`
     */
    readCommand: function( commandPath ){

        var self = this;
        var dirSep = commandPath.replace( self._commandAbsolutePath, '' ).split( Path.sep );
        var dirLen = dirSep.length;
        var commandCon = self._commands;
        var newCommandCon = {};
        var newCommandComTmp = newCommandCon;
        var commandName = '';

        dirSep.forEach(function( seg, index ){

            if( seg ){

                if( index < dirLen - 1 ){

                    console.log( seg );
                    if( !( seg in commandCon ) ){

                        commandCon[ seg ] = {};
                    }

                    commandCon = commandCon[ seg ];
                    newCommandComTmp = newCommandComTmp[ seg ] = {};
                }
                else {

                    // Only `.js` is recognized as command.
                    if( Path.extname( seg ) == '.js' ){

                        commandName = Path.basename( seg, '.js' );

                        // Skip all duplicated command.
                        if( !( commandName in commandCon ) ){

                            newCommandComTmp[ commandName ] = commandCon[ commandName ] = require( commandPath ).command;

                            // Add this new command to host.
                            self.addCommands( newCommandCon );
                        }
                    }
                }
            }
        });
    },

    /**
     * Add a list of command to a specified target, but the executing scope is still host.
     *
     * @param commandObj A nested Object of commands, like: { commandName: fn, commandGroup: { a: fn, b: fn, } }
     * @param target The target Object the command will be added to. If target not specified, the command will be added to host.
     */
    addCommands: function ( commandObj, target ){

        var self = this;
        var _args = arguments;
        var funcSelf = function(){
            _args.callee.apply( self, arguments );
        };
        target = target || self._host;

        _.forEach( commandObj, function( command, name ){

            if( typeof command === 'function' ){

                self.addCommand( name, command, target );
            }
            else if( _.isObject( command ) ){

                if( !target[ name ] ){

                    target[ name ] = {};
                }

                funcSelf( command, target[ name ] );
            }
        });
    },

    /**
     * Add a command to a specified target, but the executing scope is still host.
     *
     * @param commandName
     * @param command
     * @param target
     */
    addCommand: function ( commandName, command, target ){

        var syncRun = this._syncRun;
        target = target || this._host;

        if( !syncRun ){

            throw new Error( 'The host must have a syncRun queue!' );
        }

        // Skip duplicated command.
        if ( !target[commandName] ){

            target[commandName] = syncRun( commandName, command, this._host );
        }
    }
};

module.exports = CommandManager;


