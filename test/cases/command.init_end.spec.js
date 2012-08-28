var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"safari"
    }
});

describe('Command methods', function(){

    describe('#init() #end()', function(){

        it( '#init()', function( done ){
            this.timeout( 5000 );

            client.init(function( ret ){
                assert.equal( 0, ret.status );
                done();
            });
        });

        it( '#end()', function( done ){
            client.end(function( ret ){
                assert.equal( 0, ret.status );
                done();
            });
        });
    });
});

