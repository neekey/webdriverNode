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

// modules
var Communicate = require( './communicate' );
//var ErrorHandler = require( './errorHandler' );
var Log = require( './log' );
var CommandManager = require( './commandManager' );
var PluginManager = require( './pluginManager' );
var Base64ToFile = require( './base64ToFile' );
var ErrorConfig = require( './errorConfig' );

var ErrorCodes = ErrorConfig.codes;
var ErrorEnums = ErrorConfig.enums;


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
     * Plugins from external.
     *
     * @type {Object}
     * @private
     */
    self._plugins = {};

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
    self._config[ 'screenShotPath' ] = options.screenShotPath || __dirname;

    /**
     * A default Capabilities JSON Object sent by the client describing the capabilities a new session created by the server should possess.
     * Any omitted keys implicitly indicate the corresponding capability is irrelevant.
     *
     * @type {Object}
     * @private
     * @link http://code.google.com/p/selenium/wiki/JsonWireProtocol#Introduction - Capabilities JSON Object
     */
    self._config[ 'defaultDesiredCapabilities' ] = {
            browserName:"firefox",
            version:"",
            javascriptEnabled:true,
            platform:"ANY"
        };

    /**
     * An object describing the session's desired capabilities.
     *
     * @type {Object}
     * @private
     */
    self._config[ 'desiredCapabilities' ] = _.extend( self._config[ 'defaultDesiredCapabilities' ], options.desiredCapabilities );


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
     * Reading all commands.
     *
     * @type {CommandManager}
     */
    self._mods[ 'commandManager' ] = new CommandManager( self );

    /**
     * Communicate instance to communicate with the selenium server.
     *
     * @type {Communicate}
     * @private
     */
    var communicate = self._mods[ 'communicate' ] = new Communicate;

    /**
     * Logger to save and output all the data transmission.
     *
     * @type {Log}
     * @private
     */
    var log = self._mods[ 'log' ] = new Log;

//    var errorHandler = self._mods[ 'errorHandler' ] = ErrorHandler;


    // Bind events
    communicate.on( 'request', function( requestOption, data ){

        log.command( 'PATH: %s, METHOD: %s.' );
        if( data ){
            log.data( data );
        }
    });

    communicate.on( 'requestError', function( err ){

        log.error( 'A error occurs when requesting command! ERR: %s', JSON.stringify( err ) );
    });

    communicate.on( 'resultParseError', function( err, data ){

        log.error( 'A error occurs when parsing the response data, DATA: %s.', data );
    });

    communicate.on( 'commandError', function( result, commandName ){

        var ifUnKnownError = false;
        var screenShotFilename;

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
                ifUnKnownError = true;
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
            default:
                ifUnKnownError = true;
                break;
        }

        var errorInfo = ErrorCodes[ result.status ];

        log.error( 'A `%s` error occurs when executing command `%s`: %s.',
            errorInfo.id, commandName, errorInfo.msg );

        // Don't saving screenShot if an unknown error occurs.
        if( ifUnKnownError === false && result.value && result.result.value.screen ){

            try{
                screenShotFilename = Base64ToFile({
                    data: result.value.screen,
                    path: self._config[ 'screenShotPath' ],
                    // Add error info into filename, like: /screenShot/-ERROR[7:NoSuchElement]-randomString.png
                    extraInfo: '-ERROR[' + result.status + ':' + errorInfo.id + ']-'
                });
            }
            catch( e ){
                log.error( 'An error occurs when saving screen shot, filename: %s, ERR: %s',
                    screenShotFilename, JSON.stringify( err ) );
            }
        }
    });

    communicate.on( 'result', function( result ){

        log.result( 'Data received from server: %s', result.value )
    });


    // Run all the Plugins
    self._mods[ 'pluginManager' ] = new PluginManager( self );
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

