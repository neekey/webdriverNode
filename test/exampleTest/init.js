var FS = require( 'fs' );

var args = process.argv.splice(2);
var file = args[0];
var script = FS.readFileSync( file, 'utf-8' );
var scriptRes = parser( script );

var assert = require( 'assert' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

client.init();
var Global = {
    _FT_: { _data: {}, get: function( attr ){ return this._data[ attr ]; }, set: function( attr, value ){ this._data[ attr ] = value }}
};

scriptExec( scriptRes );

function scriptExec( exeData, index ){

    index = typeof index == 'undefined' ? 0 : index;
    if( index == exeData.length ){
        client.end(function(){
            console.log( Global );
        });
        return;
    }

    var exe = exeData[ index ];
    var url = exe.url;
    var str = exe.str;
    var data = Global._FT_._data;

    client.protocol.url( url );
    client.protocol.execute( 'var _FT_ = { _data: ' + JSON.stringify(data) + ', get: function( attr ){ return this._data[ attr ]; }, set: function( attr, value ){ this._data[ attr ] = value }};\n '+ str + ' return { _global: { _FT_: _FT_}};', function( G ){

//        console.log( 'G', G.value._ );
        Global._FT_._data = G.value._global._FT_._data;
        scriptExec( exeData, index + 1 );
    });
}

//scriptRes.forEach(function(exeChunk){
//
//    var url = exeChunk.url;
//    var str = exeChunk.str;
//    var data = Global._FT_._data;
//
//    client.protocol.url( url );
//    client.protocol.execute( 'var _FT_ = { _data: ' + JSON.stringify(data) + ', get: function( attr ){ return this._data[ attr ]; }, set: function( attr, value ){ this._data[ attr ] = value }};\n '+ str + ' return { _global: { _FT_: _FT_}};', function( G ){
//        Global._FT_._data = G.value._global._FT_._data;
//    });
//});



function parser( str ){
    return [
        {
            'url': 'http://www.baidu.com',
            'str': 'document.body.style.background = \'red\'; _FT_.set( \'a\', \'a\' );'
        },
        {
            'url': 'http://www.taobao.com',
            'str': 'document.body.style.background = \'blue\';_FT_.get( \'a\' );'
        }
    ]
}