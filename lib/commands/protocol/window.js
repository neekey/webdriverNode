var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function( windowHandle, close, callback )
{

    var optionSwitch =  {
        path: "/session/:sessionId/window",
        method: "POST"
    };

    var optionClose = {
        path: "/session/:sessionId/window",
        method: "DELETE"
    };

    var option;

    if( typeof close != 'function' ){
        option = optionClose;
    }
    else {
        option = optionSwitch;
    }

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

