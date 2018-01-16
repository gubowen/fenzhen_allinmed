/**
 * @Desc：搜索建议
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by gubowen on 2017/3/2
 */
define(["jquery", 'toJSON', 'common', 'require'], function ($, toJSON, common, require) {
    var searchSuggestion = {
        init: function () {
            var _this = this;
            _this.getData("#part-selector");
        },
        dataInfo: {
            majorId: "",
            partPlaceId: "",
            illnessId: "",
            operationId: "",
            degreeType: ""
        },

        sendData: {},
        XHRList: {
            majorData: "/call/comm/data/tag/v1/getMapList/",
            sicknessData: "/call/comm/data/illness/v1/getMapList/",
            operation: "/call/cms/major/operation/relation/v1/getMapList/",
            matchCustomerList: "/call/customer/auth/v1/getMatchCustomerList/" //推荐医师
        },
        templateUrl: function () {
        },
        templateList: {
            matchDoctor: function (data) {
                return "<section class='doctor-message-item icon-select-big' data-isTop='" + data.isTop + "' data-isNearest='" + data.isNearest + "' data-docId='" + data.customerId + "' data-all='" + JSON.stringify(data) + "'>" +
                    '                                <figure class="doctor-message-img">' +
                    '                                    <img src="' + (data.logoUrl ? data.logoUrl : "/image/img00/common/default_logo@3x.png") + '" alt="">' +
                    '                                </figure>' +
                    '                                <figcaption class="doctor-message-content">' +
                    '                                    <header class="doctor-message-content-head">' +
                    '                                        <h4>' + data.fullName + '</h4>' +
                    '                                        <p class="rate">匹配度' + data.suitability + '%</p>' +
                    '                                        <span class="netstat ' + (parseInt(data.adviceStatus) === 1 ? '' : 'rest') + '">' + (parseInt(data.adviceStatus) === 1 ? '在线' : '休息') + '</span>' +
                    '                                        <figure class="doctor-message-tags">' +
                    (parseInt(data.isTop) === 1 ? '<span class="tags">全国TOP10骨科医院</span>' : '') +
                    (parseInt(data.isNearest) === 1 ? '<span class="tags">距离最近</span>' : '') +
                    (parseInt(data.isFreeTimes) !== 0 ? '<span class="tags" style="background: #FFF1D4;color: #EB9E00;">首次问诊免费</span>' : '') +
                    '                                        </figure>' +
                    '                                    </header>' +
                    '                                    <article class="doctor-message-hospital">' +
                    '                                <span class="hos-ddress">' +
                    (data.province ? (data.province + '&nbsp') : "") + (data.city ? (data.city + '&nbsp') : "") + (data.district ? data.district : "") +
                    '                                </span>' +
                    '                                <span class="hospital">' +
                    (data.company ? data.company : "") +
                    '                                </span>' +
                    '                                <span class="medical">' +
                    data.medicalTitle +
                    '                                </span>' +
                    '                                    </article>' +
                    '                                    <article class="doctor-message-goodAt">' +
                    '                                        擅长：' + data.illnessNameList +
                    '                                    </article>' +
                    '                                    <article class="doctor-message-num">' +
                    '                                        <span class="price"><em>¥' + data.generalPrice + '</em>/' + data.generalTimes + '次起</span>' +
                    '                                        <span class="lastNum">仅剩<em>' + data.adviceNum + '</em>个名额</span>' +
                    '                                    </article>' +
                    '                                </figcaption>' +
                    '                            </section>';
            }
        },
        getData: function (target) {
            var _this = this;
            var data = {
                isValid: 1,	                        //string	是		1
                firstResult: 0,	                    //string	是	分页参数
                maxResult: 999,	                    //string	是	分页参数
                treeLevel: "2"
            };
            $.ajax({
                url: _this.XHRList.majorData,
                type: 'POST',
                dataType: 'json',
                async: false,
                timeout: 10000,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                //  debugger;
                console.log(data);
                if (data.responseObject.responseData.data_list) {

                    var dataList = data.responseObject.responseData.data_list;
                    console.log(dataList);
                    if (dataList.length > 0) {
                        var html = '<div class="custom-selector-second firstList">',
                            //搜索医生专业列表
                            docMajorHtml = '<li class="on allDocTab" data-majorId="">全部</li>';
                        var childrenHtml = "";
                        $(dataList).each(function (index, element) {
                            //  if (element.children.length > 0) {
                            //       html += '  <li class="custom-selector-item secondListTitle search-icon-rightArrow" data-down-role="' + element.majorId + '"><span>' + element.majorName + '</span></li>';
                            //       childrenHtml += '<div class="custom-selector-second custom-selector-second-list secondList" data-down-role="' + element.majorId + '">';
                            //       $(element.children).each(function (key, value) {
                            //           childrenHtml += '<li class="custom-selector-item result-item" data-value="' + value.majorId + '"><span>' + value.majorName + '</span></li>'
                            //       });
                            //       childrenHtml += '</div>';
                            //  } else {
                            if (element.platformId == 2) {
                                html += '  <li class="custom-selector-item result-item" data-value="' + element.id + '" ><span>' + "手外-" + element.tagName + '</span></li>';
                                //搜索医生专业列表
                                docMajorHtml += '<li data-majorId="' + element.id + '">' + "手外-" + element.tagName + '</li>';
                            } else {
                                html += '  <li class="custom-selector-item result-item" data-value="' + element.id + '" ><span>' + element.tagName + '</span></li>';
                                //搜索医生专业列表
                                docMajorHtml += '<li data-majorId="' + element.id + '">' + element.tagName + '</li>';
                            }
                            // }

                        });
                        html += "</div>";
                        $('.firstListTitle', target).val("专科").attr("data-select-result", " ");
                        $('.search-selector-second-box', target).html(html + childrenHtml);
                        //搜索医生专业列表
                        $(".doc-filter-box").html(docMajorHtml);
                        _this.viewMore();
                    } else {
                        console.log("无数据");
                        $('.search-selector-second-box', target).html();
                        $('.firstListTitle', target).text("不限").attr("data-select-result", " ");
                    }
                }
            });
        },
        saveData: function () {            //初诊建议-保存诊断结果
            var _this = this;
            var degreeType = "";
            var degreeTypeTarget = $(".firstListTitle", "#progress-selector").attr("data-select-result");

            if (degreeTypeTarget == "暂不需手术") {
                degreeType = 0;
            } else if (degreeTypeTarget == "需手术") {
                degreeType = 1;
            } else if (degreeTypeTarget == "急需手术") {
                degreeType = 2;
            }


            var majorNameValue = $(".firstListTitle", "#part-selector").val();
            var majorName = '';
            if ($(".firstListTitle", "#part-selector").val().substring(0, 3) == "手外-") {
                majorName = $(".firstListTitle", "#part-selector").val().substring(3, majorNameValue.length);
            } else {
                majorName = $(".firstListTitle", "#part-selector").val();
            };

            var data = {
                customerId: localStorage.getItem('userId'),                          //string	是	医生id
                caseId: localStorage.getItem('caseId'),                              //	string	是	病例id
                patientId: localStorage.getItem('patientId'),	                     //	string	是	患者id
                diagnosisType: "1",	                                                 //	string	是	1-初诊
                majorId: _this.dataInfo.majorId,                                 //	string	是	部位id
                majorName: majorName,	             //	string	是	部位名称
                illnessId: _this.dataInfo.illnessId,	                             //	string	是	疾病id
                illnessName: $(".firstListTitle", "#sick-selector").attr("data-select-result"),	         //	string	是	疾病名称
                operationId: _this.dataInfo.operationId,	                         //	string	是	手术id
                operationName: $(".firstListTitle", "#operation-selector").val(),	 //	string	是	手术名称
                degreeType: degreeType,                                              //  string	是	1-暂不确定，2-一级，3-二级，4-三级，5-四级，6-五级
                positionId: _this.dataInfo.partPlaceId,
                // positionName: $(".firstListTitle", "#direction-selector").val()
                positionName: ""
            };
            _this.sendData = data;
            setTimeout(function () {
                $(".main-masker.config-suggestion").show();
                $(".main-masker.config-suggestion").addClass("on");
                $(".search-suggestion").hide();
                $(".search-suggestion").removeClass("on");
            });
        },
        sickness: function () {
            var _this = this;
            var html = "";
            var data = {
                isValid: 1,	                //string	是		1
                firstResult: 0,	            //string	是	分页参数
                maxResult: 999,	            //string	是	分页参数
                illnessName: "",	        //string	否	疾病名称（搜索用）
                isSolr: 1
            };
            $.ajax({
                url: _this.XHRList.sicknessData,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {

                if (data.responseObject.responseData.dataList) {
                    var dataList = data.responseObject.responseData.dataList;

                    if (dataList.length > 0) {
                        html += '<div class="custom-selector-second firstList">';
                        html += '<li class="custom-selector-item result-item" data-value="0"><span>暂不确定</span></li>';
                        $(dataList).each(function (index, element) {
                            html += '<li class="custom-selector-item result-item" data-value="' + element.illnessId + '"><span>' + element.illnessName + '</span></li>';
                        });
                        html += "</div>";
                        $('.search-selector-second-box', '#sick-selector').html(html);
                    }
                }
            });
        },
        operationData: function (parentId, operationName) {
            // debugger;
            parentId = parentId ? parentId : "";
            operationName = operationName ? operationName : "";
            var _this = this;
            var html = "";
            var childrenHtml = "";
            var data = {
                isValid: 1,	                //string	是		1
                firstResult: 0,	            //string	是	分页参数
                treeLevel: 1,
                maxResult: 999,	            //string	是	分页参数
                majorId: parentId,          //string	否	专业ID
                operationName: operationName //string	是	手术名称
            };
            $.ajax({
                url: _this.XHRList.operation,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON(data)
                }
            }).done(function (data) {
                // debugger;
                if (data.responseObject.responseData.dataList) {
                    var dataList = data.responseObject.responseData.dataList;
                    if (dataList.length > 0) {
                        html += '<div class="custom-selector-second firstList">';
                        html += '<li class="custom-selector-item result-item" data-value="0"><span>暂不确定</span></li>';
                        $(dataList).each(function (index, element) {
                            if (element.children.length > 0) {
                                html += '  <li class="custom-selector-item secondListTitle search-icon-rightArrow" data-down-role="' + element.operationId + '"><span>' + element.operationName + '</span></li>';
                                childrenHtml += '<div class="custom-selector-second custom-selector-second-list secondList" data-down-role="' + element.operationId + '">';
                                $(element.children).each(function (key, value) {
                                    childrenHtml += '<li class="custom-selector-item result-item" data-value="' + value.operationId + '"><span>' + value.operationName + '</span></li>'
                                });
                                childrenHtml += '</div>';
                            } else {
                                html += '<li class="custom-selector-item result-item" data-value="' + element.operationId + '"><span>' + element.operationName + '</span></li>';
                            }
                        });
                        html += "</div>";
                        $('.search-selector-second-box', '#operation-selector').html(html + childrenHtml);
                    }
                } else {
                    html += '<div class="custom-selector-second firstList">';
                    html += '<li class="custom-selector-item result-item" data-value="0"><span>暂不确定</span></li>';
                    html += "</div>";
                    $('.search-selector-second-box', '#operation-selector').html(html);
                }
            }).fail(function (error) {
                console.log("请求失败=" + error);
            })
        },
        controller: function () {
            var partFlag, sickFlag, progressFlag, operationFlag;
            var _this = this;
            //专业--下拉控制
            $("#part-selector").downSelector({
                list: [{
                    titleName: "firstListTitle",
                    listName: "firstList"
                },
                    {
                        titleName: "secondListTitle",
                        listName: "secondList"
                    },
                    {
                        titleName: "thirdListTitle",
                        listName: "thirdList"
                    }],
                url: _this.XHRList.majorData,
                resultCallback: function (e) {
                    partFlag = true;
                    if (partFlag == true && sickFlag == true && progressFlag == true && operationFlag == true) {
                        $(".search-next", ".search-suggestion-footer").removeClass("disable");
                    }
                    $("input", "#direction-selector").removeClass("disable").attr("disabled", false);
                    $("input", "#sick-selector").removeClass("disable").attr("disabled", false);
                    $("input", "#progress-selector").removeClass("disable").attr("disabled", false);

                    var dataValue = e.attr("data-value");
                    var dataText = e.text();
                    _this.dataInfo.majorId = dataValue;

                    //  _this.getData(dataValue, dataText, "#direction-selector");
                    _this.sickness();                                           //获取疾病数据
                    _this.operationData(dataValue);                             //获取手术建议

                    //部位--已废除
                    $("#direction-selector").downSelector({
                        list: [{
                            titleName: "firstListTitle",
                            listName: "firstList"
                        },
                            {
                                titleName: "secondListTitle",
                                listName: "secondList"
                            }]
                        ,
                        resultCallback: function (e) {
                            _this.dataInfo.partPlaceId = e.attr("data-value");
                        }
                    });
                    //疾病
                    $("#sick-selector").downSelector({
                        list: [{
                            titleName: "firstListTitle",
                            listName: "firstList"
                        },
                            {
                                titleName: "secondListTitle",
                                listName: "secondList"
                            },
                            {
                                titleName: "thirdListTitle",
                                listName: "thirdList"
                            }]
                        ,
                        resultCallback: function (e) {
                            var illnessId = e.attr("data-value");
                            _this.dataInfo.illnessId = illnessId;

                            sickFlag = true;
                            console.log(partFlag);
                            console.log(sickFlag);
                            console.log(progressFlag);

                            if (progressFlag) {
                                if ($("#progress-selector .firstListTitle").val() == '暂不需手术') {
                                    operationFlag = true;
                                }
                            }

                            if (partFlag == true && sickFlag == true && progressFlag == true && operationFlag == true) {
                                $(".search-next", ".search-suggestion-footer").removeClass("disable");
                            }
                            //程度
                            $("#progress-selector").downSelector({
                                list: [{
                                    titleName: "firstListTitle",
                                    listName: "firstList"
                                },
                                    {
                                        titleName: "secondListTitle",
                                        listName: "secondList"
                                    },
                                    {
                                        titleName: "thirdListTitle",
                                        listName: "thirdList"
                                    }],
                                resultCallback: function (e) {

                                    progressFlag = true;

                                    if ($("input", "#progress-selector").val() == "需手术" || $("input", "#progress-selector").val() == "急需手术") {
                                        $("input", "#operation-selector").removeClass("disable").attr("disabled", false);
                                        $(".search-next", ".search-suggestion-footer").addClass("disable");

                                        $("#operation-selector").downSelector({
                                            list: [{
                                                titleName: "firstListTitle",
                                                listName: "firstList"
                                            },
                                                {
                                                    titleName: "secondListTitle",
                                                    listName: "secondList"
                                                }, {
                                                    titleName: "thirdListTitle",
                                                    listName: "thirdList"
                                                }, {
                                                    titleName: "fourListTitle",
                                                    listName: "fourList"
                                                }],
                                            resultCallback: function () {
                                                var operationId = e.attr("data-value");
                                                _this.dataInfo.operationId = operationId;
                                                operationFlag = true;
                                                if (partFlag == true && sickFlag == true && progressFlag == true && operationFlag == true) {
                                                    $(".search-next", ".search-suggestion-footer").removeClass("disable");
                                                }
                                            }
                                        });
                                    } else if ($("input", "#progress-selector").val() == "暂不需手术") {
                                        $("input", "#operation-selector").addClass("disable").attr("disabled", true).val("");
                                        $("#operation-selector").downSelector();
                                        if (partFlag == true && sickFlag == true && progressFlag == true) {
                                            $(".search-next", ".search-suggestion-footer").removeClass("disable");
                                        }
                                    }
                                }
                            });
                        },
                        searchCallBack: function () {

                            $(".custom-selector-title", "#sick-selector").off().keyup(function (ev) {
                                console.log(ev.keyCode);
                                var __this = this;
                                if (ev.keCode == 37 || ev.keyCode == 38 || ev.keyCode == 39 || ev.keyCode == 40) {
                                    return false;
                                }
                                var text = $(this).val();
                                var html = "";
                                var flag = false;
                                clearTimeout(_this.time);
                                _this.time = setInterval(function () {
                                    if (text == "") {
                                        console.log("1111");
                                        sickFlag = false;
                                    } else {
                                        console.log("2222");
                                        sickFlag = true;
                                    }
                                    if (partFlag == true && sickFlag == true && progressFlag == true && operationFlag == true) {
                                        $(".search-next", ".search-suggestion-footer").removeClass("disable");
                                    } else {
                                        $(".search-next", ".search-suggestion-footer").addClass("disable");
                                    }
                                    if (flag) {
                                        var data = {
                                            isValid: 1,	                //string	是		1
                                            firstResult: 0,	            //string	是	分页参数
                                            maxResult: 999,	            //string	是	分页参数
                                            illnessName: "",	        //string	否	疾病名称（搜索用）
                                            searchParam: text,
                                            isSolr: 1
                                        };
                                        $.ajax({
                                            url: _this.XHRList.sicknessData,
                                            type: 'POST',
                                            dataType: 'json',
                                            timeout: 10000,
                                            async: false,
                                            data: {
                                                paramJson: $.toJSON(data)
                                            }
                                        }).done(function (data) {
                                            if (typeof (data.responseObject.responseData.dataList) != "undefined") {
                                                var dataList = data.responseObject.responseData.dataList;

                                                if (dataList.length > 0) {
                                                    html += '<div class="custom-selector-second firstList">';
                                                    html += '<li class="custom-selector-item result-item" data-value="0"><span>暂不确定</span></li>';
                                                    $(dataList).each(function (index, element) {
                                                        html += '<li class="custom-selector-item result-item" data-value="' + element.illnessId + '"><span>' + element.illnessName + '</span></li>';
                                                    });
                                                    html += "</div>";
                                                    // $('.search-selector-second-box', '#sick-selector').html(html);
                                                    $(__this).parent().find('.search-selector-second-box').html(html);
                                                    $(__this).parent().find(".firstList").css("display", "inline-block");
                                                }
                                            } else {
                                                html += '<div class="custom-selector-second firstList">';
                                                html += '<li class="custom-selector-item no-data" data-value="0"><span>没有找到相应的结果</span></li>';
                                                html += "</div>";
                                                $(__this).parent().find('.search-selector-second-box').html(html);
                                                $(__this).parent().find(".firstList").css("display", "inline-block");

                                            }
                                        });
                                        clearTimeout(_this.time);
                                    }
                                    flag = true;
                                }, 300);
                            })

                        }
                    });

                }
            });

            var time;
            $(".search-next").on("click", function () {
                var __this = this;
                clearTimeout(time);
                time = setTimeout(function () {
                    if (!$(__this).hasClass("disable")) {
                        common.loading.show();
                        _this.saveData();
                        _this.getMatchCustomer();
                        _this.allDocCustomer();
                    }
                }, 500)

            });

        },
        getMatchCustomer: function () {
            var that = this;
            //匹配医生
            $.ajax({
                url: that.XHRList.matchCustomerList,
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {
                    common.loading.show();
                },
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        isMatch: "1",
                        isValid: "1",
                        customerId: localStorage.getItem('userId'),
                        firstResult: 0,
                        maxResult: 9999,
                        degreeType: that.sendData.degreeType,
                        illnessId: that.sendData.illnessId,
                        areasExpertise: that.sendData.majorId,
                        patientId: that.sendData.patientId,
                        logoUseFlag: 3,// fullNameLike:""
                    })
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        var mateDocHtml = '';
                        $(".no-mate-doc").remove();
                        if (dataList && dataList.length > 0) {
                            $("button.check-suggestion-select").show();
                            $(dataList).each(function (index, element) {
                                mateDocHtml += that.templateList.matchDoctor(element);
                            });
                            $(".doctor-message.doctor-message-mate").html(mateDocHtml)
                        } else {
                            $("button.check-suggestion-select").hide();
                            $(".doctor-message.doctor-message-mate").html('<p class="no-mate-doc">未找到最匹配医生,请切换至全部医生进行选择</p>');
                        }
                        $(".mate-and-all li").first().click();
                        $(".doc-filter-box li").first().addClass("on").siblings().removeClass("on");
                    }
                    common.loading.hide();
                });
        },
        allDocCustomer: function () {
            var that = this;
            //全部医生首页
            var data = {
                isMatch: "0",
                isValid: "1",
                firstResult: 0,
                maxResult: 20,
                illnessId: that.sendData.illnessId,
                areasExpertise: that.sendData.majorId + "_" + that.sendData.majorName,
                patientId: that.sendData.patientId,
                logoUseFlag: 3,
                searchParam: "",
                searchAreasExpertise: "",
                degreeType: that.sendData.degreeType
            };
            //全部医生分页
            PageClick = function (pageclickednumber) {
                data.firstResult = (pageclickednumber - 1) * data.maxResult;//加载第几页；
                //全部医生
                $.ajax({
                    url: that.XHRList.matchCustomerList,
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
                        if (data.responseObject.responseData) {
                            $('.config-suggestion .check-suggestion-inner').scrollTop(0);
                            $("button.check-suggestion-select").removeClass("active");
                            var dataList = data.responseObject.responseData.dataList;
                            var allDocHtml = '';
                            if (dataList && dataList.length > 0) {
                                $(dataList).each(function (index, element) {
                                    allDocHtml += that.templateList.matchDoctor(element);
                                });
                                $(".doctor-message.doctor-message-all .doctor-message-page-box").html(allDocHtml);
                                //判断是否已经选择过该医生
                                var docArray = require("checkSuggestion").config.storeDoctorMessage;
                                $(".doctor-message-page-box .doctor-message-item").each(function (i, e) {
                                    var docId = $(e).attr("data-docid");
                                    $.each(docArray, function (k, v) {
                                        if (v.customerId == docId) {
                                            $(e).addClass("active");
                                            return false;
                                        }
                                    })
                                });
                                var totalCount = data.responseObject.responseData.totalCount;
                                var pagecount = Math.ceil(totalCount / 20);//总页数
                                $(".pager").pager({
                                    pagenumber: pageclickednumber,
                                    pagecount: pagecount,
                                    buttonClickCallback: PageClick
                                });
                            }
                        }
                        common.loading.hide();
                    })
            };
            //dom渲染
            $.ajax({
                url: that.XHRList.matchCustomerList,
                type: 'POST',
                async: false,
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
                    if (data.responseObject.responseData) {
                        $(".page-container").remove();
                        var dataList = data.responseObject.responseData.dataList,
                            totalCount = data.responseObject.responseData.totalCount;
                        var allDocHtml = '';
                        if (dataList && dataList.length > 0) {
                            $(dataList).each(function (index, element) {
                                allDocHtml += that.templateList.matchDoctor(element);
                            });
                            $(".doctor-message.doctor-message-all .doctor-message-page-box").html(allDocHtml);
                            if (totalCount > 20) {
                                $(".doctor-message.doctor-message-all").append('<div class="page-container"><div class="pagination pager"></div></div>');
                                var pagecount = Math.ceil(totalCount / 20);//总页数
                                //初始化首页
                                if (pagecount > 1) {
                                    $(".pager").pager({
                                        pagenumber: 1,
                                        pagecount: pagecount,
                                        buttonClickCallback: PageClick
                                    });
                                }
                            }
                        }
                    }
                    common.loading.hide();
                })
        },
        viewMore: function () {
            var t = this;
            $(".viewMore").on("click", function () {
                $(this).toggleClass("rotate");
                $(".doc-filter-box").toggleClass("quHighly");
            })
        },
    };
    //  searchSuggestion.init();
    return searchSuggestion;
})
;