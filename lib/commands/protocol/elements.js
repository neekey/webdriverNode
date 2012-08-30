/**
 类似element方法，不过这个查找是查找所有元素，并且返回数组

 用法：this.elements(id, keys, function(ret){});

 其中ret.value
 { [{'ELEMENT': string},{'ELEMENT': string}]
 }
 */
var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function(using, value, callback)
{

    var optionsToUse =  {
        path: "/session/:sessionId/elements",
        method: "POST"
    };

    var ExUsing = /class name|css selector|id|name|link text|partial link text|tag name|xpath/gi;
    if (!using.match(ExUsing)){
        this._mods.log.error( "Please provide any of the following using strings as the first parameter: class name, css selector, id, name, link text, partial link text, tag name or xpath" );
        process.exit(1);
    }

    var data =  {
        'using': using,
        'value': value
    };

    this._mods.communicate.request(
        optionsToUse,
        {
            callback: callback,
            commandName: Filename,
            data: data
        }
    );
};