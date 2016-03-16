var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('queryString');
var FileTiler = require('tiler-arcgis-file'),
    BundleTiler = require('tiler-arcgis-bundle'),
    Bundle2Tiler = require('tiler-arcgis-bundle2');

module.exports=function(protocol) {
    var Tiler;
    if (protocol === 'arcgis+bundle') {
        Tiler = BundleTiler;     
    } else if (protocol === 'arcgis+bundle2') {
        Tiler = Bundle2Tiler;        
    } else if (protocol === 'arcgis+file') {
        Tiler = FileTiler;        
    } else {
        return null;
    }    

    function ArcTileLive(uri, callback) {
        if (typeof uri === 'string') uri = url.parse(uri, true);        
        else if (typeof uri.query === 'string') uri.query = qs.parse(uri.query);
        uri.query = uri.query || {};

        if (!uri.pathname) {
            callback(new Error('Invalid directory ' + url.format(uri)));
            return;
        }

        if (uri.hostname === '.' || uri.hostname == '..') {
            uri.pathname = uri.hostname + uri.pathname;
            delete uri.hostname;
            delete uri.host;
        }

        this.basepath = uri.pathname;
        
        if (protocol === 'arcgis+file') {
            this.filetype = uri.query.filetype || 'png';
            this.tiler = new Tiler(this.basepath, this.filetype);
            this.infoFile = 'conf.xml';    
        } else {
            this.tiler = new Tiler(this.basepath);
            this.infoFile = 'Conf.xml';
        }        
        callback(null);
    }

    ArcTileLive.registerProtocols = function(tilelive) {
        tilelive.protocols[protocol] = ArcTileLive;
    };

    ArcTileLive.prototype.getTile = function(z, x, y, callback) {
        this.tiler.getTile(x,y,z,callback);    
    };

    ArcTileLive.prototype.getGrid = function(z, x, y, callback) {
        callback(null);
    };

    ArcTileLive.prototype.getInfo = function(callback) {
        fs.readFile(path.join(this.basepath, this.infoFile), function(err, data) {
            if (err) return callback(err);
                    
            callback(null, data.toString('utf-8'));
        });
    };

    ArcTileLive.prototype.startWriting = function(callback) {
        callback(null);
    };

    ArcTileLive.prototype.stopWriting = function(callback) {
        callback(null);
    };

    ArcTileLive.prototype.putInfo = function(info, callback) {
        callback(null);
    };

    ArcTileLive.prototype.putTile = function(z, x, y, tile, callback) {
        callback(null);
    };

    ArcTileLive.prototype.putGrid = function(z, x, y, grid, callback) {
        callback(null);
    };

    ArcTileLive.prototype.close = function(callback) {
        callback(null);
    };    
    
    return ArcTileLive;
};

