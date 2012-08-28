var assert = require( 'assert' );
var TestHelper = require( '../testHelper' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"opera"
    }
});

var targetUrl = TestHelper.getPageUrl(__filename);

describe( 'Protocol methods', function(){
    describe( '#url()', function(){

        client.init();

        it( 'new page', function( done ){

            client.protocol.url(targetUrl, function( ret ){
                assert.equal( 0, ret.status );
                done();
            });
        });

        it( 'get url', function(done){

            client.protocol.url(function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( targetUrl, ret.value );
                client.end(function(){
                    done();
                });
            });
        });
    });
});