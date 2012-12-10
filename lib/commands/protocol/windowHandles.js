var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function( callback )
{
    // 窗口句柄的检查貌似有一定的延迟，比如刚刚关闭一个窗口，马上调用方法的话，可能那个被关闭的句柄还在
    var delay = 200;
    var option =  {
        path: "/session/:sessionId/window_handles",
        method: "GET"
    };
    var self = this;

    setTimeout(function(){
        self._mods.communicate.request(
            option,
            {
                callback: callback,
                commandName: Filename
            }
        );
    }, delay );
};

