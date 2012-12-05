/**
 * Created with IntelliJ IDEA.
 * @author neekey
 * @date 12-12-5
 */
var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe('Command methods', function(){

    describe('#executeAsync()', function(){

        it( 'normal', function( done ){

            var args = [ 'string', 1, { commandName: 'executeAsync' } ];

            client.init();
            client.protocol.url( 'http://www.baidu.com');

            client.executeAsync( function( s, n, obj, done ){

                document.body.style.background = 'red';
                setTimeout(function(){
                    done({ result: [ s, n, obj ] } );
                }, 1000 );

            }, args, function( response ){

                var result = response.value.result;
                assert.deepEqual( result, args );
            });

            client.end(function(){
                done();
            });
        });
    });
});


