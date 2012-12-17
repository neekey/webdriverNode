var assert = require( 'assert' );
var WD = require( '../../lib/core/webdriverNode');
var client = WD.remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

describe( 'Static methods', function(){
    describe( '#toJSON() #instantiate()', function(){

        client.init();

        it( 'get session info', function( done ){

            var sessionId;

            client.do( function(){
                sessionId = client._data[ 'sessionId' ];
            });

            client.protocol.session( 'get', function( ret ){

                // 验证返回的是一个正常的会话信息
                assert.equal( 'string', typeof sessionId );
                assert.equal( 0, ret.status );
                assert.equal( sessionId, ret.sessionId );

                var clientObj = WD.toJSON( client );
                var newClient = WD.instantiate( clientObj );

                newClient.protocol.session( 'get', function( r ){

                    // 除了hCode字段，其他字段应该都是一样滴
                    r.hCode = undefined;
                    ret.hCode = undefined;

                    assert.deepEqual( ret, r );
                    done();
                });
            });
        });
    });
});