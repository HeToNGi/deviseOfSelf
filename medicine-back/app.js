const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const medicineRouter = require('./routes/medicine');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*允许跨域*/
app.all('*', (req, res, next) => {
  // res.header("Access-Control-Allow-Origin", req.headers.origin);
  // res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  // res.header("Access-Control-Allow-Credentials","true");
  res.header("Content-Type", "application/json;charset=utf-8");
  if(req.method === "OPTIONS") {
    res.status(200)
    res.json({code: 200, message: "OPTIONS请求"});
  } else {
    if (req.method !== 'OPTIONS' && !['/users/login','/users/register','/users/isLogin','/users/logout'].includes(req.url) && !req.session.username) {
      res.status(403)
      res.json({code: 500, message: "登录超时或者未登录，请先登录"});
    } else {
      next();
    }
  }

  // next();
});

// 使用 session 中间件
app.use(session({
  secret: '123456', // 对session id 相关的cookie 进行签名
  resave: true,
  name: 'mySession',
  saveUninitialized: true, // 是否保存未初始化的会话
  cookie: {
    maxAge: 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
    secure: false
  },
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/medicine', medicineRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("catch 404 and forward to error handler")

  next(createError(404));

});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500)

  res.json({
    code: err.status || 500,
    message: err.message
  })
});

module.exports = app;
