var arcTilelive = require('./ArcTilelive');

//tilelive protocols to register
var protocols = {
    //Exploded tile cache format
    'File'      : 'arcgis+file',
    //Compact tile cache format since ArcGIS 10.0
    'Bundle'    : 'arcgis+bundle',
    //Compact tile cache format since ArcGIS 10.3
    'Bundle2'   : 'arcgis+bundle2'
}

exports = module.exports = {
    'File'      : arcTilelive(protocols['File']),
    'Bundle'    : arcTilelive(protocols['Bundle']),
    'Bundle2'   : arcTilelive(protocols['Bundle2'])
}