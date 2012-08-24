/**
 在指定元素上顺序按下指定按键。
 特殊符号代码请查阅：http://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value

 用法：this.elementIdKeys(id, keys, function(ret){});

 其中ret.value为null

 注意：由于是按照顺序按下按键，因此会以此出发keydown和keyup事件，如果是!@等符号，则会先触发shift的按下，其他alt,ctr等类似
 */

var http = require("http");

exports.command = function(id, value, callback) 
{

	var commandOptionsPost =  {
		path: "/session/:sessionId/element/:id/value",
		method: "POST"
	};

	var commandOptionsGet =  {
		path: "/session/:sessionId/element/:id/value",
		method: "GET"
	};
	
	var self = this;

	// set
	if (typeof value === "string")
	{
		var requestOptions = commandOptionsPost;
		requestOptions.path = requestOptions.path.replace(/:id/gi, id);
		var data = {"value": value.split("")};
		
		self.executeProtocolCommand(
			requestOptions, 
			this.proxyResponseNoReturn(callback), 
			data
		);
	}
	
	// get
	else
	{
		callback = value;
		var data = {};
		
		var requestOptions = commandOptionsGet;
		requestOptions.path = requestOptions.path.replace(/:id/gi, id);
		
		self.executeProtocolCommand(
			requestOptions, 
			this.proxyResponse(callback), 
			data
		);
	}
	
};
