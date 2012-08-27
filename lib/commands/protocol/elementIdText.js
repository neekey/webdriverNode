/**
 查询一个元素的可见文本（待定）。Returns the visible text for the element.

 用法：this.elementIdText(id, function(ret){});

 其中ret.value为
 {
 //待定
 }
 */
var http = require("http");

exports.command = function(id, callback)
{
    var commandOptions =  {
        path: "/session/:sessionId/element/:id/text",
        method: "GET"
    };

    var requestOptions = commandOptions;
    requestOptions.path = requestOptions.path.replace(/:id/gi, id);

    var data = {};

    this._mods.communicate.request(
        requestOptions,
        this.proxyResponse(callback),
        data
    );
};
