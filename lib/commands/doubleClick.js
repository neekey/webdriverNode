/**
 鼠标左键双击指定元素
 用法：this.doubleClick('#elem')
 注意：此处支持所有的css选择器，可以多级使用，如（#id .class:first
 */
exports.command = function(cssSelector, callback)
{
    var self = this;

    self.moveToObject(cssSelector);
    self.element("css selector", cssSelector,
        function(result)
        {
            if (result.status == 0)
            {
                self.doDoubleClick(
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

