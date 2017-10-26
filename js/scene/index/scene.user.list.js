/**
 * @Desc：用户列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/3/2
 */
define(["jquery", "text!userListTemplate", "toJSON", "common", "messageCommunication", "medicalRecord", "recordRemark", "filterList", "require"], function ($, text, toJSON, common, mc, mr, rr, fl, require) {

    var userList = {
        init: function () {

            this.template = text;
            this.templateUrl();
            this.getUserList();//获取患者列表
            this.userListItemEvent();//给患者每一项添加事件
            this.refreshList();
        },
        templateUrl: function () {
            $("[data-template='tpl-userList']").append(this.template);
        },
        XHRList: {
            userList: "/call/customer/case/consultation/v1/getMapListByCustomerId/"
        },
        templateList: {
            userListItem: function (data) {
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
                var formatTime = timeFormat(data.createTime);
                return '<article class="userlist-mainList-item" data-account="' + data.caseId + '" data-img="' + data.logoUrl + '" data-name="' + data.patientName + '" data-pid="' + data.patientId + '" data-age="' + data.patientAge + '" data-logo="' + data.logoUrl + '" data-ctype="' + data.consultationState + '" data-type="' + data.caseType + '" data-sex="' + data.patientSex + '" data-reason="' + data.returnReason + '" data-consultationId="' + data.consultationId + '"' + 'data-doctorId="' + data.doctorId + '"data-doctorName="' + data.doctorName + '"data-refuseTime="'+data.lastUpdateTime+'">' +
                    '<figure class="userlist-item-img">' +
                    '<img src="' + data.logoUrl + '" alt="">' +
                    (function () {
                        if (localStorage.getItem("ntnCache") && JSON.parse(localStorage.getItem("ntnCache"))["0_" + data.caseId]) {

                            $(".userlist-status-item[data-role='ut-tabs-1']").addClass("new");

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
                    (function (type, disContent) {
                        var result = "";
                        if (disContent.length === 0) {
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
                                case 3:
                                    result = "待检查";
                                    break;
                            }
                        } else {
                            if (parseInt(data.isAttachment) === 3){
                                result = "咨询";
                            }else{
                                result = disContent;
                            }
                        }
                        return result;
                    }(data.caseType, data.diagnosisContent)) +
                    '</span>' +
                    '</h3>' +
                    '<article>' +
                    '<span class="text">' +
                    (function (chat, reason,docName) {
                        var result = "";
                        if (reason.length === 0) {
                            result = (parseInt(data.patientSex) === 1 ? "男" : "女") + "&nbsp" + data.patientAge + "岁&nbsp" + (parseInt(data.isAttachment) === 0 ? "无影像资料" : "有影像资料");
                        } else {
                            result = "由于"+reason + "，该患者被"+docName + "医生退回" ;
                        }

                        return result;
                    }(data.caseChat, data.returnReason,data.doctorName)) +
                    '</span>' +
                    '</article>' +
                    '</figcaption>' +
                    '<span class="time">' +
                    formatTime +
                    '</span>' +
                    '</article>';
            }
        },
        //获取患者列表
        getUserList: function (param, type) {
            var that = this;
            $(".userList-no-data").remove();
            $(".userList-inner-content .userlist-mainList-item").remove();
            var obj = param ? param : {
                conType: 0,
                conState: ""
            };
            $.ajax({
                url: this.XHRList.userList,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show();
                },
                data: {
                    paramJson: $.toJSON($.extend(false, {
                        customerId: localStorage.getItem("userId"), //148999886548
                        logoUseFlag: 3
                    }, obj))
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;

                        if (dataList && dataList.length) {
                            $(dataList).each(function (index, element) {

                                switch (parseInt(element.consultationState)) {
                                    case 0:
                                        $(".userlist-mainList[data-role='ut-tabs-1']").append(that.templateList.userListItem(element));
                                        break;
                                    case 1:
                                        $(".userlist-mainList[data-role='ut-tabs-2']").append(that.templateList.userListItem(element));
                                        break;
                                    case 2:

                                        $(".userlist-mainList[data-role='ut-tabs-3']").append(that.templateList.userListItem(element));
                                        break;
                                }
                                $(".messageList").append("<article class='messageList-box' data-account='" + element.caseId + "'></article>")

                            });
                            if (type === "filter") {
                                $(".search-result-tips").addClass("show").find("span").text(dataList.length);
                            } else if (type === "refresh") {

                            }
                            $(".userList-no-data").remove();
                            $(".userlist-mainList").each(function () {
                                if ($(this).children(".userlist-mainList-item").size() === 0) {
                                    $(this).append("<p class='userList-no-data'>没有找到相应的患者</p>");
                                }
                            })
                        } else {
                            $(".userList-no-data").remove();
                            $(".userlist-mainList").append("<p class='userList-no-data'>没有找到相应的患者</p>");
                            if (type === "filter") {
                                $(".search-result-tips").addClass("show").find("span").text(0);
                            } else if (type === "refresh") {

                            }
                        }
                    }

                    common.loading.hide();
                    require("filterList").init(param);

                    var tab1Length =  $(".userlist-mainList[data-role='ut-tabs-1'] .userlist-mainList-item .userlist-item-img p.on").length;
                    if (tab1Length===0){
                        $(".userlist-status-item[data-role='ut-tabs-1']").removeClass("new");
                    }
                    var tab2Length =$(".userlist-mainList[data-role='ut-tabs-3'] .userlist-mainList-item .userlist-item-img p.on").length;
                    if (tab2Length===0){
                        $(".userlist-status-item[data-role='ut-tabs-3']").removeClass("new");
                    }
                })
        },
        //重置患者列表...
        refreshList: function () {
            var that = this;
            $(".search-result-tips a").on("click", function () {
                that.getUserList();

                $(".main-search").val("");
                $(".search-result-tips").removeClass("show").find("span").text("0");

                $("#sex-selector .firstListTitle").text("性别");
                $("#age-selector .firstListTitle").text("年龄");
                $("#area-selector .firstListTitle").text("地区");
                $("#data-selector .firstListTitle").text("日期");

                $(".userlist-sortType-item .firstList").find(".custom-selector-item").removeClass("active");
                $(".userlist-sortType-item .firstList").find(".recover").addClass("active");

            })
        },
        //激活患者...全模块加载开始
        userListItemEvent: function () {
            var that = this;
            $(".userlist-mainList").on("click", ".userlist-mainList-item", function () {
                // $(".messageList-box").html("").hide();
                 $(".messageList-box").empty().hide();
                 $(".jump-box").removeClass("show");
                var _that = this;

                // if ($(".userlist-mainList[data-role='ut-tabs-1'] .userlist-item-img p:visible").length===0){
                //         console.log("removeClass new");
                //     $(".userlist-status-item[data-role='ut-tabs-1']").removeClass("new");
                // }

                clearTimeout(that.i);
                that.i = setTimeout(function () {
                    $(".center-inner").removeClass("no-content");
                    var account = "0_" + $(_that).attr("data-account"),
                        img = $(_that).attr("data-img");
                    $(".userList-inner-content").find(".active").removeClass("active");
                    $(_that).addClass("active");
                    // $(_that).addClass("active").siblings(".userlist-mainList-item").removeClass("active");

                    $(_that).find(".userlist-item-img p").text("").removeClass("on").hide();
                    if (localStorage.getItem("ntnCache") && JSON.parse(localStorage.getItem("ntnCache"))[account]) {
                        var ntnCache = JSON.parse(localStorage.getItem("ntnCache"));
                        var ntnCacheStore = JSON.parse(localStorage.getItem("ntnCache"));
                        ntnCacheStore[account] = 0 ;
                        delete ntnCache[account];

                        mc.controller.ntnCacheList[account] = 0;

                        // if ($(".userlist-mainList-item .userlist-item-img p:visible").length===0){
                        //     $(".userlist-status-item[data-role='ut-tabs-1']").removeClass("new");
                        // }


                        localStorage.setItem("ntnCache", JSON.stringify(ntnCacheStore));
                    }

                    mc.controller.targetData = {
                        account: account,
                        avatar: img
                    };

                    // $(".messageList-box").hide();
                    $(".messageList-box[data-account='" + $(_that).attr("data-account") + "']").show();


                    if ($(_that).parents(".userlist-mainList").attr("data-role") === "ut-tabs-3") {

                        $(".messageList-box[data-account='" + $(_that).attr("data-account") + "']").prepend(
                            (function () {

                                  if($(_that).attr("data-refuseTime")) {
                                      return  '<p class="time-stamp">'+$(_that).attr("data-refuseTime").substring(0,$(_that).attr("data-refuseTime").length-2)+'</p>'
                                  }
                                }())+
                            '<p class="time-stamp">' +
                            ($(_that).attr("data-reason").length === 0 ? '该患者被' +
                            (function () {
                                var htmlDoctor = "";
                                $(_that).attr("data-doctorName").length === 0 ? htmlDoctor = "" : htmlDoctor = $(_that).attr("data-doctorName") + '医生';
                                return htmlDoctor;
                            }()) + '退回' : '由于' + $(_that).attr("data-reason") + ',该患者被' +
                            (function () {
                                var htmlDoctor = "";
                                $(_that).attr("data-doctorName").length === 0 ? htmlDoctor = "" : htmlDoctor = $(_that).attr("data-doctorName") + '医生';
                                return htmlDoctor;
                            }()) +
                            '退回') +
                            '</p>');
                    }
                    common.loading.show();
                    mc.controller.messageBox = $(".messageList-box[data-account='" + $(_that).attr("data-account") + "']");
                    mc.messageCommunication.getMessageList("history");

                    localStorage.setItem("caseId", $(_that).attr("data-account"));
                    localStorage.setItem("patientId", $(_that).attr("data-pid"));
                    localStorage.setItem("patientName", $(_that).attr("data-name"));

                    $(".messageList-targetName h3 span").text($(_that).attr("data-name"));

                    mr.init({
                        name: $(_that).attr("data-name"), //患者姓名
                        sex: $(_that).attr("data-sex"), //患者性别 1男2女
                        logo: $(_that).attr("data-logo"), //患者头像
                        type: $(_that).attr("data-type"),// 咨询/预约手术 0-咨询1-复诊2-手术直约 3-待检查
                        age: $(_that).attr("data-age"), //年龄
                        category: $(_that).find(".category").text()
                    });
                    rr.init();
                }, 300);
            })
        }
    };
    return userList;
});