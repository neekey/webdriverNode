var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe( 'Protocol methods', function(){
    describe( '#windowHandle()', function(){

        client.init();

        it( 'new page', function( done ){

            client.protocol.url( 'http://baidu.com' );
            client.protocol.windowHandle(function( ret ){

                assert.notEqual( undefined, ret.value );

                client.executeAsync(function(done){

                    var win = window.open( 'http://baidu.com' );
                    setTimeout( function(){
                        done( { win: win, body: document.body } );
                    }, 3000 );

                }, []);

                client.protocol.windowHandles(function(ret ){

                    var winHandles = ret.value;

                    client.protocol.window( winHandles[ 1 ] );

                    client.executeAsync( function( done){
                        document.body.style.background = 'red';
                        done();
                    }, []);

                    client.protocol.window( winHandles[ 0 ] );
                    client.executeAsync( function( done ){
                        document.body.style.background = 'yellow';
                        done();
                    }, null );

                    client.end(function(){
                            done();
                    });
                });
            });
        });
    });
});