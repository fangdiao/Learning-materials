require("./require");
var $ = require("jquery");
var xss = require("xss");
var content_path = require("./content_path");
var sign_box_str = require("../view/sign_box.html");
function signBox () {};
/*signBox.prototype = {
  info: function () {
    this.dom.sign_box = $(sign_box_str);
    this.dom.box = this.sign_box.find(".box");
    this.dom.in = this.sign_box.find(".in");
    this.dom.up = this.sign_box.find(".up");
    this.dom.living = this.sign_box.find(".living");
    if ($(window).width() <= 500) {
      this.css.show = {"opacity":"1","margin-top":"0"};
      this.css.hide = {"opacity":"0","margin-top":"2vh"};
    } else {
      this.css.show = {"opacity":"1","margin-top":"14vh"};
      this.css.hide = {"opacity":"0","margin-top":"16vh"};
    }
    if (localStorage.getItem("wangxin")) {
      this.signInSuccess(localStorage.getItem("wangxin"));
    }
  },
  addEvent: function () {
    var that = this;
    $("body").on("click",".sign-box",function (event) {
      var id = event.target.id;
      var target = $(event.target);
      //去注册
      if (id === "to-sign-up") {
        that.display.change(0);
      //去登录
      } else if (id === "to-sign-in") {
        that.display.change(1);
      //忘记密码
      } else if (id === "forget-p") {
        alert("go人看到办");
      //关闭
      } else if (target.hasClass("close")) {
        that.display.hide();
      //登录提交
      } else if (id === "in-go") {
        that.in.getForm();
      //注册提交
      } else if (id === "up-go") {
        that.up.getForm();
      //留言提交
      } else if (id === "living-go") {
        that.living.getForm();
      }
    });
    //回车按钮
    $("body").on("keydown",function (event) {
      console.log("1")
      if (event.keyCode === 13) {
        console.log("2")
        if ($(".sign-box")[0]) {
          if ($(".in").css("display") === "block") {
            that.getInForm();
          } else if ($(".up").css("display") === "block") {
            that.getUpForm();
          } else {
            that.getMessage();
          }
        }
      }
    });
    //input[text]focus消除小红叉
    $("body").on("focus",".sign-box",function (event) {
      if (event.target.nodeName === "INPUT") {
        $(event.target).next().remove();
      }
    });
  },
  action: function () {
    this.info();
    this.addEvent();
  },
  dom: {
     //整个模板dom
    sign_box_dom: null,
    box_dom: null,
    //注册dom
    in_dom: null,
    //登录dom
    up_dom: null,
    //留言板dom
    living_dom: null,
  },
  //css显示,隐藏
  css: {show:null,hide:null},
  display: {
    show: function () {},
    hide: function () {},
    change: function () {}
  },
  in: {
    form: {name: "",password: ""},
    getForm: function () {
      var name = $(".in-name"),
        password = $(".in-password"),
        flag = true;
      if (name.val() !== "") {
        this.form.name = xss(name.val());
      } else {
        this.error(name);
        flag = false;
      }
      if (password.val() !== "") {
        this.form.password = xss(password.val());
      } else {
        this.error(password);
        flag = false;
      }
      if (flag) {
        console.log(JSON.stringify(this.form.in));
        this.uploadForm();
      }
    },
    uploadForm: function () {},
    success: function () {}
  },
  up: {
    form: {name: "",mail: "",password :""},
    getForm: function () {

    },
    uploadForm: function () {}
  },
  living: {
    form: {name: "",content: ""}.
    getForm: function () {

    },
    uploadForm: function () {}
  }
};
*/




signBox.prototype = {
  //整个模板
  sign_box: null,
  box: null,
  //注册
  in: null,
  //登录
  up: null,
  //留言板
  living: null,
  //css显示,隐藏
  css: {show:null,hide:null},
  //表单信息
  form: {
    in: {name: "",password: ""},
    up: {name: "",mail: "",password :""},
    message: {name: "",content: ""}
  },
  info:function () {
    this.sign_box = $(sign_box_str);
    this.box = this.sign_box.find(".box");
    this.in = this.sign_box.find(".in");
    this.up = this.sign_box.find(".up");
    this.living = this.sign_box.find(".living");
    if ($(window).width() <= 500) {
      this.css.show = {"opacity":"1","margin-top":"0"};
      this.css.hide = {"opacity":"0","margin-top":"2vh"};
    } else {
      this.css.show = {"opacity":"1","margin-top":"14vh"};
      this.css.hide = {"opacity":"0","margin-top":"16vh"};
    }
    if (localStorage.getItem("wangxin")) {
      this.signInSuccess(localStorage.getItem("wangxin"));
    }
  },
  //入口
  action:function () {
    this.info();
    this.addEvent();
  },
  //显示
  show:function (type) {
    $("body").append(this.sign_box);
    if (type === 0) {
      this.in.show().siblings().hide();
    } else if (type === 1) {
      this.up.show().siblings().hide();
    } else {
      this.living.show().siblings().hide();
    }
    this.box.css(this.css.show);
  },
  //关闭
  hide:function () {
    var that = this;
    this.box.css(this.css.hide);
    setTimeout(function () {
      that.clear();
      that.sign_box.remove();
    },200);
  },
  //切换
  change:function (type) {
    var that = this;
    if (type === 0) {
      this.box.css(this.css.hide);
      setTimeout(function () {
        that.clear();
        that.up.show().siblings().hide();
        that.box.css(that.css.show);
      },300);
    } else {
      this.box.css(this.css.hide);
      setTimeout(function () {
        that.clear();
        that.in.show().siblings().hide();
        that.box.css(that.css.show);
      },300);
    }
  },
  //提交登录表单
  uploadIn:function () {
    var that = this;
    console.log("提交登录表单到" + content_path + "/api/signIn")
    $.ajax({
      url: content_path + "/api/signIn",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(that.form.in),
      dataType: "json",
      success:function (data) {
        //var data = JSON.parse(data);
        if (data.success === true) {
          that.signInSuccess(data.name);
          localStorage.setItem("wangxin",data.name)
        } else if (data.success === false) {
          $(".in-name").after("<label>账号或密码错误</label>");
        }
      },
      error:function (data) {
        console.log(data,"错误")
      }
    });
  },
  //登录成功渲染页面
  signInSuccess:function (name) {
    $(".not-ok").hide();
    $(".ok").show();
    $(".logged > span").text(name);
    this.hide();
  },
  //提交注册表单
  uploadUp:function () {
    var that = this;
    $.ajax({
      url: content_path + "/api/signUp",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(that.form.up),
      success:function (data) {
        //var data = JSON.parse(data);
        console.log(data);
        if (data.success === true) {
          that.change(1);
          alert("注册成功,请登录")
        } else if (data.success === false) {
          $(".up-name").after("<label>用户已存在</label>");
        }
      },
      error:function (data) {
        console.log(data);
      }
    });
  },
  //提交留言表单
  uploadLiving:function () {
    var that = this;
    $.ajax({
      url: content_path + "/api/living",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(that.form.message),
      success:function (data) {
        //var data = JSON.parse(data);
        if (data.success === true) {
          that.hide();
          location.reload();
          alert("留言成功")
        }
      },
      error:function (data) {
        console.log(data);
      }
    });
  },
  //验证,获取登录表单
  getInForm:function () {
    var name = $(".in-name"),
        password = $(".in-password"),
        flag = true;
    if (name.val() !== "") {
      this.form.in.name = xss(name.val());
    } else {
      this.error(name);
      flag = false;
    }
    if (password.val() !== "") {
      this.form.in.password = xss(password.val());
    } else {
      this.error(password);
      flag = false;
    }
    if (flag) {
      console.log(JSON.stringify(this.form.in));
      this.uploadIn();
    }
  },
  //验证,获取注册表单
  getUpForm:function () {
    var name = $(".up-name"),
        mail = $(".up-mail"),
        password = $(".up-password"),
        flag = true,
        re =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (name.val() !== "") {
      this.form.up.name = xss(name.val());
    } else {
      this.error(name);
      flag = false;
    }
    if (mail.val() !== "" && re.test(mail.val())) {
      this.form.up.mail = xss(mail.val());
    } else {
      this.error(mail);
      flag = false;
    }
    if (password.val() !== "") {
      this.form.up.password = xss(password.val());
    } else {
     this.error(password);
      flag = false;
    }
    if (flag) {
      this.uploadUp();
      console.log(JSON.stringify(this.form.up));
    }
  },
  //获取留言信息
  getMessage:function () {
    var message = $(".living-m");
    //替换空格,回车
    var m_length = message.val().replace(/(^\s+)|(\s+$)/g,"");
    console.log("留言长度:",m_length.length)


    if (m_length.length > 0) {
      this.form.message.name = localStorage.getItem("wangxin");
      this.form.message.content = xss(message.val());
      console.log(this.form.message)
      this.uploadLiving();
    } else {
      this.error(message);
    }
  },
  //错误处理
  error:function (obj) {
    if (!obj.next()[0]) {
      var error = "<i class='iconfont error'>&#xe648;</i>";
      obj.after(error);
    }
  },
  //清空数据,初始化
  clear:function () {
    var input = this.box.find("input");
    var textarea = this.box.find("textarea");
    input.val("");
    textarea.val("");
    input.next().remove();
  },
  //增加事件
  addEvent:function () {
    var that = this;
    $("body").on("click",".sign-box",function (event) {
      var id = event.target.id;
      var target = $(event.target);
      //去注册
      if (id === "to-sign-up") {
        that.change(0);
      //去登录
      } else if (id === "to-sign-in") {
        that.change(1);
      //忘记密码
      } else if (id === "forget-p") {
        alert("go人看到办");
      //关闭
      } else if (target.hasClass("close")) {
        that.hide();
      //登录提交
      } else if (id === "in-go") {
        that.getInForm();
      //注册提交
      } else if (id === "up-go") {
        that.getUpForm();
      //留言提交
      } else if (id === "living-go") {
        that.getMessage();
      }
    });
    //回车按钮
    $("body").on("keydown",function (event) {
      console.log("1")
      if (event.keyCode === 13) {
        console.log("2")
        if ($(".sign-box")[0]) {
          if ($(".in").css("display") === "block") {
            that.getInForm();
          } else if ($(".up").css("display") === "block") {
            that.getUpForm();
          } else {
            that.getMessage();
          }
        }
      }
    });
    //input[text]focus消除小红叉
    $("body").on("focus",".sign-box",function (event) {
      if (event.target.nodeName === "INPUT") {
        $(event.target).next().remove();
      }
    });
  }
};
module.exports = signBox;