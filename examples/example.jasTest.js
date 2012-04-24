var client = require("../lib/webdriverNode").remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var util = require( 'util' );

client
    .init()
    .describe( 'Main Suite', function (){

        this.describe( 'Child Suite', function (){

            this.it( 'Simple Spec', function (){

                this.expect( 1 ).not.toBe( 2 );
                this.expect( 'hellohahaa').toMatch( '^hello.+' );
                this.expect( 'hello' ).toBeDefined();
                this.expect( undefined).toBeUndefined();
                this.expect( null).toBeNull();

            });
        });

        this.url("http://www.google.com", function(){

            this.it( 'title Test', function (){

                this.getTitle(function ( title ){

                    this.expect( title ).toBe( 'Google' );

                    this.setValue("#lst-ib", "webdriver")
                        .getValue( '#lst-ib', function ( value ){

                            this.expect( value ).toBe( 'webdriver' );
                        })
                        .submitForm("#tsf");
                }) ;
            });
        });
    })

    .describe( 'The Other Main Suite', function (){

            this.it( 'The Other Simple Spec', function (){

                var currentTime;

                this.do(function (){

                    currentTime = Date.now();
                });

                this.pause( 1, function (){

                    this.expect( Date.now() - currentTime > 0).toBe( true );
                } );

                this.end(function ( logs, testResult ){

                    console.log( 'Test Result: ', testResult );
                    console.log( 'All Logs: ', logs );
                });
            });
    });









