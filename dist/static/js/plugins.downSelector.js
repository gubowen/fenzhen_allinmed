/**
 * @name:下拉选择
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/2/15
 * @author: qiangkailiang
 */
(function ($) {
  'use strict';
  let DownSelector = function (element, config) {
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
        if ($(e.target).parent().hasClass("result-item")) {
          that.selectItem(that, $(e.target).parent());
          that.config.resultCallback && that.config.resultCallback($(e.target).parent());
        } else if ($(e.target).parent().hasClass("secondListTitle") || $(e.target).parent().hasClass("thirdListTitle") || $(e.target).parent().hasClass("fourListTitle")) {
          that.secondListToggle(that, $(e.target).parent());
        }
      })
    },
    clickOff: function () {
      //var that = this;
      this.element.off();
    },
    selectorToggle: function (t, e) {
      // $("body").find(".custom-selector-second").css("display", "none");//关闭其他的下拉
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
      })
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

         //   console.log("." + element.listName + "[data-down-role='" + role + "']");
            t.element.find("." + element.listName + "[data-down-role='" + role + "']").css("display", "inline-block");
          }
        }
      });
    },
    searchEvent: function () {   //搜索内容
      var that = this;
      document.onkeydown = function (event) {
        switch (event.keyCode) {
          case 13:
            that.showSearch($(".custom-selector-title:focus"));
            break;
          default:
          //  console.log("无监听！");
        }
        ;
      }
    },
    showSearch: function (target) {    //搜索显示
      var text = $(target).val() || $(target).text();                 //回车回去值
      var listInfo = $(target).next().next().find(".result-item");    //获得列表
      $.each(listInfo, function (k, v) {
          console.log($(v).text(), $(v).text().indexOf(text));
          if ($(v).text().indexOf(text)) {                       //模糊查询
                                                                 //var dataRoleInfo = $(v).addClass("active").parent().css("display", "inline-block").attr("data-down-role");

            $(v).css("display", "none");
            // $(v).addClass("show");


            // if (dataRoleInfo != "" && dataRoleInfo != undefined) {
            //     $(v).parent().siblings().find("li").each(function () {
            //         // console.log($(this).attr("data-down-role"));
            //         if ($(this).attr("data-down-role") == dataRoleInfo) {
            //             $(this).addClass("active");
            //         }
            //     })
            // }
          }
          else {
            // console.log("无数据！");
          }
        }
      );
    }
  };
  $.fn.downSelector = function (config) {

    return $(this).each(function (index, element) {
      var d = new DownSelector(element, config);
      return d;
    })
  };
  $.fn.downSelector.defaultConfig = {};
}(jQuery));
