/**
 判断一个元素是否正在显示。

 用法：this.elementIdDisplayed(id, function(ret){});

 其中ret.value为
    boolean
 */
var http = require("http");


exports.command = function(id, callback)
{

    var commandOptions =  {
        path: "/session/:sessionId/element/:id/displayed",
        method: "GET"
    };

    var requestOptions = commandOptions;
    requestOptions.path = requestOptions.path.replace(/:id/gi, id);

    var data = {};

    this.executeProtocolCommand(
        requestOptions,
        this.proxyResponse(callback),
        data
    );
};
