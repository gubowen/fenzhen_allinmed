/**
 * @name:下拉选择
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/2/15
 * @author: qiangkailiang
 */

define(["jquery"], function ($) {
    var SearchSelector = function (element, config) {
        this.element = $(element);
        this.config = $.extend(true, $.fn.downSelector.defaultConfig, config);

        this.init();
    };

    DownSelector.prototype = {
        init: function () {
            var that = this;
            that.dataInit();
            that.clickEvent();

        },
        dataInit:function(url,data){ //数据加载 json（）
            var that =this ;
            //清空数据

            //获取数据
              html = "";

            $.ajax({
                url:url,
                type:post,
                date:date,
                success:function(data){
                    var html ="";
                    $.each(data,function(k,v){
                        if(v.list == 0){
                            html = "";
                        }else{
                            $.each(v.list,function(){
                            html = "";
                            })
                        }
                    })

                }

            });
           //加载数据
            $(this).append(html);
        },

        enterKey:function(url){    //搜索输入值监听enter
            $(document).keydown(function(event){

                var that =this ;
                var inputDate =  $(this).find(".custom-selector-title").text();

                switch(event.keyCode){
                    case 13:dataInit(url,inputDate);break;
                    default:console.log();
                };

            });

        },
        //互斥 点击一个其他消失
        other:function(){
            var that = this
            $('.search-selector').each(function(){
                if($(this) != $(that)){
                    $(this).find(".acitve").removeClass("active");
                }
            })
        },
        clickEvent: function () {
            var that = this;
            this.element.on("click", function (e) {
                $(e.target).next().hasClass("");


                // if ($(e.target).hasClass("custom-selector-title")) {
                //     that.selectorToggle(that, $(e.target));
                // }
                // if ($(e.target).parent().hasClass("result-item")) {
                //     that.selectItem(that, $(e.target).parent());
                //     that.config.resultCallback && that.config.resultCallback();
                // } else if ($(e.target).parent().hasClass("secondListTitle") || $(e.target).parent().hasClass("thirdListTitle")) {
                //     that.secondListToggle(that, $(e.target).parent());
                // }
            })

        },
        selectorToggle: function (t, e) {

        },
        selectItem: function (t, e) {

        },
        secondListToggle: function (t, e) {


        }

    };


    $.fn.searchSelector = function (config) {
        return $(this).each(function (index, element) {
            var d = new SearchSelector(element, config);
            return d;
        })
    };


    $.fn.searchSelector.defaultConfig = {}
});