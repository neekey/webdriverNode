/**
 扩展的获取css属性方法，请参阅element方法（在css选择器无法获取到这个元素时可以采用）。

 用法：this.getElementCssProperty(using, value, cssProperty, function(ret){})

 例如：
    1、this.getElementCssProperty('name', 'myname', cssProperty, function(ret){})\\通过name查找元素
    2、this.getElementCssProperty('xpath', '/a[2]', cssProperty, function(ret){})\\通过xpath查找元素

 */
exports.command = function(using, value, cssProperty, callback)
{
	var self = this;
	self.element(using, value,
		function(result)
		{
			if (result.status == 0)
			{
				self.elementIdCssProperty(result.value.ELEMENT, cssProperty,
					function(result)
					{
						if (typeof callback === "function")
						{
							callback(result.value);
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

