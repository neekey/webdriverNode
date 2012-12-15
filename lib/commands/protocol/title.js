var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

/**
 * 获取当前页面的title值，注意即便已经通过frame协议切换到页面中的某个frame中，依旧获取的是父页面的title值
 *
 * @param {Function} [callback](ret)
 * @return {Object} `{ value: 'title' }`
 */

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

