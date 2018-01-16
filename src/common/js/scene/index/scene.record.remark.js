/**
 * @Desc：病例备注
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang/gubowen on 2017/3/23
 */
define(["jquery", "jPager", "text!medicalRemarkTemplate", "common", "toJSON"], function ($, pager, text, common, toJSON) {
    var container = {
        op: {},
        init: function () {
            this.template = text;
            $("[data-template='tpl-medical-record-remark']").append(this.template);
            this.remark();
            this.recordMask();
            this.getRemarkList();
            this.toggleList();
        },
        XHRList: {
            update: "/call/customer/patient/case/remark/v1/create/",
            list: "/call/customer/patient/case/remark/v1/getMapList/",
            delete: "/call/customer/patient/case/remark/v1/update/",
            chatHistoryRecord: "/call/patient/case/chat/v1/getMapList/",
            diagnoseHistory: "/call/customer/patient/case/v1/getCaseMapList/"
        },
        templateList: {
            listItem: function (data) {
                return '<article class="remark-content-item" data-id="' + data.id + '">' +
                    '<p class="text" data-value="' + data.caseId + '">' + data.remarkContent + '</p>' +
                    '<p class="time">' + (data.time ? data.time : (function () {
                        var d = data.createTime.replace(/-/g, "/");
                        f = d.substring(2, 10),
                            y = f.substring(0, 2),
                            m = f.substring(3, 5).indexOf("0") === 0 ? f.substring(4, 5) : f.substring(3, 5),
                            dd = f.substring(6, 8),
                            s = d.substring(10).substring(0, 6),
                            time = y + "/" + m + "/" + dd + s;
                        return time;
                    })()) + '</p>' +
                    '<i class="delete"></i>' +
                    '</article>';
            }
        },
        recordMask: function () {
            var _this = this;
            var patientId = localStorage.getItem("patientId");

            $(".medical-record").off().on("click", ".medical-record-img", function () {
                //  common.loading.show();
                var htmlText = "";
                htmlText += '<section class="maskers infoBox-tips show">' +
                    '<section class="infoBox-inner">' +
                    '<article class="infoBox-content">' +
                    '<section>' +
                    '<h2>' + localStorage.getItem("patientName") + '咨询历史</h2>' +
                    '</section>' +
                    '</article>' +
                    '<section class="check-history">' +
                    '<article class="check-history-majorTitle"><span class="check-title-left">诊断结论</span><span class="check-title-right">患者提交病例时间</span></article>' +
                    '<ul>';
                htmlText += _this.diagnoseHistory();
                htmlText += '</ul>' +
                    '</section>' +
                    '</section>' +
                    '<section class="mask-close"></section>' +
                    '</section>' +
                    '<section class="mask-background show"></section>';


                // setTimeout(function(){common.loading.hide()
                // console.log("1111");}
                //     ,8000);

                if (htmlText != '') {
                    common.gbw.infoBox({
                        html: htmlText,
                        container:$(".main-inner")
                    });
                }

                $('.check-history-info', '.check-history').off().on('click', function () {
                    if( $(this).parents("li").find(".check-history-show").length){
                        $(this).parents("li").find(".check-history-show").remove();
                    }else{
                        var caseId = $(this).attr("data-caseId");
                        $(this).parents("li").siblings().find("article ").remove();
                        _this.chatHistoryRecord(caseId, $(this));
                        $(this).parents("li").find(".check-history-show").addClass("on");

                    }
                });

            });

        },
        diagnoseHistory: function () {
            var _this = this;
            var html = "";
            var data = {
                patientId: localStorage.getItem("patientId")
            };
            $.ajax({
                url: _this.XHRList.diagnoseHistory,
                type: "POST",
                async: false,
                data: {
                    paramJson: $.toJSON(data)
                },
                beforeSend: function () {
                    common.loading.show();
                }
            }).done(function (data) {
                if (data.responseObject.responseData && data.responseObject.responseStatus != false) {
                    var dataList = data.responseObject.responseData.dataList;
                    if (dataList && dataList.length !== 0) {
                        for (var i = 0; i < dataList.length; i++) {
                            var createTime = dataList[i].createTime;
                            createTime = createTime.replace("-", "年");
                            createTime = createTime.replace("-", "月");
                            createTime = createTime.substring(0, 10) + "日" + createTime.substring(10, 16);
                            var mainContent = dataList[i].mainContent;
                            var patientId = dataList[i].patientId;
                            var caseId = dataList[i].caseId;

                            html += '<li><section class="check-history-info" data-caseId="' + caseId + '">' +
                                '<span class="check-history-title"><i class="icon-downArrow"></i>' + mainContent.caseMain + '</span>' +
                                '<span class="check-history-text">' + createTime + '</span>' +
                                '</section></li>';


                            //html += _this.chatHistoryRecord(caseId, mainContent, patientId,createTime);

                        }
                    }
                }
            }).fail(function () {
                console.log("获取数据失败!");
            });
            common.loading.hide();
            //  console.log(html);

            return html;
        },
        chatHistoryRecord: function (caseId, target) {
            var _this = this;
            var textHtml = "";
            var maxResult = 5;
            var pagecount = "";  //总页数
            var data = {
                fromAccount: "1_doctor00001",   // localStorage.getItem("patientId"),
                receiveAccount: "0_"+caseId,
                firstResult: 0,
                maxResult: maxResult,
                sortType: 1
            };

            $.ajax({
                url: _this.XHRList.chatHistoryRecord,
                type: "POST",
                catch: false,
                async: false,
                data: {
                    paramJson: $.toJSON(data)
                },
                beforeSend: function () {
                },
                success: function (data) {

                 //   debugger;
                    if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            textHtml += '<article class="check-history-show">' +
                                '<h3>咨询对话历史</h3><section class="check-history-talk">' +
                                '<ul>';
                            $.each(dataList, function (k, v) {
                                if (v.msgType.toLowerCase()==="text"){
                                    if( !(v.fromAccount == '1_doctor00001') ){
                                        textHtml += '<li>' +
                                            '<article><header>' +localStorage.getItem("patientName")+ " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header><p>' + v.body + '</p></article>' +
                                            '</li>';
                                    }else{
                                        textHtml += '<li>' +
                                            '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header><p>' + v.body + '</p></article>' +
                                            '</li>';
                                    }
                                }else if (v.msgType.toLowerCase()==="custom"){


                                    if(v.body !=""){

                                      var bodyValue=v.body.substring(1,v.body.length-1);
                                        switch (JSON.parse(bodyValue).type){
                                            // case "medicalReport": //病例
                                            //     this.getMedicalReportData(account);
                                            //     break;
                                            case "previewSuggestion"://初诊报告
                                            // debugger;
                                                if(!(v.fromAccount == '1_doctor00001')  ){
                                                    textHtml += '<li>' +
                                                        '<article><header>' +localStorage.getItem("patientName")+ " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }else{
                                                    textHtml += '<li>' +
                                                        '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }
                                              textHtml +=  '<p>'+_this.previewSuggestion(JSON.parse(bodyValue).data[0]) +'</p>';
                                                textHtml +='</article></li>';
                                                break;
                                            // case "operationReport": //手术预约
                                            //     this.getOperationData(account);
                                            //     break;
                                            case "checkSuggestion": //检查检验
                                                if(!(v.fromAccount == '1_doctor00001')  ){
                                                    textHtml += '<li>' +
                                                        '<article><header>' + localStorage.getItem("patientName") + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }else{
                                                    textHtml += '<li>' +
                                                        '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }
                                                console.log(JSON.parse(bodyValue));
                                                textHtml +=  '<p>'+_this.checkSuggestion(JSON.parse(bodyValue).data)+'</p>';
                                                textHtml +='</article></li>';
                                                break;
                                            case "videoTriage": //视诊
                                                if(!(v.fromAccount == '1_doctor00001')){
                                                    textHtml += '<li>' +
                                                        '<article><header>' + localStorage.getItem("patientName") + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }else{
                                                    textHtml += '<li>' +
                                                        '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }
                                                textHtml +=  '<p>'+_this.videoTriage(JSON.parse(bodyValue).data)+'</p>';
                                                textHtml +='</article></li>';
                                                break;
                                            case "ensureOperation": //确认手术
                                                if(!(v.fromAccount == '1_doctor00001') ){
                                                    textHtml += '<li>' +
                                                        '<article><header>' + localStorage.getItem("patientName") + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }else{
                                                    textHtml += '<li>' +
                                                        '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }
                                                textHtml +=  '<p>'+_this.ensureOperation(JSON.parse(bodyValue).data)+'</p>';
                                                textHtml +='</article></li>';
                                                break;
                                            case "reTriageTip":
                                                textHtml += '<li>' +
                                                    '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';
                                                textHtml+='<p class="time-stamp">上一位服务该患者的分诊医生已下班，如有需要请继续沟通</p>';
                                                textHtml +='</article></li>';
                                                break;
                                        }

                                     }
                                }else if(v.msgType.toLowerCase()==="file"){
                                            if(v.attUrl != ""){
                                                if(!(v.fromAccount == '1_doctor00001') ){
                                                    textHtml += '<li>' +
                                                        '<article><header>' + localStorage.getItem("patientName") + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }else{
                                                    textHtml += '<li>' +
                                                        '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                }
                                                textHtml +=  '<p><img  class="img-show" src="'+v.attUrl+'"/></p>';
                                                textHtml +='</article></li>';
                                            }

                                }
                            });
                            textHtml += '</ul></section>' +
                                '<div class="page-container">' +
                                '<div class="pagination pager">' +
                                ' </div>' +
                                '</div></article>';
                            var totalCount = data.responseObject.responseData.totalCount;
                            pagecount = Math.ceil(totalCount / maxResult);//总页数
                            // pagecount = 20
                        }
                    } else {
                        common.popup({text: "无聊天记录"});
                    }
                },
                error: function () {

                    textHtml = '<li><section class="check-history-info">' +
                        '<span class="check-history-title"><i class="icon-downArrow"></i>' + mainContent + '</span>' +
                        '<span class="check-history-text">' + createTime + '</span>' +
                        '</section></ul></li>';
                    console.log("获取数据失败!");
                }
            });

            target.parents("li").append(textHtml);


            PageClick = function (pageclickednumber) {
                data.firstResult = (pageclickednumber - 1) * data.maxResult;//加载第几页；
                $.ajax({
                    url: _this.XHRList.chatHistoryRecord,
                    type: "POST",
                    catch: false,
                    async: false,
                    data: {
                        paramJson: $.toJSON(data)
                    },
                    beforeSend: function () {
                    },
                    success: function (data) {
                        if (data.responseObject.responseData.dataList && data.responseObject.responseStatus != false) {
                            var dataList = data.responseObject.responseData.dataList;
                            if (dataList && dataList.length !== 0) {
                                textHtml = "";
                                textHtml += '<article class="check-history-show on">' +
                                    '<h3>咨询对话历史</h3><section class="check-history-talk">' +
                                    '<ul>';
                                $.each(dataList, function (k, v) {
                                    if (v.msgType.toLowerCase()==="text"){
                                        if(!(v.fromAccount == '1_doctor00001') ){
                                            textHtml += '<li>' +
                                                '<article><header>' + localStorage.getItem("patientName") + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header><p>' + v.body + '</p></article>' +
                                                '</li>';
                                        }else{
                                            textHtml += '<li>' +
                                                '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header><p>' + v.body + '</p></article>' +
                                                '</li>';
                                        }
                                    }else if (v.msgType.toLowerCase()==="custom"){


                                        if(v.body !=""){

                                            var bodyValue=v.body.substring(1,v.body.length-1);
                                            switch (JSON.parse(bodyValue).type){
                                                // case "medicalReport": //病例
                                                //     this.getMedicalReportData(account);
                                                //     break;
                                                case "previewSuggestion"://初诊报告
                                                    // debugger;
                                                    if(!(v.fromAccount == '1_doctor00001') ){
                                                        textHtml += '<li>' +
                                                            '<article><header>' + localStorage.getItem("patientName") + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                    }else{
                                                        textHtml += '<li>' +
                                                            '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                    }
                                                    textHtml +=  '<p>'+_this.previewSuggestion(JSON.parse(bodyValue).data[0]) +'</p>';
                                                    textHtml +='</article></li>';
                                                    break;
                                                // case "operationReport": //手术预约
                                                //     this.getOperationData(account);
                                                //     break;
                                                case "checkSuggestion": //检查检验
                                                    if(!(v.fromAccount == '1_doctor00001')  ){
                                                        textHtml += '<li>' +
                                                            '<article><header>' + localStorage.getItem("patientName") + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                    }else{
                                                        textHtml += '<li>' +
                                                            '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                    }
                                                    console.log(JSON.parse(bodyValue));
                                                    textHtml +=  '<p>'+_this.checkSuggestion(JSON.parse(bodyValue).data)+'</p>';
                                                    textHtml +='</article></li>';
                                                    break;
                                                case "videoTriage": //视诊
                                                    if(!(v.fromAccount == '1_doctor00001') ){
                                                        textHtml += '<li>' +
                                                            '<article><header>' + localStorage.getItem("patientName") + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                    }else{
                                                        textHtml += '<li>' +
                                                            '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                    }
                                                    textHtml +=  '<p>'+_this.videoTriage(JSON.parse(bodyValue).data)+'</p>';
                                                    textHtml +='</article></li>';
                                                    break;
                                                case "ensureOperation": //确认手术
                                                    if(!(v.fromAccount == '1_doctor00001') ){
                                                        textHtml += '<li>' +
                                                            '<article><header>' +localStorage.getItem("patientName")+ " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                    }else{
                                                        textHtml += '<li>' +
                                                            '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                                    }
                                                    textHtml +=  '<p>'+_this.ensureOperation(JSON.parse(bodyValue).data)+'</p>';
                                                    textHtml +='</article></li>';
                                                    break;
                                                case "reTriageTip":
                                                    textHtml += '<li>' +
                                                        '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';
                                                    textHtml+='<p class="time-stamp">上一位服务该患者的分诊医生已下班，如有需要请继续沟通</p>';
                                                    textHtml +='</article></li>';
                                                    break;
                                            }

                                        }
                                    }else if(v.msgType.toLowerCase()==="file"){
                                        if(v.attUrl != ""){
                                            if(!(v.fromAccount == '1_doctor00001')){
                                                textHtml += '<li>' +
                                                    '<article><header>' + localStorage.getItem("patientName")+ " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                            }else{
                                                textHtml += '<li>' +
                                                    '<article><header class="doctor-letter">' + v.fromNick + " " + v.createTime.replace(/-/g, "/").substr(0,v.createTime.replace(/-/g, "/").length-2)+ '</header>';

                                            }
                                            textHtml +=  '<p><img  class="img-show" src="'+v.attUrl+'"/></p>';
                                            textHtml +='</article></li>';
                                        }

                                    }


                                });

                                textHtml += '</ul></section>' +
                                    '<div class="page-container">' +
                                    '<div class="pagination pager">' +
                                    ' </div>' +
                                    '</div></article>';
                                // debugger;
                                target.parents("li").find("article").eq(0).remove();
                                target.parents("li").append(textHtml);

                                // debugger;
                                var totalCount = data.responseObject.responseData.totalCount;
                                pagecount = Math.ceil(totalCount / maxResult);//总页数
                                // pagecount = 20
                                $(".pager").pager({
                                    pagenumber: pageclickednumber,
                                    pagecount: pagecount,
                                    buttonClickCallback: PageClick
                                });
                            }

                        } else {
                            common.popup({text: "无聊天记录"});
                        }

                    },
                    error: function () {

                        textHtml = '<li><section class="check-history-info">' +
                            '<span class="check-history-title"><i class="icon-downArrow"></i>' + mainContent + '</span>' +
                            '<span class="check-history-text">' + createTime + '</span>' +
                            '</section></ul></li>';
                        console.log("获取数据失败!");
                    }
                });


            };
            $(".pager").pager({
                pagenumber: 1,
                pagecount: pagecount,
                buttonClickCallback: PageClick
            });
        },
        remark: function () {
            var _this = this;
            $(".medical-record-remark-content .date").addClass("active");
            $(".remark-build").hide();
            $(".remark-toggle").hide();
           // $(".medical-record-remark").addClass("on");
            //$(".medical-record-form").addClass("on");

            $(".remark-build").off().on("click", function () {
                if ($(this).hasClass("remark-new")) {
                    $(".medical-record-remark-content .date").addClass("active");
                    $(".medical-record-remark-content .edit").removeClass("active");
                    $(".remark-add .remark-build").removeClass("remark-new").find("span").text("添加");
                } else {
                    $(".remark-add .remark-build").addClass("remark-new").find("span").text("返回");
                    $(".medical-record-remark-content .date").removeClass("active");
                    $(".medical-record-remark-content .edit").addClass("active").find("textarea").val("");



                    $(".saveButton").off("click").on("click", function () {
                        _this.createNewRemark();
                    })
                }
            });

            $("#ev-remark-content").off().on("click", ".remark-content-item .delete", function () {
                var ele = $(this).parents(".remark-content-item");
                common.confirmBox({
                    textList: {
                        text: "确定删除该条备注吗?"
                    },
                    ensure: '确定',
                    cancel: '取消',
                    container: $(this).parent(),
                    ensureCallback: function () {
                        _this.deleteRemark(ele);
                    },
                    cancelCallback: function () {
                        return false;
                    }
                });
            });


            $("#ev-remark-content").on("click", ".remark-content-item .text", function () {

                    var dataValue = $(this).attr("data-value");
                    var dataId = $(this).parent(".remark-content-item").attr("data-id");
                    $(".edit").find(".J-textArea-remark").val($(this).text());
                    $(".edit").find(".J-textArea-remark").attr("data-id", dataId);

                    $(".remark-add .remark-build").addClass("remark-new").find("span").text("返回");
                    $(".medical-record-remark-content .date").removeClass("active");
                    $(".medical-record-remark-content .edit").addClass("active");

                    $(".saveButton").off("click").on("click", function () {
                        var ele = $(this).prev();
                        _this.updateRemark(ele);
                    });
                }
            );

            //最多输入200个字段
            $(".edit .text").on("keyup", function () {
                if ($(this).text().length >= 200) {
                    $(this).text($(this).text().substring(0, 200))
                }
            })
        },
        createNewRemark: function () {
           // var value = common.htmlToString($(".text[contenteditable='true']").text());
            var value = $(".J-textArea-remark").val();
            var _this = this;
            if (value.length === 0) {
                $(".medical-record-remark-content .date").addClass("active");
                $(".medical-record-remark-content .edit").removeClass("active");
                $(".remark-add .remark-build").removeClass("remark-new").find("span").text("添加");
            } else {
                $.ajax({
                    url: _this.XHRList.update,
                    type: 'POST',
                    dataType: 'json',
                    timeout: 10000,
                    data: {
                        paramJson: $.toJSON({
                            patientId: localStorage.getItem("patientId"),
                            caseId: localStorage.getItem("caseId"),
                            operatorId: localStorage.getItem("userId"),
                            operatorType: "1",
                            remarkContent: value
                        })
                    }
                }).done(function (data) {
                    console.log("获取数据成功！");

                    if (data.responseObject.responseStatus) {
                        $(".medical-record-remark-content .date").addClass("active");
                        $(".medical-record-remark-content .edit").removeClass("active");
                        $(".remark-add .remark-build").removeClass("remark-new").find("span").text("添加");

                        var D = new Date(),
                            y = D.getFullYear(),
                            m = D.getMonth(),
                            d = D.getDate(),
                            h = D.getHours(),
                            mm = D.getMinutes(),
                            time = (y + "").substring(2) + "/" + m + "/" + d + " " + h + ":" + mm;
                        $("#ev-remark-content").prepend(_this.templateList.listItem({
                            remarkContent: value,
                            time: time,
                            id: data.responseObject.responsePk
                        }));
                        //$(".text[contenteditable='true']").text("");
                        // debugger;
                        //$(".J-textArea-remark").val(" ");
                    }
                }).fail(function () {
                    console.log("获取数据失败！");
                })
            }
        },
        updateRemark: function (ele) {
            //  console.log(ele);
            var _this = this,
                id = ele.attr("data-id"),
                remarkContent = ele.val();
            // console.log(id,remarkContent);
            $.ajax({
                url: _this.XHRList.delete,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        id: id,
                        remarkContent: remarkContent
                    })
                }
            }).done(function (data) {
                if (data.responseObject.responseStatus) {
                    _this.getRemarkList();

                    $(".medical-record-remark-content .date").addClass("active");
                    $(".medical-record-remark-content .edit").removeClass("active");
                    $(".remark-add .remark-build").removeClass("remark-new").find("span").text("添加");
                }
            })
        },
        getRemarkList: function () {
            var _this = this;
            $.ajax({
                url: this.XHRList.list,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        caseId: localStorage.getItem("caseId"),
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "9999"
                    })
                }
            }).done(function (data) {
                if (data.responseObject.responseData) {
                    var dataList = data.responseObject.responseData.dataList;
                    if (dataList && dataList.length !== 0) {
                        $("#ev-remark-content").html(" ");
                        $(dataList.reverse()).each(function (index, element) {
                            $("#ev-remark-content").append(_this.templateList.listItem(element))
                        });
                    }
                }
            }).fail(function () {
                console.log("获取数据失败！");
            })
        },
        deleteRemark: function (ele) {
            var _this = this,
                id = ele.attr("data-id");
            $.ajax({
                url: _this.XHRList.delete,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        id: id,
                        isValid: "0"
                    })
                }
            }).done(function (data) {
                if (data.responseObject.responseStatus) {
                    ele.addClass("delete-item");
                    ele.on("transitionend", function () {
                        $(this).remove();
                    })
                }
            })
        },
        toggleList: function () {
            $(".remark-toggle").on("click", function () {
                $(".medical-record-remark").removeClass("on");
                $('.medical-record-form').removeClass("on");
                $(".remark-toggle").hide();
                $(".remark-build").hide();
                $(".remark-name").show();

                $(".edit").removeClass("active").find(".text").text("");
                $(".date").addClass("active");
                $(".remark-build").removeClass("remark-new").find("span").text("添加");
            });

            $(".remark-name").on("click", function () {
                if (!$(".medical-record-remark").hasClass("on")) {
                    $(".medical-record-remark").addClass("on");
                    $('.medical-record-form').addClass("on");
                    $(this).hide();
                    $(".remark-toggle").show();
                    $(".remark-build").show();
                }
            })
        },
        previewSuggestion: function (data) {
            return '<figcaption class="check-suggestion-message">' +
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
                '</figcaption>' ;
        },
        videoTriage: function (data) {

            return '<figcaption class="check-suggestion-message">' +
                '<header class="check-suggestion-message-title">' +
                '视诊' +
                '</header>' +
                '<section class="check-suggestion-content">' +
                '<article class="check-suggestion-item"><span>' + data.content + '</span></article>' +
                '</section>' +
                '</figcaption>';
        },
        checkSuggestion: function (data) {

            return '<figcaption class="check-suggestion-message">' +
                '<header class="check-suggestion-message-title">' +
                '检查/检验建议' +
                '</header>' +
                '<section class="check-suggestion-content">' +
                (function (data) {
                    console.log(data);
                    var result = "";
                    $(data).each(function (index, element) {
                        result += '<article class="check-suggestion-item"><span>' + element.adviceName + '</span></article>';
                    });
                    return result;
                }(data)) +
                '</section>' +
                '</figcaption>';
        },
        ensureOperation: function (data) {
            return '<figcaption class="messageList-item-text">' +
                '你好，分诊医生已收到您的全部信息，正在帮您预约' + data.doctorName + '医生，会在12小时内给您答复。' +
                '<span>立即咨询></span>' +
                '</figcaption>' ;
        }
    };
    return container;
})
;