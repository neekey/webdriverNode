/**
 确定一个元素在页面上的位置。（0,0）是指在页面的左上角。返回该元素的坐标x和y.

 用法：this.getLocation(cssSelector, function(ret){});

 其中ret为
     {
         'x': number,
         'y': number
     }
 */
exports.command = function(cssSelector, callback)
{
	var self = this;
	
	self.element("css selector", cssSelector,
		function(result)
		{
			if (result.status == 0)
			{
				self.elementIdLocation(result.value.ELEMENT, 
					function(result)
					{
						if (typeof callback === "function")
						{
							callback({x:result.value.x, y: result.value.y});
						}
					}
				);
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

