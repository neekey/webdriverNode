/**
 提交一个表单form，提交命令不只是只能用于form类型的元素，还可以对任何form元素的子元素。相当于在这个元素上按回车。

 用法：this.submitForm(cssSelector);

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
				self.submit(result.value.ELEMENT,
					function(result)
					{
						if (typeof callback === "function")
						{
							callback(result);
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

