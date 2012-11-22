/**
 * 工具集合
 */
var FS = require( 'fs' );
var _ = require( 'underscore' );
var NEW_LINE = '\r\n';

module.exports = {

    addFileToString: function( str, file, mode ){

        mode = mode || 'append';
        var fileStr = FS.readFileSync( file, 'utf-8' ).toString();
        var result;

        switch ( mode ){
            case 'append':
                result = str + NEW_LINE + fileStr;
                break;
            case 'prepend':
                result = fileStr + NEW_LINE + str;
                break;
            default:
                result = str;
                break;
        }

        return result;
    },

    addFilesToString: function( str, files, mode ){

        var self = this;
        var result = str;

        if( !_.isArray( files ) ){
            files = [ files ];
        }

        files.forEach(function( file ){
            result = self.addFileToString( result, file, mode );
        });

        return result;
    }
};