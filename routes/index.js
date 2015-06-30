var express = require('express');
var fs = require('fs');
var path = require('path');

var router = express.Router();

router.get('*', function(req, res, next) {
  // get file at path X
  // if in cache and mtime is > cache one, transpile and cache
  // if not in cache, cache
  // serve cached
  var filePath = path.join(process.cwd(), req.path);
  fs.readFile(filePath, { encoding: 'utf8' }, function(err, contents) {
    // encode as JS / CSS / whatevs
    res.send(contents);
  });
});

module.exports = router;
