/**
 * @Desc：检查检验
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang / wangjingrongon 2017/3/2
 */
define(["text!examineCheckTemplate", "jquery", "tabView", "toJSON", "messageCommunication"], function (ecText, $, TabsViewChange, toJSON, mc) {
    var container = {
        config: {
            recoveryAdviceList: []
        },
        XHRList: {
            getExamineSuggest: "/call/comm/data/check/v1/getMapList/",//检查接口
            getTestSuggest: "/call/comm/data/inspection/v1/getMapList/",//检验接口
            saveExamineTest: "/call/patient/recovery/advice/v1/create/",//保存检查检验
            changeStatus: "/call/customer/patient/case/v1/update/",//改变为待检查状态
            updateCount: "/call/customer/case/consultation/v1/updateFrequency/" //关闭24小时定时
        },
        template: {},
        init: function () {
            var t = this;
            t.templateUrl();
            t.addHtml(t.XHRList.getExamineSuggest, "examineSuggest", "node", 1);
            t.addHtml(t.XHRList.getTestSuggest, "testSuggest", "inspection", 2);
            t.changeInfo();
            t.sendExamineReason();
            //t.searchInfo();
            //t.seeResult();
        },
        templateUrl: function () {
            var t = this;
            $("[data-template='tpl-inner']").append(ecText);
            t.closeWindow();
            t.configTabsChange();
            t.showPreview();
            setTimeout(function () {
                $(".main-masker").addClass("on");
            });
        },
        //dom加载
        addHtml: function (url, target, moudleName, type) {
            var t = this;
            var param = {
                isValid: 1,
                firstResult: 0,
                maxResult: 999
            };
            $.ajax({
                url: url,
                data: {
                    paramJson: $.toJSON(param)
                },
                type: 'post',
                dataType: "json",
                timeout: 5000,
                sendBefore: function () {
                    common.loading.show();
                },
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseData) {
                        var items = data.responseObject.responseData.dataList;
                        var examineSuggestHtml_stair = '';
                        $(items).each(function (index, element) {
                            examineSuggestHtml_stair += '<li>' +
                                '<article data-nodeid="' + element[moudleName + "Id"] + '" class="check-project-item ' + (element.children.length > 0 ? 'icon-downArrow-big' : '') + '"><span>' + element[moudleName + "Name"] + '</span></article>' +
                                function () {
                                    if (element.children.length > 0) {
                                        var examineSuggestHtml_movers = '';
                                        $(element.children).each(function (inde, elemen) {
                                            examineSuggestHtml_movers += '<li>' +
                                                '<article data-nodeid="' + elemen[moudleName + "Id"] + '" class="check-project-item ' + (elemen.children.length > 0 ? 'icon-downArrow' : '') + '"><span>' + elemen[moudleName + "Name"] + '</span></article>' +
                                                function () {
                                                    if (elemen.children.length > 0) {
                                                        var examineSuggestHtml_flyers = '';
                                                        $(elemen.children).each(function (ind, eleme) {
                                                            examineSuggestHtml_flyers += '<li>' +
                                                                '<article data-nodeid="' + eleme[moudleName + "Id"] + '" class="check-project-item isHasOption ' + (eleme.children.length > 0 ? 'icon-downArrow' : '') + '">' +
                                                                '<figcaption class="setting-form-item-input setting-form-item-sex-selector">' +
                                                                '<figure class="setting-form-item-sex icon-select-normal"><i class="icon-choice"></i><span data-id="' + eleme[moudleName + "Id"] + '" data-type="' + type + '">' + eleme[moudleName + "Name"] + '</span></figure>' +
                                                                '</figcaption>' +
                                                                '</article>' +
                                                                function () {
                                                                    if (eleme.children.length > 0) {
                                                                        var examineSuggestHtml_staff = '';
                                                                        $(eleme.children).each(function (i, e) {
                                                                            examineSuggestHtml_staff += '<li>' +
                                                                                '<article data-nodeid="' + e[moudleName + "Id"] + '" class="check-project-item isHasOption">' +
                                                                                '<figcaption class="setting-form-item-input setting-form-item-sex-selector">' +
                                                                                '<figure class="setting-form-item-sex icon-select-normal"><i class="icon-choice"></i><span data-id="' + e[moudleName + "Id"] + '" data-type="' + type + '">' + e[moudleName + "Name"] + '</span></figure>' +
                                                                                '</figcaption>' +
                                                                                '</article>' +
                                                                                '</li>'
                                                                        })
                                                                        return '<section class="check-project-content"><ul>' + examineSuggestHtml_staff + '</ul></section>'
                                                                    } else {
                                                                        return '';
                                                                    }
                                                                }() +
                                                                '</li>'
                                                        })
                                                        return '<section class="check-project-content"><ul>' + examineSuggestHtml_flyers + '</ul></section>'
                                                    } else {
                                                        return '';
                                                    }
                                                }() +
                                                '</li>'
                                        })
                                        return '<section class="check-project-content"><ul>' + examineSuggestHtml_movers + '</ul></section>';
                                    } else {
                                        return '';
                                    }
                                }() +
                                '</li>'
                        })
                        $("." + target + " .check-project ul").html(examineSuggestHtml_stair);
                        common.loading.hide();
                    }
                },
                error: function () {

                }
            });
        },
        //Tab切换
        configTabsChange: function () {
            new TabsViewChange({
                tabsInner: $(".ec-tabs.tabsInner"),
                views: $(".ec-views.viewInner"),
                changeCallback: function () {
                },
            });
        },
        //关闭检查检验
        closeWindow: function () {
            var t = this;
            $(".examine-check .window-close").on("click", function () {
                $(".examine-check").removeClass("on");
                $(".examine-check").on("transitionend", function () {
                    $(this).remove();
                })
            })
        },
        //预览检查检验
        showPreview: function () {
            var t = this;
            $(".examine-check").on("click", ".jump-box-add-term", function () {
                if ($(".icon-choice.active").length > 0) {
                    var html = '';
                    $(".icon-choice.active").each(function (index, element) {
                        html += '<li data-id="' + $(element).siblings("span").data("id") + '" data-type="' + $(element).siblings("span").data("type") + '">' + $(element).siblings("span").text() + '</li>';
                    })
                    $(".examineTestPreview .check-result-info ul").html(html);
                    $(".examineTestPreview").show().siblings(".check-suggestion-box").hide();
                }
            });
            $(".examineTestPreview").on("click", ".btn-cancel", function () {
                $(".examineTestPreview").hide().siblings(".check-suggestion-box").show();
            })
        },
        //选中需检查疾病以及第三列和第四列切换
        changeInfo: function () {
            $(".examine-check").on("click", ".check-project-item", function (e) {
                if ($(this).hasClass("icon-downArrow")) {
                    $(this).removeClass("icon-downArrow").addClass("icon-upArrow");
                    $(this).next().addClass("on");
                } else if ($(this).hasClass("icon-upArrow")) {
                    $(this).removeClass("icon-upArrow").addClass("icon-downArrow");
                    $(this).next().removeClass("on");
                } else if ($(this).hasClass("icon-downArrow-big")) {
                    $(".icon-upArrow-big").removeClass("icon-upArrow-big").addClass("icon-downArrow-big").next().removeClass("on");
                    $(this).removeClass("icon-downArrow-big").addClass("icon-upArrow-big");
                    $(this).next().addClass("on");
                } else if ($(this).hasClass("icon-upArrow-big")) {
                    $(this).removeClass("icon-upArrow-big").addClass("icon-downArrow-big");
                    $(this).next().toggleClass("on");
                }
                e.stopPropagation();
            });

            $(".examine-check").on("click", ".icon-select-normal .icon-choice", function (e) {
                var nextInfo = $(this).parents().next(".check-project-content");
                if (!$(this).parents(".icon-select-normal").hasClass("disable")) {
                    $(this).toggleClass("active");
                }
                if ($(this).hasClass("active") && nextInfo.length > 0) {
                    nextInfo.find(".setting-form-item-sex").addClass("disable");
                    nextInfo.find(".icon-choice").removeClass("active")
                } else {
                    nextInfo.find(".setting-form-item-sex").removeClass("disable");
                }

                console.log($(".check-project ").find(".active"));
                if ($(".check-project ").find(".active").length > 0) {
                    $('.jump-box-add-term').removeClass("forbid");
                } else {
                    $('.jump-box-add-term').addClass("forbid");

                }

                e.stopPropagation();
            })
        },
        //保存检查检验
        sendExamineReason: function () {
            var t = this;
            $(".examine-check").on("click", ".btn-primary-small", function () {
                t.config.recoveryAdviceList = [];
                //检查建议
                if ($(".examineSuggest .icon-choice.active").length > 0) {
                    $(".examineSuggest .icon-choice.active").each(function (index, element) {
                        t.config.recoveryAdviceList.push({
                            adviceType: 1,
                            adviceId: $(element).siblings("span").data("id")
                        })
                    })
                }
                ;
                ///检验建议
                if ($(".testSuggest .icon-choice.active").length > 0) {
                    $(".testSuggest .icon-choice.active").each(function (index, element) {
                        t.config.recoveryAdviceList.push({
                            adviceType: 2,
                            adviceId: $(element).siblings("span").data("id")
                        })
                    })
                }
                ;
                //保存后更改待检查状态，关闭24小时定时
                $.ajax({
                    url: t.XHRList.saveExamineTest,
                    type: 'POST',
                    dataType: 'json',
                    timeout: 10000,
                    data: {
                        paramJson: $.toJSON({
                            caseId: localStorage.getItem('caseId'),
                            patientId: localStorage.getItem('patientId'),
                            customerId: localStorage.getItem('userId'),
                            recoveryAdviceList: JSON.stringify(t.config.recoveryAdviceList),
                            type: 0
                        })
                    },
                    success: function () {
                        console.log("保存检查检验成功");
                        $.ajax({
                            url: t.XHRList.updateCount,
                            type: 'POST',
                            dataType: 'json',
                            timeout: 10000,
                            data: {
                                paramJson: $.toJSON({
                                    consultationId: $(".userlist-mainList[data-role='ut-tabs-1'] .userlist-mainList-item.active").attr("data-consultationid"),
                                    frequency: "-1",
                                    frequencyType: "4"
                                })
                            },
                            success: function () {
                                console.log("关闭24小时定时");
                            }
                        });
                        $.ajax({
                            url: t.XHRList.changeStatus,
                            type: 'POST',
                            dataType: 'json',
                            timeout: 10000,
                            data: {
                                paramJson: $.toJSON({
                                    caseId: localStorage.getItem('caseId'),
                                    state: 3
                                })
                            },
                            success: function () {
                                console.log("更改待检查成功");
                                var recoveryAdviceList = [];

                                $(".examineTestPreview .check-result-info li").each(function (index, element) {
                                    recoveryAdviceList.push({
                                        "adviceType": $(element).data("type"),
                                        "adviceId": $(element).data("id"),
                                        "adviceName": $(element).text()
                                    })
                                });
                                mc.messageCommunication.sendCheckSuggestion(recoveryAdviceList);
                                $(".userlist-mainList-item.active").find(".category").text("待检查");
                                $(".examine-check").removeClass("on");
                                $(".examine-check").on("transitionend WebkitTransitionEnd", function () {
                                    $(".examine-check").remove();
                                });
                            }
                        });
                    },
                    error: function () {
                        console.log("保存检查检验失败");
                    }
                })
            });
        }


        //searchInfo: function () {
        //    var that = this;
        //    $(".search-suggestion").on("blur", function () {
        //        var text = $(this).val();
        //        var target = $(".check-project>section>ul");
        //        //清空列表
        //        target.html(" ");
        //        //返回数据成功ajax
        //        //var infoList = ['双膝关节X片', '单膝关节正侧位', '髋关节正侧位'];
        //
        //        /*显示
        //         *--将数据插入
        //         *--显示数据
        //         * */
        //        var returnInfo = that.getHtml();
        //        target.append(returnInfo);
        //    });
        //},
        //getHtml: function () {
        //    var html = '<li>' +
        //        '<article class="check-project-item icon-upArrow-big">X片</article>' +
        //        '<section class="check-project-content  on">' +
        //        '<ul>' +
        //        '<li>' +
        //        '<article class="check-project-item icon-upArrow">下肢</article>' +
        //        '<section class="check-project-content on">' +
        //        '<ul>' +
        //        '<li>' +
        //        '<article class="check-project-item icon-upArrow">' +
        //        '<figcaption class="setting-form-item-input setting-form-item-sex-selector">' +
        //        '<figure class="setting-form-item-sex icon-select-normal active"></figure>' +
        //        '</figcaption>双膝关节X片</article>' +
        //        '<section class="check-project-content on">' +
        //        '<ul>' +
        //        '<li>' +
        //        '<article class="check-project-item">' +
        //        '<figcaption class="setting-form-item-input setting-form-item-sex-selector">' +
        //        '<figure class="setting-form-item-sex icon-select-normal active"><span>单膝关节正侧位</span></figure>' +
        //        '</figcaption>' +
        //        '</article>' +
        //        '</li>' +
        //        '<li>' +
        //        '<article class="check-project-item">' +
        //        '<figcaption class="setting-form-item-input setting-form-item-sex-selector">' +
        //        '<figure class="setting-form-item-sex icon-select-normal active"><span>髋关节正侧位</span></figure>' +
        //        '</figcaption>' +
        //        '</article>' +
        //        '</li>' +
        //        '<li>' +
        //        '<article class="check-project-item">' +
        //        '<figcaption class="setting-form-item-input setting-form-item-sex-selector">' +
        //        '<span class="setting-form-item-sex icon-select-normal active"><span>髋关节正侧位</span></span>' +
        //        '</figcaption>' +
        //        '</article>' +
        //        '</li>' +
        //        '</ul>' +
        //        '</section>' +
        //        '</li>' +
        //        '</ul>' +
        //
        //        '</section>' +
        //        '</li>' +
        //
        //        '</ul>' +
        //        '</section>' +
        //        '</li>';
        //    return html;
        //},
        //seeResult:function(){
        //        $('.jump-box-add-term').on('click',function(){
        //            $('.check-suggestion-inner').eq(1).addClass("hidden").siblings().removeClass("hidden");
        //        });
        //
        //        $('.btn-cancel').on('click',function(){
        //            $('.check-suggestion-inner').eq(2).addClass("hidden").siblings().removeClass("hidden");
        //        });
        //},
    };
    return container;
});
