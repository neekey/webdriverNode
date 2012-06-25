/**
 获取指定元素的尺寸大小

 用法：this.getSize(cssSelector, function(ret))

 例如：
 <div id="id" style="width: 10px; height: 20px;"></div>

 this.getCssProperty('#id', function(ret){
    ret === {width: 10,height:20}
 })


 注意：此处支持所有的css选择器，可以多级使用，如（#id .class:first）
 */
exports.command = function(cssSelector, callback)
{
	var self = this;
	
	self.element("css selector", cssSelector,
		function(result)
		{
			if (result.status == 0)
			{
				self.elementIdSize(result.value.ELEMENT, 
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

