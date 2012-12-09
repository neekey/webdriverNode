var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function( callback )
{

    var option =  {
        path: "/session/:sessionId/window_handle",
        method: "GET"
    };

    this._mods.communicate.request(
        option,
        {
            callback: callback,
            commandName: Filename
        }
    );
};

