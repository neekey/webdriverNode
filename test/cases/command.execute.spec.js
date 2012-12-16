var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe('Command methods', function(){

    describe('#execute()', function(){

        it( 'with callback', function( done ){

            var args = [ 'string', 1, { commandName: 'execute' } ];

            client.init();
            client.protocol.url( 'http://www.baidu.com' );

            client.execute( function( s, n, obj ){

                document.body.style.background = 'red';
                return { result: [ s, n, obj ] };
            }, args, function( response ){

                var result = response.value.result;

                /**
                 * 在firefox下面，所有传递回来的Object对象都会被添加一个字段 `__fxdriver_unwrapped = true;`
                 * @link http://code.google.com/p/selenium/source/browse/trunk/javascript/selenium-atoms/firefox-chrome.js?r=11730
                 */
                // assert.deepEqual( result, args );

                assert.equal( args[ 0 ], result[ 0 ] );
                assert.equal( args[ 1 ], result[ 1 ] );
                assert.equal( args[ 2 ][ 'commandName' ], result[ 2 ][ 'commandName' ] );
                done();
            });
        });

        it( 'without callback', function( next ){

            client.execute(function(){
                document.body.style.background = 'yellow';
            }, null );

            client.end(function(){
                next();
            });
        });
    });
});


