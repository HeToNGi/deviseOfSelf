const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const conf = require('../config/conf');

// 使用连接池
const pool = mysql.createPool(conf.mysql);

/*药店入驻申请*/
router.post("/approve", (req, res, next) => {

  pool.query(`select * from medicine_shop where username = '${req.session.username}'`, (error, results) => {
    if (error) next(error)
    if (results.length > 1) {
      response.json({code: 500, message: "一个账号只能申请一个药店"});
    } else {
      let sql = `insert into medicine_shop 
               (shop_name, approve_status, shop_addr, shop_emps, shop_area, shop_cert, username) 
               values 
               ('${req.body.shop_name}','0','${req.body.shop_addr}','${req.body.shop_emps}','${req.body.shop_area}',${req.body.shop_cert},'${req.session.username}')`;
      pool.query(sql, (err, result) => {
        if (err) {
          next(err);
        } else {
          res.json({code: 200, message: "申请成功，请等待审批！审批成功后可以登录"});
        }
      });
    }
  })


})

module.exports = router;
