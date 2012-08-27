/**
 此命令用于切换focus到另一个window中

 用法：this.window(window, function(ret){});

 其中ret.value为
    null
 注意：
    window参数可以是一个windowHandle对象也可以是window的name值
 */
var http = require("http");

exports.command = function(windowHandle, callback)
{

    var commandOptions =  {
        path: "/session/:sessionId/window",
        method: "POST"
    }


    var data = {"name": windowHandle};

    this._mods.communicate.request(
        commandOptions,
        this.proxyResponseNoReturn(callback),
        data
    );
};