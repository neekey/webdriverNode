/**
 去的当前页面的title值

 用法：this.title(function(ret){});

 其中ret.value为
    string
 */
var http = require("http");

exports.command = function(callback)
{
    var commandOptions =  {
        path: "/session/:sessionId/title",
        method: "GET"
    }


    var data = {};

    this.executeProtocolCommand(
        commandOptions,
        this.proxyResponse(callback),
        data
    );
};