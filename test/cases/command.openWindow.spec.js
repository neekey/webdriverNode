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
                assert.equal( 1, oldWindowHandles.length );

                // 打开一个新窗口
                client.openWindow( 'http://www.taobao.com', function( ret ){

                    var newHandle = ret.value;

                    // 获取当前的windowHandles
                    client.protocol.windowHandles( function( ret ){

                        // 比较新的handle是否一致
                        var curWindowHandles = ret.value;
                        assert.equal( 2, curWindowHandles.length );
                        assert.equal( newHandle, curWindowHandles[ 1 ] );

                        // 结束会话
                        client.end(function(){
                            done();
                        })
                    });
                });
            });
        });
    });
});


