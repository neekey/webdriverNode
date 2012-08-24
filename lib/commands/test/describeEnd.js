/**
 * 一个Suite结束时将被调用（该方法自动嵌入到describe方法中，不需要显性调用）
 * @param desc
 * @param next
 */
exports.command = function( desc, next ){

    var currentSuite = this._currentSuite;

    if( currentSuite ){

        currentSuite.isDone = true;
    }

    // 一个suite结束，则设置当前suite为其父suite
    this._currentSuite = currentSuite.parent || undefined;

    next();
};