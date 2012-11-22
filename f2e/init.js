var FS = require( 'fs' );
var Mustache = require( 'mustache' );
var Utils = require( './utils' );

var args = process.argv.splice(2);
var targetFile = args[0];
var userScript = FS.readFileSync( targetFile, 'utf-8' );
var userScriptChunks = parser( userScript );
var execScriptTPL = FS.readFileSync( './script_wrap.mustache', 'utf-8')
    .replace( /'{{/g, '{{' )
    .replace( /}}'/g, '}}' );

var libraryArray = [ './libs/jasmine-min.js', './libs/jasmine-jsreporter-min.js' ];
var libraryStr = Utils.addFilesToString( '', libraryArray );

var client = require( '../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

client.init();
client.protocol.timeoutsAsyncScript( 1000000 );
var __Jas = {
    data: {
        _data: {},
        get:function (attr) {
            return this._data[ attr ];
        },
        set:function (attr, value) {
            this._data[ attr ] = value
        },
        toJSON: function(){
            return this._data;
        }
    },

    testResult: []
};

scriptExec( userScriptChunks );

function scriptExec( exeData, index ){

    index = typeof index == 'undefined' ? 0 : index;
    if( index == exeData.length ){
        client.end(function(){
            FS.writeFileSync( './testResult.json', JSON.stringify( __Jas.testResult ) );
        });
        return;
    }

    var exe = exeData[ index ];
    var url = exe.url;
    var str = exe.str;
    var data = JSON.stringify( __Jas.data.toJSON() );
    var execScript = Mustache.render( execScriptTPL, {
        dataStr: data,
        librarys: libraryStr,
        userScript: str
    });

    client.protocol.url( url );
    client.protocol.executeAsync( execScript, function( response ){

        var Jas = response.value.__Jas;
        __Jas.data._data = Jas.data;
        __Jas.testResult.push( Jas.testResult );

        scriptExec( exeData, index + 1 );
    });
}

function parser( str ){
    var chunks = str.split( /\/\/@url\s+(.*)\n/g).splice( 1 );
    var ifUrl = true;
    var result = [];
    var item;

    chunks.forEach( function( chunk ){
        if( ifUrl ){
            item = { url: chunk };
            ifUrl = false;
        }
        else {
            item.str = chunk;
            result.push( item );
            ifUrl = true;
        }
    });

    return result;
}
