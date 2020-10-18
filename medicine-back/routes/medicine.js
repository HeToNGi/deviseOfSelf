const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const conf = require('../config/conf');
const uuid = require('uuid').v4;
var format = require('date-format');

// 使用连接池
const pool = mysql.createPool(conf.mysql);

/*=================================================================*/
/*订单*/
router.post("/goods/order/list", (request, response, next) => {
  pool.query(`select count(1)
             from medicine_order,
                  medicine_shop,
                  medicine_users
             where medicine_order.medicine_shop_id = medicine_shop.id
               and medicine_shop.username = '${request.session.username}'
             order by create_date desc
              limit 0, 5`, (err, res) => {
    if (err) {
      next(err)
    } else {
      let total = res[0].total;
      if (total > 0) {
        let pageSize = request.body.page.pageSize;
        let pageNo = request.body.page.current;
        let startPage = (pageNo - 1) * pageSize;
        let sql = `select medicine_order.id,
                    id                                                                      as \`key\`,
                    (select username from medicine_users where id = medicine_order.user_id) as username,
                    order_no,
                    pay_type,
                    has_pay,
                    pickup_code,
                    order_price,
                    create_date
             from medicine_order,
                  medicine_shop,
                  medicine_users
             where medicine_order.medicine_shop_id = medicine_shop.id
               and medicine_shop.username = '${request.session.username}'
             order by create_date desc
             limit ${startPage}, ${pageSize}`;
        pool.query(sql, (error, results) => {
          if (error) {
            next(error)
          } else {
            response.json({
              code: 200,
              message: "查询成功",
              data: results,
              page: {total: total}
            });
          }

        })
      } else {
        response.json({code: 200, message: "查询成功", data: [], page: {total: 0}});
      }
    }


  })
})
/*=================================================================*/

/*药品开始*/
/*查询药品分类列表*/
router.post("/goods/list", (request, response, next) => {
  pool.query(`select count(1) as total
              from medicine_goods,
                   medicine_goods_type,
                   medicine_shop,
                   medicine_users
              where medicine_goods_type.id = medicine_goods_type_id
                and medicine_goods.is_delete = '0'
                and medicine_users.id = medicine_goods.user_id
                and medicine_shop.id = medicine_goods.medicine_shop_id
              order by medicine_goods.id desc
              limit 0, 5`, (err, res) => {
    if (err) {
      next(err)
    } else {
      let total = res[0].total;
      if (total > 0) {
        let pageSize = request.body.page.pageSize;
        let pageNo = request.body.page.current;
        let startPage = (pageNo - 1) * pageSize;
        // let sql = "select medicine_goods.id, medicine_goods.id as `key`, " +
        //   "(select username from medicine_users where id= user_id) as username, " +
        //   "medicine_goods_type.medicine_type_name," +
        //   "medicine_no, medicine_name,medicine_desc,medicine_price,medicine_num " +
        //   "from medicine_goods,medicine_goods_type where medicine_goods_type.id = medicine_goods_type_id and is_delete = '0' order by id desc limit ?, ?";
        let sql = `select medicine_goods.id,
       medicine_goods.id                                                       as \`key\`,
       (select username from medicine_users where id = medicine_goods.user_id) as username,
       medicine_goods_type.medicine_type_name,
       medicine_no,
       medicine_name,
       medicine_desc,
       medicine_price,
       medicine_num
from medicine_goods,
     medicine_goods_type,
     medicine_shop,
     medicine_users
where medicine_goods_type.id = medicine_goods_type_id
  and medicine_goods.is_delete = '0'
  and medicine_users.id = medicine_goods.user_id
  and medicine_shop.id = medicine_goods.medicine_shop_id
order by medicine_goods.id desc
limit ${startPage}, ${pageSize}`;
        let params = [startPage, pageSize];
        pool.query(sql, params, (error, results) => {
          if (error) {
            next(error)
          } else {
            response.json({
              code: 200,
              message: "查询成功",
              data: results,
              page: {total: total}
            });
          }

        })
      } else {
        response.json({code: 200, message: "查询成功", data: [], page: {total: 0}});
      }
    }


  })
})

/*药品删除*/
router.post("/goods/delete", (request, response, next) => {
  let sql = `delete from medicine_goods where id = ${request.body.id}`;
  pool.query(sql, (err, res) => {
    if (err) next(err)
    response.json({code: 200, message: "删除成功"});
  })
})

/*药品新增*/
router.post("/goods/add", (request, response, next) => {
  pool.query(`select id from medicine_shop where username = '${request.session.username}'`, (err, res) => {
    if (err) next(err)
    let sql2 = `insert into medicine_goods (user_id, medicine_shop_id, medicine_goods_type_id, medicine_no, medicine_name, medicine_desc, medicine_price,medicine_num, medicine_pic_url, create_date, is_delete) values (${request.session.user.id}, ${res[0].id},${request.body.medicine_goods_type_id},'${uuid()}', '${request.body.medicine_name}','${request.body.medicine_desc}',${request.body.medicine_price},${request.body.medicine_num}, '${request.body.medicine_pic_url}','${format.asString('yyyy-MM-dd', new Date())}','0')`;
    pool.query(sql2, (err, res) => {
      if (err) next(err)
      response.json({code: 200, message: "添加成功"});
    })
  })


})
/*药品结束*/

/*查询所有属于当前用户的分类*/
router.post("/goods/type/all", (request, response, next) => {
  let sql = `select medicine_goods_type.id, medicine_goods_type.medicine_type_name
            from medicine_goods_type,
                 medicine_users
            where medicine_users.username = '${request.session.username}'
              and medicine_goods_type.user_id = medicine_users.id`;
  pool.query(sql, (err, res) => {
    if (err) next(err)
    response.json({code: 200, message: "查询成功", data: res});
  })
})


/*查询药品分类列表*/
router.post("/goods/type/list", (request, response, next) => {
  pool.query(`select count(1) as total
              from medicine_goods_type`, (err, res) => {
    if (err) {
      next(err)
    } else {
      let total = res[0].total;
      if (total > 0) {
        let pageSize = request.body.page.pageSize;
        let pageNo = request.body.page.current;
        let startPage = (pageNo - 1) * pageSize;
        let sql = "select id, id as `key`, (select username from medicine_users where id= user_id) as username, medicine_type_name from medicine_goods_type order by id limit ?, ?";
        let params = [startPage, pageSize];
        pool.query(sql, params, (error, results) => {
          if (error) {
            next(error)
          } else {
            response.json({
              code: 200,
              message: "查询成功",
              data: results,
              page: {total: total}
            });
          }

        })
      } else {
        response.json({code: 200, message: "查询成功", data: [], page: {total: 0}});
      }
    }


  })
})

/*药品分类删除*/
router.post("/goods/type/delete", (request, response, next) => {
  pool.query(`select * from medicine_goods where medicine_goods_type_id = ${request.body.id}`, (err, res) => {
    if (err) next(err)
    if (res.length > 0) {
      response.json({code: 500, message: "此分类下有药品,不能删除"});
    } else {
      let sql = `delete from medicine_goods_type where id = ${request.body.id}`;
      pool.query(sql, (err, res) => {
        if (err) next(err)
        response.json({code: 200, message: "删除成功"});
      })
    }
  })
})

/*药品分类新增*/
router.post("/shop/goods/type", (request, response, next) => {

  let sql2 = `insert into medicine_goods_type (user_id, medicine_type_name) 
               values 
               (${request.session.user.id}, '${request.body.medicine_type_name}')`;
  pool.query(sql2, (err, res) => {
    if (err) next(err)
    response.json({code: 200, message: "添加成功"});
  })
})

/*查询药品分类列表*/
router.post("/goods/type/list", (request, response, next) => {
  pool.query(`select count(1) as total
              from medicine_goods_type`, (err, res) => {
    if (err) {
      next(err)
    } else {
      let total = res[0].total;
      if (total > 0) {
        let pageSize = request.body.page.pageSize;
        let pageNo = request.body.page.current;
        let startPage = (pageNo - 1) * pageSize;
        let sql = "select id, id as `key`, (select username from medicine_users where id= user_id) as username, medicine_type_name from medicine_goods_type order by id limit ?, ?";
        let params = [startPage, pageSize];
        pool.query(sql, params, (error, results) => {
          if (error) {
            next(error)
          } else {
            response.json({
              code: 200,
              message: "查询成功",
              data: results,
              page: {total: total}
            });
          }

        })
      } else {
        response.json({code: 200, message: "查询成功", data: [], page: {total: 0}});
      }
    }


  })
})

/*药品分类删除*/
router.post("/goods/type/delete", (request, response, next) => {
  pool.query(`select * from medicine_goods where medicine_goods_type_id = ${request.body.id}`, (err, res) => {
    if (err) next(err)
    if (res.length > 0) {
      response.json({code: 500, message: "此分类下有药品,不能删除"});
    } else {
      let sql = `delete from medicine_goods_type where id = ${request.body.id}`;
      pool.query(sql, (err, res) => {
        if (err) next(err)
        response.json({code: 200, message: "删除成功"});
      })
    }
  })
})

/*药品分类新增*/
router.post("/shop/goods/type", (request, response, next) => {

  let sql2 = `insert into medicine_goods_type (user_id, medicine_type_name) 
               values 
               (${request.session.user.id}, '${request.body.medicine_type_name}')`;
  pool.query(sql2, (err, res) => {
    if (err) next(err)
    response.json({code: 200, message: "添加成功"});
  })
})

/*查询药店申请信息*/
router.post("/getById", (request, response, next) => {
  let sql = `select id, shop_name, approve_status, shop_addr, shop_emps, shop_area, 
       CASE shop_cert WHEN  1 then TRUE WHEN  0 then FALSE END as shop_cert, approve_message, username 
       from medicine_shop where id = ${request.body.key}`;
  pool.query(sql, (err, res) => {
    if (err) next(err)
    if (res.length > 0) {
      response.json({code: 200, message: "查询成功", data: res[0]});
    } else {
      response.json({code: 500, message: "查询失败 ID不存在" + request.body.key});
    }
  })
})

/*资质审查审查通过*/
router.post("/approveReview", (request, response, next) => {
  let sql = `update medicine_shop set approve_status = '${request.body.approve_status}' where id = ${request.body.id}`;
  pool.query(sql, (err, res) => {
    if (err) next(err)
    response.json({code: 200, message: "资质审查完成"});
  })
})

/*资质审查列表 查询已经接受申请的列表*/
router.post("/queryByPageReview", (request, response, next) => {
  pool.query(`select count(1) as total
              from medicine_shop`, (err, res) => {
    if (err) {
      next(err)
    } else {
      let total = res[0].total;
      if (total > 0) {
        let pageSize = request.body.page.pageSize;
        let pageNo = request.body.page.current;
        let startPage = (pageNo - 1) * pageSize;
        let sql = "select id as `key`, shop_name, approve_status, shop_addr, shop_emps, shop_area, shop_cert, approve_message, username from medicine_shop where approve_status in ('1','3') order by id desc limit ?, ?";
        let params = [startPage, pageSize];
        pool.query(sql, params, (error, results) => {
          if (error) {
            next(error)
          } else {
            response.json({
              code: 200,
              message: "查询成功",
              data: results,
              page: {total: total}
            });
          }

        })
      } else {
        response.json({code: 200, message: "查询成功", data: [], page: {total: 0}});
      }
    }


  })

})

/*审核提交*/
router.post('/approveSubmit', (request, response, next) => {
  let approve_status = '1';
  if (request.body.can_approve === false) {
    approve_status = '2';
  }
  let sql = `update medicine_shop set approve_status = '${approve_status}',approve_message='${request.body.approve_message}' where id = ${request.body.id}`;
  pool.query(sql, (err, res) => {
    if (err) next(err)
    response.json({code: 200, message: "审核已提交"});
  })
})

/*分页查询药店申请信息*/
router.post("/queryByPage", (request, response, next) => {
  pool.query(`select count(1) as total
              from medicine_shop`, (err, res) => {
    if (err) {
      next(err)
    } else {
      let total = res[0].total;
      if (total > 0) {
        let pageSize = request.body.page.pageSize;
        let pageNo = request.body.page.current;
        let startPage = (pageNo - 1) * pageSize;
        let sql = 'select id as `key`, shop_name, approve_status, shop_addr, shop_emps, shop_area, shop_cert, approve_message, username from medicine_shop order by id desc limit ?, ?';
        let params = [startPage, pageSize];
        pool.query(sql, params, (error, results) => {
          if (error) {
            next(error)
          } else {
            response.json({
              code: 200,
              message: "查询成功",
              data: results,
              page: {total: total}
            });
          }

        })
      } else {
        response.json({code: 200, message: "查询成功", data: [], page: {total: 0}});
      }
    }


  })

})

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
