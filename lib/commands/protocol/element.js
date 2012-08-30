/**
 查找页面上的元素,并返回找到的第一个元素，下面列出了支持的查找模式
 ====================================================================
 模式                    描述
 class name             按照class查找元素；不支持.a .b这样的二级查找。
 css selector           按照css查找元素。
 id                     按照id查找元素。
 name                   按照name查找元素。
 link text              Returns an anchor element whose visible text matches the search value.
 partial link text      Returns an anchor element whose visible text partially matches the search value.
 tag name               按照tag name查找元素。
 xpath                  按照xpath查找元素。
 ====================================================================

 用法：this.element('css selector', '#content a', function(ret){});

 其中ret.value为
    {
        'ELEMENT': string
    }

 注意：此处返回值ret.ELEMENT是WebElement JSON object，用于标示这个节点。这是一个特殊的对象。
 */
var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function(using, value, callback) 
{
	
	var optionsToUse =  {
		path: "/session/:sessionId/element",
		method: "POST"
	};
	
	var ExUsing = /class name|css selector|id|name|link text|partial link text|tag name|xpath/gi;
	if (!using.match(ExUsing)){
		this._mods.log.error( "Please provide any of the following using strings as the first parameter: class name, css selector, id, name, link text, partial link text, tag name or xpath" );
	    process.exit(1);
    }
	
	var data =  {
        'using': using,
        'value': value
    };
	
    this._mods.communicate.request(
        optionsToUse,
        {
            callback: callback,
            commandName: Filename,
            data: data
        }
    );
};