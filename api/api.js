var express = require('express');
var router = express.Router();

var cv = require('./cv');
var position = require('./position');

router.use('/cv', cv);
router.use('/position', position);

module.exports = router;
