require("./require");
require("../css/page/index.less");
var $ = require("jquery");
//获取登录组件
var signBox = require("./sign_box");
var sign_box = new signBox();
//获取公共地址
var content_path = require("./content_path");
//index主页组件
var index_str = require("../view/index.html");
var index = {
  info:function () {
    $("body").html(index_str);
    this.getLiving();
  },
  action:function () {
    this.info();
    this.addEvent();
    this.scrollSection();
    sign_box.action();
  },
  //判断图片是否加载完成，绑定锚链接
  imgLoad:function () {
    var that = this;
    var img = $("section").find("img");
    var timer = setInterval(function () {
      var flag = true;
      for (var i = 0;i < img.length;i++) {
        if (img[0].height === 0) {
          flag = false;
        }
      }
      if (flag) {
        that.scrollSection();
        clearTimeout(timer);
      }
    },200);
  },
  //获取留言
  getLiving:function () {
    var that = this;
    $.ajax({
      url: content_path + "/api/getLiving",
      type: "get",
      contentType: "application/json",
      success:function (data) {
        console.log(data)
        //var data = JSON.parse(data);
        that.showLiving(data);
      },
      error:function (data) {
        console.log(data);
      }
    });
  },
  //加载留言
  showLiving:function (data) {
    var message_box = $(".message-box");
    console.log(data.length)
    for (var i =0;i < data.length;i++) {
      var each =  "<div class='col-xs-12 col-md-6'>"+
                  "<div class='message'>"+
                  "<p class='p-name'>" + data[i].name + "</p>"+
                  "<p class='p-mes'>" + data[i].message + "</p>"+
                  "</div>"+
                  "</div>"
      message_box.append(each);
    }
  },
  //绑定锚链接
  scrollSection:function () {
    $("header").on("click",".p-ul,.m-ul",function (event) {
      var target = $(event.target)
      if (event.target.nodeName === "LI") {
        var index = target.index();
        if (index < 5) {
          var dis = $("section").eq(index).offset().top;
          if (target.parent().hasClass("m-ul")) {
             target.parent().slideUp(200,function () {
              $("html,body").stop().animate({scrollTop:dis},500);
            });
          } else {
            $("html,body").stop().animate({scrollTop:dis},500);
          }
        }
      }
    });
  },
  //退出登录
  signOut:function () {
    $(".not-ok").show();
    $(".ok").hide();
    localStorage.removeItem("wangxin");
  },
  //增加事件
  addEvent:function () {
    var that = this;
    $("body").on("click","header",function (event) {
      var target = $(event.target);
      //登录
      if (target.hasClass("sign-in")) {
        sign_box.show(0);
      //注册
      } else if (target.hasClass("sign-up")) {
        sign_box.show(1);
      //留言
      } else if (target.hasClass("living-bt")) {
        sign_box.show(2);
      //下拉菜单
      } else if (target.hasClass("m-ul-down")) {
        if (target.next().css("display") === "none") {
          target.next().slideDown(200);
        } else {
          target.next().slideUp(200);
        }
      } else if (target.hasClass("sign-out")) {
        that.signOut();
      }
    });
  }
};
window.onload = function () {
  index.action();
}