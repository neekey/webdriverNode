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

                        var handle = ret.value[ 1 ];
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
                    assert.equal( 2, handles.length );
                    console.log( 2, handles );

                    client.protocol.window( 'f1-4' );
                    client.protocol.window();

                    client.protocol.windowHandles(function( ret ){

                        var handles = ret.value;

                        assert.equal( 1, handles.length );
                        console.log( 1, handles );

                        client.protocol.window( handles[ 0 ] );
                        client.protocol.window();
                        client.protocol.windowHandles(function( ret ){
                            var handles = ret.value;
                            assert.equal( 0, handles.length );
                            console.log( 0, handles );

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