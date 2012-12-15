var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

/**
 * 获取到当前的所有窗口句柄列表
 * 注意：对于windows，当所有窗口都被关闭时，所有对于浏览器的操作请求都无法继续执行，因此无法获取到window句柄为0的情况
 * @param callback
 */

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

