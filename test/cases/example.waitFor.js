/**
 * keys方法测试
 */

var pageUrl = require( '../testHelper' ).getPageUrl( __filename );
var client = require("../../lib/webdriverNode").remote({
    desiredCapabilities: {
        browserName:"safari"
    }
});

client
    .init()
    .url( pageUrl )
    .waitFor( '#waitFor', 10000 )
    .alert( 'waitFor success!')
    .end(function( logs, tests ){

        console.log( tests );
    });