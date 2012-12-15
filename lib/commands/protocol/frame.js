var Path = require( 'path' );
var _ = require( 'underscore' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

/**
 * 切换到制定的frame中，参数selector根据类型不一样做不一样的获取
 *      Number: 切换到当前页面的第n个frame中, 1对应第一个
 *      String: 视为frame的 name|id 值
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
    var self = this
        , optionsToUse = {
            path: "/session/:sessionId/frame",
            method: "POST"
        };

    if ( arguments.length == 1 ){
        callback = selector;
        selector = null;
    }

    self._mods.communicate.request(
        optionsToUse,
        {
            callback: callback,
            commandName: Filename,
            data: { id: selector }
        }
    );
};