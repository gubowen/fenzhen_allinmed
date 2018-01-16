/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang/lichenyang on 2017/3/15
 */

$(function () {
    var login = {
        init: function () {
            // this.checkLogin();
            this.loginEvent();//登录
            this.getUserName();//获取用户登录成功后的用户名
            this.userLogin();//登录按钮
            this.goToFixPassword();//点击忘记密码，弹出手机验证
            this.goToLogin();//点击密码，弹出登录框
            // this.savePasswordBtn();//点击记住密码
            this.clearInput();//输入框x号的显示隐藏以及事件
            this.sendValidateCode();//获取验证码
            this.validateCodeEvent();//修改密码中的验证
            this.fixPassword();//确认新密码验证
            this.autoLogin();//自动登录
        },
        config: {
            // savePassword:0,//是否记住密码，默认否，0为不记住，1位记住；
            // sendValidateCodeTimes:0,//当天发送验证码的次数，一天最多只能发送三次
            customerId: "",//会员id，用于更正密码；
            userLoginTelephone: ""//用户自动登录的号码
        },
        XHRList: {
            userLoginUrl: "/call/passport/securitycheck",//用户登录
            sendValidate: "/call/customer/send/code/v1/create/",//获取验证码
            vValidate: "/call/customer/send/code/v1/update/",//手机验证码校验信息
            fixSubmit: "/call/tocure/web/user/updatePasswd/",//修改密码中的确认
            getLoginStatus: "/call/customer/status/v1/getMapById/"//当前登录状态
        },
        template: {
            validateCodeTimesFial: function () {
                return '<p class="validate-code-tips">获取验证码已超过10次，请明天再试</p>';
            }
        },
        //检测当前登录状态
        checkLogin: function () {
            if (localStorage.getItem("userId")) {
                $.ajax({
                    url: this.XHRList.getLoginStatus,
                    type: "POST",
                    dataType: "json",
                    timeout: 10000,
                    beforeSend: function () {
                        common.loading.show();
                    },
                    data: {
                        paramJson: $.toJSON({
                            customerId: localStorage.getItem('userId'),
                            firstResult: "0",
                            maxResult: "9999",
                            isValid: "1"
                        })
                    }
                })
                    .done(function (data) {
                        common.loading.hide();
                        if (data.responseObject.responseData) {
                            var dataList = data.responseObject.responseData.dataList;
                            if (dataList && dataList.length) {
                                $(dataList).each(function (index, element) {
                                    switch (parseInt(element.status)) {
                                        case 0:
                                        case 1:
                                            common.popup({
                                                text: "您已登录，将自动进入...",
                                                fn: function () {
                                                    window.location.href = "/index2.html";
                                                }
                                            });
                                            break;
                                        case 2:
                                            break;
                                    }
                                })
                            }
                        }
                    }).fail(function () {

                });
            } else {
                return true;
            }
        },
        //登录事件
        loginEvent: function () {
            $("#ev-username").on("focus", function (e) {
                e.stopPropagation();
                $("#ev-username-error").hide();
                $("#ev-userpwd-error").hide();
            });
            $("#ev-userpwd").on("focus", function (e) {
                e.stopPropagation();
                $("#ev-username-error").hide();
                $("#ev-userpwd-error").hide();
            });
            //密码框回车提交
            $("#ev-userpwd").on("keypress", function (event) {
                if (event.keyCode == 13) {
                    $("#ev-userpwd").blur();
                    $("#user-login-btn").click();
                }
            })
        },
        //登录验证
        loginValidate: function () {
            $("#ev-username").validate({
                errorEle: $("#ev-username-error"),
                rules: [{
                    rule: "isNoEmpty",
                    msg: "用户名不能为空"
                }, {
                    rule: "isMobile",
                    msg: "用户名格式不正确"
                }]
            });
            $("#ev-userpwd").validate({
                errorEle: $("#ev-userpwd-error"),
                rules: [{
                    rule: "isNoEmpty",
                    msg: "密码不能为空"
                }, {
                    rule: "maxLength:20",
                    msg: "密码长度应在6-20位之间"
                }, {
                    rule: "minLength:6",
                    msg: "密码长度应在6-20位之间"
                }, {
                    rule: "passwordRule",
                    msg: "密码格式不正确"
                }]
            });
        },
        //每次进入页面获取本地保存的用户手机号
        getUserName: function () {
            var userName = localStorage.getItem("userLoginName");
            if (userName) {
                $("#ev-username").val(userName);
            }
        },
        //点击记住密码
        // savePasswordBtn:function () {
        //     var that = this;
        //     $("#save-password").on("click",function () {
        //         $(this).toggleClass("active");
        //         if ($(this).hasClass("active")) {
        //             that.config.savePassword = 1;
        //         } else {
        //             that.config.savePassword = 0;
        //         }
        //     });
        // },
        //用户登录
        userLogin: function () {
            var that = this;
            $("#user-login-btn").on("click", function () {
                that.loginValidate();
                if ($("#ev-username").attr("data-validate") == "true" && $("#ev-userpwd").attr("data-validate") == "true") {
                    // alert("我要登录");
                    var userNameVal = $("#ev-username").val();
                    var passWord = $("#ev-userpwd").val();
                    that.loginFun(userNameVal, passWord, function () {
                        window.location.href = "/index2.html";
                    });
                } else {

                }
            });
        },
        //用户登录函数封装
        loginFun: function (userNameVal, passWord, callback) {
            var that = this;
            var data = {};
            data.j_username = "website;" + userNameVal + ";" + passWord + ";mobile";
            data.j_password = passWord;
            data.rememberMe = true;
            $.ajax({
                url: that.XHRList.userLoginUrl,
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {
                    common.loading.show();
                    $("#user-login-btn").text("登录中");
                },
                timeout: 10000,
                data: data
            }).done(function (data) {
                // alert("用户名登录成功");
                $("#user-login-btn").text("登录");
                common.loading.hide();
                if (data.responseObject.responseStatus) {
                    localStorage.setItem("userLoginName", userNameVal);
                    if (callback) {
                        callback();
                    }
                } else {
                    $("#ev-userpwd-error").show().html(data.responseObject.responseMessage);
                }
                console.log(data);
            }).fail(function (data) {

            })
        },
        //点击忘记密码，弹出手机验证
        goToFixPassword: function () {
            $("#ev-forget-pwd").on("click", function () {
                $(".login-content").hide();
                $("#ev-validateCode").css("display", "inline-block");
            })
        },
        //点击密码，弹出登录框
        goToLogin: function () {
            var that = this;
            $("#ev-login").on("click", function () {
                clearInterval(that.config.time);
                $("#ev-validate-mobile").val("");
                $(".login-input-validate-code").val("");
                $(".login-send-validate-code").text("重新获取").removeAttr("disabled").removeClass("send");
                $("#ev-loginBox").css("display", "inline-block");
                $("#ev-validateCode").hide();
                $("#ev-validate-code-error").hide();
                $("#ev-validate-mobile-error").hide();
            })
        },
        //输入框x号的显示隐藏以及事件
        clearInput: function () {
            $(".login-input-box").on("click keyup", function (e) {
                e.stopPropagation();
                if ($(this).val().length !== 0) {
                    $(this).siblings(".icon-loginCancel").show();
                } else {
                    $(this).siblings(".icon-loginCancel").hide();
                }
            });
            $("body").on("click", function () {
                $(".icon-loginCancel").hide();
            });
            $(".icon-loginCancel").on("click", function (e) {
                e.stopPropagation();
                $(this).hide().siblings(".login-input-box").val("");
            })
        },
        //获取验证码
        sendValidateCode: function () {
            var that = this;
            $(".login-send-validate-code").on("click", function () {
                //获取验证码之前的验证；
                $("#ev-validate-mobile").validate({
                    errorEle: $("#ev-validate-mobile-error"),
                    rules: [{
                        rule: "isNoEmpty",
                        msg: "手机号不能为空"
                    }, {
                        rule: "isMobile",
                        msg: "手机号格式错误"
                    }]
                });
                //判断用户发送的手机号是否填写正确；
                if ($("#ev-validate-mobile").attr("data-validate") == "true") {
                    var data = {};//获取验证码的参数
                    data.account = $("#ev-validate-mobile").val();
                    data.typeId = "1";
                    data.codeLength = "4";
                    data.accountType = "0";//0-手机 1-邮箱
                    $.ajax({
                        url: that.XHRList.sendValidate,
                        type: 'POST',
                        dataType: 'json',
                        beforeSend: function () {
                            $(".login-send-validate-code").attr("disabled", "disabled");
                        },
                        timeout: 10000,
                        data: {
                            paramJson: $.toJSON(data)
                        },
                    }).done(function (data) {
                        console.log(data);
                        if (data.responseObject.responseStatus) {
                            $("#ev-validate-code").attr("data-id", data.responseObject.responsePk);
                            var i = 60;
                            $(".login-send-validate-code").attr("disabled", "disabled").addClass("send").text(i + "S");
                            that.config.time = setInterval(function () {
                                i--;
                                $(".login-send-validate-code").text(i + "S");
                                if (i === 0) {
                                    clearInterval(that.config.time);
                                    $(".login-send-validate-code").text("重新获取").removeAttr("disabled").removeClass("send");
                                    i = 60;
                                }
                            }, 1000);
                        } else if (data.responseObject.responseCode == "SMS0003") {
                            $(".login-send-validate-code").attr("disabled", "disabled").text("重新获取").removeClass("send");
                            $("#validateCodeBox").append(that.template.validateCodeTimesFial());
                            $(".login-input-item .validate-code-tips").addClass("show");
                            setTimeout(function () {
                                $(".login-input-item .validate-code-tips").removeClass("show");
                                setTimeout(function () {
                                    $(".login-input-item .validate-code-tips").remove();
                                    $(".login-send-validate-code").removeAttr("disabled");
                                }, 500);
                            }, 3000);
                        } else if (data.responseObject.responseCode == "0B0001") {
                            $(".login-send-validate-code").removeAttr("disabled", "disabled");
                            $("#ev-validate-mobile-error").show().html(data.responseObject.responseMessage);
                        }
                    }).fail(function (data) {
                        console.log(data);
                    })
                } else {

                }
            });

        },
        //修改密码中的验证
        validateCodeEvent: function () {
            var that = this;
            $("#ev-validate-mobile").on("focus", function (e) {
                e.stopPropagation();
                $("#ev-validate-mobile-error").hide();
                $("#ev-validate-code-error").hide();
            });
            $("#ev-validate-code").on("focus", function (e) {
                e.stopPropagation();
                $("#ev-validate-code-error").hide();
            });
            //点击提交验证验证码是否正确
            $("#ev-validate-submit").on("click", function () {
                //手机号的验证；
                $("#ev-validate-mobile").validate({
                    errorEle: $("#ev-validate-mobile-error"),
                    rules: [{
                        rule: "isNoEmpty",
                        msg: "手机号不能为空"
                    }]
                });
                $("#ev-validate-code").validate({
                    errorEle: $("#ev-validate-code-error"),
                    rules: [{
                        rule: "isNoEmpty",
                        msg: "验证码不能为空"
                    }, {
                        rule: "minLength:4",
                        msg: "验证码为4位阿拉伯数字",
                    }, {
                        rule: "maxLength:4",
                        msg: "验证码为4位阿拉伯数字",
                    }]
                });
                if ($("#ev-validate-code").attr("data-validate") == "true" && $("#ev-validate-mobile").attr("data-validate") == "true") {
                    var data = {};
                    data.account = $("#ev-validate-mobile").val();//手机号
                    data.validCode = $("#ev-validate-code").val();	//string	是	验证码CODE
                    data.id = $("#ev-validate-code").attr("data-id");	//string	是	验证码主键
                    data.isValid = "1"; //修改验证码信息
                    $.ajax({
                        url: that.XHRList.vValidate,
                        type: 'POST',
                        dataType: 'json',
                        beforeSend: function () {
                            common.loading.show();
                            $("#ev-validate-submit").text("提交中");
                        },
                        timeout: 10000,
                        data: {
                            paramJson: $.toJSON(data)
                        }
                    })
                        .done(function (data) {
                            console.log(data);
                            $("#ev-validate-submit").text("提交");
                            common.loading.hide();
                            if (data.responseObject.responseStatus) {
                                if (data.responseObject.responseCode == "success") {
                                    that.config.customerId = data.responseObject.responsePk;
                                    that.config.userLoginTelephone = $("#ev-validate-mobile").val();
                                    $(".login-content").hide();
                                    $("#ev-fixPwd").css("display", "inline-block");
                                } else {
                                    //验证失败的处理
                                    common.loading.hide();
                                    $("#ev-validate-code-error").show().html(data.responseObject.responseMessage);
                                }
                            } else {
                                //验证失败的处理
                                common.loading.hide();
                                $("#ev-validate-code-error").show().html(data.responseObject.responseMessage);
                            }
                        })
                }
            })
        },
        //确认新密码验证
        fixPassword: function () {
            var that = this;
            //新密码验证
            $("#ev-newpwd").on("blur", function (e) {
                e.stopPropagation();
                $(this).validate({
                    errorEle: $("#ev-newpwd-error"),
                    rules: [{
                        rule: "isNoEmpty",
                        msg: "新密码不能为空"
                    }, {
                        rule: "maxLength:20",
                        msg: "密码长度应在6-20位之间"
                    }, {
                        rule: "minLength:6",
                        msg: "密码长度应在6-20位之间"
                    }, {
                        rule: "passwordRule",
                        msg: "密码格式不正确"
                    }]
                })
            });
            $("#ev-newpwd").on("focus", function (e) {
                e.stopPropagation();
                $("#ev-newpwd-error").hide();
                $("#ev-requrire-newpwd-error").hide();

            });
            //确认新密码验证
            $("#ev-requrire-newpwd").on("focus", function (e) {
                e.stopPropagation();
                $("#ev-requrire-newpwd-error").hide();
            });
            //保存按钮
            $("#ev-fix-submit").on("click", function () {
                var requirePassWord = $.trim($("#ev-requrire-newpwd").val());
                if (requirePassWord == "") {
                    $("#ev-requrire-newpwd").attr("data-validate", "false");
                    $("#ev-requrire-newpwd-error").show().html("请确认新密码");
                } else if (requirePassWord == $("#ev-newpwd").val()) {
                    $("#ev-requrire-newpwd").attr("data-validate", "true");
                    $("#ev-requrire-newpwd-error").hide();
                } else {
                    $("#ev-requrire-newpwd").attr("data-validate", "false");
                    $("#ev-requrire-newpwd-error").show().html("两次密码不一致");
                }
                if ($("#ev-requrire-newpwd").attr("data-validate") == "true" && $("#ev-newpwd").attr("data-validate") == "true") {
                    var data = {};
                    data.customerId = that.config.customerId;//string	是	用户id
                    data.passwd = $("#ev-requrire-newpwd").val();//string	是	明文密码
                    $.ajax({
                        url: that.XHRList.fixSubmit,
                        type: 'POST',
                        dataType: 'json',
                        beforeSend: function () {
                            common.loading.show();
                        },
                        timeout: 10000,
                        data: {
                            paramJson: $.toJSON(data)
                        }
                    })
                        .done(function (data) {
                            console.log(data);
                            if (data.responseObject.responseStatus) {
                                that.loginFun(that.config.userLoginTelephone, $("#ev-requrire-newpwd").val(), function () {
                                    //用户使用新密码登录，返回cookie，下次实现用户自动登录
                                    $("#ev-fixPwd").hide();
                                    $("#ev-fix-finish").css("display", "inline-block");
                                    var time, i = 3;
                                    $(".login-fix-success-content>h4>span>em").text(i + "S");
                                    time = setInterval(function () {
                                        i--;
                                        $(".login-fix-success-content>h4>span>em").text(i + "S");
                                        if (i === 0) {
                                            clearInterval(time);
                                            window.location.href = "/index2.html";
                                        }
                                    }, 1000);
                                });
                            } else {
                                //密码修改失败的处理
                                common.loading.hide();
                                $("#ev-requrire-newpwd-error").show().html(data.responseObject.responseMessage);
                            }
                        })
                }
            });
        },
        //自动登录按钮
        autoLogin: function () {
            var that = this;
            $("#ev-goToLogin").on("click", function () {
                that.loginFun(that.config.userLoginTelephone, $("#ev-requrire-newpwd").val(), function () {
                    //用户使用新密码登录，返回cookie，下次实现用户自动登录
                    window.location.href = "/index2.html";
                });
            })
        }
    };
    login.init();
});