/**
 改变当前焦点为指定的frame中。如果id为空，那么切换到默认frame（一般为顶层frmae）。

 用法：this.frame(id, function(ret){});
    1、this.frame(0); //切换到页面中的第一个frame中
    2、this.frame({ELEMENT: 1});//切换到element方法查找到的指定元素中
    3、this.frame('myname');//切换到name值为myname的frame中
    4、this.frame();//切换到默认frame中

 其中ret.value为null
 */
var http = require("http");

exports.command = function(frameId, callback)
{

    var commandOptions =  {
        path: "/session/:sessionId/frame",
        method: "POST"
    }

    if (arguments.length == 1)
    {
        callback = frameId;
        frameId = null;
        data= {};
    }
    var data = {"id": frameId};

    this.executeProtocolCommand(
        commandOptions,
        this.proxyResponseNoReturn(callback),
        data
    );
};