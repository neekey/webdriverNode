/**
 创建一个新的浏览器会话，可指定一些浏览器特性，返回创建的sessionId

 用法：
    1、this.init(desiredCapabilities, function(ret){});
    2、this.init(function(ret){});

 其中ret.value为
    Capabilities JSON Object

 注意：
    Capabilities JSON Object，desiredCapabilities是一个特殊对象（特殊格式的JSON），详细参看：http://code.google.com/p/selenium/wiki/JsonWireProtocol#Capabilities_JSON_Object
 */
var http = require("http");

exports.command = function(desiredCapabilities, callback) 
{
	
	var self = this;
	
	var commandOptions =  {
		path: "/session",
		method: "POST"
	}
	
	if (typeof desiredCapabilities == "function") 
	{
		callback = desiredCapabilities;
		desiredCapabilities = null;
	}
	else
	{
		self.desiredCapabilities = self.extend(self.desiredCapabilities, desiredCapabilities);
		if (desiredCapabilities.sessionId)
		{
			self.sessionId = desiredCapabilities.sessionId;
		}
	}
	
	
	var data =  {desiredCapabilities: self.desiredCapabilities, sessionId: null};
	
	this.executeProtocolCommand(
		commandOptions, 
		self.proxyResponse(callback, {setSessionId: true}), 
		data
	);
	
//	console.log("INIT ", typeof desiredCapabilities, desiredCapabilities)

	
/*
	var startOptions = {path: "/session"};

	var request = this.createRequest(startOptions, 
		function(response) 
		{
			var data = "";
			
			response.on('data', function(chunk) { data += chunk.toString(); });
			response.on('end', 
				function() 
				{
					if (response.headers.location == undefined) 
					{
						console.log('');
						console.log("\x1b[1;31m------- ERROR WHEN CREATING SESSION ------- \x1b[0m");
						console.log('');
						try
						{
							var jsonData = JSON.parse(data);
							console.log('STATUS\t', jsonData.status);
							console.log('VALUE\t', jsonData.value.message);
							console.log('CLASS\t', jsonData.value.class);
							console.log('');
							console.log('COMPLETE DATA DUMP', data);
						}
						catch (err)
						{
							console.log("ERROR WHEN CREATING SESSION ");
							console.log('COMPLETE DATA DUMP', data);
						}
						
						console.log('');
						console.log("\x1b[1;31m------------------------------------------- \x1b[0m");
						console.log('');
						return;
					}
					
				//console.log("NEW SESSION")
					
					var locationList = response.headers.location.split("/");
					self.sessionId = locationList[locationList.length - 1];
					
					
					
					if (callback) 
					{ 
						callback(self.sessionId);
					}
				}
			);
		}
	);
	
	request.write(JSON.stringify());
	request.end();
	*/
	
};