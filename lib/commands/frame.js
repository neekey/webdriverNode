var _ = require( 'underscore' );
/**
 * 切换到制定的frame中，参数selector根据类型不一样做不一样的获取
 *      Number: 切换到当前页面的第n个frame中, 1对应第一个
 *      String: 如果里面包含了'.', '#'等，则视为CSS Selector，否则视为frame的 name|id 值
 *      null: 切换到当前page的默认content中
 *      WebElement JSON Object: {ELEMENT: 1}
 *
 * 注意到所有的搜索都是在当前的frame中查找（top也算是一种frame吧），且不能跨越frame超找.
 *
 * @param {string|number|null|WebElementJSONObject} selector
 * @param callback
 */
exports.command = function( selector, callback)
{
    var self = this;

    if (arguments.length == 1)
    {
        callback = selector;
        selector = null;
    }
    else {
        var CSSSelectorEX = /[\.#]/g;

        // 若为CSSSelector，则先获取元素，然后再通过WebElement的形式制定frame
        if(_.isString( selector ) && CSSSelectorEX.test( selector ) ){

            self.protocol.element( 'css selector', selector, function( ret ){
                self.protocol.frame( ret.value, callback );
            });
        }
        // 若既然不为数字也不为WebElement
        else if( !_.isString( selector ) && !_.isNumber( selector ) && !( _.isObject(selector) && _.isNumber( selector.ELEMENT ) )){
            selector = null;
        }
    }

    self.protocol.frame( selector, callback );
};