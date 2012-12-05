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
                document.body.style.background="red";\
                return ' + JSON.stringify( resultData );

            client.init();
            client.protocol.url( 'http://www.baidu.com' );
            client.protocol.execute( script, function( ret ){
                var result = ret.value;
                assert.deepEqual( result, resultData );
            });
            client.end(function(){
                done();
            });
        });
    });
});