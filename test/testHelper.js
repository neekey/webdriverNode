var serverConfig = require( './serverConfig' );
var path = require( 'path' );
var Fs = require( 'fs' );
var Mustache = require( 'mustache' );

module.exports = {
    getPageUrl: function( filename, data ){

        var pageBase = serverConfig.getPageBase();
        var baseName = path.basename( filename, '.js' );

        if( data ){
            this.renderPage( filename, data );
        }

        return pageBase + '/' + baseName + '.html?t=' + Date.now();
    },

    renderPage: function( filename, data ){

        var baseName = path.basename( filename, '.js' );
        var mustachePath = path.resolve( __dirname,  'pages/' + baseName + '.html.mustache' );
        var pagePath = path.resolve( __dirname,  'pages/' + baseName + '.html' );

        if( Fs.existsSync( mustachePath ) ){

            var pageHTML = Mustache.render( Fs.readFileSync( mustachePath).toString(), data );
            Fs.writeFileSync( pagePath, pageHTML );
        }
    }
};