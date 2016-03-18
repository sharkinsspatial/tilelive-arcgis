var arcTilelive = require('./ArcTilelive');

//tilelive protocols to register
var protocols = {
    //Exploded tile cache format
    'File'      : 'arcgis+file',
    //Compact tile cache format since ArcGIS 10.0
    'Bundle'    : 'arcgis+bundle'
}

exports = module.exports = {
    'File'      : arcTilelive(protocols['File']),
    'Bundle'    : arcTilelive(protocols['Bundle'])
}