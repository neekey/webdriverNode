/**
 * 关闭window，且在关闭窗口后回到关闭前处于激活状态的窗口
 * 注意：当只剩下一个窗口时，不会关闭窗口，而是将其通过`about:blank`的方式置空
 *
 * @param {String} windowHandle 需要关闭的窗口句柄
 * @param {Function} [callback]
 * @return undefined
 */

var _ = require( 'underscore' );

exports.command = function( windowHandle, callback )
{
    // 先保存当前window的handle
    var self = this;

    this.protocol.windowHandle(function( ret ){
        var curHandle = ret.value;

        /**
         * 如果一个窗口处于激活状态，然后这个窗口被关闭
         * 如果没有显性地指定激活到另一个打开着的窗口，那么执行`windowHandle`方法
         * 还是会返回那个已经关闭的不可用的窗口，因此这边需要做判定
         * 获取当前所有窗口列表，检查是否存在
         * 如果不存在，则使用最新的那个窗口作为关闭之后激活的窗口
         */

        self.protocol.windowHandles(function( ret ){

            var curHandleList = ret.value;

            if(_.indexOf( curHandleList, curHandle ) < 0 ){
                curHandle = curHandleList[ curHandleList.length - 1 ];
            }

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
    });
};

