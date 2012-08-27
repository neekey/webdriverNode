/**
 * @description 与Selenium进行通信
 * @author neekey<ni184775761@gmail.com>
 * @date 2012-08
 */

var http = require( 'http' );
var Path = require( 'path' );
var _ = require( 'underscore' );
var EventEmitter = require( 'events').EventEmitter;
var Util = require( 'util' );


/**
 * 用于向server请求的request参数
 * @type {Object}
 */
var DEFAULT_REQUEST_OPTIONS = {
    host: 'localhost',
    port: 4444,
    method:'POST',
    // 下面两个字段的值是既定的
    headers: {
        'content-type':'application/json',
        'charset':'charset=UTF-8'
    }
};

/**
 * 向server请求的request参数中path字段的前缀,如 /wd/hub/session...
 * @type {String}
 */
var REQUEST_PATH_PREFIX = '/wd/hub';

/**
 * The charset encoding that webdriverNode expect the server response.
 * @type {String}
 */
var RESPONSE_DATA_ENCODING = 'utf8';

/**
 * The Communicate constructor inherited form EventEmitter
 *
 * @constructor
 */
var Communicate = module.exports = function( host ){
    EventEmitter.call(this);
    this._host = host;
};
Util.inherits( Communicate, EventEmitter );

/**
 * 向selenium-server发送请求
 * @param {Object} requestOptions 请求相关配置
 * @param data 需要发送的数据
 * @param options 参见 proxyResponse方法的参数
 * @return {Object} request对象
 */
var request = Communicate.prototype.request = function ( requestOptions, options ) {

    // 必须制定option，其余参数均可选
    if( !requestOptions ){

        throw new Error( '必须制定请求参数!' );
    }
    else {
        // 附加参数
        requestOptions = this.createOptions( requestOptions );
    }

    var data = options.data;
    var self = this;
    var req;
    var stringData = JSON.stringify( data );
    var ifHasData = true;

    // 根据data设置 content-length
    if (data === undefined || data === '{}' || data === '[]' || data === '""' ) {

        ifHasData = false;
        requestOptions.headers['content-length'] = 0;
    }
    else {

        requestOptions.headers['content-length'] = JSON.stringify(data).length;
    }

    self._host._mods.log.debug( 'request option: %s', requestOptions );
    // 发送请求
    req = http.request( requestOptions, this.proxyResponse( options, self ) );

    /**
     * `request` Requesting an command.
     *
     * @event
     * @param requestOptions
     * @param stringData
     *
     */
    self.emit( 'request', requestOptions, options, stringData );

    // 设置出错的handler
    req.on( 'error', function( err ){

        /**
         * `requestError` An error occurs when requesting a command.
         *
         * @event
         * @param err.
         */
        self.emit( 'requestError', err );
    });

    // 发送数据
    if( ifHasData ){

        req.write(stringData);
    }

    // 结束请求
    req.end();

    return req;
};

/**
 * 为请求的option附加信息
 * @param {Object} option {
 *      host:,
 *      method,
 *      path:,
 *      port
 * }
 * @return {Object} newOption
 */
var createOptions = Communicate.prototype.createOptions = function( option ){

    // 加入默认参数
    var newOption = _.defaults( option, DEFAULT_REQUEST_OPTIONS );

    // 为请求path参数添加前缀 /session/... -> /wd/hb/session/...
    newOption.path = Path.join( REQUEST_PATH_PREFIX, newOption.path );

    // session/:sessionId --> session/1123442
    var sessionId = this._host._data.sessionId;
    if( sessionId ){
        newOption.path = newOption.path.replace( new RegExp( '\:sessionId', 'g' ), sessionId );
    }

    return newOption;
};

/**
 * 对向server请求的响应的回调代理
 * @param {Object} paramObj{
 *      callback: function( result ) result: { value: }, 当返回结果status=0时，先经过resultHandler处理，然后将返回值给callback
 *      commandName: 发起请求的命令的名称，一般为文件名,
 *      resultHandler: 对结果进行处理的方法( {
 *          response:,
 *          data:,
 *          result: { status:, value:, sessionId: },
 *      })
 * }
 * @return {Function}
 */
var proxyResponse = Communicate.prototype.proxyResponse = function ( paramObj, host ) {

    var data = "";
    var callback = paramObj.callback;
    var commandName = paramObj.commandName;
    var resultHandler = paramObj.resultHandler;

    return function( response ){

        response.setEncoding( RESPONSE_DATA_ENCODING );

        // 开始接受响应内容
        response.on('data', function (chunk) {

            data += chunk.toString( RESPONSE_DATA_ENCODING );
        });

        // 所有数据接受完毕
        response.on('end', function () {

                var result;

                try {

                    // If the server do has data response, parsed it.
                    if( data ){
                        // 解析返回的数据结构
                        // 应该为如下数据格式
                        // { sessionId: , status: , value: }
                        result = JSON.parse( strip(data) );
                    }
                    else {
                        // If no data response, it probably is the response for creating an new session.
                        // So we just fake one.
                        result = { status: 0, value: '' };
                    }
                }
                catch (err) {

                    /**
                     * `resultParseError` encounter an error when parsing the response data.
                     *
                     * @event
                     * @param err
                     * @param data
                     */
                    host.emit( 'resultParseError', err, data );

                    if (callback) {

                        // Set status to `-1` to indicate an error occur when parsing the response data.
                        callback({
                            status: -1,
                            value: data,
                            err: err
                        });
                    }

                    return;
                }

                // Error.
                if ( result.status !== 0){

                    /**
                     * `commandError` Indicate that something is wrong when executing the request command.
                     *
                     * @event
                     * @param result
                     */
                    host.emit( 'commandError', result, commandName );
                }
                else {

                    /**
                     * `result` Command is done successfully.
                     *
                     * @event
                     * @param result
                     */
                    host.emit( 'result', result );
                }

                // 若给定了 接口自己处理结果的handler
                // 则处理之，并将结果赋值给result
                if( resultHandler ){

                    result = resultHandler( {
                        response: response,
                        data: data,
                        result: result
                    });
                }

                if ( callback ) {
                    callback( result );
                }
            }
        );
    };
};

// strip the content from unwanted characters
var strip = function (str) {
    var x = [],
        i = 0,
        il = str.length;

    for (i; i < il; i++) {
        if (str.charCodeAt(i)) {
            x.push(str.charAt(i));
        }
    }

    return x.join('');
};

