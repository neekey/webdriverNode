/**
 在指定元素上顺序按下指定按键.特殊符号代码请查阅：http://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value

 用法：this.sendKeys(cssSelector, ['abc']);

 例如：
 <input id="id" style="display: none;" value="t1234" />

 this.sendKeys('#id', 'U+E00C');

 注意：此处支持所有的css选择器，可以多级使用，如（#id .class:first）
 */
exports.command = function(cssSelector, keys, callback)
{
    var self = this;
    self.element("css selector", cssSelector,
        function(result)
        {
            if (result.status == 0)
            {
                self.elementIdKeys(
                    result.value.ELEMENT,
                    keys,
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

