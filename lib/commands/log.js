exports.command = function( msg, next )
{
    this._log.call( this, 'custom', msg );
    next();
};

