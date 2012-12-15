/**
 删除当前session，内部方法，一般不会用到
 */
exports.command = function(callback)
{
    /**
     * 在Windows下（暂时就测试了chrome)，多个用例一起执行的时候会出现 ` Command failed to close cleanly. Destroying forcefully`
     * 但是还是无法结束回话，导致一致无法返回
     * 因此这边做一个超时，如果超时了，就直接执行回调...\
     * todo 这个需求先hold住，但是之后看看能不能解决掉
     */

    var TIMEOUT = 10000;
    var ifTimeout = false;
    var self = this;
    var timer = setTimeout(function(){
        ifTimeout = true;
        self._mods.log.other( 'Deleting Session is timeout!' );
        if (typeof callback === "function"){
            callback();
        }
    }, TIMEOUT);

	this.protocol.session( 'delete', function( result ){

            if( ifTimeout === false ){
                clearTimeout( timer );
                self._mods.log.other( 'Session is deleted!' );
                if (typeof callback === "function"){
                    callback( result );
                }
            }
		}
	);
};

