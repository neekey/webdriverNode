/**
 获取指定元素的属性值
 用法：this.elementIDAttribute(id, attributeName, function(ret){});
 callback函数参数：ret = string | null
 注意：
    此处直接返回属性值，如果没有这个属性为null
    此处的id为
 */
var http = require("http");

exports.command = function(id, attributeName, callback) 
{
	var commandOptions =  {
		path: "/session/:sessionId/element/:id/attribute/:name",
		method: "GET"
	};
	
	var requestOptions = commandOptions;
	requestOptions.path = requestOptions.path.replace(/:id/gi, id);
	requestOptions.path = requestOptions.path.replace(":name", attributeName);
	
	var data = {};

	this.executeProtocolCommand(
		requestOptions, 
		this.proxyResponse(callback), 
		data
	);
};
