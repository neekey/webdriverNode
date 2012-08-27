/*!
 * Log.js
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 *
 * Colorful stdout messages by Couto <lcouto87@gmail.com>
 *
 * CustomLevel by Neekey<ni184775761@gmail.com>
 */

/**
 * Colors Cheat-sheet
 *     white  : "\033[1;37m",   black        : "\033[0;30m",
 *     red    : "\033[0;31m",   light_red    : "\033[1;31m",
 *     green  : "\033[0;32m",   light_green  : "\033[1;32m",
 *     yellow : "\033[0;33m",   light_yellow : "\033[1;33m",
 *     blue   : "\033[0;34m",   light_blue   : "\033[1;34m",
 *     purple : "\033[0;35m",   light_purple : "\033[1;35m",
 *     cyan   : "\033[0;36m",   light_cyan   : "\033[1;36m",
 *     gray   : "\033[1;30m",   light_gray   : "\033[0;37m",
 *     reset  : "\033[0m"
 */

/**
 * Module dependencies.
 */
var EventEmitter = require('events').EventEmitter;

/**
 * Initialize a `Loggeer` with the given log `level` defaulting
 * to __DEBUG__ and `stream` defaulting to _stdout_.
 *
 * @param {Number} level
 * @param {Object} stream
 * @api public
 */

var Log = exports = module.exports = function Log(level, stream, custom) {

    // Add custom levels.
    if( custom ) this.customLevels( custom );
    this.setLevel( level );
    this.stream = stream || process.stdout;
    if (this.stream.readable) this.read();

    /**
     * Store all the logs in memory.
     *
     * @type {Array}
     * @private
     */
    this._logs = [];
};

/**
 * Define Levels for levels.
 */
exports.colors = {

    /**
     * Violet.
     */
    'COMMAND': '\x1b[0;35m',

    /**
     * Brown.
     */
    'DATA': '\x1b[0;33m',

    /**
     * Teal.
     */
    'RESULT': '\x1b[0;36m',

    /**
     * Red.
     */
    'ERROR': '\x1b[1;31m',

    /**
     * Red.
     */
    'SCREENSHOTSAVE': '\x1b[1;31m',

    /**
     * Brown
     */
    'CUSTOM': '\x1b[0;33m',

    /**
     *
     */
    'TEST': undefined,

    /**
     * Other.
     */
    'OTHER': '\x1b[0;33m',

    /**
     * Debug
     */
    'DEBUG': "\033[1;37m",

    /**
     * Reset log color.
     */
    'reset':"\033[0m"
};

/**
 * The latest enum value for level.
 *
 * @type {Number}
 */
var enumCount = 0;

/**
 * Add an new log level to exports, and assign an new enum value to it.
 *
 * @param levelName
 */
var addLevelEnumerable = function (levelName) {

    if (!( levelName in exports )) {
        exports[ levelName ] = ++enumCount;
    }

    var lowCaseLevelName = levelName.toLowerCase();

    if(!( lowCaseLevelName in Log.prototype )) {

        Log.prototype[ lowCaseLevelName ] = function(msg){
            this.log(levelName, arguments);
        }
    }
};

/**
 * prototype.
 */

Log.prototype = {

    /**
     * Start emitting "line" events.
     *
     * @api public
     */

    read:function () {
        var buf = ''
            , self = this
            , stream = this.stream;

        stream.setEncoding('ascii');
        stream.on('data', function (chunk) {
            buf += chunk;
            if ('\n' != buf[buf.length - 1]) return;
            buf.split('\n').map(function (line) {
                if (!line.length) return;
                try {
                    var captures = line.match(/^\[([^\]]+)\] (\w+) (.*)/);
                    var obj = {
                        date:new Date(captures[1]), level:exports[captures[2]], levelString:captures[2], msg:captures[3]
                    };
                    self.emit('line', obj);
                } catch (err) {
                    // Ignore
                }
            });
            buf = '';
        });

        stream.on('end', function () {
            self.emit('end');
        });
    },

    /**
     * Log output message.
     *
     * @param  {String} levelStr
     * @param  {Array} args
     * @api private
     */

    log:function (levelStr, args) {
        if (exports[levelStr] <= this.level) {
            var i = 1;
            var msg = args[0].replace(/%s/g, function () {
                var arg = args[i++];
                if( typeof arg === 'object' ){
                    return JSON.stringify( arg );
                }
                else {
                    return arg;
                }
            });
            if (this.stream === process.stdout &&
                this.useColors &&
                exports.colors[levelStr]) {

                this.stream.write(
                    exports.colors[levelStr]
                        + '[' + new Date + ']'
                        + ' ' + levelStr
                        + ' ' + msg
                        + exports.colors.reset
                        + '\n'
                );
            } else {
                this.stream.write(
                    '[' + new Date + ']'
                        + ' ' + levelStr
                        + ' ' + msg
                        + '\n'
                );
            }

            // Save the log
            this._saveLog( new Date, levelStr, msg );
        }
    },

    /**
     * Customize colors for stout.
     *
     * @param {Object|Boolean} colors
     * @return {*}
     * @example
     *      `colorful({ DEBUG: "\033[0m"});`    set level `DEBUG` color to `\033[0m`.
     *      `colorful(false)`   turn off color.
     *      `colorful()` or `colorful(true)` turn on color.
     *
     */
    colorful:function (colors) {
        var k;
        if (Object.prototype.toString.call(colors) === '[object Object]') {
            for (k in colors) {
                if (colors.hasOwnProperty(k)) {
                    exports.colors[k] = colors[k];
                }
            }
            this.useColors = true;
        } else if (colors === false) {
            this.useColors = false;
        }
        else {
            this.useColors = true;
        }
        return this;
    },

    /**
     * Customize Levels and Colors.
     *
     * @param {Object|Array} levels
     * @example
     *      `customLevels([ 'DEBUG', 'ERROR', 'WARNING' ]);`
     *      `customLevels({ DEBUG: "\033[0m"});`
     */
    customLevels: function( levels ){

        var k;

        if( Object.prototype.toString.call( levels ) === '[object Array]' ){

            for( k = 0; k < levels.length; k++ ){

                addLevelEnumerable( levels[ k ] );
            }
        }
        else if( Object.prototype.toString.call( levels ) === '[object Object]' ){
            this.colorful( levels );

            for( k in levels ){
                addLevelEnumerable( k );
            }
        }

        return this;
    },

    /**
     * Set log level
     *
     * @param level
     * @return {*}
     */
    setLevel: function( level ){

        if ('string' == typeof level) level = exports[level.toUpperCase()];
        this.level = level || this.level || exports.reset;

        return this;
    },

    /**
     * Return all the stored logs in memory.
     *
     * @return {Array}
     */
    getLogs: function(){

        return this._logs;
    },

    /**
     * Save log info to this.logs.
     *
     * @param date
     * @param level
     * @param msg
     * @private
     */
    _saveLog: function( date, level, msg ){

        this._logs.push({
            date: date,
            type: level,
            msg: msg
        });
    }

};

/**
 * Add Default levels to exports and add methods to Log.prototype.
 */
Log.prototype.customLevels( exports.colors );

/**
 * Inherit from `EventEmitter`.
 */

Log.prototype.__proto__ = EventEmitter.prototype;
