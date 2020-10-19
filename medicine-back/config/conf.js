// MySQL数据库联接配置
module.exports = {
  mysql: {
    connectionLimit: 10,

    host: '192.168.6.254', // 数据库地址
    port: 33061, // 数据库端口
    user: 'root', // 数据库用户名
    password: '123456', // 数据库密码
    database: 'medicine', // 数据库

  }
  
};
