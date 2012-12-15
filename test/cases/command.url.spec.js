var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe( 'Command methods', function(){
    describe( '#url()', function(){

        var URL = 'http://www.baidu.com/';
        client.init();

        it( 'new page', function( done ){

            client.url( URL, function( ret ){
                assert.equal( URL, ret.value );
                client.title(function( r ){
                    assert.equal( '百度一下，你就知道', r.value );
                    done();
                });
            });
        });

        it( 'get url', function(done){

            client.url(function( ret ){
                assert.equal( URL, ret.value );
                client.end(function(){
                    done();
                });
            });
        });
    });
});