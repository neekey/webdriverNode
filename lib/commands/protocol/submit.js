/**
 提交一个表单form，提交命令不只是只能用于form类型的元素，还可以对任何form元素的子元素。

 用法：this.submit(id, function(ret){});

 其中ret.value为null

 注意：
 此处的id可以通过element方法获取到
 */
var http = require("http");

exports.command = function(id, callback)
{
	var commandOptionsGet =  {
		path: "/session/:sessionId/element/:id/submit",
		method: "POST"
	};
	
	var self = this;
	var request, data, requestOptions;

	requestOptions = commandOptionsGet;
	requestOptions.path = requestOptions.path.replace(/:id/gi, id);
	request = this.createRequest(requestOptions, this.proxyResponseNoReturn(callback));
	data = JSON.stringify({});
	
	request.write(data);
	request.end();
};

