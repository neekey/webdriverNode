var assert = require( 'assert' );
var TestHelper = require( '../testHelper' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var pageInfo = { title: 'This page is for #title() test.', name: 'title' };
var targetUrl = TestHelper.getPageUrl(__filename, pageInfo );

describe( 'Protocol methods', function(){
    describe( '#title()', function(){

        client.init();

        it( 'title should be equal to `pageInfo.title`', function( done ){

            client.protocol.url( targetUrl, function( ret ){
                assert.equal( 0, ret.status );
            });

            client.protocol.title( function( ret ){
                assert.equal( 0, ret.status );
                assert.equal( pageInfo.title, ret.value );
            });

            client.end(function(){
                done();
            });
        });
    });
});