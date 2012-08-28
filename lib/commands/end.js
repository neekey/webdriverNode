/**
 删除当前session，内部方法，一般不会用到
 */
exports.command = function(callback)
{
	this.protocol.session( 'delete', function( result ){

            this._mods.log.other( 'Session is deleted!' );
			if (typeof callback === "function"){
				callback( result );
			}
		}
	);
};

