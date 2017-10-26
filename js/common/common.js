/**
 * Created by Administrator on 2016/10/19.
 */

var common = {
    //登陆框
    showLoginDom: {
        loginDomShow: function showLoginDom() {
            //登录按钮
            if (this.className == "EV-login") {
                if ($(this).parent()[0].className == "loginBtn") {
                    if ($(".loginInput input")[0].value != "" && $(".loginInput input")[1].value != "") {
                        $("#loginLayer").hide();
                        $("#MaskLayer").hide();
                        $("body").css("overflow","auto");
                        $("#EV-nav .EV-login").text("登录成功").off();
                        $("#EV-nav .EV-register").text("退出").parent().removeClass("poin").end().off().attr("href", "/");
                        // if ($(".productList").length) {
                        //     $(".productList").off().on("click", function () {
                        //         return true;
                        //     })
                        // }
                    }
                } else {
                    $("#MaskLayer").show();
                    $("#loginLayer").show();
                    $("body").css("overflow","hidden");
                }
                $("#registerLayer").hide();
            } else if (this.className == "EV-register") {
                if ($(this).parent()[0].className == "loginBtn") {
                    if ($("#registerLayer input")[0].value != "" && $("#registerLayer input")[1].value != "") {
                        $("#registerLayer").hide();
                        $("#MaskLayer").hide();
                        $("body").css("overflow","auto");
                        $("#EV-nav .EV-login").text("登录成功").off();
                        $("#EV-nav .EV-register").text("退出").parent().removeClass("poin").end().off().attr("href", "//www.medplus.net/index.html");
                        // if ($(".productList").length) {
                        //     $(".productList").off().on("click", function () {
                        //         return true;
                        //     })
                        // }
                    }
                } else {
                    $("#MaskLayer").show();
                    $("#registerLayer").show();
                    $("body").css("overflow","hidden");
                }
                $("#loginLayer").hide();
            }
        },
        domBindFn: function () {
            //登录注册弹窗
            $(".EV-login").on("click", this.loginDomShow);
            $(".EV-register").on("click", this.loginDomShow);

            //资讯页面未登录时不可以点击,并弹出登录框
            // $(".productList").on("click", function () {
            //     $("#MaskLayer").show();
            //     $("#loginLayer").show();
            //     return false;
            // });

            //关闭按钮
            $(".EV-close").on("click", function () {
                $("#MaskLayer").hide();
                $(this).parents(".loginMain").hide();
            });
        }
    }
}