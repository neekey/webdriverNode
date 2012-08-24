/**
 在指定元素上点击

 用法：this.elementIdClick(id, function(ret){});

 其中ret.value为null
 */
var http = require("http");
exports.command = function(id, callback)
{
    var commandOptions =  {
        path: "/session/:sessionId/element/:id/click",
        method: "POST"
    };

    var requestOptions = commandOptions;
    requestOptions.path = requestOptions.path.replace(/:id/gi, id);

    var data = {};

    this.executeProtocolCommand(
        requestOptions,
        this.proxyResponseNoReturn(callback),
        data
    );
};
