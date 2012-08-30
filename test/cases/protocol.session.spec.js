var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"firefox"
    }
});

describe( 'Protocol methods', function(){
    describe( '#session()', function(){
        it( 'POST: create an new session.', function( done ){

            assert.equal( undefined, client._data[ 'sessionId' ] );

            client.protocol.session('POST', function( ret ){

                var sessionId = client._data[ 'sessionId' ];
                assert.equal( 'number', typeof parseInt( sessionId ) );
                assert.equal( 0, ret.status );
                assert.equal( sessionId, ret.value );
                done();
            });
        });

        // 服务器会出错...还是有问题啊...
        it.skip( 'GET: Get the session info', function( done ){

            var sessionId = client._data[ 'sessionId' ];

            client.protocol.session('GET', function( ret ){

                assert.equal( 'number', typeof parseInt( sessionId ) );
                assert.equal( 0, ret.status );
                assert.equal( sessionId, ret.value );
                done();
            });
        });

        it( 'DELETE: delete a session.', function(done){

            client.protocol.session( 'DELETE', function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( '', ret.value );
                done();
            });
        });
    });
});