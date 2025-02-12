var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send("Hi,I am root path");
});

module.exports = router;
