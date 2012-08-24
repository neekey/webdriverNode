/**
 对当前页面截图，并返回base64后的PNG数据

 用法：this.screenshot(function(ret){})

 其中ret.value为base64后的PNG数据

 注意：不推荐使用这个方法，推荐使用saveScreenshot
 */
var http = require("http");


exports.command = function(callback)
{
    var commandOptions =  {
        path: "/session/:sessionId/screenshot",
        method: "GET"
    }


    var request = this.createRequest(commandOptions, this.proxyResponse(callback));
    var data = JSON.stringify( {} );
    request.write(data);
    request.end();
};