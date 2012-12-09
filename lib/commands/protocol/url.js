var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function(url, callback)
{

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

