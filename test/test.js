var client = require( '../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"safari"
    }
});

client.init().end();