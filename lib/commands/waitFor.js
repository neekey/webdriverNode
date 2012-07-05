/**
 等待某个元素出现在页面(需要设置超时)

 用法：this.waitFor(cssSelector, waitForMilliseconds， function(){});

 注意：此处支持所有的css选择器，可以多级使用，如（#id .class:first）
 */
exports.command = function(cssSelector, waitForMilliseconds, callback)
{
	var self = this;
	var startTimer = new Date().getTime();
	
	function checkElement()
	{
		self.element("css selector", cssSelector,
			function(result)
			{
				var now = new Date().getTime();
				
				if (result.status == 0)
				{		
					callback(result);
				}
				else
				{
					if (now - startTimer < waitForMilliseconds)
					{
						setTimeout(checkElement, 500);
					}
					else if (typeof callback === "function")
					{
						callback(result);
					}
				}
			}
		);
	}
	
	checkElement();
	
};

