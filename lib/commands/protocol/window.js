var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );
var _ = require( 'underscore' );

exports.command = function( windowHandle, callback )
{

    var method;

    if( windowHandle === undefined || typeof windowHandle == 'function' ){
        callback = windowHandle;
        method = 'DELETE';
    }
    else {
        method = 'POST';
    }

    var option =  {
        path: "/session/:sessionId/window",
        method: method
    };

    var data = {
        name: windowHandle
    };

    this._mods.communicate.request(
        option,
        {
            callback: callback,
            commandName: Filename,
            data: data
        }
    );
};

