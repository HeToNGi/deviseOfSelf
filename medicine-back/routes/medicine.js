const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const conf = require('../config/conf');
const uuid = require('uuid').v4;
const format = require('date-format');
const getConnection = require("../util/dbUtil").getConnection;
const releaseConnection = require("../util/dbUtil").releaseConnection;
const beginTransaction = require("../util/dbUtil").beginTransaction;
const rollBack = require("../util/dbUtil").rollBack;
const commit = require("../util/dbUtil").commit;
const execSqlByConn = require("../util/dbUtil").execSqlByConn;

// 使用连接池
const pool = mysql.createPool(conf.mysql);


function execSql(sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (error, results) => {
      if (error) {
        // console.log("=================================================")
        // console.log("执行sql失败", sql)
        // console.log("错误", error)
        // console.log("=================================================")
        reject(error)
      } else {
        // console.log("*************************************************")
        // console.log("执行sql成功", sql)
        // console.log("结果集", results)
        // console.log("*************************************************")
        resolve(results)
      }
    })
  })
}


/*=================================================================*/
/*客户端*/
/*支付*/
router.post("/client/order/pay", async (request, response, next) => {
  let list = [];
  let connection;
  try {
    connection = await getConnection().catch(err => {
      throw err;
    })
    await beginTransaction(connection).catch(err => {
      throw err;
    })

    let orders = await execSqlByConn(connection, `select medicine_goods.medicine_shop_id
                              from medicine_car,
                                   medicine_goods
                              where medicine_goods_no = medicine_goods.medicine_no
                                and medicine_car.user_name = '${request.session.username}'
                              group by medicine_goods.medicine_shop_id`).catch(err => {
      throw err;
    });
    if (orders.length === 0) {
      throw new Error("购物车为空或者已支付");
    }
    for (let i in orders) {
      // 开始
      let order = orders[i];

      // 订单号
      let orderNo = Math.random().toString(36).substr(-10);
      // 查询同一家店的 创建一个订单
      let result = await execSqlByConn(connection, `select id, user_name, medicine_goods_no, medicine_price, medicine_num
                                        from medicine_car 
                                        where user_name = '${request.session.username}' 
                                              and medicine_goods_no in 
                                                  (select medicine_no from medicine_goods where medicine_shop_id = ${order.medicine_shop_id})`).catch(err => {
        throw err;
      });
      for (let i in result) {
        let item = result[i];
        // 检查库存
        let goods = await execSqlByConn(connection, `select medicine_num,medicine_name,medicine_price 
                                                            from medicine_goods where medicine_no = '${item.medicine_goods_no}'`).catch(err => {
          throw err;
        });
        if (goods[0].medicine_num <= 0) {
          throw new Error(goods[0].medicine_name + " 库存为0，请重新选择")
        }
        // 更新库存
        await execSqlByConn(connection, `update medicine_goods  set medicine_num = medicine_num - ${item.medicine_num} 
                                                                        where medicine_no = '${item.medicine_goods_no}'`).catch(err => {
          throw err;
        });
        // 订单项
        await execSqlByConn(connection, `insert into medicine_order_item (user_id, order_no, medicine_goods_no, medicine_price, medicine_num) 
                        values 
                        ((select id from medicine_users where username = '${request.session.username}'),
                         '${orderNo}','${item.medicine_goods_no}',${goods[0].medicine_price * item.medicine_num}, ${item.medicine_num})`).catch(err => {
          throw err;
        });
      }

      // 订单 默认为已支付
      let hasPay = '1';
      if (request.body.payType === "2") {
        hasPay = '2';
      }
      await execSqlByConn(connection, `insert into medicine_order (user_id, order_no, pay_type, has_pay, 
                            order_price, create_date, has_pickup, medicine_shop_id, order_address)
                      values 
                      ((select id from medicine_users where username = '${request.session.username}'),
                         '${orderNo}','${request.body.payType}', '${hasPay}',
                       (select sum(medicine_price) from medicine_car where user_name = '${request.session.username}' and medicine_goods_no in 
                                                  (select medicine_no from medicine_goods where medicine_shop_id = ${order.medicine_shop_id})),
                       '${format.asString('yyyy-MM-dd hh:mm:ss', new Date())}', '0', ${order.medicine_shop_id},
                       '${request.body.orderAddress}')`).catch(err => {
        throw err;
      });
      // 一单100积分
      await execSqlByConn(connection, `update medicine_users set members_point = members_point + 100 
                                                        where username = '${request.session.username}'`).catch(err => {
        throw err;
      });
      // 结束
    }
    // 删除购物车
    let deleteCartSql = `delete from medicine_car where user_name = '${request.session.username}'`;
    await execSqlByConn(connection, deleteCartSql).catch(err => {
      throw err;
    });
    // throw new Error("回滚....")
    await commit(connection).catch(err => {
      throw err;
    })
    response.json({code: 200, message: "成功", data: list});
  } catch (err) {
    console.log(err)
    response.json({code: 500, message: "支付失败" + err, data: list});
    await rollBack(connection).catch(error => {
      console.error("rollBack", error)
    })

  } finally {
    await releaseConnection(connection).catch(err => {
      console.error("releaseConnection", err)
    })


  }

})

/*创建订单*/
router.post("/client/order/create", async (request, response, next) => {
  let list = [];

  let orders = await execSql(`select medicine_goods.medicine_shop_id
                              from medicine_car,
                                   medicine_goods
                              where medicine_goods_no = medicine_goods.medicine_no
                                and medicine_car.user_name = '${request.session.username}'
                              group by medicine_goods.medicine_shop_id`);
  for (let i in orders) {
    let tmp = orders[i];
    let shopInfo = await execSql(`select * from medicine_shop where id = '${tmp.medicine_shop_id}'`);
    let sql = `select medicine_car.medicine_num   as carnum,
                    medicine_car.medicine_price as carprice,
                    medicine_car.user_name      as carusername,
                    medicine_goods.medicine_name,
                    medicine_goods.medicine_price,
                    medicine_goods.medicine_no,
                    medicine_shop.shop_name,
                    medicine_shop.shop_addr,
                    medicine_shop.id as shopid,
                    medicine_goods.medicine_pic_url
             from medicine_car,
                  medicine_goods,
                  medicine_shop
             where medicine_car.medicine_goods_no = medicine_goods.medicine_no
               and medicine_goods.medicine_shop_id = medicine_shop.id and medicine_goods.medicine_shop_id = ${tmp.medicine_shop_id}
               and medicine_car.user_name = '${request.session.username}'`;
    let orderItem = await execSql(sql);
    let total = 0, price = 0, banners = [];
    for (let i in orderItem) {
      let item = orderItem[i];
      total += item.carnum;
      price += item.carprice;
      banners.push('http://127.0.0.1:3000' + item.medicine_pic_url);
    }

    let obj = {
      address: shopInfo[0].shop_addr,
      shopName: shopInfo[0].shop_name,
      totalNum: total,
      totalAmount: price,
      banners: banners
    }
    list.push(obj);
  }
  let pay = await execSql(`select sum(medicine_price) as price from medicine_car where user_name = '${request.session.username}'`);

  console.log("订单", list)
  await response.json({code: 200, message: "订单生成成功", data: list, payAmount: pay[0].price});


})


/*购物车删除*/
router.post("/client/cart/deleteCart", (request, response, next) => {
  let sql = `delete from medicine_car where user_name = '${request.session.username}' and medicine_goods_no = '${request.body.sku}'`;
  pool.query(sql, (err, res) => {
    if (err) {
      next(err)
    } else {
      response.json({code: 200, message: "删除成功"});
    }
  });
})

/*购物车新增减少*/
router.post("/client/cart/cartNum", (request, response, next) => {
  let sql = `select id, user_name, medicine_goods_no, medicine_price, medicine_num
                from medicine_car where user_name = '${request.session.username}' and medicine_goods_no = '${request.body.sku}'`;
  pool.query(sql, (err, res) => {
    if (err) {
      next(err)
    } else {
      if (res.length > 0) {
        let num = res[0].medicine_num + request.body.quantity;
        if (num > 0) {
          let sqlUpdate = `update medicine_car set medicine_num = ${num},
                                medicine_price = (select medicine_price * ${num} from medicine_goods where medicine_no = '${request.body.sku}') 
                                where id = ${res[0].id}`;
          pool.query(sqlUpdate, (err, res) => {
            if (err) {
              next(err)
            } else {
              response.json({code: 200, message: "成功"});
            }
          });
        } else {
          let sqlDelete = `delete from medicine_car where id = ${res[0].id}`;
          pool.query(sqlDelete, (err, resDelete) => {
            if (err) {
              next(err)
            } else {

            }
          });
        }
      }
    }
  });
})

/*查询购物车*/
router.post("/client/cart/list", (request, response, next) => {

  let sqlc = `select medicine_name,
               medicine_pic_url,
               medicine_no,
               medicine_car.medicine_num,
               medicine_car.medicine_price,
               medicine_name,
               medicine_goods.medicine_price as oneprice
        from medicine_car,
             medicine_goods
        where medicine_goods.medicine_no = medicine_car.medicine_goods_no and user_name = '${request.session.username}'`;
  pool.query(sqlc, (errc, resc) => {
    if (errc) {
      next(errc)
    } else {
      if (resc.length > 0) {

        let total = 0;
        let totalNum = 0;
        let list = [];
        for (let i = 0; i < resc.length; i++) {
          total += resc[i].medicine_price;
          totalNum += resc[i].medicine_num;
          let obj = {
            "sku": resc[i].medicine_no,
            "productName": resc[i].medicine_name,
            "quantity": resc[i].medicine_num,
            "price": resc[i].medicine_price,
            "image": resc[i].medicine_pic_url,
            "checked": true,
            "title": resc[i].medicine_name,
          }
          list.push(obj);
        }

        let obj = {
          "total": total,
          "cartEntries": list,
          "selectAll": true,
          "totalNum": totalNum
        };
        response.json({code: 200, message: "查询成功", data: obj});
      } else {
        response.json({
          code: 200, message: "查询成功", data: {
            "total": 0,
            "cartEntries": [],
            "selectAll": true,
            "totalNum": 0
          }
        });
      }
    }
  });

})

/*加入购物车*/
router.post("/client/cart/addCart", (request, response, next) => {
  let sqlb = `select * from medicine_car 
             where user_name = '${request.session.username}' and medicine_goods_no ='${request.body.sku}'`;
  pool.query(sqlb, (errb, resb) => {
    if (errb) {
      next(errb)
    } else {
      // 购物车已存在，更新
      if (resb.length > 0) {
        let sql = `update medicine_car 
                    set medicine_num = medicine_num + ${request.body.quantity},
                        medicine_price = 
                            (select medicine_price 
                            from medicine_goods 
                            where medicine_no = '${request.body.sku}') * (medicine_num)
                    where id = ${resb[0].id}`;
        pool.query(sql, (err, res) => {
          if (err) {
            next(err)
          } else {
            let sqla = `select id,
                   user_id,
                   medicine_shop_id,
                    (select medicine_type_name
                     from medicine_goods_type
                     where id = medicine_goods_type_id)                                                    as medicine_type_name,
                   medicine_goods_type_id,
                   medicine_no,
                   medicine_name,
                   medicine_desc,
                   medicine_price,
                   medicine_num,
                   concat('http://127.0.0.1:3000', medicine_pic_url)                                      as medicine_pic_url ,
                   create_date,
                   is_delete
            from medicine_goods
            where medicine_no = '${request.body.sku}'`;
            pool.query(sqla, (erra, resa) => {
              if (erra) {
                next(erra)
              } else {

                let sqlc = `select id, user_name, medicine_goods_no, medicine_price, medicine_num 
                            from medicine_car where user_name = '${request.session.username}'`;
                pool.query(sqlc, (errc, resc) => {
                  if (errc) {
                    next(errc)
                  } else {
                    if (resc.length > 0) {

                      let total = 0;
                      let totalNum = 0;
                      for (let i = 0; i < resc.length; i++) {
                        total += resc[i].medicine_price;
                        totalNum += resc[i].medicine_num;
                      }

                      let obj = {
                        "total": total,
                        "cartEntries": [
                          {
                            "sku": resa[0].medicine_no,
                            "productName": resa[0].medicine_name,
                            "quantity": resa[0].medicine_num,
                            "price": resa[0].medicine_name,
                            "image": resa[0].medicine_pic_url,
                            "checked": true,
                            "title": resa[0].medicine_name,
                          }
                        ],
                        "selectAll": true,
                        "totalNum": totalNum
                      };
                      response.json({code: 200, message: "添加成功", data: obj});
                    } else {
                      response.json({code: 200, message: "添加成功，计算总量错误"});
                    }
                  }
                });

              }
            });
            // response.json({code: 200, message: "添加成功"});
          }
        });
      } else { // 新增
        let sql = `insert into medicine_car (user_name, medicine_goods_no, medicine_price, medicine_num) values 
            ('${request.session.username}','${request.body.sku}',
             (select medicine_price from medicine_goods where medicine_no = '${request.body.sku}') * ${request.body.quantity} ,
             ${request.body.quantity})`;
        pool.query(sql, (err, res) => {
          if (err) {
            next(err)
          } else {
            let sqla = `select id,
                   user_id,
                   medicine_shop_id,
                    (select medicine_type_name
                     from medicine_goods_type
                     where id = medicine_goods_type_id)                                                    as medicine_type_name,
                   medicine_goods_type_id,
                   medicine_no,
                   medicine_name,
                   medicine_desc,
                   medicine_price,
                   medicine_num,
                   concat('http://127.0.0.1:3000', medicine_pic_url)                                      as medicine_pic_url ,
                   create_date,
                   is_delete
            from medicine_goods
            where medicine_no = '${request.body.sku}'`;
            pool.query(sqla, (erra, resa) => {
              if (erra) {
                next(erra)
              } else {

                let sqlc = `select id, user_name, medicine_goods_no, medicine_price, medicine_num 
                            from medicine_car where user_name = '${request.session.username}'`;
                pool.query(sqlc, (errc, resc) => {
                  if (errc) {
                    next(errc)
                  } else {
                    if (resc.length > 0) {

                      let total = 0;
                      let totalNum = 0;
                      for (let i = 0; i < resc.length; i++) {
                        total += resc[i].medicine_price;
                        totalNum += resc[i].medicine_num;
                      }

                      let obj = {
                        "total": total,
                        "cartEntries": [
                          {
                            "sku": resa[0].medicine_no,
                            "productName": resa[0].medicine_name,
                            "quantity": resa[0].medicine_num,
                            "price": resa[0].medicine_name,
                            "image": resa[0].medicine_pic_url,
                            "checked": true,
                            "title": resa[0].medicine_name,
                          }
                        ],
                        "selectAll": true,
                        "totalNum": totalNum
                      };
                      response.json({code: 200, message: "添加成功", data: obj});
                    } else {
                      response.json({code: 200, message: "添加成功，计算总量错误"});
                    }
                  }
                });

              }
            });
          }
        });
      }
    }
  });


})

/*sku*/
router.post("/client/goods/detail/category", (request, response, next) => {
  let sql = `select id,
                   user_id,
                   medicine_shop_id,
       (select medicine_type_name
                     from medicine_goods_type
                     where id = medicine_goods_type_id)                                                    as medicine_type_name,
                   medicine_goods_type_id,
                   medicine_no,
                   medicine_name,
                   medicine_desc,
                   medicine_price,
                   medicine_num,
                   concat('http://127.0.0.1:3000', medicine_pic_url)                                      as medicine_pic_url ,
                   create_date,
                   is_delete
            from medicine_goods
            where medicine_no = '${request.body.productId}'`;
  pool.query(sql, (err, res) => {
    if (err) {
      next(err)
    } else {
      if (res.length > 0) {
        response.json({
          code: 200, message: "查询成功", data: {
            tree: [
              {
                k: res[0].medicine_name,
                k_s: "s1",
                v: [
                  {
                    id: 5,
                    name: res[0].medicine_name,
                    attrId: 1,
                    imgUrl: res[0].medicine_pic_url,
                    sort: 999,
                  },
                ],
              },

            ],
            list: [
              {
                id: res[0].medicine_no,
                s1: 5,
                s2: 4,
                price: res[0].medicine_price * 100,
                stock_num: res[0].medicine_num,
              },
            ],
            price: res[0].medicine_price,
            stock_num: res[0].medicine_num,
            none_sku: false,
            hide_stock: false,
          }
        });
      } else {
        response.json({code: 500, message: "查询失败，药品不存在"});
      }
    }
  });

})

/*商品详情*/
router.post("/client/goods/detail", (request, response, next) => {
  let sql = `select id,
                   user_id,
                   medicine_shop_id,
       (select medicine_type_name
                     from medicine_goods_type
                     where id = medicine_goods_type_id)                                                    as medicine_type_name,
                   medicine_goods_type_id,
                   medicine_no,
                   medicine_name,
                   medicine_desc,
                   medicine_price,
                   medicine_num,
                   concat('http://127.0.0.1:3000', medicine_pic_url)                                      as medicine_pic_url ,
                   create_date,
                   is_delete
            from medicine_goods
            where medicine_no = '${request.body.productId}'`;
  pool.query(sql, (err, res) => {
    if (err) {
      next(err)
    } else {
      if (res.length > 0) {
        let result = {
          "name": res[0].medicine_name,
          "productId": res[0].medicine_no,
          "title": res[0].medicine_desc,
          "virtualNum": res[0].medicine_num,
          "price": res[0].medicine_price,
          "stock": 0,
          "sort": 999,
          "productImg": {
            "id": res[0].id,
            "productId": res[0].medicine_no,
            "rollImg": res[0].medicine_pic_url,
            "detailImg": res[0].medicine_pic_url
          },
          "brand": res[0].medicine_type_name,
          "productRightsList": [{
            "id": 1,
            "type": 2,
            "describe": "全站自营"
          }, {"id": 2, "type": 2, "describe": "正品货源"}, {
            "id": 3,
            "type": 2,
            "describe": "权威鉴定"
          }, {
            "id": 5,
            "type": 1,
            "describe": "假一赔十，100%保证"
          }]
        }
        response.json({code: 200, message: "查询成功", data: result});
      } else {
        response.json({code: 500, message: "查询失败，药品不存在"});
      }
    }
  });
})

/*商品列表*/
router.post("/client/goods/list", (request, response, next) => {
  let s = `select count(1) as total
              from medicine_goods
              where is_delete = '0'
                    and (medicine_name like '%${request.body.searchText}%' or medicine_desc like '%${request.body.searchText}%')
              order by create_date desc`;
  if (request.body.searchText === '') {
    s = `select count(1) as total
              from medicine_goods,medicine_shop
              where is_delete = '0' and medicine_shop.id = medicine_goods.medicine_shop_id
                    and (medicine_name like '%${request.body.searchText}%' 
                             or medicine_desc like '%${request.body.searchText}%' 
                             or shop_name like '%${request.body.searchText}%'
                             or shop_addr like '%${request.body.searchText}%')
              order by create_date desc`;
  }
  console.log('count sql', s)
  pool.query(s, (err, res) => {
    if (err) {
      next(err)
    } else {
      let total = res[0].total;
      if (total > 0) {
        let pageSize = request.body.pageSize;
        let pageNo = request.body.pageNum;
        let startPage = (pageNo - 1) * pageSize;
        let sql = '';
        if (request.body.searchText === '') {
          sql = `select id,
                    concat('http://127.0.0.1:3000', medicine_pic_url)                                      as img,
                    medicine_name                                                                          as name,
                    medicine_price                                                                         as price,
                    medicine_no                                                                            as productId,
                    medicine_name                                                                          as title,
                    (select medicine_type_name
                     from medicine_goods_type
                     where id = medicine_goods_type_id)                                                    as medicine_type_name,
                    medicine_desc                                                                          as productDesc,
                    medicine_num                                                                           as num
             from medicine_goods
             where is_delete = '0' 
             order by create_date desc
             limit ${startPage}, ${pageSize}`;
        } else {
          sql = `select id,
                    concat('http://127.0.0.1:3000', medicine_pic_url)                                      as img,
                    medicine_name                                                                          as name,
                    medicine_price                                                                         as price,
                    medicine_no                                                                            as productId,
                    medicine_name                                                                          as title,
                    (select medicine_type_name
                     from medicine_goods_type
                     where id = medicine_goods_type_id)                                                    as medicine_type_name,
                    medicine_desc                                                                          as productDesc,
                    medicine_num                                                                           as num
             from medicine_goods,medicine_shop
             where is_delete = '0' and medicine_shop.id = medicine_goods.medicine_shop_id
               and (medicine_name like '%${request.body.searchText}%' 
                             or medicine_desc like '%${request.body.searchText}%' 
                             or shop_name like '%${request.body.searchText}%'
                             or shop_addr like '%${request.body.searchText}%')
             order by create_date desc
             limit ${startPage}, ${pageSize}`;
        }
        console.log('sql', sql)
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


/*=================================================================*/

router.post('/shop/users/list',async (request, response, next)=>{
  try {
    let resTotal = await execSql(`select count(1) as total
                        from medicine_users where id in (select user_id
                                 from medicine_order,
                                      medicine_shop
                                 where medicine_shop_id = medicine_shop.id
                                   and medicine_shop.username = '${request.session.username}')`).catch(err=>{
      throw err
    })
    let total = resTotal[0].total;
    if (total > 0) {
      let pageSize = request.body.page.pageSize;
      let pageNo = request.body.page.current;
      let startPage = (pageNo - 1) * pageSize;
      let sql = `select medicine_users.id, username, user_type, members_point 
                        from medicine_users where id in (select medicine_order.user_id
                                 from medicine_order,
                                      medicine_shop
                                 where medicine_shop_id = medicine_shop.id
                                   and medicine_shop.username = '${request.session.username}' order by medicine_order.user_id desc )
                                   limit ${startPage}, ${pageSize} `;
      let results = await execSql(sql).catch(err=>{throw err})
      response.json({
        code: 200,
        message: "查询成功",
        data: results,
        page: {total: total}
      });

    } else {
      response.json({code:500,message:"没有用户购买过"});
    }
  } catch (error) {
    console.log(error)
    response.json({code:500,message:error});
  }

})

router.post('/server/order/pickup',async (request, response, next)=>{
  try {
    let orders = await execSql(`select * from medicine_order where order_no = '${request.body.order_no}'`).catch(err=>{
      throw err
    })
    if (orders.length === 0) {
      throw new Error("订单不存在")
    } else {
      await execSql(`update medicine_order set has_pay = '1', has_pickup = '1' where order_no = '${request.body.order_no}'`).catch(err=>{
        throw err
      })
      response.json({code:200,message:orders[0].pay_type === '1' ? '取货完成' : "发货完成"});
    }
  } catch (err) {
    response.json({code:500,message:err});
  }
})

router.post('/server/order/items', async (request, response, next) => {
  try {
    let items = await execSql(`select medicine_order_item.id,
                                      medicine_order_item.id as \`key\`,
                                      (select username from medicine_users where id = medicine_order_item.user_id) as user_id,
                                      medicine_order_item.order_no,
                                      medicine_order_item.medicine_goods_no,
                                      medicine_order_item.medicine_price,
                                      medicine_goods.medicine_price as price,
                                      medicine_goods.medicine_name,
                                      medicine_order_item.medicine_num
                               from medicine_order_item,
                                    medicine_goods
                               where order_no = '${request.body.order_no}'
                                 and medicine_goods.medicine_no = medicine_order_item.medicine_goods_no`).catch(err => {
      throw err;
    })

    response.json({code:200,message:"查询成功", data:items});
  } catch (error) {
    response.json({code: 200, message: "查询失败" + error});
  }
})

/*服务端*/
/*订单*/
router.post("/goods/order/list", (request, response, next) => {
  pool.query(`select count(1) as total
             from medicine_order,
                  medicine_shop,
                  medicine_users
             where medicine_order.medicine_shop_id = medicine_shop.id
               and medicine_users.id = medicine_order.user_id
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
                    medicine_order.id                                                                      as \`key\`,
                    (select username from medicine_users where id = medicine_order.user_id) as username,
                    order_no,
                    pay_type,
                    has_pay,
                    order_price,
                    has_pickup,
                    create_date,
                    (select sum(medicine_order_item.medicine_num) from medicine_order_item where medicine_order.order_no = medicine_order.order_no) as sum
             from medicine_order,
                  medicine_shop,
                  medicine_users
             where medicine_order.medicine_shop_id = medicine_shop.id
               and medicine_users.id = medicine_order.user_id
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
                and medicine_users.username = '${request.session.username}'
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
and medicine_users.username = '${request.session.username}'
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
              from medicine_goods_type where user_id = (select id from medicine_users where medicine_users.username = '${request.session.username}')`, (err, res) => {
    if (err) {
      next(err)
    } else {
      let total = res[0].total;
      if (total > 0) {
        let pageSize = request.body.page.pageSize;
        let pageNo = request.body.page.current;
        let startPage = (pageNo - 1) * pageSize;
        let sql = `select id, id as \`key\`, 
                        (select username from medicine_users where id= user_id) as username, 
                        medicine_type_name from medicine_goods_type 
                        where user_id = (select id from medicine_users where medicine_users.username = '${request.session.username}')
                        order by id limit ?, ?`;
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
