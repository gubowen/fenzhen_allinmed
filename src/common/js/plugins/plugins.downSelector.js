/**
 * @name:下拉选择
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/2/15
 * @author: qiangkailiang
 */

define(["jquery"], function ($) {
    var DownSelector = function (element, config) {
        this.element = $(element);
        this.config = $.extend(false, $.fn.downSelector.defaultConfig, config);

        if (!config) {
            this.clickOff()
        } else {
            this.init();
        }
    };

    DownSelector.prototype = {
        init: function () {
            var that = this;
            that.clickEvent();
            that.searchEvent();
        },
        clickEvent: function () {

            var that = this;
            this.element.off().on("click", function (e) {
                if ($(e.target).hasClass("custom-selector-title")) {

                    that.selectorToggle(that, $(e.target));
                }

                //下拉箭头触发事件
                console.log($(e.target));
                if ($(e.target).hasClass("icon-downArrow")) {
                    console.log("111");
                  that.selectorToggle(that, $(e.target).prev());
                }else if($(e.target).hasClass("icon-upArrow")) {   //上拉箭头触发事件
                    console.log("222");
                    that.selectorToggle(that, $(e.target).prev());
                }

                if ($(e.target).parent().hasClass("result-item")) {
                    that.selectItem(that, $(e.target).parent());
                    that.config.resultCallback && that.config.resultCallback($(e.target).parent());
                } else if ($(e.target).parent().hasClass("secondListTitle") || $(e.target).parent().hasClass("thirdListTitle") || $(e.target).parent().hasClass("fourListTitle")) {
                    that.secondListToggle(that, $(e.target).parent());
                }
            });
            $("body").off().on('click',function(e){
                if($(e.target).parents(".userlist-sortType-item").length ||$(e.target).parents(".search-sortType-item").length){

                }else{
                    $("body").find(".custom-selector-second").css("display", "none");//关闭其他的下拉
                  var  userListI ="";
                  var  searchI="";
                  if($(".userlist-sortType-item").find("i").hasClass("icon-upArrow")){
                      userListI = $(".userlist-sortType-item").find(".icon-upArrow");
                  }

                  if($(".search-sortType-item").find("i").hasClass("icon-upArrow")){
                      searchI = $(".search-sortType-item").find(".icon-upArrow");
                  }

                  that.toggleClass(userListI);
                  that.toggleClass(searchI);
                }
            });

        },
        clickOff: function () {
            //var that = this;
            this.element.off();
        },
        selectorToggle: function (t, e) {
            // $("body").find(".custom-selector-second").css("display", "none");//关闭其他的下拉

            var next =  e.next();
            this.toggleClass(next);

            $(t.config.list).each(function (index, element) {
                if (index === 0) {
                    if (e.hasClass(element.titleName)) {
                        if (t.element.find("." + element.listName).is(":visible")) {
                            t.element.find("." + element.listName).css("display", "none");
                        } else {
                            $("body").find(".custom-selector-second").css("display", "none");//关闭其他的下拉
                            t.element.find("." + element.listName).css("display", "inline-block");
                        }
                    }
                } else {
                    t.element.find("." + element.listName).css("display", "none");
                }
            })
        },
        selectItem: function (t, e) {
            var that = this ;
            $(t.config.list).each(function (index, element) {

                e.addClass('active').siblings().removeClass("active");

                if (index === 0) {
                    var oldData = t.element.find(".custom-selector-title").attr("data-select-result");
                    if (e.parent("div").attr("data-down-role") && t.config.all) {
                        if (e.parents(".secondList").length > 0) {
                            var _dataList = oldData.split("-");
                            t.element.find("." + element.titleName).attr("data-select-result", _dataList[0] + "-" + e.text());
                            t.element.find("." + element.titleName).text(_dataList[0] + "-" + e.text());
                            t.element.find("." + element.titleName).val(_dataList[0] + "-" + e.text());  //input 也可赋值
                        } else {
                            t.element.find("." + element.titleName).attr("data-select-result", oldData ? oldData + "-" + e.text() : e.text());
                            t.element.find("." + element.titleName).text(oldData ? oldData + "-" + e.text() : e.text());
                            t.element.find("." + element.titleName).val(oldData ? oldData + "-" + e.text() : e.text());  //input 也可赋值
                        }

                    } else {
                        t.element.find("." + element.titleName).attr("data-select-result", e.text()).text(e.text()).val(e.text());  //input 也可赋值
                    }
                } else {
                    //   e.parent().siblings("." + element.listName).children().removeClass("active");
                }
                if (t.element.find("." + element.listName).is(":visible")) {
                    t.element.find("." + element.listName).css("display", "none");
                }
                // } else {
                //     t.element.find("." + element.listName).css("display", "inline-block");
                // }
            });

            var userListI =  e.parents(".userlist-sortType-item").find("i");
            var searchI =  e.parents(".search-sortType-item").find("i");

            if(e.parents(".userlist-sortType-item").find(".icon-upArrow").length>0||e.parents(".search-sortType-item").find(".icon-upArrow").length>0){
                that.toggleClass(userListI);
                that.toggleClass(searchI);
            }
        },
        secondListToggle: function (t, e) {
            var role = e.attr("data-down-role");
            e.addClass('active').siblings().removeClass("active");
            if (t.config.all) {
                var oldData = t.element.find(".custom-selector-title").attr("data-select-result");
                var data = "";
                if (oldData) {
                    if (e.hasClass("secondListTitle")) {
                        data = e.text();
                    } else {
                        var _data = oldData.split("-");
                        data = _data[0] + "-" + e.text();
                    }
                } else {
                    data = e.text();
                }
                t.element.find(".custom-selector-title").attr("data-select-result", data).text(data).val(data);
            }
            $(t.config.list).each(function (index, element) {
                if (index !== 0) {
                    if (e.parents(".custom-selector").attr("id") !== "area-selector") {
                        e.parent().siblings("." + element.listName).css("display", "none");

                        console.log("." + element.listName + "[data-down-role='" + role + "']");
                        t.element.find("." + element.listName + "[data-down-role='" + role + "']").css("display", "inline-block");
                    }
                }
            });
        },
        searchEvent: function () {   //搜索内容
            this.showSearch();
        },
        showSearch: function () {    //搜索显示
           if(typeof (this.config.searchCallBack)!="undefined"){
               this.config.searchCallBack();


           }

        },
        toggleClass:function(target){

          if($(target).hasClass("icon-upArrow")){
            $(target).removeClass("icon-upArrow").addClass("icon-downArrow");
          }else if($(target).hasClass("icon-downArrow")){
            $(target).removeClass("icon-downArrow").addClass("icon-upArrow");
          }
        }
    }
    ;
    $.fn.downSelector = function (config) {

        return $(this).each(function (index, element) {
            var d = new DownSelector(element, config);
            return d;
        })
    };
    $.fn.downSelector.defaultConfig = {}
})
;
