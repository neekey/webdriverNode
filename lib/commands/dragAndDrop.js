/**
 拖拽指定元素到指定位置
 用法：this.dragAndDrop('#elemTarget', '#cssSelectorDropDestination')
 注意：此处支持所有的css选择器，可以多级使用，如（#id .class:first）
 */
exports.command = function(cssSelectorItem, cssSelectorDropDestination, callback)
{
	var self = this;
	
    self.moveToObject(cssSelectorItem)
    self.buttonDown()
    self.moveToObject(cssSelectorDropDestination)
    self.buttonUp(
        function()
		{
			if (typeof callback === "function")
			{
				callback();
		    }
		}
    )
 
};
