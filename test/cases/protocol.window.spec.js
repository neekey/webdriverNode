var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe( 'Protocol methods', function(){
    describe( '#window()', function(){

        for( var i = 0; i < 10; i++ ){

            it( 'switch' + i, function( done ){
                client.init();

                /**
                 * 创建一个空的页面，由于windows下面，所有窗口都关闭后就不能再进行相关命令的操作
                 * 比如windowHandles方法就执行不了，我们获取不到0这个结果，因此滞留一个空白页面
                 * 所以测试过程中每次都有三个页面（滞留一个，我们脚本新开的2个）
                 */
                client.executeAsync( function( done ){
                    window.open( 'about:blank' );
                    done();
                }, null );

                client.protocol.windowHandles( function( ret ){
                    var handle = ret.value[ 1 ];
                    client.protocol.window( handle );
                });

                // Open one window
                client.protocol.url( 'http://www.baidu.com' );
                client.protocol.title(function( ret ){

                    assert.equal( '百度一下，你就知道', ret.value );

                    // Open another.
                    client.executeAsync( function( done ){
                        window.open( 'http://s.taobao.com' );
                        done();
                    }, null );

                    client.protocol.windowHandles( function( ret ){

                        var handle = ret.value[ 2 ];
                        client.protocol.window( handle );
                        client.protocol.title( function( ret ){

                            assert.equal( '淘宝搜索', ret.value );
                            done();
                        });
                    });
                });
            });

            it( 'close' + i, function( done ){

                client.protocol.windowHandles(function( ret ){

                    var handles = ret.value;
                    assert.equal( 3, handles.length );

                    // 关掉最后一个
                    client.protocol.window( handles[ 2 ] );
                    client.protocol.window();

                    client.protocol.windowHandles(function( ret ){

                        var handles = ret.value;

                        assert.equal( 2, handles.length );

                        // 关掉第二个
                        client.protocol.window( handles[ 1 ] );
                        client.protocol.window();
                        client.protocol.windowHandles(function( ret ){
                            var handles = ret.value;
                            assert.equal( 1, handles.length );

                            client.end(function(){
                                done();
                            });
                        });
                    });
                });
            });
        }
    });
});