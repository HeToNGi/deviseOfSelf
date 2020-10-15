// conf/db.js
// MySQL数据库联接配置
module.exports = {
    mysql: {
        // host: '127.0.0.1',
        host: '192.168.6.254',
        port: 33061,
        user: 'root',
        password: '123456',
        database: 'medicine', // 前面建的user表位于这个数据库中
    }
};
