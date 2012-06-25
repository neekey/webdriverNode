/**
 此命令暂不解释，可以实现window的位置、大小改变。
 http://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window
 */
var http = require("http");

exports.command = function(callback)
{
    var commandOptions =  {
        path: "/session/:sessionId/window_handles",
        method: "GET"
    }

    var data = {};

    this.executeProtocolCommand(
        commandOptions,
        this.proxyResponse(callback),
        data
    );
};