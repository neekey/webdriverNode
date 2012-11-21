var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe( 'Protocol methods', function(){
    describe( '#execute()', function(){
        it( 'Execute a script.', function( done ){

            client.init();
            client.protocol.url( 'http://www.baidu.com' );
            client.protocol.execute('alert("hello world");', function( ret ){
                client.end();
            });
        });
    });
});