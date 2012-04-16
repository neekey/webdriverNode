var client = require("../lib/webdriverNode").remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var util = require( 'util' );

client
    .init()
    .url("http://www.google.com", function(){

        this.log( 'url finished!' );
        this.getTitle(function (){

            this.log( 'title get!' );
            this.setValue("#lst-ib", "webdriver")
                .submitForm("#tsf", function(){

                    this.log( 'form submmit!' );
                });

        }) ;
    })
    .pause( 1000, function (){

        this.log( 'pause!' );

        this.saveScreenshot();
        this.end(function ( r ){

            this.log( 'end!' );
//            console.log( JSON.stringify( r ) );
            console.log( r );
        });
    });







