# tilelive-arcgis
A tilelive.js adapter for reading from tile storage cache of ArcGIS

[![Circle CI](https://circleci.com/gh/FuZhenn/tilelive-arcgis.svg?style=svg)](https://circleci.com/gh/FuZhenn/tilelive-arcgis)

## Introduction
This is a [tilelive](http://github.com/mapbox/tilelive) adapter from tile storage cache of ESRI ArcGIS.

It is readonly currently and can't be used to generate ArcGIS tile caches.

There are 2 implemetations:

tilelive-arcgis.File is for the exploded tile format used by ArcGIS 9.3.1 and before.

tilelive-arcgis.Bundle is for compact tiles format since ESRI ArcGIS 10.0

[ArcGIS Compact Tile](https://server.arcgis.com/zh-cn/server/latest/publish-services/windows/inside-the-compact-cache-storage-format.htm) is a tile format since ArcGIS version 10.

It bundles exploded tile files into a .bundlx and a .bundle file and really reduces number of tile files.

This library is a reader for the bundles.

PLEASE NOTICE: this library is not available for the improved compact format introduced in ArcGIS 10.3, and we are working on the upgrade. 

## Install

```bash
npm install tilelive-arcgis
```

## Usage

```javascript
var arcgis = require('tileive-arcgis');
var FileSource = arcgis.File,
    BundleSource = arcgis.Bundle;

//root folder of the tiles, where the Conf.xml stands
new BundleSource('./test/sample/bundle', function(err, source) {
    if (err) throw err;
    source.getTile(2, 0xd50, 0x971, function(err, tile, headers) {
        if (err) throw err;
        console.log(headers);
        //tile is the buffer.
        fs.writeFileSync(tile);        
    });
    source.getInfo(function(error, info){
        if (err) throw err;
        console.log(info);
    });
});

//root folder of the tiles, where the Conf.xml stands
new FileSource('./test/sample/file', function(err, source) {
    if (err) throw err;
    source.getTile(2, 0xd50, 0x971, function(err, tile, headers) {
        if (err) return done(err);
        console.log(headers);
        //tile is the buffer.
        fs.writeFileSync(tile);        
    });
    source.getInfo(function(error, info){
        if (err) throw err;
        console.log(info);
    });
});
```
