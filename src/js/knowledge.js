require("./require");
require("../css/page/knowledge.less");
var $ = require("jquery");
var content_path = require("./content_path");
var knowledge_str = require("../view/knowledge.html");
$(document).ready(function () {
  var knowledge = {
    num: 0,
    page: null,
    data: {min: 1,max: 31,type: ""},
    info: function () {
      this.page = $(knowledge_str);
      this.getUrlParam("num");
    },
    showPage:function (num) {
      var header = this.page.find("header").eq(num)[0];
      var section = this.page.find("section")[0];
      $("body").append(header,section);
      this.getData(this.num);
    },
    action:function () {
      this.info();
      this.addEvent();
    },
    getData:function (num) {
      var that = this;
      if (num === 3) {
        this.data.type = "chinese";
        $.ajax({
          url: content_path + "/api/chinese",
          type: "get",
          data: that.data,
          contentType: "application/json",
          success: function (data) {
            //var data = JSON.parse(data);
            that.showChinese(data);
            if (data.more === false) {
              $(window).unbind("scroll");
            }
          },
          error: function (data) {
            console.log(data);
          }
        });
      } else {
        if (num === 0) {
          this.data.type = "math";
        } else if (num === 1) {
          this.data.type = "physics";
        } else if (num ===2) {
          this.data.type = "chemistry";
        }
        $.ajax({
          url: content_path + "/api/engineering",
          type: "get",
          data: that.data,
          contentType: "application/json",
          success: function (data) {
            //var data = JSON.parse(data);
            that.showEngineering(data);
            if (data.more === false) {
              $(window).unbind("scroll");
            }
          },
          error: function (data) {
            console.log(data);
          }
        });
      }
    },
    showEngineering:function (data) {
      this.data.min +=30;
      this.data.max +=30;
      var box = $("section").find(".row");
      for (var i = 0;i < data.content.length;i++) {
        var each =  "<div class='col-xs-12 col-md-6'>" +
                    "<p>" + data.content[i] + "</p>" +
                    "</div>";
        box.append(each);
      }
      
    },
    showChinese:function (data) {
      this.data.min +=30;
      this.data.max +=30;
      var box = $("section").find(".row");
      for (var i = 0;i < data.content.length;i++) {
        var each =  "<div class='col-xs-12 col-md-6 col-lg-4'>" +
                    "<div class='chinese-content'>" +
                    "<h3>" + data.content[i].title + "</h3>" +
                    "<h4>" + data.content[i].author + "</h4>" +
                    "<p>" + data.content[i].content + "</p>" +
                    "</div>" +
                    "</div>"
        box.append(each);
      }
    },
    getUrlParam:function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r != null) {
        this.num = Number(unescape(r[2]));
        this.showPage(this.num);
      }; return null; //返回参数值
    },
    //滚动加载更多
    addEvent:function () {
      var that = this;
      var stop = true;
      $(window).scroll(function () {
        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()); 
        console.log($(document).height(),totalheight)
        if ($(document).height() <= totalheight){
          console.log("滚")
          if (stop === true) {
            stop === false;
            that.getData(that.num,function () {
              stop = true;
            });
          }
        }
      });
    }
  }
  knowledge.action();
});