var client = require( '../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"safari"
    }
});

setTimeout(function(){
    console.log( client );
}, 3000 );
