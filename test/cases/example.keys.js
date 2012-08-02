/**
 * keys方法测试
 */

var pageUrl = require( '../testHelper' ).getPageUrl( __filename );
var client = require("../../lib/webdriverNode").remote({
    desiredCapabilities: {
        browserName:"firefox"
    }
});

client
    .init()
    .describe( '键盘输入测试', function(){
        this.url( pageUrl )
        .pause( 1000 )
        .it( '地址是否正确', function(){
            this.url(function( ret ){

                this.expect( ret.value ).toBe( pageUrl );
            });
        })
        .click( 'textarea')
        .pause( 2000 );

        this.it( '键盘使用字符串输入', function(){

            this.keys( 'hello' );
            this.getValue( 'textarea', function( value ){

                this.expect( value ).toBe( 'hello' );
            });  
        });

        this.it( '键盘使用数组输入', function(){
            
            this.keys( [ 'w', 'o', 'r', 'l', 'd', '!' ] );
            this.getValue( 'textarea', function( value ){

                this.expect( value ).toBe( 'helloworld!' );
            });          
        })
        .pause( 2000 );
    })
    .end(function( logs, tests ){

        console.log( tests );
    });