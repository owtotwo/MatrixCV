var express = require('express');
var router = express.Router();

// define the home page route
router.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
  });

module.exports = router;
