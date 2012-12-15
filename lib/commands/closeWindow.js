/**
 * 关闭window，且在关闭窗口后回到关闭前处于激活状态的窗口
 * 注意：当只剩下一个窗口时，不会关闭窗口，而是将其通过`about:blank`的方式置空
 *
 * @param {String} windowHandle 需要关闭的窗口句柄
 * @param {Function} [callback]
 * @return undefined
 */

exports.command = function( windowHandle, callback )
{
    // 先保存当前window的handle
    var self = this;

    this.protocol.windowHandle(function( ret ){
        var curHandle = ret.value;

        /**
         * 如果需要关闭的是最后一个窗口，则不关闭这个窗口，只是将其置空。
         * 因为windows系统如果窗口都关闭的话，Server这边就无法进行其他命令的操作，继续请求会显示：
         * UnKnowError: Error communicating with remote browser, it may have died.
         * 与其针对windows单独处理，不如统一。
         */
        if( curHandle === windowHandle ){
            self.protocol.windowHandles(function( ret ){
                if( ret.value.length > 1 ){
                    // 激活到需要关闭的window
                    self.protocol.window( windowHandle );
                    // 关闭当前激活窗口
                    self.protocol.window();

                    /**
                     * 当执行closeWindow时，激活的window不为需要close的window，则在close之后激活会到原来的window
                     */

                    if( windowHandle !== curHandle ){
                        // 切换回到当之的窗口
                        self.protocol.window( curHandle, function( ret ){
                            callback();
                        });
                    }
                    else {
                        callback()
                    }
                }

                // 置空页面
                else {
                    self.execute(function(){
                        location.href = 'about:blank';
                    }, null, function(){
                        callback();
                    });
                }
            });
        }

        else {
            // 激活到需要关闭的window
            self.protocol.window( windowHandle );
            // 关闭当前激活窗口
            self.protocol.window();

            /**
             * 当执行closeWindow时，激活的window不为需要close的window，则在close之后激活会到原来的window
             */

            if( windowHandle !== curHandle ){
                // 切换回到当之的窗口
                self.protocol.window( curHandle, function( ret ){
                    callback();
                });
            }
            else {
                callback()
            }
        }
    });
};

