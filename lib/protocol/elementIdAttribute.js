/**
 获取指定元素的属性值

 用法：this.elementIDAttribute(id, attributeName, function(ret){});

 其中ret.value为
     string | null
 
 注意：
    此处直接返回属性值，如果没有这个属性为null
    此处的id可以通过element方法获取到
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
