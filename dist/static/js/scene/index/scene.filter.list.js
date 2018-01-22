/**
 * @Desc：患者筛选项
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/3/23
 */
define(["jquery", 'common', 'downSelector', "text!userListTemplate", "ymd", "toJSON", "userList", "tabView", "require"], function ($, common, downSelector, text, ymd, toJSON, userList, TabsViewChange, require) {
    var container = {
        init: function (param) {
            if ($("#ev-provice-list .secondListTitle").size() === 0) {
                this.getArea({
                    id: "",
                    treeLevel: "2",
                    container: $("#ev-provice-list")
                });
            }
            this.toggleFilterList();
            if ($("#age-selector .custom-selector-second .custom-selector-item").size() === 1) {
                this.createAgeList();//年龄列表生成...
            }
            this.statusChange();//三个状态的点击切换（沟通中、已结束、被退回）
            this.searchPatient();
            this.refreshList();
            this.filterMethod = param || {
                    conType: 0,
                    conState: "",
                }
        },
        XHRList: {
            areaList: "/call/comm/data/baseinfo/v1/getRegionList/"
        },
        templateList: {
            proviceList: function (data) {
                return '<li class="custom-selector-item secondListTitle ' + (parseInt(data.treeLevel) === 3 ? 'result-item' : '') + '" data-down-role="' + data.regionId + '" data-level="' + data.treeLevel + '"><span>' + data.regionName + '</span></li>';
            }
        },
        toggleFilterList: function () {

            var that = this;
            $("#sex-selector").downSelector({
                list: [{
                    titleName: "firstListTitle",
                    listName: "firstList"
                }],
                resultCallback: function (e) {
                    var sex = (e.find("span").text() === "男") ? 1 : 2;
                    if (e.hasClass("recover")) {

                        that.filterMethod = $.extend(false, that.filterMethod, {selectSex: ""});

                        require("userList").getUserList(that.filterMethod, "filter");
                        $("#sex-selector .firstListTitle").text("性别");
                    } else {
                        that.filterMethod = $.extend(false, that.filterMethod, {selectSex: sex});

                        require("userList").getUserList(that.filterMethod, "filter");

                    }
                }
            });

            $("#area-selector").downSelector({
                list: [{
                    titleName: "firstListTitle",
                    listName: "firstList"
                },
                    {
                        titleName: "secondListTitle",
                        listName: "secondList"
                    }],
                resultCallback: function (e) {
                    var selectProvince = $("#ev-provice-list .active").attr("data-down-role"),
                        selectCity = $("#ev-city-list .active").attr("data-down-role");

                    if (e.hasClass("recover")) {
                        if (e.parents(".custom-selector-second").hasClass("firstList")) {
                            that.filterMethod = $.extend(false, that.filterMethod, {
                                selectProvince: "",
                                selectCity: ""
                            })
                            require("userList").getUserList(that.filterMethod, "filter");
                            $("#area-selector .firstListTitle").text("地区");
                        } else if (e.parents(".custom-selector-second").hasClass("secondList")) {
                            that.filterMethod = $.extend(false, that.filterMethod, {selectProvince: selectProvince});
                            require("userList").getUserList(that.filterMethod, "filter");
                            $("#area-selector .firstListTitle").text($("#ev-provice-list .active").text());
                        }
                    } else {
                        that.filterMethod = $.extend(false, that.filterMethod, {
                            selectCity: selectCity
                        })
                        require("userList").getUserList(that.filterMethod, "filter");
                    }
                    $("#area-selector .firstListTitle").text($("#area-selector .firstListTitle").text().length > 3 ? $("#area-selector .firstListTitle").text().substring(0, 3) + "..." : $("#area-selector .firstListTitle").text());
                }
            });
            $("#age-selector").downSelector({
                list: [{
                    titleName: "firstListTitle",
                    listName: "firstList"
                }],
                resultCallback: function (e) {
                    var age = e.find("span").text();
                    var ageList = age.split("-");
                    if(ageList.length ==2){
                        age = ageList[0] + ',' + ageList[1];
                    }else{
                        age ="90,200";
                    }


                    if (e.hasClass("recover")) {
                        $("#age-selector .firstListTitle").text("年龄");
                        that.filterMethod = $.extend(false, that.filterMethod, {selectAge: ""})
                    } else {
                        that.filterMethod = $.extend(false, that.filterMethod, {selectAge: age})
                    }

                    require("userList").getUserList(that.filterMethod, "filter");
                }
            });
            $("#data-selector").downSelector({
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

                    var y = e.attr("data-year"),
                        m = e.attr("data-month"),
                        d = e.text();
                    $("#data-selector .custom-selector-title").text();

                    if (e.hasClass("recover")) {
                        if (e.parents(".custom-selector-second").hasClass("firstList")) {
                            that.filterMethod = $.extend(false, that.filterMethod, {
                                selectDate: ""
                            });
                            require("userList").getUserList(that.filterMethod, "filter");
                            $("#data-selector .custom-selector-title").text("日期");
                        } else if (e.parents(".custom-selector-second").hasClass("secondList")) {
                            that.filterMethod = $.extend(false, that.filterMethod, {
                                selectDate: $("#data-selector .firstList .active").text()
                            })
                            require("userList").getUserList(that.filterMethod, "filter");
                            $("#data-selector .custom-selector-title").text($("#data-selector .firstList .active").text());
                        } else if (e.parents(".custom-selector-second").hasClass("thirdList")) {
                            that.filterMethod = $.extend(false, that.filterMethod, {
                                selectDate: y + "-" + m
                            });
                            require("userList").getUserList(that.filterMethod, "filter");
                            $("#data-selector .custom-selector-title").text(y.substring(2, 4) + "/" + m);

                        }
                    } else {
                        that.filterMethod = $.extend(false, that.filterMethod, {
                            selectDate: y + "-" + m + "-" + d
                        });
                        require("userList").getUserList(that.filterMethod, "filter");
                        $("#data-selector .custom-selector-title").text(y.substring(2, 4) + "/" + m);
                    }
                }
            });
            if ($("#data-selector .firstList [data-down-role='dataSelect']").size() === 0) {
                ymd({
                    year: $("#data-selector .firstList"),
                    month: $("#data-selector .secondList"),
                    day: $("#data-selector .thirdList")
                });
            }


            $("#area-selector .firstListTitle").on("click", function () {
                setTimeout(function () {
                    $("#area-selector .firstList").scrollTop(0);
                }, 10);
            })

            $("#data-selector .firstListTitle").on("click", function () {
                setTimeout(function () {
                    $("#data-selector .firstList").scrollTop(0);
                }, 10);
            })
        },


        //年龄列表生成...
        createAgeList: function () {
            var list = "";
            for (var i = 0; i < 90; i++) {
                if (i % 5 == 0) {
                    if(i==0){
                        list += '<li class="custom-selector-item result-item"><span>' + parseInt(i) + "-" + parseInt(i + 5) + '</span></li>';
                    }else{
                        list += '<li class="custom-selector-item result-item"><span>' + parseInt(i + 1) + "-" + parseInt(i + 5) + '</span></li>';
                    }

                }
            }
            list += '<li class="custom-selector-item result-item"><span>' +i+'以上'+ '</span></li>';
            $("#age-selector .firstList").append(list);

            $("#age-selector .firstListTitle").on("click", function () {
                setTimeout(function () {
                    $("#age-selector .firstList").scrollTop(0);
                }, 10);
            })
        },
        //获取省市区列表
        getArea: function (param) {
            var that = this;
            $.ajax({
                url: this.XHRList.areaList,
                type: 'POST',
                dataType: 'json',
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        parentId: param.id,
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "9999",
                        regionName: "",
                        treeLevel: param.treeLevel
                    })
                },
            })
                .done(function (data) {
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            $(dataList).each(function (index, element) {
                                param.container.append(that.templateList.proviceList(element))
                            })
                        }
                        that.selectArea();
                    }
                })
        },
        selectArea: function () {
            var that = this;
            $(".custom-selector-item").off("click").on("click", function () {
                if (parseInt($(this).attr("data-level")) === 2) {
                    $("#ev-city-list").css("display", "inline-block").children().not(".recover").remove();
                    that.getArea({
                        id: $(this).attr("data-down-role"),
                        treeLevel: "3",
                        container: $("#ev-city-list")
                    });
                } else if (parseInt($(this).attr("data-level")) === 3) {
                    $("#ev-city-list").hide();
                    $("#area-selector .firstListTitle").attr("data-id", $(this).attr("data-down-role"))
                }
            })
        },
        //三个状态的点击切换（沟通中、已结束、被退回）
        statusChange: function () {
            new TabsViewChange({
                tabsInner: $(".userlist-status-box.tabsInner"),
                views: $(".userList-inner-content.viewInner"),
                changeCallback: function () {
                    $(".center-inner").addClass("no-content");
                    $(".userList-inner-content").find(".active").removeClass("active");

                    if ($(".userlist-status-item.active").attr("data-role") === "ut-tabs-2") {
                        $(".user-controller").addClass("disabled");
                        $(".user-controller-input").attr("readonly", "readonly")
                    } else {
                        $(".user-controller").removeClass("disabled");
                        $(".user-controller-input").removeAttr("readonly")
                    }

                    if ($(".userlist-status-item.active").attr("data-role") === "ut-tabs-1") {
                        if ($(".userlist-mainList[data-role='ut-tabs-1'] .active").size() === 1) {
                            $(".center-inner").removeClass("no-content");
                        }
                    }
                },
                role: "ut-tabs"
            });
        },
        //患者搜索...
        searchPatient: function () {
            var that = this;
            $(".main-search").on("keyup", function (e) {
                if ($(this).val().length !== 0) {
                    clearTimeout(this.time);
                    var _C = $(this).val();
                    this.time = setTimeout(function () {
                        if (e.keyCode == 13) {
                            that.filterMethod = $.extend(false, that.filterMethod, {
                                selectName: _C,
                            });
                            require("userList").getUserList(that.filterMethod, "filter");
                            $("#ev-user-inner").addClass("search-result");
                        }
                    }, 300);

                    if ($(this).val().length > 20) {
                        $(this).val($(this).val().substring(0, 20));
                    }
                }
            });
            $(".main-header-search .icon-header-search").off("click").on("click", function () {
                var _C = $(".main-header-search .main-search").val();
                if (_C.length !== 0) {
                    that.filterMethod = $.extend(false, that.filterMethod, {
                        selectName: _C,
                    });
                    require("userList").getUserList(that.filterMethod, "filter");
                    $("#ev-user-inner").addClass("search-result");
                }
            })
        },
        refreshList: function () {
            var that = this;
            $(".refresh-user-list-btn").off("click").on("click", function () {
                require("userList").getUserList(that.filterMethod, "refresh");

                if ($(".userlist-mainList[data-role='ut-tabs-1'] .userlist-mainList-item .userlist-item-img p:visible").size() === 0) {
                    $(".userlist-status-item[data-role='ut-tabs-1']").removeClass("new");
                }
            });
            $(".search-result-tips a").on("click", function () {
                that.filterMethod = {
                    conType: 0,
                    conState: "",
                };
                $("#ev-user-inner").removeClass("search-result");
            })

        }
    };

    return container;
});