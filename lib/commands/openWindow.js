var _ = require( 'underscore' );

exports.command = function( url, callback)
{
    var self = this;

    // 先获取当前的窗口windowHandle
    this.protocol.windowHandles(function( ret ){

        var oldHandles = ret.value;

        // 执行脚本打开窗口
        self.execute( function(){
            window.open();
        }, null );

        // 获取新的窗口句柄列表
        self.protocol.windowHandles(function( ret ){

            var newHandles = ret.value;
            // 比较两者的不同
            var diffHandles = _.difference( newHandles, oldHandles );

            if( diffHandles && diffHandles.length == 1 ){
                var newHandle = diffHandles[ 0 ];
                // Active to the new window handle.
                self.protocol.window( newHandle );
                // Open URL
                self.protocol.url( url, function(){
                    callback( { value: newHandle });
                });
            }
            else {
                throw new Error( 'Error when fetching new window handle!' );
            }
        });
    });

};

