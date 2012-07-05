/**
 鼠标移动到指定元素的中心

 用法：this.moveToObject(cssSelector);

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
                self.moveTo(result.value.ELEMENT,
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

