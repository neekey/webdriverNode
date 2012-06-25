/**
 获取指定元素的指定CSS属性值

 用法：this.getCssProperty(cssSelector, cssProperty, function(ret))

 例如：
     <div id="id" style="color: #000000"></div>

     this.getCssProperty('#id', 'color', function(ret){
        //ret为#000000
     })


 注意：此处支持所有的css选择器，可以多级使用，如（#id .class:first）
 */

exports.command = function(cssSelector, cssProperty, callback)
{
	var self = this;
	self.element("css selector", cssSelector,
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

