/**
 获取当前页面的uri(可以通过frame方法取得frame中的uri)
 跳转到某uri

 用法：
 1、this.url(function(ret){});//获取uri

 其中ret.value为
    string

 2、this.url('http://www.taobao.com/', function(ret){});//在当前页面打开淘宝首页

 其中ret.value为
    null
 */

var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function(url, callback)
{

    var commandOptionsPost =  {
        path: "/session/:sessionId/url",
        method: "POST"
    };
    var commandOptionsGet =  {
        path: "/session/:sessionId/url",
        method: "GET"
    };
    var data = {};
    var optionsToUse;

    if (typeof url === "string"){
        data.url = url;
        optionsToUse = commandOptionsPost;
    }
    else {
        optionsToUse = commandOptionsGet;
        callback = url;
    }

    this._mods.communicate.request(
        optionsToUse,
        {
            callback: callback,
            commandName: Filename,
//            resultHandler: function( type ){},
            data: data
        }
    );
};

