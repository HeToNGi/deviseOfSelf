const pool = require('./commonUtil');

/**
 * 获取数据库连接
 * @returns {Promise<unknown>}
 */
function getConnection() {
  return new Promise(((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.error(err)
        console.log(`数据库连接${connection.threadId}获取失败@@@@@@@@`)
        reject(err);
      } else {
        console.log(`数据库连接${connection.threadId}获取成功=======`)
        resolve(connection);
      }
    })
  }))
}


function releaseConnection(connection) {
  return new Promise(((resolve, reject) => {
    if (connection) {
      connection.release();
      console.log(`数据库连接${connection.threadId}释放成功=======`)
    } else {
      reject("数据库连接为空")
    }

  }))
}

function beginTransaction(connection) {
  return new Promise(((resolve, reject) => {
    if (connection) {
      connection.beginTransaction(function (err) {
        if (err) {
          console.error(err)
          console.log("数据库连接" + connection.threadId + "事务获取失败！@@@@@@@@")
          reject(err);
        } else {
          console.log("数据库连接" + connection.threadId + "事务获取成功！=======")
          resolve(true);
        }
      })
    } else {
      reject("数据库连接为空")
    }
  }))
}

function rollBack(connection) {
  return new Promise(((resolve, reject) => {
    if (connection) {
      connection.rollback(function (err) {
        if (err) {
          console.error(err)
          console.error("数据库连接" + connection.threadId + "事务回滚失败！@@@@@@@@")
          reject(err);
        } else {
          console.log("数据库连接" + connection.threadId + "事务提回滚成功！=======")
          resolve(true);
        }
      })
    } else {
      reject("数据库连接为空")
    }
  }))
}


function commit(connection) {
  return new Promise(((resolve, reject) => {
    if (connection) {
      connection.commit(function (err) {
        if (err) {
          console.error(err)
          console.log("数据库连接" + connection.threadId + "事务提交失败！@@@@@@@@")
          reject(err);
        } else {
          console.log("数据库连接" + connection.threadId + "事务提交成功！=======")
          resolve(true);
        }
      })
    } else {
      reject("数据库连接为空")
    }
  }))
}

/**
 * 执行sql
 * @param connection
 * @param sql
 * @returns {Promise<unknown>}
 */
function execSqlByConn(connection, sql) {
  return new Promise(((resolve, reject) => {
    if (connection) {
      connection.query(sql, (error, results) => {
        if (error) {
          console.error(error)
          console.log(`数据库连接${connection.threadId}执行SQL[${sql}]失败@@@@@@@@`)
          reject(error);
        } else {
          console.log(`数据库连接${connection.threadId}执行SQL[${sql}]成功=======`)
          resolve(results);
        }
      })
    } else {
      reject("数据库连接为空")
    }
  }))
}

function execSql(sql){
  return new Promise((resolve, reject) => {
    pool.query(sql, function (error, results) {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    });
  })
}

module.exports = {
  getConnection,
  releaseConnection,
  beginTransaction,
  rollBack,
  commit,
  execSqlByConn,
  execSql
}