const mysql = require('mysql');
const conf = require('../config/conf');
// 使用连接池
const dbPool = mysql.createPool(conf.mysql);

module.exports =  dbPool
