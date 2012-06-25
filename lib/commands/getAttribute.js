/**
 获取指定元素的指定属性值
 用法：this.getAttribute(cssSelector, attributeName, function(ret))
 例如：
    <div id="id" data-spm="12345"></div>
    this.getAttribute('#id', 'data-spm', function(ret){
        //ret为12345
    })
 注意：此处支持所有的css选择器，可以多级使用，如（#id .class:first）
 */
exports.command = function(cssSelector, attributeName, callback)
{
	var self = this;

	self.element("css selector", cssSelector,
		function(result)
		{
			if (result.status == 0)
			{
				self.elementIdAttribute(result.value.ELEMENT, attributeName, 
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
					callback(false);
				}
			}
		}
	);
	
};

