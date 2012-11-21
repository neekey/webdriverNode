var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var script = [
    {
        url: 'baidu',
        str: '....'
    }
];


describe( 'Protocol methods', function(){
    describe( '#execute()', function(){
        it( 'Execute a script.', function( done ){

            client.init();
            client.protocol.url( 'http://www.baidu.com', function(){
                var newC = require( '../../lib/core/webdriverNode').remote({
                    desiredCapabilities: {
                        browserName:"chrome"
                    }
                });

                newC._data.sessionId = client._data.sessionId;

                setTimeout(function(){
                    newC.protocol.executeAsync('alert( "hahah");', function(){
                        //newC.end();
                        newC.protocol.acceptAlert(function(){

                            setTimeout(function(){
                                newC.end();
                            }, 3000);
                        });
                    });
                }, 3000);
            } );
            client.protocol.executeAsync('var cb = arguments[0]; document.body.style.background="red";cb("hello");', function( ret ){
                //client.end();
            });
        });
    });
});