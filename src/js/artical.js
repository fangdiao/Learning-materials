require("./require");
require("../css/page/artical.less");
var $ = require("jquery");
var artical_str = require("../view/artical.html");
$(document).ready(function () {
  var artical = {
    page: null,
    showPage:function (num) {
      var header = this.page.find("header").eq(num)[0],
          section = this.page.find("section").eq(num)[0],
          footer = this.page.find("footer")[0];
      $("body").append(header,section,footer);

    },
    info:function () {
      this.page = $(artical_str);
    },
    //footer处理
    footerUrl:function (num) {
      var num = Number(num),
          footer = $(this.page.find("footer")[0]),
          next_a = footer.find(".next-a"),
          pre_a = footer.find(".pre-a");
      if (num === 0) {
        footer.find(".pre").hide();
        next_a.attr("href","artical.html?num=1");
        next_a.eq(1).text("学习方法之目标法");
      } else if (num === 1) {
        pre_a.attr("href","artical.html?num=0");
        pre_a.eq(1).text("学习方法之联系法");
        next_a.attr("href","artical.html?num=2");
        next_a.eq(1).text("学习方法之问题法");
      } else {
        footer.find(".next").hide();
        pre_a.attr("href","artical.html?num=1");
        pre_a.eq(1).text("学习方法之目标法");
      }
      this.showPage(num);
    },
    //获取url的num值
    getUrlParam:function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r != null) this.footerUrl(unescape(r[2])); return null; //返回参数值
    },
    action:function () {
      this.info();
      this.getUrlParam("num");
    }
  };
  artical.action();
});