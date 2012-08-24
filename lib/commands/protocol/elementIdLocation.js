/**
 确定一个元素在页面上的位置。（0,0）是指在页面的左上角。返回该元素的坐标x和y.

 用法：this.elementIdLocation(id, function(ret){});

 其中ret.value为
     {
         'x': number,
         'y': number
     }
 */
var http = require("http");

exports.command = function(id, callback)
{
    var commandOptions =  {
        path: "/session/:sessionId/element/:id/location",
        method: "GET"
    };

    var requestOptions = commandOptions;
    requestOptions.path = requestOptions.path.replace(/:id/gi, id);

    var request = this.createRequest(requestOptions, this.proxyResponse(callback));
    var data = JSON.stringify({});
    request.write(data);
    request.end();
};
