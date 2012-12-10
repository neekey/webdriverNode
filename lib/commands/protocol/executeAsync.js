/**
 在当前的frame中插入一段js脚本执行，并返回脚本执行后的结果。

 用法：
 1、this.execute('function(a,b,c){}', [a,b,c], function(ret){});
 2、this.execute('function(){}', function(ret){});

 其中ret.value为脚本返回的结果
 */

var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

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