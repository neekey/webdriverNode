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
                assert.deepEqual( result, args );
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


