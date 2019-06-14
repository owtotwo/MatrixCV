var express = require('express');
var router = express.Router();

var position = require('./position');
var user = require('./user');
var admin = require('./admin');

router.use('/position', position);
router.use('/user', user);
router.use('/admin', admin);

module.exports = router;
