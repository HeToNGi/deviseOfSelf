var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.get("/1", (req, res, next) => {
    res.send("123122");
})


module.exports = router;
