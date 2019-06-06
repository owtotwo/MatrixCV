var express = require('express');
var router = express.Router();

var cv = require('./cv');

router.use('/cv', cv);

module.exports = router;
