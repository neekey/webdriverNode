var assert = require( 'assert' );
var TestHelper = require( '../testHelper' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var pageInfo = { title: '#frame() test.', name: '#frame()' };
var childInfo = { title: '#frame()child' };
var targetUrl = TestHelper.getPageUrl(__filename, pageInfo );

describe( 'Command methods', function(){
    describe( '#frame()', function(){

        client.init();
        client.url( targetUrl );

        it( 'use as `name`', function( done ){

            client.frame( 'name-baidu' );
            client.title(function( ret ){
                assert.equal( '百度一下，你就知道', ret.value );
                // 返回到top
                client.frame(function(){
                    done();
                });
            });
        });

        it( 'use as `id`', function( done ){

            client.frame( 'id-google' );
            client.title(function( ret ){
                assert.equal( 'Google', ret.value );
                // 返回到top
                client.frame(function(){
                    done();
                });
            });
        });

        // todo 元素获取成功，但是目前会报出 "NoSuchFrame" 的错误
        it.skip( 'use css selector', function(done){

            client.frame( '.m-taobao' );
            client.title(function( ret ){
                assert.equal( '淘宝网触屏版', ret.value );
                // 返回到top
                client.frame(function(){
                    done();
                });
            });
        });

        it( 'use as number', function( done ){

            // 获取第一个frame
            client.frame( 0 );
            client.title(function( ret ){
                assert.equal( '百度一下，你就知道', ret.value );
                // 返回到top
                client.frame();
            });

            // 获取第二个
            client.frame( 1 );
            client.title(function( ret ){
                assert.equal( 'Google', ret.value );
                // 返回到top
                client.frame(function(){
                    done();
                });
            });
        });

        it( 'back to top', function( done ){

            // 现在在top上
            client.title(function( ret ){
                assert.equal( pageInfo.title, ret.value );

                // 进入子页面
                client.frame( 'child' );
                client.title(function( ret ){
                    assert.equal( childInfo.title, ret.value );

                    // 现在在子页面，我们进入子页面的 s.taobao.com
                    client.frame( 's-taobao' );
                    client.title(function( ret ){
                        assert.equal( '淘宝搜索', ret.value );

                        // 现在我们在子页面中的淘宝搜索页面, 我们现在返回top
                        client.frame();
                        client.title(function( ret ){
                            assert.equal( pageInfo.title, ret.value );
                            client.end(function(){
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});