var _ = require( 'underscore' );

/**
 * 同步执行方法
 *
 * @param {Function} exeFunc 需要在浏览器中执行的方法，通过return返回的值将作为 `ret.value` 返回给服务器
 * @param {Array} args 需要传递给exeFunc的参数, 必须，因为SyncRun机制的限制，无法只传递一个function（会被当做回调函数）
 * @param {Function} [callback] 脚本执行完毕的回调
 */

exports.command = function( exeFunc, args )
{
    // 后面三个参数都是可选
    var callback;
    var _arguments = Array.prototype.slice.call( arguments, 1 );

    _arguments.forEach(function( arg ){

        if(_.isArray( arg )){
            args = arg;
        }

        if(_.isFunction(arg)){
            callback = arg;
        }
    });

    // 构造脚本
    var script = 'return (' + exeFunc.toString() + ').apply( this, Array.prototype.slice.call( arguments, 0 ) );';
    // 执行脚本
    this.protocol.execute( script, args || [], function( result ){

            if (typeof callback === "function"){
                callback( result );
            }
        }
    );
};

