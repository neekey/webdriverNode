var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

/**
 * 获取和设置当前页面的URL值，注意即便已经通过frame协议切换到页面中的某个frame中，依旧获取和设置是父页面的URL值
 *
 * @param {String} url
 * @param {Function} [callback](ret)
 * @return {Object} `{ value: 'url' }`
 */

exports.command = function(url, callback){

    var commandOptionsPost =  {
        path: "/session/:sessionId/url",
        method: "POST"
    };
    var commandOptionsGet =  {
        path: "/session/:sessionId/url",
        method: "GET"
    };
    var data = {};
    var optionsToUse;

    if (typeof url === "string"){
        data.url = url;
        optionsToUse = commandOptionsPost;
    }
    else {
        optionsToUse = commandOptionsGet;
        callback = url;
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

