var express = require('express');
var router = express.Router();

var cv = require('./cv');
var position = require('./position');
var user = require('./user');

router.use('/cv', cv);
router.use('/position', position);
router.use('/user', user);

module.exports = router;
