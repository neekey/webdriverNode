/**
 * 关闭window，且在关闭窗口后回到关闭前处于激活状态的窗口
 *
 * @param {String} windowHandle 需要关闭的窗口句柄
 * @param {Function} [callback]
 * @return undefined
 */

exports.command = function( windowHandle, callback )
{
    // 先保存当前window的handle
    this.protocol.windowHandle(function( ret ){
        var curHandle = ret.value;
        // 激活到需要关闭的window
        this.protocol.window( windowHandle );
        // 关闭当前激活窗口
        this.protocol.window();

        /**
         * 当执行closeWindow时，激活的window不为需要close的window，则在close之后激活会到原来的window
         */

        if( windowHandle !== curHandle ){
            // 切换回到当之的窗口
            this.protocol.window( curHandle, function( ret ){
                callback();
            });
        }
        else {
            callback()
        }
    });
};

