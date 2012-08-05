/*!
 * Log.js
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 *
 * Colorful stdout messages by Couto <lcouto87@gmail.com>
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

var Log = exports = module.exports = function Log(level, stream){
    if ('string' == typeof level) level = exports[level.toUpperCase()];
    this.level = level || exports.DEBUG;
    this.stream = stream || process.stdout;
    if (this.stream.readable) this.read();
};

/**
 * Define Colors for levels
 */
exports.colors = {
    'EMERGENCY' : "\033[0;31m",
    'ALERT'     : "\033[0;33m",
    'CRITICAL'  : "\033[0;31m",
    'ERROR'     : "\033[1;31m",
    'WARNING'   : "\033[0;33m",
    'NOTICE'    : "\033[0;36m",
    'INFO'      : "\033[0;35m",
    'DEBUG'     : "\033[0m",
    'TRACE'     : "\033[1;30m",
    'reset'     : "\033[0m"
}

/**
 * System is unusable.
 *
 * @type Number
 */

exports.EMERGENCY = 0;

/**
 * Action must be taken immediately.
 *
 * @type Number
 */

exports.ALERT = 1;

/**
 * Critical condition.
 *
 * @type Number
 */

exports.CRITICAL = 2;

/**
 * Error condition.
 *
 * @type Number
 */

exports.ERROR = 3;

/**
 * Warning condition.
 *
 * @type Number
 */

exports.WARNING = 4;

/**
 * Normal but significant condition.
 *
 * @type Number
 */

exports.NOTICE = 5;

/**
 * Purely informational message.
 *
 * @type Number
 */

exports.INFO = 6;

/**
 * Application debug messages.
 *
 * @type Number
 */

exports.DEBUG = 7;

/**
 * Application debug messages.
 *
 * @type Number
 */

exports.TRACE = 8;


/**
 * prototype.
 */

Log.prototype = {

    /**
     * Start emitting "line" events.
     *
     * @api public
     */

    read: function(){
        var buf = ''
            , self = this
            , stream = this.stream;

        stream.setEncoding('ascii');
        stream.on('data', function(chunk){
            buf += chunk;
            if ('\n' != buf[buf.length - 1]) return;
            buf.split('\n').map(function(line){
                if (!line.length) return;
                try {
                    var captures = line.match(/^\[([^\]]+)\] (\w+) (.*)/);
                    var obj = {
                        date: new Date(captures[1])
                        , level: exports[captures[2]]
                        , levelString: captures[2]
                        , msg: captures[3]
                    };
                    self.emit('line', obj);
                } catch (err) {
                    // Ignore
                }
            });
            buf = '';
        });

        stream.on('end', function(){
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

    log: function(levelStr, args) {
        if (exports[levelStr] <= this.level) {
            var i = 1;
            var msg = args[0].replace(/%s/g, function(){
                return args[i++];
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
        }
    },

    colorful : function (colors) {
        var k;
        if (Object.prototype.toString.call(colors) === '[object Object]') {
            for (k in colors) {
                if (colors.hasOwnProperty(k)) {
                    exports.colors[k] = colors[k];
                }
            }
            this.useColors = true;
        } else if (colors === false) { this.useColors = false; }
        else { this.useColors = true; }
        return this;
    },

    /**
     * Log emergency `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    emergency: function(msg){
        this.log('EMERGENCY', arguments);
    },

    /**
     * Log alert `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    alert: function(msg){
        this.log('ALERT', arguments);
    },

    /**
     * Log critical `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    critical: function(msg){
        this.log('CRITICAL', arguments);
    },

    /**
     * Log error `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    error: function(msg){
        this.log('ERROR', arguments);
    },

    /**
     * Log warning `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    warning: function(msg){
        this.log('WARNING', arguments);
    },

    /**
     * Log notice `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    notice: function(msg){
        this.log('NOTICE', arguments);
    },

    /**
     * Log info `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    info: function(msg){
        this.log('INFO', arguments);
    },

    /**
     * Log debug `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    debug: function(msg){
        this.log('DEBUG', arguments);
    },

    /**
     * Log trace `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    trace: function(msg){
        this.log('TRACE', arguments);
    }

};

/**
 * Inherit from `EventEmitter`.
 */

Log.prototype.__proto__ = EventEmitter.prototype;