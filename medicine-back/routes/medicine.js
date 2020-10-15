var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conf = require('../config/conf');

// 使用连接池
var pool = mysql.createPool(conf.mysql);

router.get('/', function (req, res, next) {
    if (pool) {
        res.json({
            status: '0000',
            msg: 'succees'
        });
    } else {
        res.json({
            status: '-1',
            msg: 'error!'
        });
    }
});

/**
 * 申请
 */
router.get("/approve", (req, res, next) => {
    let sql = `select * from medicine_shop`;
    pool.query(sql, (err, result) => {
        console.log(sql)
        console.log(err)
        console.log(result);
        if (err) {
            res.json({
                status: '0',
                msg: err.message
            });
        } else {
            res.json({
                status: '1',
                msg: '',
                result: result
            });
        }
    });

})


module.exports = router;
