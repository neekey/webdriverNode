/**
 鼠标左键单击指定元素 用法：this.click('#elem')

 注意：此处支持所有的css选择器，可以多级使用，如（#id .class:first)
*/
exports.command = function(cssSelector, callback)
{
	var self = this;
	self.element("css selector", cssSelector,
		function(result)
		{
			if (result.status == 0)
			{
				self.elementIdClick(result.value.ELEMENT, 
					function(result)
					{
						if (typeof callback === "function")
						{
							callback();
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

