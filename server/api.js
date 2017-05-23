var mysql = require('mysql');
var client = mysql.createConnection({  
  user: 'root',  
  password: '',
  port: "3306",
  database: "wangxin"
});
client.connect();
client.on("error",function (err) {
  console.log(err.code)
})
//api处理函数
handle = {
  in: {
    data: {name: "",success: null},
    query: function (body,res) {
      var that = this;
      console.log("收到登陆请求")
      var sql = "select name,password from user where name=" + 
                client.escape(body.name) + 
                " and password=" + 
                client.escape(body.password);
      console.log(sql)
      client.query(sql,function (err, results) {
        if (err) {
          throw err;
        }
        if (results) {
          if (results.length > 0) {
            that.data.name = results[0].name;
            that.data.success = true;
            res.send(JSON.stringify(that.data));
          } else {
             that.data.success = false;
             res.send(JSON.stringify(that.data));
             console.log(JSON.stringify(that.data))
          }
        }
      });
    }, 
  },
  up: {
    data: {success: null},
    query: function (body,res) {
      console.log(body)
      var that = this;
      var sql_insert = "insert into user (name,password,mail) values (" +
                client.escape(body.name) + "," + 
                client.escape(body.password) + "," + 
                client.escape(body.mail) + ")";
      var sql_select = "select name from user where name=" + client.escape(body.name);
      console.log(sql_select,sql_insert)
      client.query(sql_select,function (err,results) {//检查用户是否已存在
        if (err) {
          throw err;
        }
        if (results) {
          console.log(results)
          if (results.length > 0) {
            that.data.success = false;
            res.send(JSON.stringify(that.data));
            return;
          } else {
            client.query(sql_insert,function (err,results) {//插入用户信息
              if (err) {
                throw err;
              }
              if (results) {
                console.log("1")
                that.data.success = true;
                console.log("2")
                res.send(JSON.stringify(that.data));
              }
            });
          }
        }
      });
    }
  },
  living: {
    data: {success: null},
    query:function (body,res) {
      var that = this;
      sql = "insert into living_message (name,message) values (" + 
            client.escape(body.name) + "," + 
            client.escape(body.content) + ")";
      client.query(sql,function (err,results) {
        if (err) {
          throw err;
        }
        if (results) {
          that.data.success = true;
          res.send(JSON.stringify(that.data));
        }
      });
    }
  },
  getLiving: {
    data: [],
    query:function (res) {
      var that = this;
      var sql = "select * from living_message";
      client.query(sql,function (err,results) {
        if (err) {
          throw err;
        }
        if (results) {
          that.data= [];
          for (var i = 0;i < results.length;i++) {
            var each = {"name": "",message: ""};
            each.name = results[i].name;
            each.message = results[i].message;
            that.data.push(each);
          }
          console.log(JSON.stringify(that.data))
          res.send(JSON.stringify(that.data));
        }
      });
    }
  },
  engineering: {
    data: {content: [],more: null},
    query:function (body,res) {
      var that = this;
      var sql = "select * from " + body.type + " where id>" + body.min + " and id<=" +body.max;
      client.query(sql,function (err,results) {
        if (err) {
          throw err;
        }
        if (results) {
          that.data.content = [];
          that.data.more = null;
          for (var i = 1;i < results.length;i++) {
            that.data.content.push(results[i].content);
          }
          if (results.length < 30) {
            that.data.more = false;
          } else {
            that.data.more = true;
          }
          res.send(JSON.stringify(that.data));
        }
      });
    }
  },
  chinese: {
    data: {content: [],more: null},
    query: function (body,res) {
      console.log(body)
      var that = this;
      var sql = "select * from " + body.type + " where id>" + body.min + " and id<=" +body.max;
      client.query(sql,function (err,results) {
        if (err) {
          throw err;
        }
        if (results) {
          that.data.content = [];
          that.data.more = null;
          for (var i = 0;i < results.length;i++) {
            var each = {type: "",title: "",author: "",content: ""};
            each.type = results[i].type;
            each.title = results[i].title;
            each.author = results[i].author;
            each.content = results[i].content;
            that.data.content.push(each);
          }
          if (results.length < 30) {
            that.data.more = false;
          } else {
            that.data.more = true;
          }
          res.send(JSON.stringify(that.data));
        }
      });
    }
  }
}
module.exports = handle;