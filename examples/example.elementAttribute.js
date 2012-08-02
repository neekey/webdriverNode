var client = require("../lib/webdriverNode").remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var util = require( 'util' );

console.log( client );
client
    .init()
    .url("http://base64.cnodejs.net/")
    .pause( 1000 )
    .setAttribute( '#decode-form .decode-textarea', 'value', 'hello world!' )
    .pause( 2000 )
    .end();







