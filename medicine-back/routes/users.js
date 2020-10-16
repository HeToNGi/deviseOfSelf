const express = require('express');
const router = express.Router();
const dbPool = require('../util/commonUtil');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/*登录退出*/
router.post('/logout', (request, response, next) => {
  request.session.username = null;
  response.json({code: 200, message: "退出成功"});
})

/*判断用户是否登录*/
router.post('/isLogin', (request, response, next) => {
  if (!!request.session.username) {
    response.json({code: 200, message: ""});
  } else {
    response.json({code: 500, message: "未登录, 请先登录"});
  }
})

/*管理端登录*/
router.post('/login', (request, response, next) => {
  let body = request.body;
  let sql = `select id,username,user_password,user_type from medicine_users where username = '${body.username}'`;
  dbPool.query(sql, function (error, results, fields) {
    if (error) {
      next(error)
    }
    if (results.length === 0) {
      response.json({code: 500, message: "用户不存在"})
    } else {
      if (results[0].user_password !== body.user_password) {
        response.json({code: 500, message: "密码错误"});
      } else if (results[0].user_type !== body.user_type) {
        response.json({code: 500, message: "用户类型不正确"});
      } else {
        // 药店登录
        if (body.user_type === '1') {
          // 判断药店有没有申请过 如果没申请过  跳转到申请页面 , 申请过跳转到药品增删改查等页面
          dbPool.query(`select * from medicine_shop where username = '${body.username}'`, (error, results) => {
            // 查不到药店
            if (results.length === 0) {
              response.json({code: 200, message: "申请药店", approve: false});
            } else { // 申请过药店
              // 判断是否审核通过
              if (results[0].approve_status === '0') { // 已提交
                response.json({
                  code: 500,
                  message: "药店已申请，请等待审核通过后登录",
                  approve: true,
                  approveStatus: '0'
                });
              } else { // 审核通过
                request.session.username = body.username;
                response.json({
                  code: 200,
                  message: "登录成功",
                  data: results[0],
                  approve: true,
                  approveStatus: '1'
                });
              }
            }
          });
        } else if (body.user_type === '0') { // 管理员登录
          request.session.username = body.username;
          response.json({code: 200, message: "登录成功", data: results[0]});
        } else if (body.user_type === '2') { // 买家登录
          request.session.username = body.username;

        }


      }
    }
  });
})


/*管理端 注册*/
router.post('/register', (req, resp, next) => {
  let body = req.body;
  let sql = `select id from medicine_users where username = '${body.username}'`;
  dbPool.query(sql, function (error, results, fields) {
    if (error) throw next(error);
    if (results.length === 0) {
      let insertSql = `insert into medicine_users (username, user_type, user_password) values ('${body.username}', '${body.user_type}', '${body.user_password}')`;
      dbPool.query(insertSql, function (error, results, fields) {
        if (error) throw next(error)
        req.session.username = body.username;
        resp.json({code: 200, message: "注册成功"})
      })
    } else {
      resp.json({code: 500, message: "用户已存在"})
    }
  });

})


router.get("/1", (req, res, next) => {
  res.send("123122");
})


module.exports = router;
