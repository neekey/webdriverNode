/**
 移动鼠标到指定元素，在相对指定元素偏移（x,y）
 如果不指定元素，那么相对于当前鼠标位置偏移（x,y）
 如果指定元素，但不指定偏移值，鼠标将移动到该元素的中心
 如果指定的元素不在可见区域，会滚动文档使元素处于可见区域

 用法：
     1、this.moveTo(id, x, y, function(ret){});
     2、this.moveTo(x, y, function(ret){});
     3、this.moveTo(id, function(ret){});

 其中ret.value为null

 注意：
    id为WebElement JSON Object
 */
var http = require("http");

exports.command = function(element, xoffset, yoffset, callback)
{

    var data = {};

    if (typeof element == "string" && typeof element != "function" )
    {
        data.element = element;
    }
    else if (typeof element == "function")
    {
        callback = element;
    }

    if (typeof xoffset == "number" && typeof xoffset != "function" )
    {
        data.xoffset = xoffset;
    }
    else if (typeof xoffset == "function")
    {
        callback = xoffset;
    }

    if (typeof yoffset == "number" && typeof yoffset != "function" )
    {
        data.yoffset = yoffset;
    }
    else if (typeof yoffset == "function")
    {
        callback = yoffset;
    }

    var commandOptions =  {
        path: "/session/:sessionId/moveto",
        method: "POST"
    }

    this._mods.communicate.request(
        commandOptions,
        this.proxyResponseNoReturn(callback),
        data
    );
};