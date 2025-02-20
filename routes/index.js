var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  setTimeout(() => {
    res.redirect('/listings');
  }, 1000); // 1000ms = 1 second delay
});

module.exports = router;
