var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe( 'Protocol methods', function(){
    describe( '#execute()', function(){
        it( 'Execute a script.', function( done ){

            var resultData = {
                commandName: "executeAsync"
            };

            var script = '\
                var cb = arguments[0]; \
                document.body.style.background="red";\
                cb( ' + JSON.stringify( resultData ) + ');\
            ';

            client.init();
            client.protocol.url( 'http://www.baidu.com');
            client.protocol.timeoutsAsyncScript( 100000 );
            client.protocol.executeAsync( script, function( ret ){
                var result = ret.value;
                assert.deepEqual( result, resultData );
            });
            client.end(function(){
                done();
            });
        });
    });
});