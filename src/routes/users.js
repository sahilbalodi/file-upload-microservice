var express = require('express');
var router = express.Router();
var api = require('../middleware/api-framework');
/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
