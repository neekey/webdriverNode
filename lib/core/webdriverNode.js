/*!
 * webdriverNode.js
 * Copyright(c) 2012 Neekey <tj@vision-media.ca>
 * MIT Licensed
 *
 */


// Helpers.
var http = require( 'http' );
var fs = require( 'fs' );
var path = require( 'path' );
var _ = require( 'underscore' );
var SyncRun = require( 'SyncRun' );

// modules
var Communicate = require( './communicate' );
var ErrorHandler = require( './errorHandler' );
var Log = require( './log' );
var Config = require('./config');
var colors = Config.colors;
var ErrorConfig = require( './errorConfig' );
var ErrorCodes = ErrorConfig.codes;
var ErrorEnums = ErrorConfig.enums;
var JasTest = require( './jasTest' );
var Matcher = JasTest.Matcher;

/**
 * Configuration for methods paths.
 *
 * @type {Array}
 */
var CommandPaths = [
    __dirname + '../protocols/',
    __dirname + '../commands/',
    __dirname + '../jasTest/'
];

/**
 * Commands that read from paths that CommandPaths specified.
 *
 * @type {Object}
 */
var Commands = {};

/**
 * Add a list of command to a specified target, but the executing scope is still host.
 *
 * @param host The scope the commands will executing with. Note that the host must be and webdriveNode instance.
 * @param commandList The Object of commands. {
 *      commandName: command function
 * }
 * @param target The target Object the command will be added to. If target not specified, the command will be added to host.
 */
var addCommands = function ( host, commandList, target ){

    var name;
    var command;

    for( name in commandList ){

        command = commandList[ name ];

        host.addCommand( host, name, command, target );
    }
};

/**
 * Add a command to a specified target, but the executing scope is still host.
 *
 * @param host
 * @param commandName
 * @param command
 * @param target
 */
var addCommand = function ( host, commandName, command, target ){

    var syncRun = host.syncRun;
    target = target || host;

        if( !syncRun ){

        throw new Error( 'The host must have a syncRun queue!' );
    }

    if ( target[commandName] ) {
        throw "The command '" + commandName + "' is already defined!";
    }

    target[commandName] = syncRun( commandName, command, host );
};

/**
 * Read the dir, and take all file with extname 'js' as node moudule, and added the module as an method for webdriverNode.
 *
 * @param dir
 * @return {Object} { commandName: command function }
 */
var readCommands = function( dir ){

    // save the command list to a variable available to all
    var commandFiles = fs.readdirSync( dir );

    commandFiles.forEach( function( commandPath, index ){

        if ( path.extname( commandPath ) == '.js' ) {
            commandName = path.basename( commandPath, '.js' );
            Commands[ commandName ] = require( dir + commandPath ).command;
        }
    });

    return Commands;
};

/**
 * Read all commands from directory, and save to `Commands` for later use.
 * All commands will be added to `webdriverNode` instance when they initialized.
 */
CommandPaths.forEach(function( path, index ){

    readCommands( path );
});

/**
 * WebdriverNode Constructor.
 *
 * @param options
 * @constructor
 */
var WebdriverNode = function ( options )
{
    options = options || {};

    var self = this;

    /**
     * An new syncRun queue for asynchronous method to execute sequentially.
     *
     * @type {Function}
     * @private
     */
    self._syncRun = SyncRun.newQueue();

    /**
     * Configuration for internal use.
     *
     * @type {Object}
     * @private
     */
    self._config = {};

    /**
     * Data for internal use.
     *
     * @type {Object}
     * @private
     */
    self._data = {};

    /**
     * Modules from external.
     *
     * @type {Object}
     * @private
     */
    self._mods = {};

    /**
     * Log level
     *
     * @type {String}
     * @private
     */
    self._config[ 'logLevel' ] = options.logLevel || 'verbose';

    /**
     * The path for screenshot to save.
     *
     * @type {String}
     * @private
     */
    self._config[ 'screenshotPath' ] = options.screenshotPath || __dirname;

    /**
     * An object describing the session's desired capabilities.
     *
     * @type {Object}
     * @private
     */
    self._config[ 'desiredCapabilities' ] = self.extend(self.defaultDesiredCapabilities, options.desiredCapabilities);


    /**
     * Record all log info.
     *
     * @type {Array}
     * @private
     */
    self._data[ 'logInfo' ] = [];

    /**
     * For saving of the session Id that received from server
     *
     * @type {*}
     * @private
     */
    self._data[ 'sessionId' ] = null;

    /**
     * Communicate instance to communicate with the selenium server.
     *
     * @type {Communicate}
     */
    var communicate = self._mods[ 'communicate' ] = new Communicate;

    /**
     * Logger to save and output all the data transmission.
     *
     * @type {Log}
     */
    var log = self._mods[ 'log' ] = new Log();

    var errorHandler = self._mods[ 'errorHandler' ] = ErrorHandler;


    // Bind events
    communicate.on( 'request', function( requestOption, data ){

        log.command( 'PATH: %s, METHOD: %s.' );
        if( data ){
            log.data( data );
        }
    });

    communicate.on( 'requestError', function( err ){

        log.error( 'A error occurs when requesing command! ERR: %s', JSON.stringify( err ) );
    });

    communicate.on( 'resultParseError', function( err, data ){

        log.error( 'A error occurs when parsing the response data, DATA: %s.', data );
    });

    communicate.on( 'commandError', function( result, commandName ){

        switch( result.status ){

            case ErrorEnums.NoSuchElement:
                break;
            case ErrorEnums.NoSuchFrame:
                break;
            case ErrorEnums.UnknownCommand:
                break;
            case ErrorEnums.StaleElementReference:
                break;
            case ErrorEnums.ElementNotVisible:
                break;
            case ErrorEnums.InvalidElementState:
                break;
            case ErrorEnums.UnknownError:
                break;
            case ErrorEnums.ElementIsNotSelectable:
                break;
            case ErrorEnums.JavaScriptError:
                break;
            case ErrorEnums.XPathLookupError:
                break;
            case ErrorEnums.Timeout:
                break;
            case ErrorEnums.NoSuchWindow:
                break;
            case ErrorEnums.InvalidCookieDomain:
                break;
            case ErrorEnums.UnableToSetCookie:
                break;
            case ErrorEnums.UnexpectedAlertOpen:
                break;
            case ErrorEnums.NoAlertOpenError:
                break;
            case ErrorEnums.ScriptTimeout:
                break;
            case ErrorEnums.InvalidElementCoordinates:
                break;
            case ErrorEnums.IMENotAvailable:
                break;
            case ErrorEnums.IMEEngineActivationFailed:
                break;
            case ErrorEnums.InvalidSelector:
                break;
        }

        var errorInfo = ErrorCodes[ result.status ];

        log.error( 'A `%s` error occurs when executing command `%s`: %s.', errorInfo.id, commandName, errorInfo.msg );
    });

    communicate.on( 'result', function( result ){

        log.result( 'Data received from server: %s', result.value )
    });


    // Add all commands.
    addCommands( self, Commands );

};

/**
 * WebdriverNode factory.
 *
 * @param options
 * @return {*}
 */
exports.remote = function ( options ){
    // make sure we have a default options if none are provided
    options = options || {};

    return new WebdriverNode( options );
};

