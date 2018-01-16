/**
 * @Desc：底部按钮组
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/3/2
 */
define(["text!bottomTemplate","examineCheck","searchSuggestion","checkSuggestion","jquery","fastReply","usedReply"], function (text,examineCheck,searchSuggestion,checkSuggestion, $,fastReply,usedReply) {
    var bottomController = {
        init: function () {
            this.template = text;
            this.templateUrl();
        },
        templateUrl: function () {
            $("[data-template='tpl-bottom-controller']").append(this.template);

            this.controller();
        },
        controller: function () {
            $(".user-controller-fastReply").on("click", function (e) {

                e.stopPropagation();
                if ($(".user-controller").hasClass("disabled")){
                    return;
                }
                if ($(".jump-box").hasClass("show")) {
                    if (!$(".jump-box.show").hasClass("fast-reply")) {
                        $(".jump-box").removeClass("show");
                        $(".jump-box.fast-reply").addClass("show");
                        $(".user-controller-fastReply").removeClass("reply-on");
                        $(".user-controller-result").removeClass("result-on");
                    } else {
                        $(".jump-box").removeClass("show");
                        $(".user-controller-fastReply").removeClass("reply-on");
                        $(".user-controller-result").removeClass("result-on");
                    }
                } else {
                    $(".jump-box.fast-reply").addClass("show");
                }
                $(this).toggleClass("reply-on");
            });

            $(".user-controller-result").on("click", function (e) {
                e.stopPropagation();
                if ($(".user-controller").hasClass("disabled")){
                    return;
                }
                if ($(".jump-box").hasClass("show")) {
                    if (!$(".jump-box.show").hasClass("used_reply")) {
                        $(".jump-box").removeClass("show");
                        $(".jump-box.used_reply").addClass("show");

                        $(".user-controller-fastReply").removeClass("reply-on");
                        $(".user-controller-result").removeClass("result-on");
                    } else {
                        $(".jump-box").removeClass("show");
                        $(".user-controller-fastReply").removeClass("reply-on");
                        $(".user-controller-result").removeClass("result-on");
                    }
                } else {
                    $(".jump-box.used_reply").addClass("show");
                }
                $(this).toggleClass("result-on");
            });

            $(".user-controller-check").on("click", function (e) {
                e.stopPropagation();
                if ($(".user-controller").hasClass("disabled")){
                    return;
                }
                examineCheck.init();
                if ($(".jump-box").hasClass("show")) {
                    $(".jump-box").removeClass("show");
                } else {
                    $(".examine-check").show();
                }
                $(this).toggleClass("fastReply-on");
            });

            $(".user-controller-report").on("click", function (e) {
                if ($(".user-controller").hasClass("disabled")){
                    return;
                }
                e.stopPropagation();
                // $(".config-suggestion").show();
                // $(".check-suggestion").show();
                checkSuggestion.init();
                $(".search-suggestion").show();
                searchSuggestion.init();
                if ($(".jump-box").hasClass("show")) {
                    $(".jump-box").removeClass("show");
                }
                searchSuggestion.controller();
                $(this).toggleClass("fastReply-on");
            });


            $("body").on("click", function (e) {

                if (!$(".main-masker").is(":visible")) {
                    if ($(e.target).parents(".main-masker").size() === 0 && !$(e.target).hasClass("main-masker")) {
                        if ($(e.target).parents(".jump-box").size()===0){
                            $(".jump-box").removeClass("show");
                            $(".user-controller-fastReply").removeClass("reply-on");
                            $(".user-controller-result").removeClass("result-on");
                        }

                    }
                }
            })
        }
    };
    // bottomController.init();
    return bottomController;
});