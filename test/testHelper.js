var serverConfig = require( './serverConfig' );
var path = require( 'path' );

module.exports = {
    getPageUrl: function( filename ){

        var pageBase = serverConfig.getPageBase();
        var baseName = path.basename( filename, '.js' );

        return pageBase + '/' + baseName + '.html';
    }
}