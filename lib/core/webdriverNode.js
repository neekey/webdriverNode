/*!
 * webdriverNode.js
 * Copyright(c) 2012 Neekey <tj@vision-media.ca>
 * MIT Licensed
 *
 */

var SyncRun = require( 'SyncRun' );


// Helpers.
var http = require( 'http' );
var fs = require( 'fs' );
var path = require( 'path' );
var _ = require( 'underscore' );

// modules
var Communicate = require( './communicate' );
var ErrorHandler = require( './errorHandler' );
var Log = require( './log' );
var Config = require('./config');
var colors = Config.colors;
var errorCodes = Config.errorCodes;
var JasTest = require( './jasTest' );
var Matcher = JasTest.Matcher;

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
 */
var readCommands = function( dir ){

    // save the command list to a variable available to all
    var commandFiles = fs.readdirSync( dir );
    var commandList = {};

    commandFiles.forEach( function( commandPath, index ){

        if ( path.extname( commandPath ) == '.js' ) {
            commandName = path.basename( commandPath, '.js' );
            commandList[ commandName ] = require( dir + commandPath ).command;
        }
    });
};

/**
 *
 * @type {Object}
 */
var Commands = {};


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

    self._mods[ 'communicate' ] = Communicate;

    self._mods[ 'log' ] = Log;

    self._mods[ 'errorHandler' ] = ErrorHandler;

    // 显示帮助信息
    self.showHelpInfo();

    self.addCommands( 'protocol', protocolCommands );
    self.addCommands( 'command', commandList );
    self.addCommands( 'test', testList, self.tests );
    self.addCommands( 'assert', assertList );
    self.addCommands( 'jasTest', jasTestList );
};


var i, ii, commandName;
// the acutal commands. read them dynamicaly
var protocolFiles = fs.readdirSync(__dirname + "/protocol/");
var protocolCommands = {};

for ( i = 0, ii = protocolFiles.length; i < ii; i++) {
    if (path.extname(protocolFiles[i]) == ".js") {
        commandName = path.basename(protocolFiles[i], '.js');
        protocolCommands[commandName] = require("./protocol/" + protocolFiles[i]).command;
    }
}

// save the command list to a variable available to all
var commandFiles = fs.readdirSync(__dirname + "/commands/");
var commandList = {};

for ( i = 0, ii = commandFiles.length; i < ii; i++) {
    if (path.extname(commandFiles[i]) == ".js") {
        commandName = path.basename(commandFiles[i], '.js');
        commandList[commandName] = require("./commands/" + commandFiles[i]).command;
    }
}

var testFiles = fs.readdirSync(__dirname + "/tests/");
var testList = {};

for ( i = 0, ii = testFiles.length; i < ii; i++) {
    if (path.extname(testFiles[i]) == ".js") {
        commandName = path.basename(testFiles[i], '.js');
        testList[commandName] = require("./tests/" + testFiles[i]).command;
    }
}


var assertFiles = fs.readdirSync(__dirname + "/asserts/");
var assertList = {};
for ( i = 0, ii = assertFiles.length; i < ii; i++) {
    if (path.extname(assertFiles[i]) == ".js") {
        commandName = path.basename(assertFiles[i], '.js');
        assertList[commandName] = require("./asserts/" + assertFiles[i]).command;
    }
}

// 添加测试方法
var jasTestFiles = fs.readdirSync(__dirname + "/jasTest/");
var jasTestList = {};
for ( i = 0, ii = jasTestFiles.length; i < ii; i++) {
    if (path.extname(jasTestFiles[i]) == ".js") {
        commandName = path.basename(jasTestFiles[i], '.js');
        jasTestList[commandName] = require("./jasTest/" + jasTestFiles[i]).command;
    }
}


var singletonInstance = null;

// expose the man function
// if we need a singleton, we provide the option here
exports.remote = function (options)//host, port, username, pass)
{
    // make sure we have a default options if none are provided
    options = options || {};

    if (options.singleton) {
        if (!singletonInstance) {
            singletonInstance = new WebdriverJs(options);
        }
        return singletonInstance;
    }
    else {
        return new WebdriverJs(options);//host, port, username, pass);
    }
};

