exports.command = function( windowHandle, callback )
{

    // 先保存当前window的handle
    this.protocol.windowHandle(function( ret ){
        var curHandle = ret.value;

        // 激活到需要关闭的window
        this.protocol.window( windowHandle );
        // 关闭当前激活窗口
        this.protocol.window();
        // 切换回到当之的窗口
        this.protocol.window( curHandle, function( ret ){
            callback( ret );
        });
    });
};

