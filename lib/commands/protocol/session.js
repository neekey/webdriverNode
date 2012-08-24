/**
 获取当前浏览器会话的信息
 或者删除这个会话（关闭浏览器窗口）

 用法：
     1、this.session(function(ret){});//获取
     2、this.session('get', function(ret){});//同上
     3、this.session('delete', function(ret){});//删除

 其中ret.value为
     Capabilities JSON Object

 注意：
    Capabilities JSON Object，desiredCapabilities是一个特殊对象（特殊格式的JSON），详细参看：http://code.google.com/p/selenium/wiki/JsonWireProtocol#Capabilities_JSON_Object
 */
var http = require("http");



exports.command = function(doWhat, callback)
{
    var commandOptionsGet =  {
        path: "/session/:sessionId",
        method: "GET"
    }

    var commandOptionsDelete =  {
        path: "/session/:sessionId",
        method: "DELETE"
    }

    var self = this;
    var options, request;

    if (typeof doWhat == "function")
    {
        callback = doWhat;
        doWhat = "get";
    }


    // set
    if (doWhat.toLowerCase() === "get")
    {
        request = this.createRequest(commandOptionsGet, this.proxyResponse(callback));
    }
    else if (doWhat.toLowerCase() === "delete")
    {
        request = this.createRequest(commandOptionsDelete,
            function()
            {
                // all this is done dor the sake of having one more extrerow in the console when done
                if (typeof callback === "function")
                {
                    callback();
                }
                console.log("");
            }
        );

    }
    else
    {
        throw "The session command need either a 'delete' or 'get' attribute to know what to do. example: client.session('get', callback) to get the capabilities of the session.";
        return;
    }

    var data = JSON.stringify({});
    request.write(data);
    request.end();

};