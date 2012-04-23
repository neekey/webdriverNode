var client = require("../lib/webdriverNode").remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var util = require( 'util' );

client
    .init()
    .describe( 'hello', function (){

        this.describe( 'hello!', function (){

            this.log( 'call describe in it success!' );
            this.log( 'hello!');


        });

        this.url("http://www.google.com", function(){

            this.log( 'url finished!' );
            this.getTitle(function (){

                this.log( 'title get!' );
                this.setValue("#lst-ib", "webdriver")
                    .submitForm("#tsf", function(){

                        this.log( 'form submmit!' );
                    });

            }) ;

            this.it( 'it in url', function (){

                this.expect( 1 ).toBe( 1 );
            } );

        });

        this.log( 'hello');
    })

    .describe( 'hello two!', function (){

            this.it( 'hello two it', function (){

                this.pause( 1 );

                this.end(function ( r ){

                    this.log( 'end!' );
                    console.log( this._suites[ 0 ].specs[ 0 ].items );
//            console.log( JSON.stringify( r ) );
//                    console.log( r );
                });
            });


        this.log( 'hello two');
    })









