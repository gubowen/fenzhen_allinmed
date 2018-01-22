/**
 * @Desc：顶部
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/3/2
 */

define(['jquery', 'text!headerTemplate', "toJSON", "common", "userList", "fastReply", "usedReply", "bottomController", "messageCommunication"], function ($, text, toJSON, common, ul, fastReply, usedReply, bc, mc) {
    var mainHeader = {
        init: function () {
            this.template = text;
            this.templateUrl();

            this.getBaseMessage();
            this.toggleStatusEvent();
            this.quitLogin();


        },
        templateUrl: function () {
            $("[data-template='tpl-header']").append(this.template);
        },
        XHRList: {
            quitLogin: "/call/tocure/web/user/logout/",
            getMsg: "/call/tocure/web/user/getWebUser/",
            status: "/call/customer/status/v1/update/",
            getStatus: "/call/customer/status/v1/getMapById/",
            quitTriage: "/call/customer/case/consultation/v1/updateConsultation/",
            online: "/call/customer/status/v1/getOnlineUsers/"
        },
        quitFailBack: function () {
            common.popup({
                text: "抱歉您退出失败，请重新登录"
            });
            common.loading.hide();
        },
        checkOnlineDoctorNum: function (msgCallback) {
            var that = this;
            $.ajax({
                url: this.XHRList.online,
                type: "POST",
                dataType: "json",
                timeout: 10000,
                async: false,
                data: ""
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        if (parseInt(data.responseObject.responseData) > 1) {
                            msgCallback && msgCallback();
                        }
                    } else {
                        that.quitFailBack();
                    }
                }).fail(function () {
                that.quitFailBack();
            });
        },
        quitTriage: function (callback) {
            var that = this;
            $.ajax({
                url: this.XHRList.quitTriage,
                type: 'POST',
                dataType: 'json',
                timeout: 20000,
                data: {
                    paramJson: $.toJSON({
                        customerId: localStorage.getItem("userId")
                    })
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        that.checkOnlineDoctorNum(function () {
                            mc.messageCommunication.nim.sendCustomMsg({
                                scene: 'p2p',
                                to: '1_doctor00001',
                                content: JSON.stringify({
                                    type: "anotherDoctorTriage",
                                    data: {
                                        caseId: "",
                                        sexName: "",
                                        age: "",
                                        patientName: "",
                                        createDate: new Date().getTime(),
                                        diagnoseConTent: "",
                                        isAttachment: "",
                                        time: "",
                                        patientId: "",
                                        consultationid: "",
                                        shuntCustomerId: ""
                                    }
                                }),
                                isLocal: true,
                                done: function () {
                                    $(".userlist-mainList[data-role='ut-tabs-1'] .userlist-mainList-item,.userlist-mainList[data-role='ut-tabs-3'] .userlist-mainList-item").each(function (index, el) {
                                        mc.messageCommunication.nim.sendCustomMsg({
                                            scene: 'p2p',
                                            to: "0_" + el.getAttribute("data-account"),
                                            content: JSON.stringify({
                                                "type": "reTriageTip"
                                            }),
                                            done: function (error, obj) {

                                            }
                                        });
                                    });

                                }
                            });
                        });

                        callback && callback();
                    }else{
                        that.quitFailBack();
                    }
                }).fail(function () {

            });
        },
        quitLogin: function () {
            var that = this;


            $("#ev-quit-login").on("click", function () {
                common.bigConfirm({
                    text: "你确定要退出平台吗？",
                    ensure: "确定",
                    cancel: "取消",
                    ensureCallback: function () {
                        that.quitTriage(function () {
                            $.ajax({
                                url: that.XHRList.quitLogin,
                                type: 'POST',
                                dataType: 'json',
                                timeout: 10000
                            })
                                .done(function (data) {
                                    if (data.responseObject.responseStatus) {
                                        that.quitTriage(function () {
                                            localStorage.removeItem("userName");
                                            localStorage.removeItem("mobile");
                                            localStorage.removeItem("userId");
                                            window.location.href = "/pages/login/login.html";
                                        });
                                    }else{
                                        that.quitFailBack();
                                    }
                                }).fail(function (data) {
                            });
                        });
                    }
                });
            });
        },
        getBaseMessage: function () {
            //检测登录状态 获取基本信息
            var that = this;
            $.ajax({
                url: this.XHRList.getMsg,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                async: false
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        if (data.responseObject.responseMessage) {
                            var dataList = data.responseObject.responseMessage;
                            localStorage.setItem("userName", dataList.nickName);
                            localStorage.setItem("mobile", dataList.mobile);
                            localStorage.setItem("userId", dataList.uniteUserId);
                            localStorage.setItem("mailBox", dataList.email);
                            localStorage.setItem("sex", dataList.sex);
                            that.getUserStatus();
                            $(".main-header-tips span").text(dataList.nickName);
                            bc.init();
                            ul.init();
                            fastReply.init();
                            usedReply.init();
                        }
                    } else {
                        window.location.href = "/pages/login/login.html";
                    }
                })

        },
        toggleStatusEvent: function () {
            var that = this;
            $(".main-header-toggle").on("click", function () {
                $(this).toggleClass("on");
            });

            $('.main-header-toggle-list-item').on("click", function () {
                var id = $(this).attr("data-id");
                that.toggleStatus(id, $(this));
            });
        },
        toggleStatus: function (id, ele) {
            $.ajax({
                url: this.XHRList.status,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show();
                },
                data: {
                    paramJson: $.toJSON({
                        customerId: localStorage.getItem('userId'),
                        status: id
                    })
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        ele.addClass("active").siblings().removeClass("active");
                        $("#ev-user-status").text(ele.text());
                    }
                    common.loading.hide();
                })

        },
        getUserStatus: function () {
            $.ajax({
                url: this.XHRList.getStatus,
                type: 'POST',
                dataType: 'json',
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
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length) {
                            $(dataList).each(function (index, element) {
                                $(".main-header-toggle-list .main-header-toggle-list-item").removeClass("active");
                                $(".main-header-toggle-list .main-header-toggle-list-item[data-id='" + element.status + "']").addClass("active");
                                switch (parseInt(element.status)) {
                                    case 0:
                                        $("#ev-user-status").text("在线");
                                        break;
                                    case 1:
                                        $("#ev-user-status").text("休息");
                                        break;
                                }
                            })
                        }
                    }
                    common.loading.hide();
                })
        }
    };
    mainHeader.init();
    return mainHeader;
});