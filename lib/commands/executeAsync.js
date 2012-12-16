var _ = require( 'underscore' );
var DEFAULT_TIMEOUT = 100000000;
var Compress = require( '../core/compress' );

/**
 * 异步执行方法
 *
 * @param {Function} exeFunc 需要在浏览器中执行的方法，最后一个参数为结束执行的回调
 * @param {Array} args 需要传递给exeFunc的参数, 必须，因为SyncRun机制的限制，无法只传递一个function（会被当做回调函数）
 * @param {Number} [timeout] 异步脚本执行的超时
 * @param {Function} [callback] 脚本执行完毕的回调
 */

exports.command = function( exeFunc, args )
{
    // 后面三个参数都是可选
    var timeout;
    var callback;
    var self = this;
    var _arguments = Array.prototype.slice.call( arguments, 1 );

    _arguments.forEach(function( arg ){

        if(_.isArray( arg )){
            args = arg;
        }

        if(_.isNumber(arg)){
            timeout = arg;
        }

        if(_.isFunction(arg)){
            callback = arg;
        }
    });


    // 设置超时
    this.protocol.timeoutsAsyncScript( timeout || DEFAULT_TIMEOUT );

    // 构造脚本
    var script = '(' + exeFunc.toString() + ').apply( this, Array.prototype.slice.call( arguments, 0 ) );';

    /**
     * 对script进行 NON-ASCII --> Unicode 处理
     */

    script = Compress( script, function( msg ){ self._mods.log.error( msg  ) });
    // 执行脚本
    this.protocol.executeAsync( script, args || [], function( result ){

            if (typeof callback === "function"){
                callback( result );
            }
        }
    );
};

