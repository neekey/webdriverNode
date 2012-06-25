/**
 Determine an element's location on the screen once it has been scrolled into view.

 Note: This is considered an internal command and should only be used to determine an element's location for correctly generating native events.

 用法：this.getLocationInView(cssSelector, function(ret){});

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
				self.elementIdLocationInView(result.value.ELEMENT, 
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

