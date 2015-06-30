var express = require('express');
var fs = require('fs');
var path = require('path');
var babel = require('babel');
var router = express.Router();

var cache = {};

router.get('*', function(req, res, next) {
  // get file at path X
  // if in cache and mtime is > cache one, transpile and cache
  // if not in cache, cache
  // serve cached
  var filePath = path.join(process.cwd(), req.path);
  res.type('text/javascript');
  fs.stat(filePath, function(err, stat) {
    var fileMTime = +stat.mtime;
    var cacheMTime = getCacheTime(filePath);
    if (isCached(filePath) && fileMTime <= cacheMTime) {
      console.log('Sent from cache');
      res.send(cache[filePath].code);
    } else {
      console.log('Sent from live');
      transformAndCache(filePath, function(err, code) {
        res.send(code);
      });
    }
  });
});

function transformAndCache(filePath, cb) {
  babel.transformFile(filePath, function(err, result) {
    cacheFile(filePath, result.code);
    cb(err, result.code);
  });
}

function isCached(path) {
  return cache[path];
}

function getCacheTime(path) {
  return (cache[path] && cache[path].time) || 0;
}

function cacheFile(path, transpiledCode) {
  cache[path] = {
    code: transpiledCode,
    time: +(new Date())
  };
}

module.exports = router;
