var client = require("../lib/webdriverNode").remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var util = require( 'util' );

client
    .init()
    .url("http://www.google.com")
    .alert( 'hello world' )
    .pause( 1000 )
    .getAlertText(function ( text ){

        this.log( 'alert text: ' + text );
    })
    .acceptAlert()
    .pause( 1000 )
    .prompt( 'hello' )
    .pause( 1000 )
    .setPromptText( "hello Neekey!" )
    .pause( 1000 )
    .getAlertText(function ( text ){

        this.log( 'prompt text: ' + text );
    })
    .acceptAlert()
    .end();







