const handle = require("./server/api")
const express = require("express");
const path = require("path");
const app = express();
//const proxy = require("http-proxy-middleware");
//const proxy = require("express-http-proxy");
const bodyParser = require('body-parser');

app.listen(3000);


app.all("*",function (req,res,next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Content-Type,X-Requested-With,Content-Length,Authorization,Accept");
  res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS,PUT,DELETE");
  res.header("X-Powered-By","3.2.1");
  res.header("Content-Type","application/json;charset=utf8");
  next();
});

//app.use("/api*",proxy("http:120.77.155.69:3000"));
//const api_proxy = proxy("/api",{target:"http://120.77.155.69:3000",changeOrigin:true});
//app.use("/api/*",api_proxy);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));
//页面获取
app.get("/",function (req,res,next) {
  res.send("index");
  next();
});
app.get("/index",function (req,res) {
  res.send("index");
});
app.get("/artical",function (req,res) {
  res.send("artical");
});
app.get("/knowledge",function (req,res) {
  res.send("knowledge");
});


//api接口

//登录
app.post("/api/signIn",function (req,res) {
  console.log("收到登录请求")
  handle.in.query(req.body,res);
});
//注册
app.post("/api/signUp",function (req,res) {
  console.log("收到注册请求")
  handle.up.query(req.body,res);
});
//留言
app.post("/api/living",function (req,res) {
  console.log("收到留言请求")
  handle.living.query(req.body,res);
});
//获取留言
app.get("/api/getLiving",function (req,res) {
  console.log("收到获取留言请求")
  handle.getLiving.query(res);
});
//数学,物理,化学
app.get("/api/engineering",function (req,res) {
  console.log("收到engineering请求")
  handle.engineering.query(req.query,res);
});
//国学
app.get("/api/chinese",function (req,res) {
  console.log("收到国学请求")
  handle.chinese.query(req.query,res);
});