var client = require("../lib/webdriverNode").remote({
    desiredCapabilities: {
        browserName:"firefox"
    }
});

var util = require( 'util' );

client
    .init()
    .url( 'http://base64.cnodejs.net/' )
    .pause( 1000 )
    .click( '.decode-textarea')
    .pause( 3000 )
    .keys( 'hello' )
    .keys( [ 'w', 'o', 'r', 'l', 'd', '!' ] )
    .pause( 5000 )
    .end();