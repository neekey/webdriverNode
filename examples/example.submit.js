var client = require("webdriverjs").remote({
	desiredCapabilities: {
		chromeName: 'chrome'
	}
});

client
    .init()
    .url("http://www.google.com")
    .setValue("#lst-ib", "webdriver")
    .submitForm("#tsf")
    .end();



