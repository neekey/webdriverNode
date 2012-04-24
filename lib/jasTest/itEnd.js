/**
 * 一个Suite结束时将被调用（该方法自动嵌入到describe方法中，不需要显性调用）
 * @param desc
 * @param next
 */
exports.command = function( next ){

    var currentSuite = this._currentSuite;

    if( currentSuite ){

        currentSuite.currentSpec && ( currentSuite.currentSpec.isDone = true );

        currentSuite.currentSpec = undefined;
    }

    next();
};