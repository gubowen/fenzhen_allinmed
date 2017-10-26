/**
 * @Desc： IM通讯模块
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/2/13
 */
define(['jquery', "NIM", "common", "bigPicShow", "previewSuggestion", "medicalRecord","exif"], function ($, NIM, common, bigPicShow, ps, mr,exif) {
    function nimEnv(){
        var host=window.location.host;
        var nimKey="";


        if (host==="www1.allinmed.cn"){
            /*
             * m1线上测试环境
             * 使用云信测试账号
             * */
            nimKey="936722025b6a7fda857cb990fd4ca3ec";
        }else{
            /*
             * 其余任何环境
             * 使用正式账号
             *
             * 注意，该key任何人员不允许修改
             * */
            nimKey="50c93d2ab7e207fd83231a245c07bfbc";
        }
        return nimKey;
    }

    //通讯类
    var MessageCommunication = function () {
    };

    MessageCommunication.prototype = {
        //通讯类加载...
        init: function () {
            var that = this;
            this.nim = NIM.getInstance({
                // debug: true,
                appKey: nimEnv(),
                account: controller.userData.account,
                token: controller.userData.token,
                onconnect: function (data) {
                    console.log('连接成功');


                },
                onmyinfo: function (userData) {
                    controller.getUserInfo(userData);
                    that.sendMessage();

                },
                onwillreconnect: this.onWillReconnect,
                ondisconnect: function (error) {
                    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
                    console.log('丢失连接');
                    console.log(error);
                    if (error) {
                        switch (error.code) {
                            // 账号或者密码错误, 请跳转到登录页面并提示错误
                            case 302:
                                break;
                            // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                            case 417:
                                common.alertBox({
                                    title: "唯医会诊",
                                    text: "当前账号于其他设备登录.若非本人操作,您的登录密码可能已经泄露,请及时改密.",
                                    ensure: "确定",
                                    ensureCallback: function () {
                                        localStorage.removeItem("userName");
                                        localStorage.removeItem("mobile");
                                        localStorage.removeItem("userId");
                                        window.location.href = "//www.allinmed.cn/pages/login/login.html";
                                    }
                                });
                                break;
                            // 被踢, 请提示错误后跳转到登录页面
                            case 'kicked':
                                break;
                            default:
                                break;
                        }
                    }
                },
                onerror: this.onError,
                onroamingmsgs: this.onRoamingMsgs,
                onofflinemsgs: this.onOfflineMsgs,
                onmsg: function (msg) {
                   // console.log(msg);
                    // debugger;
                    //console.log(JSON.parse(msg.content));
                    if (msg.from.substring(2) == localStorage.getItem("caseId")) {
                        controller.receiveMessage($(".messageList-box[data-account='" + msg.from.substring(2) + "']"), msg, "message");
                    }


                    if (msg.type.toLowerCase() === "custom" && JSON.parse(msg.content).type.indexOf("new-") != -1) {
                        setTimeout(function () {
                            controller.newPatientAppendToList(msg);
                        }, 3000);
                    }

                    controller.userItemToTop(msg.from, msg.time);
                    if (msg.type.toLowerCase() === "custom"&&JSON.parse(msg.content).data) {
                      //  debugger;
                        if (JSON.parse(msg.content).data.shuntCustomerId === localStorage.getItem("userId")) {
                            if (JSON.parse(msg.content).type.indexOf("new-") == -1||JSON.parse(msg.content).type == "reTriageTip"){
                                return;
                            }else{
                                controller.newMessageTips(msg.from);
                            }
                        }
                    } else if (msg.type.toLowerCase()==="text"){
                        if ($("[data-account='" + msg.from.substring(2) + "'].active").length === 0) {
                            controller.newMessageTips(msg.from);
                        }
                    }else if(msg.type.toLowerCase()==="file"){
                        if ($("[data-account='" + msg.from.substring(2) + "'].active").length === 0) {
                            controller.newMessageTips(msg.from);
                        }
                    }

                    //$('#music')[0].play();

                },
                onsessions: function (sessions) {
                    // 会话列表……Account获取>>>>对应聊天云端记录获取
                    var list = controller.getAccountLists(sessions);
                    // >>>对应用户名片获取

                    // that.getTargetAvatar(list);
                },
                onupdatesession: function (session) {
                    console.log('会话更新了', session);

                }
            });
        },
        sendMessage: function () {
            var that = this;
            //单条消息发送
            $(".user-controller-send-btn").on("click", function () {
                if ($(".user-controller-input").val().trim().length === 0) {
                    return false;
                }
                if ($(".user-controller-input").attr("data-upload") && (parseInt($(".user-controller-input").attr("data-upload")) === 1 || parseInt($(".user-controller-input").attr("data-upload")) === 2)) {
                    that.sendVideoTriage($(".user-controller-input").val(), $(".user-controller-input").attr("data-upload"))
                } else {
                    that.nim.sendText({
                        scene: 'p2p',
                        to: controller.targetData.account,
                        text: $(".user-controller-input").val(),
                        done: function (error, obj) {
                            console.log(obj)
                            controller.sendSingleMessage(error, obj)
                        }
                    });
                }
            });
            $(".user-controller-input").on("keydown", function (e) {

                if (e.keyCode == 13) {
                    if ($(".user-controller-input").attr("data-upload") && (parseInt($(".user-controller-input").attr("data-upload")) === 1 || parseInt($(".user-controller-input").attr("data-upload")) === 2)) {
                        that.sendVideoTriage($(".user-controller-input").val(), $(".user-controller-input").attr("data-upload"))
                    } else {
                        if ($(".user-controller-input").val().trim().length === 0) {
                            return false;
                        }
                        that.nim.sendText({
                            scene: 'p2p',
                            to: controller.targetData.account,
                            text: $(".user-controller-input").val(),
                            done: function (error, obj) {
                                controller.sendSingleMessage(error, obj)
                            }
                        });
                    }
                }
            });
        },
        //发送检查检验...
        sendCheckSuggestion: function (data) {
            // this.nim.sendText({
            //     scene: 'p2p',
            //     to: controller.targetData.account,
            //     text: "非常抱歉，由于缺少重要的检查资料，暂时无法做出诊断。建议您尽快进行以下检查，并上传检查资料，唯医骨科将继续为您咨询。",
            //     done: function (error, obj) {
            //         controller.sendSingleMessage(error, obj)
            //     }
            // });


            this.nim.sendCustomMsg({
                scene: 'p2p',
                to: controller.targetData.account,
                content: JSON.stringify({
                    "data": data,
                    "type": "checkSuggestion"
                }),
                done: function (error, obj) {
                    console.log(obj)
                    controller.sendCheckSuggestion(error, obj)
                }
            });
        },
        //发送初诊建议...
        sendPreviewSuggestion: function (data) {

            // this.nim.sendText({
            //     scene: 'p2p',
            //     to: controller.targetData.account,
            //     text: "亲爱的" + $(".messageList-targetName span").text() + "，感谢您对唯医会诊的信任！请查看医生为您定制的专属建议，如有任何疑问，会诊将继续为您解答。祝您早日康复！",
            //     done: function (error, obj) {
            //         controller.sendSingleMessage(error, obj)
            //     }
            // });
            this.nim.sendCustomMsg({
                scene: 'p2p',
                to: controller.targetData.account,
                content: JSON.stringify({
                    "data": data,
                    "type": "previewSuggestion"
                }),
                done: function (error, obj) {
                    controller.sendPreviewSuggestion(error, obj)
                }
            });
        },
        //发送视诊...
        sendVideoTriage: function (content, type) {
            var tType = "";
            if (type == 1) {
                tType = 2;
            } else if (type == 2) {
                tType = 1;
            }
            this.nim.sendCustomMsg({
                scene: 'p2p',
                to: controller.targetData.account,
                content: JSON.stringify({
                    "data": {
                        content: content,
                        type: tType
                    },
                    "type": "videoTriage"
                }),
                done: function (error, obj) {
                    controller.sendVideoTriage(error, obj)
                }
            });
        },
        //获取历史消息……
        getMessageList: function (from) {
            var that = this;
            this.nim.getHistoryMsgs({
                scene: 'p2p',
                to: controller.targetData.account,
                done: function (error, obj) {
                    controller.renderHistoryMessage($(".messageList-box[data-account='" + controller.targetData.account.substring(2) + "']"), error, obj, from);
                    if (obj.msgs.length > 0) {
                        that.messageScrolling(obj.msgs[0].time);

                    }
                    template.savePic();

                    $(".messageList-box[data-account='" + controller.targetData.account.substring(2) + "'] .J-showPicImg img").each(function (index,element) {
                       // console.log(EXIF.getData)
                        setTimeout(function () {
                            EXIF.getData(element, function () { // IMG_FILE为图像数据
                                var orientation = EXIF.getTag(this, "Orientation");
                                if (orientation==6){
                                    $(this).parent().css({
                                        "transform":"rotate(90deg)"
                                    })
                                }
                            });
                        },400)
                    });

                },
                limit: 100
            });
        },
        // 记录懒加载
        messageScrolling: function (time) {
            var ele = $(".messageList-box[data-account='" + controller.targetData.account.substring(2) + "']");
            var that = this;
            var i = 1;
            ele.off("scroll").on("scroll", function () {
                if (i <= 5 && time) {
                    if (parseInt($(this).scrollTop()) === 0) {
                        that.nim.getHistoryMsgs({
                            scene: 'p2p',
                            to: controller.targetData.account,
                            beginTime: 0,
                            endTime: time,
                            done: function (error, obj) {
                                $(".messageList-box[data-account='" + controller.targetData.account.substring(2) + "']").prepend("<article class='replace-part'></article>");
                                controller.renderHistoryMessage($(".replace-part"), error, obj);
                                $(".messageList-box[data-account='" + controller.targetData.account.substring(2) + "']").prepend($(".replace-part").children());
                                $(".replace-part").remove();
                                if (obj.msgs[0]) {
                                    time = obj.msgs[0].time;
                                    i++;
                                } else {
                                    return;
                                }

                            },
                            limit: 20
                        });
                    }
                }
            })
        },
        //修改用户名片...
        //尚不确定如何修改
        configUserInfo: function () {
            this.nim.updateMyInfo(controller.configUserInfo());

        },
        //获取对方名片
        getTargetAvatar: function (list) {
            var that = this;
            that.nim.getUsers({
                accounts: list,
                done: controller.getTragetInfo
            });
        },
        getFriends: function () {
            var that = this;

            this.nim.getFriends({
                done: getFriendsDone
            });

            function getFriendsDone(error, friends) {
                console.log('获取好友列表' + (!error ? '成功' : '失败'), error, friends);
                if (!error) {
                    onFriends(friends);
                }
            }

            function onFriends(friends) {
                console.log('收到好友列表', friends);
            }
        }
    };

    //操作类
    var Controller = function () {
        this.messageBox = "";
        this.ntnCacheList = {};
    };
    Controller.prototype = {
        XHRList: {
            getMedicalReport: ""
        },

        //基础用户数据...
        userData: {
            account: '1_doctor00001',
            token: 'AllinDoctor00001'
        },

        //对话目标数据:
        targetData: [],
        targetAvatar: [],
        //未读消息

        //未阅消息数量...
        newTipsNumber: 0,
        //发送单条数据...
        sendSingleMessage: function (error, msg) {

            var that = this;
            console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
            if (!error) {
                $(".user-controller-input").val("");
                this.renderTimeStamp(parseInt(msg.time));
                $(".messageList-box:visible").append(template.mine(msg));
            }
            this.messageBox.scrollTop(Math.pow(10, 10));

            this.userItemToTop(msg.to, msg.time);
        },
        //列表置顶...
        userItemToTop: function (account, time) {
            var ele = $(".userlist-mainList-item[data-account='" + account.substring(2) + "']");
            var container = ele.parents(".userlist-mainList");
            $(".userlist-mainList-item[data-account='" + account.substring(2) + "']").remove();
            container.prepend(ele);
            ele.find(".time").text(this.transformMessageTime(time));
        },
        //发送检查检验...
        sendCheckSuggestion: function (error, msg) {
            var that = this;
            console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
            if (!error) {
                this.renderTimeStamp(parseInt(msg.time));
                $(".messageList-box:visible").append(template.checkSuggestion(JSON.parse(msg.content).data));
            }
            this.messageBox.scrollTop(Math.pow(10, 10));
            this.userItemToTop(msg.from, msg.time);
        },

        //发送初诊建议
        sendPreviewSuggestion: function (error, msg) {
            console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
            if (!error) {
                this.renderTimeStamp(parseInt(msg.time));
                this.messageBox.append(template.previewSuggestion(JSON.parse(msg.content).data[0]));

            }
            this.messageBox.scrollTop(Math.pow(10, 10));
            this.userItemToTop(msg.from, msg.time);
        },
        //发送视诊...
        sendVideoTriage: function (error, msg) {
            console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
            if (!error) {
                $(".user-controller-input").removeAttr("data-upload").val("");
                this.renderTimeStamp(parseInt(msg.time));
                $(".messageList-box[data-account='" + this.targetData.account.substring(2) + "']").append(template.videoTriage(JSON.parse(msg.content).data));
                $(".messageList-box[data-account='" + this.targetData.account.substring(2) + "']").scrollTop(Math.pow(10, 10));
                this.userItemToTop(msg.from, msg.time);
            }
        },
        //新消息提示机制...
        newMessageTips: function (account) {
            if ($(".main-header-toggle-list-item.active").attr("data-id") == 0) {
                var element = $(".userlist-mainList-item[data-account='" + account.substring(2) + "']");
                // if (localStorage.getItem("ntnCache") && JSON.parse(localStorage.getItem("ntnCache"))[account]) {
                //     var ntnCache = JSON.parse(localStorage.getItem("ntnCache")),
                //         newTipsNumber = ntnCache[account];
                // } else {
                //     var ntnCache = {}, newTipsNumber = 0;
                // }


                var newTipsNumber = 0;
                var ntnCache = {};
                if (localStorage.getItem("ntnCache") && JSON.parse(localStorage.getItem("ntnCache"))[account]) {
                    var ntnCache = JSON.parse(localStorage.getItem("ntnCache")),
                        newTipsNumber = ntnCache[account];
                }


                var ntnCacheObject = {};
                if (this.ntnCacheList[account] != undefined) {
                    newTipsNumber = this.ntnCacheList[account];
                } else {
                    ntnCacheObject[account] = 0;
                    newTipsNumber = ntnCacheObject[account];
                    this.ntnCacheList[account] = newTipsNumber;

                }
                newTipsNumber++;
                ntnCache[account] = newTipsNumber;
                this.ntnCacheList[account] = newTipsNumber;
                localStorage.setItem("ntnCache", JSON.stringify(ntnCache));

                if (!element.hasClass("active") && $(".userlist-mainList-item[data-account='" + account.substring(2) + "']").length > 0) {
                    var _role = element.parents(".userlist-mainList").attr("data-role");

                    element.find(".userlist-item-img p").show().addClass("on").text((newTipsNumber >= 100 ? "..." : newTipsNumber));
                    if (_role != 'ut-tabs-2') {
                        $(".userlist-status-item[data-role='" + _role + "']").addClass("new");
                        $('#music')[0].play();

                    }
                }
            }
        },
        //接受消息...
        receiveMessage: function (container, element, from) {
            if (from === "history") {
                if (element.content) {
                    if (JSON.parse(element.content).type.indexOf("new-") > -1||JSON.parse(element.content).type==="notification") {

                    } else if (JSON.parse(element.content).type.indexOf("medicalReport") > -1) {

                    } else {
                        this.renderTimeStamp(parseInt(element.time), element.from.substring(2));
                    }
                    // console.log(JSON.parse(element.content).type)
                } else {
                    this.renderTimeStamp(parseInt(element.time), element.from.substring(2));
                }
            } else if (from === "message" && element.from === this.targetData.account) {
                if (element.content && JSON.parse(element.content).type==="notification"){

                }else{
                    this.renderTimeStamp(parseInt(element.time), element.from.substring(2));
                }

            }
            switch (element.type) {
                case 'custom':
                    //情况区分：病例？手术？康复报告？
                    if (JSON.parse(element.content)) {
                        this.receiveCustomMessage(container, JSON.parse(element.content), element.from.substring(2), from);
                    }
                    break;
                case 'notification':
                    // 处理群通知消息
                    break;
                case "text":
                    //单聊消息
                    this.receiveSingleMessage(container, element, element.from.substring(2));
                    break;
                case "file":
                    // 发送文件...
                    this.receiveFileMessage(container, element, element.from.substring(2));
                    break;
                default:
                    break;
            }
            container.scrollTop(Math.pow(10, 10));


        },
        //消息时间转换...
        transformMessageTime: function (time) {
            var format = function (num) {
                return num > 9 ? num : "0" + num;
            };
            var normalTime = function (time) {
                var d = new Date(time);
                var obj = {
                    y: d.getFullYear(),
                    m: d.getMonth() + 1,
                    dd: d.getDate(),
                    h: d.getHours(),
                    mm: format(d.getMinutes())
                };
                return obj;
            };
            var result = "";
            var now = new Date().getTime(),
                day1 = normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd,
                day2 = normalTime(now).y + "-" + normalTime(now).m + "-" + normalTime(now).dd;
            if (day1 === day2) {
                result = normalTime(time).h + ":" + normalTime(time).mm;
            } else if (normalTime(time).y === normalTime(now).y) {
                result = normalTime(time).m + "月" + normalTime(time).dd + "日  " + normalTime(time).h + ":" + normalTime(time).mm;
            } else if (normalTime(time).y !== normalTime(now).y) {
                result = normalTime(time).y + "年" + normalTime(time).m + "月" + normalTime(time).dd + "日  " + normalTime(time).h + ":" + normalTime(time).mm;
            }
            return result;
        },
        //每超过5分钟打印一次时间戳...

        renderTimeStamp: function (time, account) {
            //  if ((time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
            $(".messageList-box[data-account='" + localStorage.getItem("caseId") + "']").append("<p class='time-stamp'>" + this.transformMessageTime(time) + "</p>");
            this.beginTimestamp = time;
            //    }
        },
        //接受单条消息...
        receiveSingleMessage: function (container, msg, account) {
            container.append(msg.from === this.userData.account ? template.mine(msg) : template.others(msg));
            $(".messageList-item", ".center-inner-message").off().on('click', function () {
                if ($(this).find(".link").length > 0) {
                    $(".medical-record .tabsInner .active").removeClass("active");
                    $(".medical-record .tabsItem[data-role='mr-record-6']").addClass("active");
                    mr.getMajorCheck();

                    $(".medical-record .viewInner .viewItem").each(function () {
                        if ($(this).is(':visible')) {
                            $(this).hide()
                        }
                    });
                    $(".medical-record .viewItem[data-role='mr-record-6']").show();
                }
            })
        },
        //接受文件消息...
        receiveFileMessage: function (container, msg, account) {
            container.append(template.others(msg));
            template.savePic();
        },
        //接受自定义消息 集中分配
        receiveCustomMessage: function (container, msg, account, from) {
            switch (msg.type) {
                case "medicalReport": //病例
                    if (from !== "message") {
                        this.getMedicalReportData(account);
                    }
                    break;
                case "previewSuggestion"://初诊报告
                    container.append(template.previewSuggestion(msg.data[0]));
                    ps.previewSended();
                    break;
                case "operationReport": //手术预约
                    if (from !== "message") {
                        this.getOperationData(account);
                    }
                    break;
                case "checkSuggestion": //检查检验
                    container.append(template.checkSuggestion(msg.data));
                    break;
                case "videoTriage": //视诊
                    container.append(template.videoTriage(msg.data));
                    break;
                case "ensureOperation": //确认手术
                    container.append(template.ensureOperation(msg.data));
                    break;
                case "reTriageTip":
                    container.append("<p class='time-stamp'>上一位服务该患者的分诊医生已下班，如有需要请继续沟通</p>");
                    break;
            }

        },
        //患者被拒绝后处理DOM...
        movePatientToRefuseList: function (msg) {
            console.log("504");
            var ele = $(".userlist-mainList-item[data-account='" + msg.caseId + "']");

            $(".userlist-mainList[data-role='ut-tabs-3']").prepend(ele);

            $(".messageList-box[data-account='" + msg.caseId + "']").prepend('<p class="time-stamp">' +
                ((msg.refuseReason && msg.refuseReason.length === 0) ? '该患者被退回' : '由于' + msg.refuseReason + ',该患者被退回') +
                '</p>');

        },
        //调取接口获取病例单...
        getMedicalReportData: function (account) {
            var that = this;
            $.ajax({
                url: "/call/customer/patient/case/v1/getMapById/",
                type: 'get',
                dataType: 'json',
                timeout: 10000,
                async: false,
                data: {
                    paramJson: $.toJSON({
                        caseId: localStorage.getItem("caseId"),
                        isOrder: 0,
                        attUseFlag: 3
                    })
                },
                beforeSend: function () {
                    common.loading.show();

                }
            })
                .done(function (data) {
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            that.medicalRecordData = dataList[0];
                            $(".messageList-box[data-account='" + account + "']").append(template.medicalRecord(dataList[0]));
                            mr.getBaseData(dataList);

                            var imgLength = "";
                            $(".messageList-box[data-account='" + account + "'] ").each(function () {
                                if ($(this).is(":visible")) {
                                    imgLength = $(this).find(".special-message-item-img").length;
                                }
                            });
                            var swiperDom = "";
                            var isInit = "";
                            // debugger;
                            //var imgLength = $(".messageList-box[data-account='" + account + "'] .special-message-item-list.img-box .special-message-item-img ").length;
                            //   var  = $(".messageList-box").is(':hidden').length;

                            if (imgLength == 1) {
                                isInit = false;
                                swiperDom = '<div id="EV-swiper">' +
                                    '<div class="background-hidden">' +
                                    '<div class="rotate-button"></div>' +
                                    '<div class="bigger-button"></div>' +
                                    '<div class="smaller-button"></div>' +
                                    '  <div class="swiper-container gallery-top">' +
                                    '      <div class="swiper-wrapper">' +
                                    //  str +
                                    '      </div>' +
                                    '</div>' +
                                    '      <div class="swiper-pagination EV-gallery-top"></div>' +
                                    '      </div>' +
                                    '      <div class="closeBtn"></div>' +
                                    '      </div>';
                            } else if (imgLength <= 6) {
                                isInit = false;
                                swiperDom = '<div id="EV-swiper">' +
                                    '<div class="background-hidden">' +
                                    '<div class="rotate-button"></div>' +
                                    '<div class="bigger-button"></div>' +
                                    '<div class="smaller-button"></div>' +
                                    '  <div class="swiper-container gallery-top">' +
                                    '      <div class="swiper-wrapper">' +
                                    //     str +
                                    '      </div>' +
                                    '</div>' +
                                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                    '      <div class="swiper-pagination EV-gallery-top"></div>' +

                                    '      </div>' +
                                    '      <div class="swiper-container gallery-thumbs">' +
                                    '      <div class="swiper-wrapper  swiper-wrapper-center">' +
                                    //  str +
                                    '      </div>' +
                                    '      <!-- Add Pagination -->' +
                                    '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                                    '      </div>' +
                                    '      <div class="closeBtn"></div>' +
                                    '      </div>';


                            } else {
                                swiperDom = '<div id="EV-swiper">' +
                                    '<div class="background-hidden">' +
                                    '<div class="rotate-button"></div>' +
                                    '<div class="bigger-button"></div>' +
                                    '<div class="smaller-button"></div>' +
                                    '<div class="swiper-container gallery-top">' +
                                    '      <div class="swiper-wrapper">' +
                                    // str +
                                    '      </div>' +
                                    '</div>' +
                                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                    '      <div class="swiper-pagination EV-gallery-top"></div>' +

                                    '      </div>' +
                                    '      <div class="swiper-container gallery-thumbs">' +
                                    '      <div class="swiper-wrapper">' +
                                    //str +
                                    '      </div>' +
                                    '      <!-- Add Pagination -->' +
                                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                    '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                                    '      </div>' +
                                    '      <div class="closeBtn"></div>' +

                                    '      </div>';
                                isInit = true;
                            }

                            $.bigPicShow({
                                domIdList: ".special-message-item-list.img-box",
                                // swiperList: str,
                                topSwiperOptions: {
                                    isInit: true,//是否需要初始化,
                                    // loop: true, // 开启循环模式,必须设置loopedSlides
                                    // loopedSlides: 5, //looped slides should be the same
                                    autoplay: "",//自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
                                    preventClicks: false,//当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
                                    //pagination : '.swiper-pagination', //分页器
                                    noSwiping: true,
                                    pagination: '',//分页器q
                                    paginationType: 'fraction',
                                    /*** ‘bullets’  圆点（默认）‘fraction’  分式‘progress’  进度条‘custom’ 自定义**/
                                    prevButton: '.swiper-button-prev',
                                    nextButton: '.swiper-button-next',//前进按钮的css选择器或HTML元素。
                                    /**
                                     *  回调函数，初始化后执行。
                                     */
                                    simulateTouch: false,
                                    onInit: function (swiper) {
                                        $(".gallery-thumbs .swiper-slide").on("click", function () {
                                            var index = $(this).index();
                                            console.log("asdfasdfasdf");
                                            swiper.slideTo(index);//切换到第一个slide，速度为1秒
                                        });
                                        // $(".gallery-thumbs .swiper-slide").eq(0).addClass("swiper-slide-active");
                                        $(".gallery-thumbs .swiper-slide-active").length > 0 ? " " : $(".gallery-thumbs .swiper-slide").eq(0).addClass("swiper-slide-active");

                                        console.log("sipwer初始化完成!,回调函数，初始化后执行。");
                                        $('.swiper-right-gray').on("click", function () {
                                            $("#EV-swiper .gallery-thumbs").stop().addClass("show");
                                            setTimeout(function () {
                                                $("#EV-swiper .gallery-thumbs").stop().removeClass("show");
                                            }, 0);
                                        });

                                        $('.swiper-left-gray').on("click", function () {
                                            $("#EV-swiper .gallery-thumbs").stop(false, true).addClass("show");
                                            setTimeout(function () {
                                                $("#EV-swiper .gallery-thumbs").stop(false, true).removeClass("show");
                                            }, 0);
                                        });
                                    },
                                    /**
                                     * 回调函数，当你轻触(tap)Swiper后执行。在移动端，click会有 200~300 ms延迟，所以请用tap代替click作为点击事件。
                                     * */
                                    onTap: function (swiper, event) {

                                        console.log(swiper.activeIndex); //swiper当前的活动块的索引

                                        console.log(swiper.realIndex);//swiper当前的活动块的真实索引,排除loop模式下添加的滑块DOM
                                        console.log(swiper.clickedIndex);//返回最后点击Slide的索引。(click)
                                        swiper.stopAutoplay();    //停止自动切换
                                        swiper.startAutoplay();    //开始自动切换
                                    },
                                    onSlideChangeStart: function (swiper) { //滑块释放时如果触发slider切换则执行

                                        console.log(swiper.activeIndex + "当前索引");
                                        $.openPhotoGallery($(".swiper-slide-active").eq(0));

                                        if (!isInit) {
                                            $(".gallery-thumbs .swiper-slide").removeClass("swiper-slide-active").eq(swiper.activeIndex).addClass("swiper-slide-active");

                                        }
                                        console.log("loop循环模式前的索引值为" + swiper.realIndex);
                                    }
                                },
                                bottomSwiperOptions: {
                                    isInit: isInit,//是否需要初始化,
                                    // loop: true, // 开启循环模式,必须设置loopedSlides
                                    paginationType: '',
                                    loopedSlides: 5 //looped slides should be the same
                                },
                                /**
                                 * 为每个指定的图片（会触发大图）单击事件绑定回调函数
                                 * 此方法针对以dom为数据源的方式
                                 * */
                                imgElementCallBack: function () {
                                    console.log("为每个指定的图片（会触发大图）单击事件绑定回调函数");
                                },
                                /**
                                 * 关闭按钮回调函数
                                 * */
                                closeCallBack: function () {
                                    console.log("关闭按钮回调函数");
                                },
                                /**
                                 * 指定的dom结构
                                 * */
                                swiperDom: swiperDom
                                /**
                                 * 指定的dom结构
                                 * */
                                // swiperDom: swiperDom
                            });

                        }

                    }
                    common.loading.hide();
                })
        },
        getOperationData: function (account) {
            var that = this;
            $.ajax({
                url: "/call/customer/patient/case/v1/getMapById/",
                type: 'get',
                dataType: 'json',
                timeout: 10000,
                async: false,
                data: {
                    paramJson: $.toJSON({
                        caseId: localStorage.getItem("caseId"),
                        isOrder: 1,
                        attUseFlag: 3
                    })
                },
                beforeSend: function () {
                    common.loading.show();
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            that.operationData = dataList;
                            $(".messageList-box[data-account='" + account + "']").append(template.operation(dataList[0]));
                            mr.getBaseData(dataList);
                            var swiperDom = "";
                            var isInit = "";
                            // debugger;
                            var imgLength = "";
                            $(".messageList-box[data-account='" + account + "'] ").each(function () {
                                if ($(this).is(":visible")) {
                                    imgLength = $(this).find(".special-message-item-img").length;
                                }
                            });
                            var swiperDom = "";
                            var isInit = "";
                            // debugger;
                            //var imgLength = $(".messageList-box[data-account='" + account + "'] .special-message-item-list.img-box .special-message-item-img ").length;
                            //   var  = $(".messageList-box").is(':hidden').length;

                            if (imgLength == 1) {
                                isInit = false;
                                swiperDom = '<div id="EV-swiper">' +
                                    '<div class="background-hidden">' +
                                    '<div class="rotate-button"></div>' +
                                    '<div class="bigger-button"></div>' +
                                    '<div class="smaller-button"></div>' +
                                    '  <div class="swiper-container gallery-top">' +
                                    '      <div class="swiper-wrapper">' +
                                    //  str +
                                    '      </div>' +
                                    '</div>' +
                                    '      <div class="swiper-pagination EV-gallery-top"></div>' +
                                    '      </div>' +
                                    '      <div class="closeBtn"></div>' +
                                    '      </div>';
                            } else if (imgLength <= 6) {
                                isInit = false;
                                swiperDom = '<div id="EV-swiper">' +
                                    '<div class="background-hidden">' +
                                    '<div class="rotate-button"></div>' +
                                    '<div class="bigger-button"></div>' +
                                    '<div class="smaller-button"></div>' +
                                    '  <div class="swiper-container gallery-top">' +
                                    '      <div class="swiper-wrapper">' +
                                    //     str +
                                    '      </div>' +
                                    '</div>' +
                                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                    '      <div class="swiper-pagination EV-gallery-top"></div>' +

                                    '      </div>' +
                                    '      <div class="swiper-container gallery-thumbs">' +
                                    '      <div class="swiper-wrapper  swiper-wrapper-center">' +
                                    //  str +
                                    '      </div>' +
                                    '      <!-- Add Pagination -->' +
                                    '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                                    '      </div>' +
                                    '      <div class="closeBtn"></div>' +
                                    '      </div>';


                            } else {
                                swiperDom = '<div id="EV-swiper">' +
                                    '<div class="background-hidden">' +
                                    '<div class="rotate-button"></div>' +
                                    '<div class="bigger-button"></div>' +
                                    '<div class="smaller-button"></div>' +
                                    '<div class="swiper-container gallery-top">' +
                                    '      <div class="swiper-wrapper">' +
                                    // str +
                                    '      </div>' +
                                    '</div>' +
                                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                    '      <div class="swiper-pagination EV-gallery-top"></div>' +

                                    '      </div>' +
                                    '      <div class="swiper-container gallery-thumbs">' +
                                    '      <div class="swiper-wrapper">' +
                                    //str +
                                    '      </div>' +
                                    '      <!-- Add Pagination -->' +
                                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                                    '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                                    '      </div>' +
                                    '      <div class="closeBtn"></div>' +

                                    '      </div>';
                                isInit = true;
                            }

                            $.bigPicShow({
                                domIdList: ".special-message-item-list.img-box",
                                // swiperList: str,
                                topSwiperOptions: {
                                    isInit: true,//是否需要初始化,
                                    // loop: true, // 开启循环模式,必须设置loopedSlides
                                    // loopedSlides: 5, //looped slides should be the same
                                    autoplay: "",//自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
                                    preventClicks: false,//当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
                                    //pagination : '.swiper-pagination', //分页器
                                    noSwiping: true,
                                    pagination: '',//分页器q
                                    paginationType: 'fraction',
                                    /*** ‘bullets’  圆点（默认）‘fraction’  分式‘progress’  进度条‘custom’ 自定义**/
                                    prevButton: '.swiper-button-prev',
                                    nextButton: '.swiper-button-next',//前进按钮的css选择器或HTML元素。
                                    /**
                                     *  回调函数，初始化后执行。
                                     */
                                    simulateTouch: false,
                                    onInit: function (swiper) {
                                        $(".gallery-thumbs .swiper-slide").on("click", function () {
                                            var index = $(this).index();
                                            console.log("asdfasdfasdf");
                                            swiper.slideTo(index);//切换到第一个slide，速度为1秒
                                        });
                                        // $(".gallery-thumbs .swiper-slide").eq(0).addClass("swiper-slide-active");
                                        $(".gallery-thumbs .swiper-slide-active").length > 0 ? " " : $(".gallery-thumbs .swiper-slide").eq(0).addClass("swiper-slide-active");

                                        console.log("sipwer初始化完成!,回调函数，初始化后执行。")

                                        $('.swiper-right-gray').on("click", function () {
                                            $("#EV-swiper .gallery-thumbs").stop().addClass("show");
                                            setTimeout(function () {
                                                $("#EV-swiper .gallery-thumbs").stop().removeClass("show");
                                            }, 0);
                                        });

                                        $('.swiper-left-gray').on("click", function () {
                                            $("#EV-swiper .gallery-thumbs").stop(false, true).addClass("show");
                                            setTimeout(function () {
                                                $("#EV-swiper .gallery-thumbs").stop(false, true).removeClass("show");
                                            }, 0);
                                        });
                                    },
                                    /**
                                     * 回调函数，当你轻触(tap)Swiper后执行。在移动端，click会有 200~300 ms延迟，所以请用tap代替click作为点击事件。
                                     * */
                                    onTap: function (swiper, event) {
                                        console.log(swiper.activeIndex); //swiper当前的活动块的索引


                                        console.log(swiper.realIndex);//swiper当前的活动块的真实索引,排除loop模式下添加的滑块DOM
                                        console.log(swiper.clickedIndex);//返回最后点击Slide的索引。(click)
                                        swiper.stopAutoplay();    //停止自动切换
                                        swiper.startAutoplay();    //开始自动切换
                                    },
                                    onSlideChangeStart: function (swiper) { //滑块释放时如果触发slider切换则执行
                                        console.log(swiper.activeIndex + "当前索引");
                                        setTimeout(function () {
                                            console.log("sild");
                                            $.openPhotoGallery($(".swiper-slide-active").eq(0));
                                        }, 300);
                                        if (!isInit) {
                                            $(".gallery-thumbs .swiper-slide").removeClass("swiper-slide-active").eq(swiper.activeIndex).addClass("swiper-slide-active");

                                        }
                                        console.log("loop循环模式前的索引值为" + swiper.realIndex);
                                    }
                                },
                                bottomSwiperOptions: {
                                    isInit: isInit,//是否需要初始化,
                                    // loop: true, // 开启循环模式,必须设置loopedSlides
                                    paginationType: '',
                                    loopedSlides: 5 //looped slides should be the same
                                },
                                /**
                                 * 为每个指定的图片（会触发大图）单击事件绑定回调函数
                                 * 此方法针对以dom为数据源的方式
                                 * */
                                imgElementCallBack: function () {
                                    console.log("为每个指定的图片（会触发大图）单击事件绑定回调函数");
                                },
                                /**
                                 * 关闭按钮回调函数
                                 * */
                                closeCallBack: function () {
                                    console.log("关闭按钮回调函数");
                                },
                                /**
                                 * 指定的dom结构
                                 * */
                                swiperDom: swiperDom
                                /**
                                 * 指定的dom结构
                                 * */
                                // swiperDom: swiperDom
                            });
                            that.operationEvent();
                        }
                    }
                    common.loading.hide();
                })
        },
        //接收用户信息...
        getUserInfo: function (data) {
            controller.userData = data;
        },
        //获得用户名片数组..
        getTragetInfo: function (error, users) {
            controller.targetAvatar = users;
            $(users).each(function (index, element) {
                $(".userlist-mainList").append(template.sessionListItem(element));
            })
        },
        //修改用户信息...
        //实际数据通过用户填写改变……并不在该页面
        configUserInfo: function () {
            return {
                nick: '超级强三皮',
                avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1487237955376&di=1e503c951bce4233984028c82a9b3059&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201402%2F24%2F20140224012947_s8BeJ.jpeg',
                sign: '超级强三皮测试中',
                gender: 'male',
                email: 'superpi@163.com',
                birth: '1991-01-15',
                tel: '15201669519',
                done: function (error, user) {
                    console.log('更新我的名片' + (!error ? '成功' : '失败'));
                    console.log(error);
                    console.log(user);
                }
            }
        },
        //输出历史消息...
        renderHistoryMessage: function (container, error, obj, from) {
            var that = this;
            if (!error) {
                // that.messageBox.children().remove();
                $(obj.msgs.reverse()).each(function (index, element) {
                    if (index === 0) {
                        // console.log(element);
                        that.beginTimestamp = element.time;
                        container.append("<p class='time-stamp'>" + that.transformMessageTime(that.beginTimestamp) + "</p>");
                    }
                    that.receiveMessage(container, element, from)
                });
            }
        },
        //获取用户名列表...
        getAccountLists: function (list) {
            var arr = [];
            $(list).each(function (index, element) {
                arr.push(element.to);
            });
            return arr;
        },
        //手术预约单的确认与否交互操作...
        operationEvent: function () {
            var that = this;

            $(".like-doctor-message-btn .ensure").on("click", function () {
                var param = {
                    name: $(this).parents(".like-doctor-message").find(".like-doctor-message-baseInfo h4").text(),
                    id: $(this).parents(".like-doctor-message").find(".like-doctor-message-baseInfo h4").attr("data-doctorid")
                }
                common.bigConfirm({
                    text: "确定后患者将收到医生的咨询邀请",
                    cancel: "取消",
                    ensure: "确认",
                    ensureCallback: function () {
                        $.ajax({
                            url: "/call/customer/patient/case/v1/update/",
                            type: 'get',
                            dataType: 'json',
                            timeout: 10000,
                            data: {
                                paramJson: $.toJSON({
                                    caseId: localStorage.getItem("caseId"),
                                    doctorStatus: 1
                                })
                            }
                        })
                            .done(function (data) {
                                if (data.responseObject.responseStatus) {
                                    that.operationEnsure(param)
                                }
                            })
                    }
                })
            });
            $(".like-doctor-message-btn .cancel").on("click", function () {

                var name = $(this).parents(".like-doctor-message").find(".like-doctor-message-baseInfo h4").text();

                common.bigConfirm({
                    input: true,
                    placeholder: "200字以内",
                    title: "请填写不匹配原因",
                    max: 200,
                    cancel: "取消",
                    ensure: "确认",
                    ensureCallback: function () {
                        var content = common.htmlToString($(".big-confirm-input").val());
                        if ($(".big-confirm-input").val().length === 0) {
                            return false;
                        }
                        $.ajax({
                            url: "/call/customer/patient/case/v1/update/",
                            type: 'get',
                            dataType: 'json',
                            timeout: 10000,
                            data: {
                                paramJson: $.toJSON({
                                    caseId: localStorage.getItem("caseId"),
                                    doctorStatus: 2,
                                    doctorRefuseReason: content
                                })
                            }
                        })
                            .done(function (data) {
                                if (data.responseObject.responseStatus) {
                                    that.operationRefuse(name, content)
                                }
                            })
                    }
                })
            });
        },

        //同意手术预约..
        operationEnsure: function (param) {
            var that = this;
            messageCommunication.nim.sendCustomMsg({
                scene: 'p2p',
                to: controller.targetData.account,
                content: JSON.stringify({
                    "data": {
                        doctorId: param.id,
                        doctorName: param.name
                    },
                    "type": "ensureOperation"
                }),
                done: function (error, obj) {
                    controller.ensureOperation(error, obj)
                }
            });
        },
        ensureOperation: function (error, msg) {
            $(".messageList-box:visible").append(template.ensureOperation(JSON.parse(msg.content).data));
        },
        //拒绝手术预约...
        operationRefuse: function (name, text) {
            var that = this;
            messageCommunication.nim.sendText({
                scene: 'p2p',
                to: that.targetData.account,
                text: "由于" + text + "，唯医会诊将重新为您推荐适合的权威手术医生，请稍候。",
                done: function (error, obj) {
                    that.sendSingleMessage(error, obj)
                },
            });
        },
        //新患者加入患者列表...
        newPatientAppendToList: function (msg) {
            if (!$("#ev-user-inner").hasClass("search-result")) {
                if (msg.type === "custom") {
                    var dataList = JSON.parse(msg.content);
                    if (dataList.data.shuntCustomerId === localStorage.getItem("userId")) {
                        if (dataList.type.indexOf("new-") != "-1") {
                            $(".userlist-mainList.viewItem[data-role='ut-tabs-1'] .userList-no-data").remove();
                            $(".userlist-mainList.viewItem[data-role='ut-tabs-1']").prepend(template.userListItem(dataList.data, dataList.type));
                            $(".messageList").append('<article class="messageList-box" data-account="' + dataList.data.caseId + '" style="display: none;"></article>');
                            $('#music')[0].play();
                            $(".userlist-status-item[data-role='ut-tabs-1']").addClass("new");
                        }
                    }
                }
            }
        }
    };
    //策略类
    var Template = function () {
        var that = this;
    };
    Template.prototype = {
        medicalRecord: function (data) {
            function splitString(list, mainTitle) {
                var result = '<article class="special-message-item-list">';
                $(list).each(function (index, element) {
                    if (index === 3) {
                        mLink = "加重";
                    }
                    result += '<span class="answer">' +
                        (function () {
                            var title = "";
                            switch (index) {
                                case 0:
                                    title = '<p class="question">' + mainTitle + '：</p>' + (mainTitle === "主要症状" ? data.patientCasemap.caseMain.caseMain : data.patientCasemap.caseMain.caseAlong);
                                    break;
                                case 1:
                                    title = '<p class="question">影响活动程度：</p>';
                                    break;
                                case 2:
                                    break;
                                case 3:
                                    break;
                                case 4:
                                    title = '<p class="question">何时加重：</p>';
                                    break;
                                case 5:
                                    title = '<p class="question">何时缓解：</p>';
                                    break;
                                case 6:
                                    title = '<p class="question">曾做治疗：</p>';
                                    break;
                            }
                            return title;
                        }()) +
                        (function (sList) {
                            var sResult = "", link = "-";
                            if (index === 0) {
                                if (list[3]) {
                                    sResult += '，加重<span>' + (list[3] ? (list[3].symptomOptions[0].isAttachment == 2 ? list[3].symptomOptions[0].optionDesc : list[3].symptomOptions[0].optionName) : '') + '</span>';
                                }
                            } else if (index === 2 || index === 3) {
                                return "";
                            } else if (index === 6) {

                                $(sList).each(function (iindex, eelement) {
                                    if (eelement.refQuestionList.length > 0) {
                                        sResult += '<span>' + eelement.optionName + '-' + eelement.refQuestionList[0].symptomOptions[0].optionName + (iindex === sList.length - 1 ? '</span>' : '-</span>');
                                    } else {
                                        if (iindex === sList.length - 1) {
                                            link = ""
                                        }
                                        sResult += '<span>' + (eelement.isAttachment == 2 ? eelement.optionDesc : eelement.optionName) + '</span>' + link;
                                    }
                                });
                            } else {
                                $(sList).each(function (iindex, eelement) {
                                    if (iindex === sList.length - 1) {
                                        link = ""
                                    } else if (parseInt(eelement.isMain) === 1) {
                                        link = "伴随";
                                    } else {
                                        link = "-";
                                    }
                                    sResult += '<span>' + (eelement.isAttachment == 2 ? eelement.optionDesc : eelement.optionName) + '</span>' + link;
                                });
                            }
                            return sResult;
                        })(element.symptomOptions) +
                        '</span>';

                });
                return result + '</article>';
            };
            return '<article class="messageList-item others-message">' +
                '<article class="messageList-item-content">' +
                '<figure class="messageList-item-img">' +
                '<img src="' + controller.targetData.avatar + '" alt="">' +
                '</figure>' +
                '<figcaption class="messageList-item-text special-message">' +
                '<section class="special-message-box medical-report" data-role="medical-report">' +
                '<header class="special-message-title">' +
                '<h2>' + data.patientCasemap.patientName + '问诊信息</h2>' +
                '</header>' +
                '<section class="special-message-content">' +
                '<article class="special-message-item inline-message">' +
                '<header class="special-message-item-title">' +
                '<span>基本信息</span>' +
                '</header>' +
                '<article class="special-message-item-text medical-report-name">' +
                '<h4>' + data.patientCasemap.patientName + '</h4>' +
                (function (sex) {
                    // if (sex === 1) {
                    //     return '<i class="J-sex icon-sex-male"></i>';
                    // } else if (sex === 2) {
                    //     return '<i class="J-sex icon-sex-female"></i>';
                    // }
                    if (sex === 1) {
                        return '<i class="J-sex icon-sex-male">男</i>';
                    } else if (sex === 2) {
                        return '<i class="J-sex icon-sex-female">女</i>';
                    }
                }(parseInt(data.patientCasemap.sexId))) +
                '<span>' + data.patientCasemap.age + '岁</span>' +
                '</article>' +
                '<article class="special-message-item-text">' +
                '<article class="special-message-item-list">' +
                '<span class="answer"><p class="question">问诊目的：</p>' +
                (function (type) {
                    var result = "";
                    switch (parseInt(type)) {
                        case 0:
                            result = "咨询";
                            break;
                        case 1:
                            result = "复诊";
                            break;
                        case 2:
                            result = "预约手术";
                            break;
                    }
                    return result;
                }(data.patientCasemap.caseType)) +
                '</span>' +
                '</article>' +
                '<article class="special-message-item-list">' +
                '<span class="answer"><p class="question">所在地区：</p>' + data.patientCasemap.provinceName + '&nbsp&nbsp' + data.patientCasemap.cityName + '</span>' +
                '</article>' +
                // '<article class="special-message-item-list">' +
                // '<span class="answer"><p class="question">联系电话： </p>' + data.patientCasemap.mobile + '</span>' +
                // '</article>' +
                '</article>' +
                '</article>' +
                '<article class="special-message-item">' +
                '<header class="special-message-item-title">' +
                '<span>主诉</span>' +
                '</header>' +
                '<article class="special-message-item-text">' +
                (function (data) {
                    if (data) {
                        return '<figcaption class="special-message-item-list">' +
                            '<p class="question">主要症状：</p>' +
                            '<span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">' + data + '</span>' +
                            '</figcaption>'
                    } else {
                        return ""
                    }
                }(data.patientCasemap.caseMain.caseMain)) +
                (function (data) {
                 //   console.log(data);
                    var html = '';
                    $.each(data, function (index, value) {
                        if (value.refQuestionList && value.refQuestionList.length > 0) {
                            if (value.refQuestionList[0]) {
                                if (value.refQuestionList[0].symptomOptions && value.refQuestionList[0].symptomOptions.length > 0) {
                                    if (value.refQuestionList[0].symptomOptions[0].optionName && value.refQuestionList[0].symptomOptions[0].optionName.length > 0) {
                                        html += '<figcaption class="special-message-item-list">' +
                                            '<p class="question">疼痛性质：</p>' +
                                            '<span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">' + value.refQuestionList[0].symptomOptions[0].optionName + '</span>' +
                                            '</figcaption>';
                                    }
                                }
                            }
                        }
                    });
                    return html;
                }(data.resultMainList.length>0 ? data.resultMainList[0].symptomOptions:'')) +
                (function (data) {
                 //   console.log(data);
                    var html = '';
                    $.each(data, function (index, value) {
                        if (value.refQuestionList && value.refQuestionList.length > 0) {
                            if (value.refQuestionList[1]) {
                                if (value.refQuestionList[1].symptomOptions && value.refQuestionList[1].symptomOptions.length > 0) {
                                    if (value.refQuestionList[1].symptomOptions[0].optionName && value.refQuestionList[1].symptomOptions[0].optionName.length > 0) {
                                       var optionNameStr = value.refQuestionList[1].symptomOptions[0].optionName;
                                        optionNameStr = optionNameStr.substring(optionNameStr.length-1) == '：' ?optionNameStr.substring(0,optionNameStr.length-1):optionNameStr
                                        html += '<figcaption class="special-message-item-list">' +
                                            '<p class="question">VAS评分：</p>' +
                                            '<span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">' + optionNameStr +'</span>' +
                                            '</figcaption>';
                                    }
                                }
                            }
                        }
                    });
                    return html;
                }(data.resultMainList.length>0?data.resultMainList[0].symptomOptions:"")) +
                (function (data) {
                    if (data) {
                        return '<figcaption class="special-message-item-list">' + '<p class="question">其他症状：</p>' +
                            '<span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">' + data + '</span>' +
                            '</figcaption>';
                    } else {
                        return ""
                    }
                }(data.patientCasemap.caseMain.caseAlong)) +

                // (data.patientCasemap.caseAlong.length > 0 ? '<figcaption class="special-message-item-list">' +
                // '<p class="question">伴随症状：</p>' +
                // '<span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">' + data.patientCasemap.caseAlong + '</span>' +
                // '</figcaption>' : '') +
                '</article>' +
                '</article>' +
                '<article class="special-message-item">' +
                '<header class="special-message-item-title">' +
                '<span>现病史</span>' +
                '</header>' +
                // '<article class="special-message-item-text">' +
                // (function (mList) {
                //     return splitString(mList, "主要症状");
                // }(data.resultMainList)) +
                // (function (mList) {
                //     return splitString(mList, "伴随症状");
                // }(data.resultAlongList)) +
                // '</article>' +
                // '</article>' +
                '<article class="special-message-item-list">' +
                '<span class="answer">' +
                (function (content) {
                    if (content.length === 0) {
                        return "";
                    } else {
                        return '<p class="question">曾就诊情况：</p>' + data.patientCasemap.treatmentName + '&nbsp&nbsp&nbsp' + data.patientCasemap.illnessName;
                    }
                }(data.patientCasemap.treatmentName)) +
                '</span>' +
                '</article>' +
                '<article class="special-message-item-list">' +
                '<span class="answer">' +
                (function (content) {
                    if (content.length === 0) {
                        return "";
                    } else {
                        return '<p class="question">服用药物：</p>' + data.patientCasemap.takeMedicine;
                    }
                }(data.patientCasemap.takeMedicine)) +
                '</span>' +
                '</article>' +
                (function (aList) {
                    // console.log(aList)
                    var result = "<figcaption class='special-message-item-list img-box'>";
                    var str = "";
                    $(aList).each(function (index, element) {
                        //  $(element.uploadAttList).each(function (index, element) {
                        str += '<div class="swiper-slide swiper-no-swiping"><img src=' + element.caseAttUrl + ' /></div>';
                        result += "<figure class='special-message-item-img '><img src='" + element.caseAttUrl + "'></figure>"
                        //   });
                    });
                    return result + "</figcaption>";
                }(data.patientCasemap.attachmentList)) +
                '<article class="special-message-item">' +
                (data.caseHistoryList.length > 0 ? '<header class="special-message-item-title">' +
                '<span>既往史</span>' +
                '</header>' : '') +
                '<article class="special-message-item-text">' +
                (function (cData) {
                    var result = "";
                    $(cData).each(function (index, element) {
                        result += '<figcaption class="special-message-item-list">' +
                            '<p class="question">' + element.typeName + '：</p>' +
                            '<span class="answer empty">' +
                            (function (ccData) {
                                var ccResult = "";
                                $(ccData).each(function (index, element) {
                                    ccResult += element.historyName + "&nbsp&nbsp&nbsp";
                                });
                                return ccResult + '<span class="answer empty" style="display: block;">' + ccData[0].historyDesc + '</span>';
                            }(element.customerHistory)) +
                            '</span>' +
                            '</figcaption>';
                    });
                    return result;
                }(data.caseHistoryList)) +

                '</article>' +
                '</article>' +
                '<article class="special-message-item inline-message">' +
                '<header class="special-message-item-title">' +
                '<span>备注</span>' +
                '</header>' +
                '<article class="special-message-item-list">' +
                '<span class="answer">' +
                (data.patientCasemap.remark.length > 0 ? data.patientCasemap.remark : "未填写") +
                '</span>' +
                '</article>' +
                '</article>' +
                '</section>' +
                '</section>' +
                '</figcaption>' +
                '</article>' +
                '</article>';
        },
        previewSuggestion: function (data) {
            return '<article class="messageList-item my-message " >' +
                '<article class="messageList-item-content">' +
                '<figcaption class="check-suggestion-message">' +
                '<header class="check-suggestion-message-title">' +
                '初诊建议' +
                '</header>' +
                '<section class="preview-suggestion-content" data-id="' + data.diagnosisId + '">' +
                '<figure class="preview-suggestion-img">' +
                '<img src="/image/img00/index/dialog_report.png" alt="">' +
                '</figure>' +
                '<figcaption class="preview-suggestion-content-text">' +
                '<header class="preview-suggestion-title">' + $(".messageList-targetName span").text() + data.createTime + '</header>' +
                '<p class="preview-suggestion-result">初诊：' + (data.illnessName.length === 0 ? "暂不确定" : data.illnessName) + '</p>' +
                '</figcaption>' +
                '</section>' +
                '</figcaption>' +
                '<figure class="messageList-item-img">' +
                '<img src="/image/img00/index/chatting_portrait_system@2x.png" alt="">' +
                '</figure>' +
                '</article>' +
                '</article>';
        },
        videoTriage: function (data) {

            return '<article class="messageList-item my-message">' +
                '<article class="messageList-item-content">' +
                '<figcaption class="check-suggestion-message">' +
                '<header class="check-suggestion-message-title">' +
                '视诊' +
                '</header>' +
                '<section class="check-suggestion-content">' +
                '<article class="check-suggestion-item"><span>' + data.content + '</span></article>' +
                '</section>' +
                '</figcaption>' +
                '<figure class="messageList-item-img">' +
                '<img src="/image/img00/index/chatting_portrait_system@2x.png" alt="">' +
                '</figure>' +
                '</article>' +
                '</article>';
        },
        others: function (data) {
            return '<article class="messageList-item others-message">' +
                '<article class="messageList-item-content">' +
                '<figure class="messageList-item-img">' +
                '<img src="' + controller.targetData.avatar + '" alt="">' +
                '</figure>' +
                (function (file) {
                    //console.log(file)
                    if (file) {
                        switch (file.ext.toLowerCase()) {
                            case "jpg":
                            case "png":
                            case "gif":
                            case "jpeg":
                                return '<figcaption class="messageList-item-text J-showPicImg"><img src="' + file.url + '" alt="Image" style="width: 300px;" class=""/></figcaption>';
                                break;
                            case "mp4":
                                return '<figcaption class="messageList-item-text J-showPicImg"><video src="' + file.url + '" alt="Image" style="width: 300px;"/></figcaption>';
                        }

                    } else {
                        if (data.text == '患者已上传检查资料') {
                            return '<figcaption class="messageList-item-text ">' + data.text + '，点击至<a href="#" class="link">“专科检查”</a>查看。' + '</figcaption>';
                        } else if (data.text == "患者已上传视诊资料") {
                            return '<figcaption class="messageList-item-text ">' + data.text + '，点击至' + '<a href="#" class="link">“专科检查”</a>' + '查看。若视频上传中，请稍后再次点击查看.' + '</figcaption>';
                        } else {
                            return '<figcaption class="messageList-item-text ">' + data.text + '</figcaption>';
                        }
                    }
                }(data.file)) +
                '</article>' +
                '</article>';
        },
        mine: function (data) {
            return '<article class="messageList-item my-message">' +
                '<article class="messageList-item-content">' +
                '<figcaption class="messageList-item-text">' +
                data.text +
                '</figcaption>' +
                '<figure class="messageList-item-img">' +
                '<img src="/image/img00/index/chatting_portrait_system@2x.png" alt="">' +
                '</figure>' +
                '</article>' +
                '</article>';
        },
        operation: function (data) {
            var img = $(".userlist-mainList-item[data-account='" + data.target + "']").attr("data-img");

            function splitString(list, mainTitle) {
                var result = '<article class="special-message-item-list">';
                $(list).each(function (index, element) {
                    if (index === 3) {
                        mLink = "加重";
                    }
                    result += '<span class="answer">' +
                        (function () {
                            var title = "";
                            switch (index) {
                                case 0:
                                    title = '<p class="question">' + mainTitle + '：</p>' + (mainTitle === "主要症状" ? data.patientCasemap.caseMain.caseMain : data.patientCasemap.caseMain.caseAlong);
                                    break;
                                case 1:
                                    title = '<p class="question">影响活动程度：</p>';
                                    break;
                                case 2:
                                    break;
                                case 3:
                                    break;
                                case 4:
                                    title = '<p class="question">何时加重：</p>';
                                    break;
                                case 5:
                                    title = '<p class="question">何时缓解：</p>';
                                    break;
                                case 6:
                                    title = '<p class="question">曾做治疗：</p>';
                                    break;
                            }
                            return title;
                        }()) +
                        (function (sList) {
                            var sResult = "", link = "-";
                            if (index === 0) {
                                if (list[3]) {
                                    sResult += '，加重<span>' + (list[3] ? (list[3].symptomOptions[0].isAttachment == 2 ? list[3].symptomOptions[0].optionDesc : list[3].symptomOptions[0].optionName) : '') + '</span>';
                                }
                            } else if (index === 2 || index === 3) {
                                return "";
                            } else if (index === 6) {
                                $(sList).each(function (iindex, eelement) {
                                    if (eelement.refQuestionList.length > 0) {
                                        sResult += '<span>' + eelement.optionName + '-' + eelement.refQuestionList[0].symptomOptions[0].optionName + (iindex === sList.length - 1 ? '</span>' : '-</span>');
                                    } else {
                                        if (iindex === sList.length - 1) {
                                            link = ""
                                        }
                                        sResult += '<span>' + (eelement.isAttachment == 2 ? eelement.optionDesc : eelement.optionName) + '</span>' + link;
                                    }
                                });
                            } else {
                                $(sList).each(function (iindex, eelement) {
                                    if (iindex === sList.length - 1) {
                                        link = ""
                                    } else if (parseInt(eelement.isMain) === 1) {
                                        link = "伴随";
                                    } else {
                                        link = "-";
                                    }
                                    sResult += '<span>' + (eelement.isAttachment == 2 ? eelement.optionDesc : eelement.optionName) + '</span>' + link;
                                });
                            }
                            return sResult;
                        })(element.symptomOptions) +
                        '</span>';

                });
                return result + '</article>';
            };

            return '<article class="messageList-item others-message">' +
                '<article class="messageList-item-content">' +
                '<figure class="messageList-item-img">' +
                '<img src="' + controller.targetData.avatar + '" alt="">' +
                '</figure>' +
                '<figcaption class="messageList-item-text special-message">' +
                '<section class="special-message-box medical-report" data-role="medical-report">' +
                '<header class="special-message-title">' +
                '<h2>' + data.patientCasemap.patientName + '问诊信息</h2>' +
                '</header>' +
                '<section class="special-message-content">' +
                '<article class="special-message-item inline-message">' +
                '<header class="special-message-item-title">' +
                '<span>基本信息</span>' +
                '</header>' +
                '<article class="special-message-item-text illness-direct-name">' +
                '<h4>' + data.patientCasemap.patientName + '</h4>' + (parseInt(data.patientCasemap.sexId) === 1 ? '<i class="icon-sex-male">男</i>' : '<i class="icon-sex-female">女</i>' ) +
                '<span>' + data.patientCasemap.age + '岁</span>' +
                '</article>' +
                '<article class="special-message-item-text">' +
                '<article class="special-message-item-list">' +
                '<span class="answer"><p class="question">问诊目的 ：</p>预约手术</span>' +
                '</article>' +
                // '<article class="special-message-item-list">' +
                // '<span class="answer"><p class="question">联系电话： </p>' + data.patientCasemap.mobile + '</span>' +
                // '</article>' +
                '</article>' +
                '</article>' +
                '<article class="special-message-item inline-message">' +
                '<header class="special-message-item-title">' +
                '<span>预约手术信息</span>' +
                '</header>' +
                '<article class="special-message-item-text">' +


                '<article class="special-message-item-list">' +
                '<span class="answer"> <p class="question">所需手术：</p>' + data.reservationList[0].operationName + '</span>' +
                '</article>' +
                '<article class="special-message-item-list">' +
                '<span class="answer"><p class="question">期望手术时间：</p>' +
                (function (type) {
                    var result = "";
                    switch (parseInt(type)) {
                        case 0:
                            result = "尽快";
                            break;
                        case 1:
                            result = "一周内";
                            break;
                        case 2:
                            result = "一月内";
                            break;
                        case 3:
                            result = "一年内";
                            break;
                        case 4:
                            result = "一年以上";
                            break;
                    }
                    return result;
                }(data.reservationList[0].expectedTime)) +

                '</span>' +
                '</article>' +
                '<article class="special-message-item-list">' +
                '<span class="answer"><p class="question">期望手术地区：</p>' + data.reservationList[0].provinceName + "&nbsp&nbsp&nbsp" + data.reservationList[0].cityName + "&nbsp&nbsp&nbsp" + data.reservationList[0].districtName + '</span>' +
                '</article>' +
                '<article class="special-message-item-list">' +
                '<span class="answer"><p class="question">社保类型：</p>' + data.patientCasemap.socialName + '</span>' +
                '</article>' +
                '</article>' +
                '</article>' +
                '<article class="special-message-item">' +
                '<header class="special-message-item-title">' +
                '<span>主诉</span>' +
                '</header>' +
                '<article class="special-message-item-text">' +
                '<figcaption class="special-message-item-list">' +
                '<p class="question">主要症状：</p>' +
                '<span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">' + data.patientCasemap.caseMain.caseMain + '</span>' +
                '</figcaption>' +
                // (data.patientCasemap.caseAlong.length > 0 ? '<figcaption class="special-message-item-list">' +
                // '<p class="question">伴随症状：</p>' +
                // '<span class="answer" style="display:inline-block;max-width:80%;vertical-align:top">' + data.patientCasemap.caseAlong + '</span>' +
                // '</figcaption>' +
                // '</article>' +
                // '</article>' : ' ') +
                '<article class="special-message-item">' +
                '<header class="special-message-item-title">' +
                '<span>现病史</span>' +
                '</header>' +
                '<article class="special-message-item-text">' +
                (function (mList) {
                    return splitString(mList, "主要症状");
                }(data.resultMainList)) +
                (function (mList) {
                    return splitString(mList, "伴随症状");
                }(data.resultAlongList)) +
                '</article>' +
                '</article>' +
                (function (content) {
                    if (content.length === 0) {
                        return "";
                    } else {

                        return '<article class="special-message-item-list">' +
                            '<span class="answer">' +
                            '<p class="question">曾就诊情况：</p>' + data.patientCasemap.treatmentName + '&nbsp&nbsp&nbsp' + data.patientCasemap.illnessName +
                            '</span>' +
                            '</article>';
                    }
                }(data.patientCasemap.treatmentName)) +
                '<article class="special-message-item-list">' +
                '<span class="answer">' +
                (function (content) {
                    if (content.length === 0) {
                        return "";
                    } else {
                        return '<p class="question">服用药物：</p>' + data.patientCasemap.takeMedicine;
                    }
                }(data.patientCasemap.takeMedicine)) +
                '</span>' +
                '</article>' +


                (function (aList) {
                    var result = "<figcaption class='special-message-item-list img-box'>";
                    var str = "";
                    $(aList).each(function (index, element) {
                        //  $(element.uploadAttList).each(function (index, element) {
                        str += '<div class="swiper-slide swiper-no-swiping"><img src=' + element.caseAttUrl + ' /></div>';
                        result += "<figure class='special-message-item-img '><img src='" + element.caseAttUrl + "'></figure>"
                        //  });
                    });
                    return result + "</figcaption>";
                }(data.patientCasemap.attachmentList)) +

                '<article class="special-message-item">' +
                (data.caseHistoryList.length > 0 ? '<header class="special-message-item-title">' +
                '<span>既往史</span>' +
                '</header>' : '') +
                '<article class="special-message-item-text">' +
                (function (cData) {
                    var result = "";
                    $(cData).each(function (index, element) {
                        result += '<figcaption class="special-message-item-list">' +
                            '<p class="question">' + element.typeName + '：</p>' +
                            '<span class="answer empty">' +
                            (function (ccData) {
                                var ccResult = "";
                                $(ccData).each(function (index, element) {
                                    ccResult += element.historyName + "&nbsp&nbsp&nbsp";
                                    // ccResult += element.historyName + "&nbsp&nbsp&nbsp" + (element.historyDesc.length > 500 ? element.historyDesc.substring(0, 500) : element.historyDesc);
                                });
                                return ccResult + '<span class="answer empty" style="display: block;">' + ccData[0].historyDesc + '</span>';
                            }(element.customerHistory)) +
                            '</span>' +
                            '</figcaption>';
                    });
                    return result;
                }(data.caseHistoryList)) +

                '</article>' +
                '</article>' +
                '<article class="special-message-item inline-message">' +
                '<header class="special-message-item-title">' +
                '<span>备注</span>' +
                '</header>' +
                '<article class="special-message-item-list">' +
                '<span class="answer">' +
                (data.patientCasemap.remark.length > 0 ? data.patientCasemap.remark : "未填写") +
                '</span>' +
                '</article>' +
                '</article>' +
                (function () {
                    if (!$.isEmptyObject(data.doctorMap)) {
                        return '<article class="special-message-item">' +
                            '<header class="special-message-item-title">' +
                            '<span>患者希望以下医生为他做手术</span>' +
                            '</header>' +
                            '<article class="special-message-item-text">' +
                            '<article class="special-message-item-list like-doctor-message">' +
                            '<figure class="like-doctor-message-img">' +
                            '<img src="' + data.doctorMap.logoUrlMap.logoUrl + '" alt="">' +
                            '</figure>' +
                            '<figcaption class="like-doctor-message-content">' +
                            '<article class="like-doctor-message-baseInfo">' +
                            '<h4 data-doctorid="' + data.doctorMap.authMap.customerId + '">' + data.doctorMap.authMap.fullName + '</h4>' +
                            '<span>' + data.doctorMap.authMap.medicalTitle + '</span>' +
                            '</article>' +
                            '<p class="hospital">' + data.doctorMap.authMap.company + '</p>' +
                            (data.doctorMap.illnessMapList.length > 0 ?
                                '<article class="like-doctor-message-item">' +
                                '<p>' +
                                '<span>擅长疾病：</span>' +
                                (function (iList) {
                                    var result = "";
                                    $(iList).each(function (index, element) {
                                        result += '<span>' + element.illnessName + "&nbsp&nbsp" + '</span>';
                                    });
                                    return result;
                                }(data.doctorMap.illnessMapList)) +
                                '</p>' +
                                '</article>' : ''
                            ) +
                            (data.doctorMap.operationMapList.length > 0 ? '<article class="like-doctor-message-item">' +
                            '<p>' +
                            '<span>擅长手术：</span>' +
                            (function (oList) {
                                var result = "";
                                $(oList).each(function (index, element) {
                                    result += '<span>' + element.operationName + '&nbsp&nbsp' + '</span>';
                                });
                                return result;
                            }(data.doctorMap.operationMapList)) +
                            '</p>' +
                            '</article>' : '') +

                            '<article class="like-doctor-message-btn">' +
                            '<button class="btn-primary ensure">匹配</button>' +
                            '<button class="btn-primary cancel">不匹配</button>' +
                            '</article>' +
                            '</figcaption>' +
                            '</article>' +
                            '</article>' +
                            '</article>';
                    }
                }()) +
                '</section>' +
                '</section>' +
                '</figcaption>' +
                '</article>' +
                '</article>';
        },
        sessionListItem: function (ele) {
            return '<article class="userlist-mainList-item" data-account="' + ele.account + '" data-img="' + ele.avatar + '">' +
                '<figure class="userlist-item-img">' +
                '<img src="' + ele.avatar + '" alt="">' +
                '<p>25</p>' +
                '</figure>' +
                '<figcaption class="userlist-item-base-msg">' +
                '<h3>' +
                '<span class="name">' + (ele.account.length > 4 ? ele.account.substring(0, 4) + '...' : ele.account) + '</span><span class="category">膝关节炎 5级 建议...</span>' +
                '</h3>' +
                '<article>' +
                '<span class="text">退回理由：近期手术排期已满 请推荐其他医生</span>' +
                '</article>' +
                '</figcaption>' +
                '<time>9:30</time>' +
                '</article>';
        },
        checkSuggestion: function (data) {

            return '<article class="messageList-item my-message">' +
                '<article class="messageList-item-content">' +
                '<figcaption class="check-suggestion-message">' +
                '<header class="check-suggestion-message-title">' +
                '检查/检验建议' +
                '</header>' +
                '<section class="check-suggestion-content">' +
                (function (data) {
                    var result = "";
                    $(data).each(function (index, element) {
                        result += '<article class="check-suggestion-item"><span>' + element.adviceName + '</span></article>';
                    });
                    return result;
                }(data)) +
                '</section>' +
                '</figcaption>' +
                '<figure class="messageList-item-img">' +
                '<img src="/image/img00/index/chatting_portrait_system@2x.png" alt="">' +
                '</figure>' +
                '</article>' +
                '</article>';

        },
        ensureOperation: function (data) {

            return '<article class="messageList-item my-message">' +
                '<article class="messageList-item-content">' +
                '<figcaption class="messageList-item-text">' +
                '您好，由于手术安排需谨慎进行，请您先与' + data.doctorName + '医生进行线上沟通。' +
                '<span>立即咨询></span>' +
                '</figcaption>' +
                '<figure class="messageList-item-img">' +
                '<img src="/image/img00/index/chatting_portrait_system@2x.png" alt="">' +
                '</figure>' +
                '</article>' +
                '</article>';
        },
        userListItem: function (data, messageType) {
            var timeFormat = function (time) {
                var result = "";
                var date = new Date(),
                    y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate(),
                    h = date.getHours(),
                    mm = date.getMinutes();
                var nowFirst = new Date(y + "/" + (m >= 10 ? m : "0" + m) + "/" + (d >= 10 ? d : "0" + d)).getTime(),
                    timeFirst = new Date(time.substring(0, 10).replace(/-/g, "/")).getTime();
                var week = new Date(timeFirst).getDay();
                if (nowFirst === timeFirst) {
                    result = time.substring(10, 16);
                } else if (parseInt((nowFirst / (60 * 60 * 24 * 1000) + 4) / 7) === parseInt((timeFirst / (60 * 60 * 24 * 1000) + 4) / 7)) {
                    result = "星期" + numToChinese(week);
                } else {
                    result = time.substring(0, 16);
                }
                return result;
            };
            var sex = data.sexName;
            var age = parseInt(data.age);
            var logoUrl = function () {

                var img = "";
                if (age <= 12) {
                    img = "https://img00.allinmed.cn/common/portrait_child_98.png";
                } else if (age > 12 && age <= 59) {
                    img = (sex === "男" ? "https://img00.allinmed.cn/common/portrait_male_98.png" : "https://img00.allinmed.cn/common/portrait_female_98.png");
                } else if (age > 59) {
                    img = (sex === "男" ? "https://img00.allinmed.cn/common/portrait_old_man_98.png" : "https://img00.allinmed.cn/common/portrait_old_woman_98.png");
                }
                return img;
            }();
            var formatTime = timeFormat(data.time);
            var patientSex = (sex === "男" ? 1 : 2);
            return '<article class="userlist-mainList-item" data-account="' + data.caseId + '" data-img="' + logoUrl + '" data-name="' + data.patientName + '" data-pid="' + data.patientId + '" data-age="' + data.age + '" data-logo="' + logoUrl + '" data-ctype="0" data-type="1" data-sex="' + patientSex + '" data-reason="" data-consultationId="' + data.consultationid + '">' +
                '<figure class="userlist-item-img">' +
                '<img src="' + logoUrl + '" alt="">' +
                (function () {
                    if (localStorage.getItem("ntnCache") && JSON.parse(localStorage.getItem("ntnCache"))["0_" + data.caseId]) {

                        return '<p style="display: block;" class="on">' + (parseInt(JSON.parse(localStorage.getItem("ntnCache"))["0_" + data.caseId]) > 100 ? "..." : JSON.parse(localStorage.getItem("ntnCache"))["0_" + data.caseId]) + '</p>';

                    } else {
                        return '<p></p>'
                    }
                }()) +
                '</figure>' +
                '<figcaption class="userlist-item-base-msg">' +
                '<h3>' +
                '<span class="name">' + (data.patientName.length > 4 ? data.patientName.substring(0, 3) + '...' : data.patientName) + '</span>' +
                '<span class="category ' + (formatTime.length === 16 ? "short" : "") + '">' +
                (function () {
                    var result = "";
                    switch (messageType) {
                        case "new-further":
                            result = "复诊";
                            break;
                        case "new-health":
                            result = "咨询";
                            break;
                        case "new-op_help":
                            result = "预约手术";
                            break;
                    }
                    return result;
                }()) +
                '</span>' +
                '</h3>' +
                '<article>' +
                '<span class="text">' +
                (function () {
                    return result = sex + "&nbsp" + data.age + "岁&nbsp" + (parseInt(data.isAttachment) === 0 ? "无影像资料" : "有影像资料");
                }()) +
                '</span>' +
                '</article>' +
                '</figcaption>' +
                '<span class="time">' +
                formatTime +
                '</span>' +
                '</article>';
        },
        savePic: function () {
            var imgLength = "";
            var account = controller.targetData.account.substring(2);
            $(".messageList-box[data-account='" + account + "'] ").each(function () {
                // console.log($(this));
                if ($(this).is(":visible")) {
                    //  $focus =  $(this).find(".J-showPicImg");
                    imgLength = $(this).find(".J-showPicImg").find("img").length;
                }
            });
            var swiperDom = "";
            var isInit = "";
            // debugger;
            //var imgLength = $(".messageList-box[data-account='" + account + "'] .special-message-item-list.img-box .special-message-item-img ").length;
            //   var  = $(".messageList-box").is(':hidden').length;
            if (imgLength == 1) {
                isInit = false;
                swiperDom = '<div id="EV-swiper">' +
                    '<div class="background-hidden">' +
                    '<div class="rotate-button"></div>' +
                    '<div class="bigger-button"></div>' +
                    '<div class="smaller-button"></div>' +
                    '<div class="download-button"></div>' +
                    '  <div class="swiper-container gallery-top">' +
                    '      <div class="swiper-wrapper">' +
                    //  str +
                    '      </div>' +
                    '</div>' +
                    '      <div class="swiper-pagination EV-gallery-top"></div>' +
                    '      </div>' +
                    '      <div class="closeBtn"></div>' +
                    '      </div>';
            }
            else if (imgLength <= 6) {
                isInit = false;
                swiperDom = '<div id="EV-swiper">' +
                    '<div class="background-hidden">' +
                    '<div class="rotate-button"></div>' +
                    '<div class="bigger-button"></div>' +
                    '<div class="smaller-button"></div>' +
                    '<div class="download-button"></div>' +
                    '  <div class="swiper-container gallery-top">' +
                    '      <div class="swiper-wrapper">' +
                    //     str +
                    '      </div>' +
                    '</div>' +
                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                    '      <div class="swiper-pagination EV-gallery-top"></div>' +

                    '      </div>' +
                    '      <div class="swiper-container gallery-thumbs">' +
                    '      <div class="swiper-wrapper  swiper-wrapper-center">' +
                    //  str +
                    '      </div>' +
                    '      <!-- Add Pagination -->' +
                    '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                    '      </div>' +
                    '      <div class="closeBtn"></div>' +
                    '      </div>';


            }
            else {
                swiperDom = '<div id="EV-swiper">' +
                    '<div class="background-hidden">' +
                    '<div class="rotate-button"></div>' +
                    '<div class="bigger-button"></div>' +
                    '<div class="smaller-button"></div>' +
                    '<div class="download-button"></div>' +
                    '<div class="swiper-container gallery-top">' +
                    '      <div class="swiper-wrapper">' +
                    // str +
                    '      </div>' +
                    '</div>' +
                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                    '      <div class="swiper-pagination EV-gallery-top"></div>' +

                    '      </div>' +
                    '      <div class="swiper-container gallery-thumbs">' +
                    '      <div class="swiper-wrapper">' +
                    //str +
                    '      </div>' +
                    '      <!-- Add Pagination -->' +
                    '      <div class="swiper-button-next swiper-right-gray"></div>' +
                    '      <div class="swiper-button-prev swiper-left-gray"></div>' +
                    '      <div class="swiper-pagination EV-gallery-thumbs"></div>' +
                    '      </div>' +
                    '      <div class="closeBtn"></div>' +

                    '      </div>';
                isInit = true;
            }

            //console.log(isInit)
            //console.log($(".messageList-box[data-account='" + account + "'] .J-showPicImg"));
            $.bigPicShow({
                // domIdList: ".special-message-item-list.img-box",
                domIdList: $(".messageList-box[data-account='" + account + "'] .J-showPicImg"),
                // domIdList: ".J-showPicImg",
                // swiperList: str,
                topSwiperOptions: {
                    isInit: true,//是否需要初始化,
                    // loop: true, // 开启循环模式,必须设置loopedSlides
                    // loopedSlides: 5, //looped slides should be the same
                    autoplay: "",//自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换。
                    preventClicks: false,//当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
                    //pagination : '.swiper-pagination', //分页器
                    noSwiping: true,
                    pagination: '',//分页器q
                    paginationType: 'fraction',
                    /*** ‘bullets’  圆点（默认）‘fraction’  分式‘progress’  进度条‘custom’ 自定义**/
                    prevButton: '.swiper-button-prev',
                    nextButton: '.swiper-button-next',//前进按钮的css选择器或HTML元素。
                    /**
                     *  回调函数，初始化后执行。
                     */
                    simulateTouch: false,
                    onInit: function (swiper) {
                        $(".gallery-thumbs .swiper-slide").on("click", function () {
                            var index = $(this).index();
                            swiper.slideTo(index);//切换到第一个slide，速度为1秒
                        });
                        // $(".gallery-thumbs .swiper-slide").eq(0).addClass("swiper-slide-active");

                        $(".gallery-thumbs .swiper-slide-active").length > 0 ? " " : $(".gallery-thumbs .swiper-slide").eq(0).addClass("swiper-slide-active");

                        console.log("sipwer初始化完成!,回调函数，初始化后执行。");

                        $('.swiper-right-gray').on("click", function () {
                            $("#EV-swiper .gallery-thumbs").stop().addClass("show");
                            setTimeout(function () {
                                $("#EV-swiper .gallery-thumbs").stop().removeClass("show");
                            }, 0);
                        });

                        $('.swiper-left-gray').on("click", function () {
                            $("#EV-swiper .gallery-thumbs").stop(false, true).addClass("show");
                            setTimeout(function () {
                                $("#EV-swiper .gallery-thumbs").stop(false, true).removeClass("show");
                            }, 0);
                        });
                        //查看大图 旋转 缩放 保存
                        console.log("***********************");
                        console.log("IM上传图片-查看大图！");
                        $.openPhotoGallery($(".swiper-slide-active").eq(0));

                    },
                    /**
                     * 回调函数，当你轻触(tap)Swiper后执行。在移动端，click会有 200~300 ms延迟，所以请用tap代替click作为点击事件。
                     * */
                    onTap: function (swiper, event) {

                        console.log(swiper.activeIndex); //swiper当前的活动块的索引

                        console.log(swiper.realIndex);//swiper当前的活动块的真实索引,排除loop模式下添加的滑块DOM
                        console.log(swiper.clickedIndex);//返回最后点击Slide的索引。(click)
                        swiper.stopAutoplay();    //停止自动切换
                        swiper.startAutoplay();    //开始自动切换
                    },
                    onSlideChangeStart: function (swiper) { //滑块释放时如果触发slider切换则执行

                        console.log(swiper.activeIndex + "当前索引");

                        if (!isInit) {
                            $(".gallery-thumbs .swiper-slide").removeClass("swiper-slide-active").eq(swiper.activeIndex).addClass("swiper-slide-active");

                        }
                        console.log("loop循环模式前的索引值为" + swiper.realIndex);

                        //查看大图 旋转 缩放 保存
                        console.log("***********************");
                        console.log("onSlideChangeStart查看大图");
                        $.openPhotoGallery($(".swiper-slide-active").eq(0));


                    }
                },
                bottomSwiperOptions: {
                    isInit: isInit,//是否需要初始化,
                    // loop: true, // 开启循环模式,必须设置loopedSlides
                    paginationType: '',
                    loopedSlides: 5 //looped slides should be the same
                },
                /**
                 * 为每个指定的图片（会触发大图）单击事件绑定回调函数
                 * 此方法针对以dom为数据源的方式
                 * */
                imgElementCallBack: function () {
                    console.log("为每个指定的图片（会触发大图）单击事件绑定回调函数");
                },
                /**
                 * 关闭按钮回调函数
                 * */
                closeCallBack: function () {
                    console.log("关闭按钮回调函数");
                },
                /**
                 * 指定的dom结构
                 * */
                swiperDom: swiperDom
                /**
                 * 指定的dom结构
                 * */
                // swiperDom: swiperDom
            });
        }
    };
//HTML模板 策略类启动...
    var template = new Template();
//全局控制方法启动...
    var controller = new Controller();

//集中控制 网易云信核心通讯SDK启动...
    var messageCommunication = new MessageCommunication();
    messageCommunication.init();
// 全页面业务流启动...
    return {
        messageCommunication: messageCommunication,
        controller: controller,
        template: template
    };
})
;
