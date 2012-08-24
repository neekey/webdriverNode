/**
 在指定元素上顺序按下指定按键。特殊符号代码请查阅：http://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value

 用法：this.elementIdKeys(id, keys, function(ret){});

 其中ret.value为null
 */
var http = require("http");
exports.command = function(id, keys, callback)
{
    var commandOptions =  {
        path: "/session/:sessionId/element/:id/value",
        method: "POST"
    };

    var requestOptions = commandOptions;
    requestOptions.path = requestOptions.path.replace(/:id/gi, id);

    var data = {"value" : keys};

    this.executeProtocolCommand(
        requestOptions,
        this.proxyResponseNoReturn(callback),
        data
    );
};
