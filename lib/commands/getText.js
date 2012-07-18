/**
 获取指定元素的可见文本

 用法：this.getText(cssSelector, function(ret){});

 例如：
 <span id="id">text is ok !</span>

 this.getText('#id', function(ret){
    ret === 'text is ok !'
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

				self.elementIdText(result.value.ELEMENT,
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
					callback(result.value);
				}
			}
		}
	);
};

