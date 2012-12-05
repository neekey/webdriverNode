//#url http://baidu.com
document.body.style.background = 'red';
describe( 'Test if we arrived at "baidu"', function(){

    it( 'Test URL', function(){
        var host = location.host;
        expect( host).toEqual( 'www.baidu.com' );

        __Jas.data.set( 'prevHost', host );
    });
});

//#url http://taobao.com
document.body.style.background = 'blue';
describe( 'Test if we arrived at "taobao"', function(){

    it( 'Test URL', function(){
        var host = location.host;
        expect( host).toEqual( 'www.taobao.com' );
    });

    it( 'Test if we come from "baidu"', function(){
        expect( __Jas.data.get( 'prevHost' ) ).toEqual( 'www.baidu.com' );
    });
});
//#frame #selector

//@window http://taobao.com