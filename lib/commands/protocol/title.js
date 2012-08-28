/**
 去的当前页面的title值

 用法：this.title(function(ret){});

 其中ret.value为
    string
 */

var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function(callback)
{
    var optionsToUse = {
        path: '/session/:sessionId/title',
        method: 'GET'
    };

    this._mods.communicate.request(
        optionsToUse,
        {
            callback: callback,
            commandName: Filename
        }
    );
};

