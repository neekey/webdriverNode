/**
 获取当前页面title

 用法：this.getTitle(function(ret){});

 */
exports.command = function(callback)
{
	this.title(
		function(result)
		{
			if (result.status == 0)
			{
				if (typeof callback === "function")
				{
					
				//	console.log("RUNNNING MY CALLBACK ON TITLE")
					callback(result.value);
				}
			}
			else
			{
				if (typeof callback === "function")
				{
					callback(result);
				}
			}
		}
	);
	
};

