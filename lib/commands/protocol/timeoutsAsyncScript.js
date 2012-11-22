/**
 * 设置executeAsync方法的超时
 */

var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function( ms, callback )
{
    var optionsToUse = {
        path: '/session/:sessionId/timeouts/async_script',
        method: 'POST'
    };

    var data = {
        ms: ms
    };

    this._mods.communicate.request(
        optionsToUse,
        {
            callback: callback,
            commandName: Filename,
            data: data
        }
    );
};