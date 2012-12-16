var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

/**
 * 向当前的frame中植入一段脚本进行执行，并返回执行的结果
 *
 * 在firefox下面，所有传递回来的Object对象都会被添加一个字段 `__fxdriver_unwrapped = true;`
 * @link http://code.google.com/p/selenium/source/browse/trunk/javascript/selenium-atoms/firefox-chrome.js?r=11730
 * @usage
 *  `execute( 'var args = arguments; var data = args[ 0 ]; var done = args[ 1 ]; console.log( data ); done( { msg: \'received\' } );',
 *      [{ commandName: 'execute'}],
 *      function( ret ){ console.log( ret.value.msg ) } ); `
 *
 * @param script
 * @param args
 * @param callback
 */

exports.command = function( script, args,  callback )
{
    var optionsToUse = {
        path: '/session/:sessionId/execute_async',
        method: 'POST'
    };

    var data;

    if( typeof args == 'function' ){
        callback = args;
        data = {
            script: script,
            args: []
        };
    }else{
        data = {
            script: script,
            args: args
        };
    }

    this._mods.communicate.request(
        optionsToUse,
        {
            callback: callback,
            commandName: Filename,
            data: data
        }
    );
};