var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
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
        it( 'GET: Get the session info', function( done ){

            var sessionId = client._data[ 'sessionId' ];

            client.protocol.session('GET', function( ret ){

                /**
                 * 下面是一个正常返回的对象结构

                var expectRet = {
                    sessionId: '1354848935413',
                    status: 0,
                    value:
                    {
                        platform: 'MAC',
                        'chrome.chromedriverVersion': '23.0.1240.0',
                        acceptSslCerts: false,
                        javascriptEnabled: true,
                        browserName: 'chrome',
                        rotatable: false,
                        locationContextEnabled: false,
                        'webdriver.remote.sessionid': '1354848935413',
                        version: '23.0.1271.95',
                        cssSelectorsEnabled: true,
                        databaseEnabled: false,
                        handlesAlerts: true,
                        browserConnectionEnabled: false,
                        webStorageEnabled: true,
                        nativeEvents: true,
                        'chrome.nativeEvents': false,
                        applicationCacheEnabled: false,
                        takesScreenshot: true
                    },
                    class: 'org.openqa.selenium.remote.Response',
                    hCode: 427145209
                };

                */

                assert.equal( 'number', typeof parseInt( sessionId ) );
                assert.equal( 0, ret.status );
                assert.equal( sessionId, Number( ret.sessionId ) );
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