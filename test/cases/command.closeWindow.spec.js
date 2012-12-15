var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe('Command methods', function(){

    describe('#openWindow()', function(){

        it( 'normal', function( done ){

            client.init();
            client.protocol.url( 'http://www.baidu.com' );

            // 获取当前windowHandles
            client.protocol.windowHandles( function( ret ){

                var oldWindowHandles = ret.value;
                var oldHandle = oldWindowHandles[ 0 ];
                assert.equal( 1, oldWindowHandles.length );

                // 打开一个新窗口
                client.openWindow( 'http://s.taobao.com', function( ret ){

                    var newHandle = ret.value;

                    // 获取当前的windowHandles
                    client.protocol.windowHandles( function( ret ){

                        // 比较新的handle是否一致
                        var curWindowHandles = ret.value;
                        assert.equal( 2, curWindowHandles.length );
                        assert.equal( newHandle, curWindowHandles[ 1 ] );

                        // 关闭window
                        client.closeWindow( newHandle );

                        client.protocol.windowHandles( function( ret ){
                            assert.equal( 1, ret.value.length );
                            assert.equal( oldHandle, ret.value[ 0 ] );
                        });

                        // 结束会话
                        client.end(function(){
                            done();
                        })
                    });
                });
            });
        });

        it('close all', function( done ){

            client.init();

            // 先打开两个窗口
            client.protocol.url( 'http://www.baidu.com' );
            client.openWindow( 'http://s.taobao.com' );

            // 检查是否为两个窗口
            client.protocol.windowHandles(function( ret ){

                var windowHandles = ret.value;
                assert.equal( 2, windowHandles.length );
                var index;
                var handle;

                for( index = 0; handle = windowHandles[ index ]; index++ ){
                    client.closeWindow( handle );
                    client.protocol.windowHandles(function( ret ){
                        var count = windowHandles.length - index - 1;
                        if( count == 0 ){
                            count = 1;
                        }
                        assert( count, ret.value.length );
                    });
                }

                // 现在的窗口句柄数应该为1，且该页面为空
                client.protocol.windowHandles(function( ret ){
                    assert.equal( 1, ret.value.length );
                    client.title(function( ret ){
                        assert.equal( '', ret.value );
                    });
                    client.end(function(){
                        done();
                    });
                });
            });
        });
    });
});


