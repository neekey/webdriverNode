var client = require("webdriverjs").remote();

var util = require( 'util' );

client
    .init()
    .url("http://www.google.com", function(){
        this.customLog( 'hello! url' );
        this.getTitle(function (){

            this.setValue("#lst-ib", "webdriver")
                .submitForm("#tsf", function(){
                    this.customLog( 'hello! submitForm' );})

        }) ;
    })
    .pause( 5000, function (){

        this.end(function ( r ){

            console.log( JSON.stringify( r ) );
        });
    });







