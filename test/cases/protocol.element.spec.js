var assert = require( 'assert' );
var TestHelper = require( '../testHelper' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var pageInfo = {
    className: 'className',
    name: 'name',
    tagName: 'span',
    linkText: 'linkText',
    partialLinkText: 'partialLinkText'
};
var targetUrl = TestHelper.getPageUrl(__filename, pageInfo );

client.init();
client.protocol.url( targetUrl);

describe( 'Protocol methods', function(){
    describe( '#element()', function(){
        it( '', function( done ){
            client.protocol.element( 'class name', pageInfo.className, function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( 'object', typeof ret.value );
                // $ Number( '2px' );
                // --> NaN
                // $ Number( '2' );
                // --> 2
                // & parseInt( '2px' );
                // --> 2
                assert.equal( false, isNaN( Number( ret.value.ELEMENT ) ) );
                client.end(function(){
                    done();
                });
            });
        });
    });
});
