var express = require('express');
var router = express.Router();

router.get('*', function(req, res, next) {
  // get file at path X
  // if in cache and mtime is > cache one, transpile and cache
  // if not in cache, cache
  // serve cached
  res.send('');
});

module.exports = router;
