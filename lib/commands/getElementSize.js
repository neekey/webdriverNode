/**
 扩展的获取元素的尺寸大小，请参阅element方法（在css选择器无法获取到这个元素时可以采用）。

 用法：this.getElementSize(using, value, function(ret){})

 例如：
    1、this.getElementSize('name', 'myname',  function(ret){})\\通过name查找元素
    2、this.getElementSize('xpath', '/a[2]',  function(ret){})\\通过xpath查找元素

 其中ret为
     {
         width:number,
         height:number
     }
 */
exports.command = function(using, value, callback)
{
	var self = this;

	self.element(using, value,
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

