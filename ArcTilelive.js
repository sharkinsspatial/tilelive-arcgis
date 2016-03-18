var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var tiletype = require('tiletype');

var FileTiler = require('tiler-arcgis-file'),
    BundleTiler = require('tiler-arcgis-bundle');

module.exports=function(protocol) {
    var Tiler;
    if (protocol === 'arcgis+bundle') {
        Tiler = BundleTiler;
    } else if (protocol === 'arcgis+file') {
        Tiler = FileTiler;
    } else {
        return null;
    }

    function ArcTilelive(uri, callback) {
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
        callback(null, this);
    }

    ArcTilelive.registerProtocols = function(tilelive) {
        tilelive.protocols[protocol+':'] = ArcTilelive;
    };

    ArcTilelive.prototype.getTile = function(z, x, y, callback) {
        this.tiler.getTile(x,y,z,function(error, tile) {
            if (error) {
                callback(error);
                return;
            }
            var headers = {};
            if (!this.filetype) {
                this.filetype = tiletype.type(tile.data);
            }
            headers['Last-Modified'] = new Date(tile.lastModified).toUTCString();
            headers['ETag'] = tile.data.length + '-' + Number(tile.lastModified);
            headers['Content-Type'] = 'image/'+this.filetype
            return callback(null, tile.data, headers);
        });
    };

    ArcTilelive.prototype.getGrid = function(z, x, y, callback) {
        callback(null);
    };

    ArcTilelive.prototype.getInfo = function(callback) {
        fs.readFile(path.join(this.basepath, this.infoFile), function(err, data) {
            if (err) return callback(err);

            callback(null, {
                'protocol' : protocol,
                'conf'     : data.toString('utf-8')
            });
        });
    };

    ArcTilelive.prototype.startWriting = function(callback) {
        callback(null);
    };

    ArcTilelive.prototype.stopWriting = function(callback) {
        callback(null);
    };

    ArcTilelive.prototype.putInfo = function(info, callback) {
        callback(null);
    };

    ArcTilelive.prototype.putTile = function(z, x, y, tile, callback) {
        callback(null);
    };

    ArcTilelive.prototype.putGrid = function(z, x, y, grid, callback) {
        callback(null);
    };

    ArcTilelive.prototype.close = function(callback) {
        callback(null);
    };

    return ArcTilelive;
};

