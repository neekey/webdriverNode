var client = require("webdriverjs").remote({
	desiredCapabilities: {
		browserName: 'chrome'
	}
});

client
    .init()
    .url("http://www.google.com")
    .setValue("#lst-ib", "webdriver")
    .submitForm("#tsf")
	.pause( 5000 )
    .end();



