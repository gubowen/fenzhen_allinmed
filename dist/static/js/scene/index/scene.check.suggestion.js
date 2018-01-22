/**
 * @Desc：初诊建议
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang/wangjingrong  on 2017/3/21
 */
define([
    "text!configSuggestionTemplate",
    "tabView",
    "diseaseTeach",
    "previewSuggestion",
    "text!searchSuggestionTemplate",
    "messageCommunication",
    "searchSuggestion"
], function (config, TabsViewChange, diseaseTeach, preview, search,mc,ss) {
    var container = {
        init: function () {
            var t = this;
            t.config.storeDoctorMessage=[];
            t.config.recoveryAdviceList=[];
            t.templateUrl();
            t.selectItem();
            t.showToggleList();

            t.dataInit("teachingKnowledge",this.XHRList.getTeachingKnowledge,1,"knowledge"); //患教知识
            t.dataInit("disposeSuggest",this.XHRList.getDisposeSuggest,0,"treatment"); //处置建议
            t.dataInit("examineSuggest",this.XHRList.getExamineSuggest,0,"node"); //检查建议
            t.dataInit("testSuggest",this.XHRList.getTestSuggest,0,"inspection"); //检验建议
        },
        config:{
            storeDoctorMessage:[],//存储医生信息
            recoveryAdviceList:[],//四大建议列表
            recommendCustomerList:[]//推荐医生列表
        },
        XHRList: {
            getTeachingKnowledge:"/call/comm/data/knowledge/v1/getMapList/",//患教知识
            getDisposeSuggest:"/call/comm/data/treatment/v1/getMapList/",//处置建议
            getExamineSuggest:"/call/comm/data/check/v1/getMapList/",//检查建议
            getTestSuggest:"/call/comm/data/inspection/v1/getMapList/",//检验建议
            saveData: "/call/patient/case/diagnosis/v1/create/",//保存初步诊断
            savePreviewSuggest:"/call/patient/recovery/advice/v1/create/",//保存初诊建议
            saveRecommendDoc:"/call/patient/recommend/v1/create/",//保存初诊医生
            filterSearchDocMessage:"/call/customer/auth/v1/getMatchCustomerList/"//筛选搜索推荐医生
        },
        templateUrl: function () {
            var t = this;
            $("[data-template='tpl-inner']").append(preview);
            $("[data-template='tpl-inner']").append(config);
            $("[data-template='tpl-inner']").append(search);
            t.previewSuggestionContent();
            t.savePreviewSuggestion();
            t.configTabsChange();
            t.mateAllTabs();
            t.filterAndSearchDocController();
            setTimeout(function () {
                $(".main-masker.search-suggestion").addClass("on");
            });
        },
        closeWindow: function () {
	        var t = this;
            //点击关闭弹层
            $(".search-suggestion .window-close,.config-suggestion .window-close").on("click",function () {
                $(".search-suggestion,.config-suggestion").removeClass("on");
                $(".search-suggestion,.config-suggestion").on("transitionend WebkitTransitionEnd",function () {
                    $(".search-suggestion,.config-suggestion").remove();
                })
            });
            //点击上一步清空数据
            $(".config-suggestion .check-suggestion-back").on("click", function () {
                t.config.storeDoctorMessage=[];
                setTimeout(function () {
                    $(".config-suggestion").hide();
                    $(".config-suggestion").removeClass("on");
                    $(".search-suggestion").show();
                    $(".search-suggestion").addClass("on");
                });
                $("button.check-suggestion-select").removeClass("active");
                $(".recommendDoctor .doctor-message-mate .doctor-message-item").remove();
            });
        },

        dataInit: function (target,url,isHasDetails,moudleName) {
            var t = this;
            $.ajax({
                url:url,
                dataType: 'json',
                type:'post',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        isValid: 1,
                        firstResult:0,
                        maxResult:9999
                    })
                }
            }).done(function (data) {
                if (data.responseObject.responseData.dataList){
                    var dataList = data.responseObject.responseData.dataList;
                    var html = "";
                    $.each(dataList, function (index, element) {
                        html += '<article class="check-project-item">' +
                            '<span class="'+(element.children.length>0?'icon-downArrow-big':'')+'">'+element[moudleName+"Name"]+'</span><section class="check-project-second-box">';
                            $.each(element.children, function (key, value) {
                                html += '<section class="check-project-second-item check-project-second-title '+(value.children.length>0?'icon-downArrow':'')+'">' +
                                    '<span>' + value[moudleName+"Name"] + '</span>';
                                if(value.children.length>0){
                                    html +=  '<section class="check-project-second-box">';
                                    $.each(value.children, function (k, v) {
                                        html += '<section class="check-project-second-item select-element '+(v.children.length>0?'icon-downArrow':'')+'">' +
                                        '<i class="icon-select-big"></i>' +
                                        '<span data-id="'+v[moudleName+"Id"]+'" data-time="'+(v.createTime?v.createTime.split(" ")[0].replace(/-/g,"."):"")+'">' + v[moudleName+"Name"] + '</span>'+
                                        (isHasDetails?'<i class="icon-detail"><span>详情</span></i>':'');
                                        if (v.children.length>0) {
                                            html += '<section class="check-project-second-box">';
                                            $.each(v.children, function (k4, v4) {
                                                html += '<section class="check-project-second-item select-element ">' +
                                                '<i class="icon-select-big"></i>' +
                                                '<span data-id="'+v4[moudleName+"Id"]+'" data-time="'+(v.createTime?v.createTime.split(" ")[0].replace(/-/g,"."):"")+'">' + v4[moudleName+"Name"] + '</span>' +
                                                (isHasDetails?'<i class="icon-detail"><span>详情</span></i>':'')+
                                                '</section>';
                                            });
                                            html += '</section>';
                                        }
                                        html += '</section>';
                                    });
                                    html += '</section>';
                                }
                                html += '</section>';
                            });
                        html += '</section></article>';
                    });
                    $(".config-suggestion-viewers").find("."+target+" .check-project-list").append(html);
                    t.closeWindow();
                    t.diseaseTeachDetail();
                }
            }).fail(function(){

            })
        },
        //五大Tab切换
        configTabsChange: function () {
            new TabsViewChange({
                tabsInner: $(".cs-tabs.tabsInner"),
                views: $(".cs-view.viewInner"),
                changeCallback: function () {
                    var input = $(".check-suggestion-item:visible .search-suggestion-input");
                    //var rInner = $(".check-suggestion-item:visible .check-project-result-inner");
                    //var sInner = $(".check-suggestion-item:visible .check-project-list-inner");
                }
            });
        },
        //第三列和第四列只能选择一种
        showToggleList: function () {
            $(".config-suggestion").on("click",'.check-project-item>span,.check-project-second-item>span',function () {
                $(this).siblings(".check-project-second-box").toggleClass("active");
                if ($(this).hasClass("icon-downArrow-big")) {
                    $(this).toggleClass("selected");
                } else {
                    $(this).parent().toggleClass("selected");
                }
            })
        },
        //选中列表
        selectItem: function () {
            var t = this;
            //选择全部医生
            $(".config-suggestion-viewers").on("click",".check-suggestion-select",function () {
                var docItem = $(".doctor-message.show .doctor-message-item");
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                    $(".check-suggestion-item[data-role='cs-tabs-1'] .doctor-message.show .doctor-message-item").addClass('active');
                    //添加全部医生并去重
                    docItem.each(function(index,element){
                        var docId = $(element).attr("data-docid"),
                            allData = JSON.parse($(element).attr("data-all")),
                            flag = true;
                        $.each(t.config.storeDoctorMessage,function(i,e){
                            if(e.customerId == docId){
                                //数组中已经有此医生，不再添加
                                console.log("已添加此医生");
                                flag = false;
                            }else{
                                //数组中没有此医生，添加
                                console.log("未添加此医生");
                            }
                        })
                        if(flag){
                            t.config.storeDoctorMessage.push(allData);
                            console.log(t.config.storeDoctorMessage);
                        }else{
                            console.log("该医生已选");
                        }
                    })
                } else {
                    $(this).removeClass("active");
                    $(".check-suggestion-item[data-role='cs-tabs-1'] .doctor-message.show .doctor-message-item").removeClass('active');
                    docItem.each(function(index,element){
                        var docId = $(element).attr("data-docid");
                        $.each(t.config.storeDoctorMessage,function(i,e){
                            if(e.customerId == docId){
                                //数组中有此医生，删除
                                t.config.storeDoctorMessage.splice(i,1);
                                console.log(t.config.storeDoctorMessage);
                                return false;
                            }
                        })
                    })
                };
                t.lightPreSend();
            });

            $(".doctor-message").on("click",".doctor-message-item",function (e) {
                e.stopPropagation();
                var docId = $(this).attr("data-docid"),
                    flag = true;
                //存储选中医生信息
                if($(this).hasClass("active")){
                    //删除已选医生
                    $(this).removeClass("active");
                    $.each(t.config.storeDoctorMessage,function(index,element){
                        if(element.customerId == docId){
                            t.config.storeDoctorMessage.splice(index,1);
                            console.log(t.config.storeDoctorMessage);
                            return false;
                        }
                    });
                }else{
                    //增加已选医生
                    $(this).addClass("active");
                    $.each(t.config.storeDoctorMessage,function(index,element){
                        if(element.customerId == docId){
                            flag = false;
                        }
                    });
                    if(flag){
                        t.config.storeDoctorMessage.push(JSON.parse($(this).attr("data-all")));
                        console.log(t.config.storeDoctorMessage);
                    }else{
                        console.log("该医生已选");
                    }
                };
                t.lightPreSend();
            });

            $(".config-suggestion-viewers").on("click",'.select-element .icon-select-big',function () {
                if ($(this).parent().hasClass("select-disabled")) {
                    return;
                }
                if ($(this).parent().hasClass("active")) {
                    $(this).parent().removeClass("active");
                    $(this).parent().find(".select-element").removeClass("select-disabled");
                } else {
                    $(this).parent().addClass("active");
                    $(this).parent().find(".select-element").addClass("select-disabled").removeClass("active");
                }
                t.lightPreSend();
            });
        },
        //点击查看详情
        diseaseTeachDetail: function () {
            $(".icon-detail").on("click",function (e) {
                var knowledgeId = $(this).siblings("span").data("id"),
                    knowledgeTitle = $(this).siblings("span").text();
                e.stopPropagation();
                diseaseTeach.init({
                    knowledgeId:knowledgeId,
                    knowledgeTitle:knowledgeTitle
                });
                $(".config-suggestion").hide();
            })
        },
        //发送初诊建议
        savePreviewSuggestion: function(){
            var t = this;
            $(".ev-send-suggestion").off("click").on("click",function(){
                if(!$(this).hasClass("forbid")){
                    var that = this;
                    t.config.recommendCustomerList = [];
                    $(this).attr("disabled","disabled");
                    //推荐医生
                    if(t.config.storeDoctorMessage.length>0){
                        $.each(t.config.storeDoctorMessage,function(index,element){
                            //距离远近，是否Top10
                            var recommendCause = '';
                            if(element.isTop==1&&element.isNearest==1){
                                recommendCause = 2
                            }else if(element.isTop==1){
                                recommendCause = 1
                            }else{
                                recommendCause = 0
                            }
                            t.config.recommendCustomerList.push({
                                recommendType:1,
                                recommendId:element.customerId,
                                recommendCause:recommendCause
                            })
                        })
                    }
                    //患教知识
                    if($(".teachingKnowledge .select-element.active").length>0){
                        $(".teachingKnowledge .select-element.active").each(function(index,element){
                            t.config.recoveryAdviceList.push({
                                adviceType:3,
                                adviceId:$(element).children("span").data("id")
                            })
                        })
                    }
                    //处置建议
                    if($(".disposeSuggest .select-element.active").length>0){
                        $(".disposeSuggest .select-element.active").each(function(index,element){
                            t.config.recoveryAdviceList.push({
                                adviceType:0,
                                adviceId:$(element).children("span").data("id")
                            })
                        })
                    }
                    //检查建议
                    if($(".examineSuggest .select-element.active").length>0){
                        $(".examineSuggest .select-element.active").each(function(index,element){
                            t.config.recoveryAdviceList.push({
                                adviceType:1,
                                adviceId:$(element).children("span").data("id")
                            })
                        })
                    }
                    ///检验建议
                    if($(".testSuggest .select-element.active").length>0){
                        $(".testSuggest .select-element.active").each(function(index,element){
                            t.config.recoveryAdviceList.push({
                                adviceType:2,
                                adviceId:$(element).children("span").data("id")
                            })
                        })
                    }
                    //保存初步诊断，返回diagnosisId
                    $.ajax({
                        url: t.XHRList.saveData,
                        type: 'POST',
                        dataType: 'json',
                        timeout: 10000,
                        data: {
                            paramJson: $.toJSON(ss.sendData)
                        }
                    }).done(function (data) {
                        if (data.responseObject.responseStatus) {
                            console.log("初步诊断保存成功");
                            var diagnosisId = data.responseObject.responsePk;
                            //推荐医生保存
                            $.ajax({
                                url: t.XHRList.saveRecommendDoc,
                                type: 'POST',
                                dataType: 'json',
                                timeout: 10000,
                                data: {
                                    paramJson: $.toJSON({
                                        caseId:localStorage.getItem('caseId'),
                                        patientId:localStorage.getItem('patientId'),
                                        customerId:localStorage.getItem('userId'),
                                        recommendCustomerList:JSON.stringify(t.config.recommendCustomerList),
                                        diagnosisId:diagnosisId,
                                        type:1
                                    })
                                },
                                success:function(data){
                                    console.log("推荐医生保存成功");
                                    //四大建议保存
                                    $.ajax({
                                        url: t.XHRList.savePreviewSuggest,
                                        type: 'POST',
                                        dataType: 'json',
                                        timeout: 10000,
                                        data: {
                                            paramJson: $.toJSON({
                                                caseId:localStorage.getItem('caseId'),
                                                patientId:localStorage.getItem('patientId'),
                                                customerId:localStorage.getItem('userId'),
                                                recoveryAdviceList:JSON.stringify(t.config.recoveryAdviceList),
                                                diagnosisId:diagnosisId,
                                                type:1
                                            })
                                        },
                                        success:function(){
                                            console.log("四大建议保存成功");
                                            //发送IM
                                            $(that).removeAttr("disabled");
                                            var recoveryAdviceList = [];
                                            var nowTime = new Date(),
                                                createTime = (nowTime.getFullYear()+'.'+(nowTime.getMonth()+1<10?"0"+(nowTime.getMonth()+1):nowTime.getMonth()+1)+'.'+(nowTime.getDate()<10?"0"+nowTime.getDate():nowTime.getDate())).replace(/-/g,".")
                                            recoveryAdviceList.push({
                                                "illnessName":ss.sendData.illnessName?ss.sendData.illnessName:"暂不确定",
                                                "customerId":localStorage.getItem("userId"),
                                                "caseId":localStorage.getItem("caseId"),
                                                "patientName":$(".messageList-targetName span").text(),
                                                "createTime":createTime,
                                                "diagnosisId":diagnosisId
                                            });
                                            mc.messageCommunication.sendPreviewSuggestion(recoveryAdviceList);
                                            var caseMajorName = (ss.sendData.majorName=="暂不确定"?"":ss.sendData.majorName),
                                                caseIllnessName = (ss.sendData.illnessName=="暂不确定"?"":ss.sendData.illnessName),
                                                caseOperationName = (ss.sendData.operationName=="暂不确定"?"":ss.sendData.operationName);
                                            $(".userlist-mainList-item.active").find(".category").text(caseMajorName+' '+caseIllnessName+' '+caseOperationName);

                                            $(".check-suggestion,.config-suggestion").removeClass("on");
                                            $(".check-suggestion,.config-suggestion").on("transitionend WebkitTransitionEnd",function () {
                                                $(".check-suggestion").remove();
                                                $(".config-suggestion").remove();
                                                $(".search-suggestion").remove();
                                            });
                                            preview.previewSended();
                                        },
                                        error:function(){
                                            console.log("四大建议保存失败");
                                        }
                                    })
                                },
                                error:function(){
                                    console.log("推荐医生保存失败");
                                }
                            })
                        } else {
                            console.log("初步诊断保存失败");
                        }
                    });
                }
            })
        },
        //预览初诊建议
	    previewSuggestionContent: function(){
		    var t =this;
		    $(".ev-preview-suggestion").on("click", function () {
                if(!$(this).hasClass("forbid")){
                    preview.init({
                        data: t.config.storeDoctorMessage
                    });
                    t.savePreviewSuggestion();
                }
		    })
	    },
        //筛选和搜索推荐医生
        filterAndSearchDocDate:function(opt){
            var t = this;
            var data = {
                isValid: 1,
                firstResult: 0,
                maxResult: 20,
                illnessId: ss.sendData.illnessId,
                areasExpertise : ss.sendData.majorId + "_" + (ss.sendData.majorName.indexOf("手外-") == -1?ss.sendData.majorName:ss.sendData.majorName.substring(3)),
                patientId: ss.sendData.patientId,
                searchParam:opt.searchParam,
                searchAreasExpertise:opt.searchAreasExpertise + (opt.searchMajorName == "全部"?"":"_"+(opt.searchMajorName.indexOf("手外-") == -1?opt.searchMajorName:opt.searchMajorName.substring(3))),
                isMatch: 0,
                logoUseFlag:3
            };
            //筛选和搜索后分页
            fsPageClick = function(pageclickednumber){
                data.firstResult = (pageclickednumber - 1) * data.maxResult;//加载第几页；
                //全部医生
                $.ajax({
                        url: t.XHRList.filterSearchDocMessage,
                        type: 'POST',
                        dataType: 'json',
                        async:false,
                        beforeSend: function () {
                            common.loading.show();
                        },
                        timeout: 10000,
                        data: {
                            paramJson: $.toJSON(data)
                        }
                    })
                    .done(function (data) {
                        if (data.responseObject.responseData.dataList&&data.responseObject.responseData.dataList.length>0) {
                            $('.config-suggestion .check-suggestion-inner').scrollTop(0);
                            //全部按钮置空
                            $("button.check-suggestion-select").removeClass("active");

                            var items = data.responseObject.responseData.dataList,
                                docListHtml = '';
                            $.each(items,function(index,element){
                                docListHtml += ss.templateList.matchDoctor(element);
                            });
                            $(".doctor-message.doctor-message-all .doctor-message-page-box").html(docListHtml);

                            //判断是否有重复医生
                            t.isChosenTheDoc(".doctor-message-page-box .doctor-message-item");
                            //分页
                            var totalCount = data.responseObject.responseData.totalCount;
                            var pagecount = Math.ceil(totalCount / 20);//总页数
                            $(".pager").pager({
                                pagenumber: pageclickednumber,
                                pagecount: pagecount,
                                buttonClickCallback: fsPageClick
                            });
                        }
                        common.loading.hide();
                    })
            };

            $.ajax({
                url: t.XHRList.filterSearchDocMessage,
                type:"POST",
                dataType:"json",
                async:false,
                timeout:10000,
                data:{
                    paramJson: $.toJSON(data)
                },
                beforeSend: function () {
                    common.loading.show();
                },
                success:function(data){
                    if(data.responseObject.responseData.dataList&&data.responseObject.responseData.dataList.length>0){
                        console.log("筛选医生成功");
                        //清除分页器
                        $(".page-container").remove();

                        //dom渲染
                        var items = data.responseObject.responseData.dataList,
                            totalCount = data.responseObject.responseData.totalCount,
                            docListHtml = '';
                        $.each(items,function(index,element){
                            docListHtml += ss.templateList.matchDoctor(element);
                        });
                        $(".doctor-message.doctor-message-all .doctor-message-page-box").html(docListHtml);
                        //判断是否有重复医生
                        t.isChosenTheDoc(".doctor-message-page-box .doctor-message-item");

                        //加载分页器
                        if(totalCount>20){
                            $(".doctor-message.doctor-message-all").append('<div class="page-container"><div class="pagination pager"></div></div>');
                            var pagecount = Math.ceil(totalCount / 20);//总页数
                            if(pagecount>1){
                                $(".pager").pager({
                                    pagenumber: 1,
                                    pagecount: pagecount,
                                    buttonClickCallback: fsPageClick
                                });
                            }
                        }
                    }else{
                        $(".page-container").remove();
                        $("button.check-suggestion-select").hide();
                        $(".doctor-message.doctor-message-all .doctor-message-page-box").html('<p class="no-mate-doc">没有找到相应的结果</p>');
                    }
                    common.loading.hide();
                },
                error:function(){
                    console.log("获取数据失败")
                }
            })
        },
        //筛选和搜索推荐医生
        filterAndSearchDocController:function(){
            var t = this;
            //筛选医生
            $(".config-suggestion").on("click",".doc-filter-box li",function(){
                $(".doc-search").val("");
                $(".doc-search,.doc-search-btn").removeClass("on");
                $(this).addClass("on").siblings("li").removeClass("on");
                var docMajorId = $(this).attr("data-majorid");
                var searchMajorName = $(this).text();
                t.filterAndSearchDocDate({
                    searchParam:"",
                    searchAreasExpertise:docMajorId,
                    searchMajorName:searchMajorName
                })
            });
            //搜索医生
            $(".doc-search").on("input",function(){
                if($(this).val().length>0){
                    $(this).addClass("on");
                    $(".doc-search-btn").addClass("on");
                }else{
                    $(this).removeClass("on");
                    $(".doc-search-btn").removeClass("on");
                }
            });
            $(".doc-search-btn").on("click",function(){
                var docGoodIll = $(".doc-search").val();
                if($(".doc-search").val().length>0){
                    t.filterAndSearchDocDate({
                        searchParam:docGoodIll,
                        searchAreasExpertise:$(".doc-filter-box li.on").attr("data-majorid"),
                        searchMajorName:$(".doc-filter-box li.on").text()
                    })
                    //高亮搜索关键字
                    var reg=new RegExp("("+docGoodIll+")","g");
                    $(".doctor-message-goodAt").each(function(index,element){
                        var text = $(element).text().replace(reg,"<span class='high-light-search-text'>"+docGoodIll+"</span>");
                        $(element).html(text);
                    })
                }else{
                    $(".allDocTab").click();
                }
            });
        },
        //enterSearchList: function (ele, sInner, rInner, XHR) {
        //    var that = this;
        //    $(ele).on("keyup", function (e) {
        //        // 无键入值,且未执行搜索时恢复列表显示...
        //
        //        if ($(this).val().length === 0) {
        //            sInner.show();
        //            rInner.hide().children().remove();
        //        }
        //
        //
        //        // 键入回车时搜索...
        //         if (e.keyCode === 13) {
        //           //  this.dataInit("check-suggestion-Result",that.XHRList.searchCheck); //检查建议
        //        //     $.ajax({
        //        //         url: XHR,
        //        //         type: 'POST',
        //        //         dataType: 'json',
        //        //         timeout: 10000,
        //        //         data: {
        //        //             paramJson: $.toJSON(data)
        //        //         }
        //        //     }).done(function (data) {
        //        //         console.log(data);
        //        //         if (data.responseObject.responseData) {
        //        //             var dataList = data.responseObject.responseData;
        //        //             if (dataList && dataList.length === 0) {
        //        //                 $(dataList).each(function (index, element) {
        //        //                     inner.append(that.template.searchList(element))
        //        //                 });
        //        //             }
        //        //         }
        //        //     })
        //         }
        //    })
        //},


        //匹配和全部Tab切换
        mateAllTabs:function(){
            var t = this;
            $(".mate-and-all li").on("click",function(){
                var i = $(this).index();
                $(this).addClass("on").siblings().removeClass("on");
                $(".doctor-message-box .doctor-message").eq(i).addClass("show").siblings().removeClass("show");
                //全部按钮的显示隐藏
                if(i==1){
                    $(".doc-filter-search-box").removeClass("hide");
                    if($(".doctor-message-all .doctor-message-item").length>0){
                        $("button.check-suggestion-select").show();
                        $(".doctor-message-all .doctor-message-item").removeClass("active");
                        t.isChosenTheDoc(".doctor-message-all .doctor-message-item");
                    }else{
                        $("button.check-suggestion-select").hide();
                    }
                }else{
                    $(".doc-filter-search-box").addClass("hide");
                    if($(".doctor-message-mate .doctor-message-item").length>0){
                        $("button.check-suggestion-select").show();
                        $(".doctor-message-mate .doctor-message-item").removeClass("active");
                        t.isChosenTheDoc(".doctor-message-mate .doctor-message-item");
                    }else{
                        $("button.check-suggestion-select").hide();
                    }
                }
                //$(".check-suggestion-select,.doctor-message-item").removeClass("active");
            })
        },

        //点亮预览与发送，点亮全部
        lightPreSend:function(){
            if($(".doctor-message-item.active").length>0 || $(".select-element.active").length>0){
                $(".ev-preview-suggestion").removeClass("forbid icon-suggestion-preview-gray").addClass("icon-suggestion-preview");
                $(".ev-send-suggestion").removeClass("forbid");
            }else{
                $(".ev-preview-suggestion").addClass("forbid icon-suggestion-preview-gray").removeClass("icon-suggestion-preview");
                $(".ev-send-suggestion").addClass("forbid");
            }
            //点亮全部
            if($(".doctor-message-mate.show").length>0){
                if($(".doctor-message-mate .doctor-message-item.active").length>0&&($(".doctor-message-mate .doctor-message-item").length == $(".doctor-message-mate .doctor-message-item.active").length)){
                    $("button.check-suggestion-select").addClass("active");
                }else{
                    $("button.check-suggestion-select").removeClass("active");
                }
            }else if($(".doctor-message-all.show").length>0){
                if($(".doctor-message-all .doctor-message-item.active").length>0&&($(".doctor-message-all .doctor-message-item").length == $(".doctor-message-all .doctor-message-item.active").length)){
                    $("button.check-suggestion-select").addClass("active");
                }else{
                    $("button.check-suggestion-select").removeClass("active");
                }
            }
        },

        //验证是否已选中该医生
        isChosenTheDoc:function(controller){
            var t = this;
            var docArray = t.config.storeDoctorMessage;
            $(controller).each(function(index,element){
                var docId = $(element).attr("data-docid");
                $.each(docArray,function(key,value){
                    if(value.customerId == docId){
                        $(element).addClass("active");
                        return false;
                    }
                })
            })
            t.lightPreSend();
        }
    };
	return container;
});

