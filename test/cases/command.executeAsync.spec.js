var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe('Command methods', function(){

    describe('#executeAsync()', function(){

        it( 'with callback', function( done ){

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

                done();
            });
        });

        it( 'without callback', function( next ){

            client.executeAsync(function( done ){
                document.body.style.background = 'yellow';
                done();
            }, undefined );

            client.end(function(){
                next();
            });
        });
    });
});


