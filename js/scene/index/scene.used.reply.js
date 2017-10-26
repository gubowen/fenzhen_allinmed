/**
 * @Desc：常用回复
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/3/8
 */

define(['jquery', "text!usedReplyTemplate", "text!usedReplyConfigTemplate", "toJSON", "common"], function ($, urText, urcText, toJSON, common) {
    var container = {
        init: function () {
            this.template = urText;
            this.configTemplate = urcText;
            this.templateUrl();
            this.getUsedList();
            this.showConfig();
            this.selectUsedItem();

        },
        templateList: {
            listItem: function (data) {
                return '<li class="jump-box-list-item" data-id="' + data.id + '"><span>' + data.replyContent + '</span></li>';
            },
            addMember: function () {
                return '<section class="jump-box-member-config">' +
                    '<input type="text" class="jump-box-member-input" placeholder="请输入常用回复"/>' +
                    '<figure class="member-add-button">' +
                    '<button class="btn-primary member-add-save">保存</button>' +
                    '<i class="icon-member-add-cancel"></i>' +
                    '</figure>' +
                    '</section>';
            },
            configItem: function (data) {
                return '<section class="jump-box-term" data-id="' + data.id + '">' +
                    '<article class="jump-box-term-title">' +
                    '<h3>' + data.replyContent + '</h3>' +
                    '<figure class="jump-box-term-button">' +
                    '<p class="fix">修改</p>' +
                    '<p class="del">删除</p>' +
                    '</figure>' +
                    '</article>' +
                    '</section>';
            }
        },
        XHRList: {
            usedList: "/call/customer/comm/reply/v1/getMapList/",
            update: "/call/customer/comm/reply/v1/save/"
        },
        templateUrl: function () {
            $("[data-template='tpl-fastReply']").append(this.template)
        },

        showConfig: function () {
            var that = this;
            $(".used_reply_config_show").on("click", function () {
                $('[data-template="tpl-inner"]').append(that.configTemplate);

                setTimeout(function () {
                    $(".used-reply-config").addClass("on");
                });
                that.createNewItemEvent();
                that.deleteMemberEvent();
                that.getConfigList();
                that.closeWindow();
                $(".used-reply-config").on("click", ".jump-box-term-button .fix", function () {
                    that.showFixMember($(this), that);
                });

                $("#ev-used-reply-config-box").on("input propertychange", ".add-input,.jump-box-member-input", function () {
                    if (common.getByteLen($(this).val()) > 200) {
                        $(this).val(common.getStrByteLen($(this).val(), 200))
                    }
                })
            })
        },
        getConfigList: function () {
            var that = this;
            $.ajax({
                url: this.XHRList.usedList,
                type: 'get',
                dataType: 'json',
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show();
                },
                data: {
                    paramJson: $.toJSON({
                        customerId: localStorage.getItem("userId"),
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "9999"
                    })
                }
            })
                .done(function (data) {
                    console.log("success");
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            $(dataList.reverse()).each(function (index, element) {
                                $("#ev-used-reply-config-box").append(that.templateList.configItem(element))
                            })
                        }
                        common.loading.hide();
                    }
                })
        },
        getUsedList: function () {
            var that = this;
            $("#ev-used-reply-box").children().remove();
            $.ajax({
                url: this.XHRList.usedList,
                type: 'get',
                dataType: 'json',
                timeout: 10000,

                data: {
                    paramJson: $.toJSON({
                        customerId: localStorage.getItem("userId"),
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "9999"
                    })
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            $(dataList.reverse()).each(function (index, element) {
                                $("#ev-used-reply-box").append(that.templateList.listItem(element))
                            })
                        }
                    }
                })

        },
        closeWindow: function () {
            var that = this;
            $(".used-reply-config .window-close").on("click", function () {
                $(".used-reply-config").removeClass("on");
                $(".used-reply-config").on("transitionend WebkitTransitionEnd", function () {
                    $(".used-reply-config").remove();
                });

                that.getUsedList();

            });
        },
        selectUsedItem: function () {
            $("#ev-used-reply-box").on("click", ".jump-box-list-item", function () {
                $(".user-controller-input").removeAttr("data-upload").val($(this).text());
                $(".used_reply").removeClass("show");
                $(".user-controller-result").removeClass("result-on");
            })
        },
        //新建问题...
        createNewItemEvent: function () {
            var that = this;
            $(".used-reply-config .jump-box-add-term").on("click", function () {
                $(".used-reply-config .jump-box-term-add").show();
            });
            $(".used-reply-config .jump-box-term-add .term-add-button").on("click", function (e) {
                if ($(e.target).hasClass("term-add-cancel")) {
                    $(".used-reply-config .jump-box-term-add").hide().find(".add-input").val("");
                } else if ($(e.target).hasClass("term-add-save")) {
                    var content = $(this).siblings(".add-input").val().trim();
                    $(".used-reply-config .jump-box-term-add").hide();
                    if (content.length !== 0) {
                        that.createNewItem(content, $(this).siblings(".add-input"));
                    }
                }
            })
        },
        createNewItem: function (content, input) {
            var that = this;
            $.ajax({
                url: this.XHRList.update,
                type: 'POST',
                dataType: 'json',
                data: {
                    paramJson: $.toJSON({
                        customerId: localStorage.getItem("userId"),
                        replyContent: content,
                        isValid: "1"
                    })
                },
                beforeSend: function () {
                    common.loading.show()
                },
                timeout: 10000
            })
                .done(function (data) {
                    console.log("success");
                    if (data.responseObject.responseStatus) {

                        $("#ev-used-reply-config-box .jump-box-term-add").after(that.templateList.configItem({
                            replyContent: content,
                            id: data.responseObject.responsePk
                        }));
                        $("#ev-used-reply-box").prepend(that.templateList.listItem({
                            replyContent: content,
                            id: data.responseObject.responsePk
                        }));
                        input.val("");
                    }
                    common.loading.hide()
                })
        },

        //删除分组事件...
        deleteMemberEvent: function () {
            var that = this;
            $(".used-reply-config").on("click", ".jump-box-term-button .del", function (e) {
                e.stopPropagation();
                var id = $(this).parents(".jump-box-term").attr("data-id");
                common.confirmBox({
                    container: $(this),
                    textList: [{
                        text: "确定删除该回复吗？"
                    }],
                    ensure: "确定",
                    cancel: "取消",
                    ensureCallback: function () {
                        that.deleteMember(id);
                    }
                })
            });
        },
        //    项目删除...
        deleteMember: function (id) {

            $.ajax({
                url: this.XHRList.update,
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {
                    common.loading.show();
                },
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        id: id,
                        isValid: "0",
                        // replyContent: ""
                    })
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        $(".jump-box-term[data-id='" + id + "']").addClass("delete-item");
                        $(".jump-box-term[data-id='" + id + "']").on("transitionend", function () {
                            $(".jump-box-term[data-id='" + id + "']").remove();

                        });
                        common.loading.hide();
                    }
                })
                .fail(function () {
                })
        },
        //    修改问题UI变化...
        showFixMember: function (e, t) {
            var content = e.parents(".jump-box-term-button").siblings("h3").text();
            var textLine = e.parents(".jump-box-term-button").siblings("h3");
            var id = e.parents(".jump-box-term").attr("data-id");
            var that = this;
            e.parents(".jump-box-term-button").hide().siblings("h3").hide();
            e.parents(".jump-box-term-title").append(t.templateList.addMember());
            e.parents(".jump-box-term-title").find(".jump-box-member-config").show();

            var container = e.parents(".jump-box-term-title").find(".jump-box-member-config");

            container.find(".jump-box-member-input").val(content);

            container.on("click", function (event) {
                var text = $(this).find(".jump-box-member-input").val().trim();
                if ($(event.target).hasClass("member-add-save")) {
                    if (text.length === 0) {
                        // container.siblings("h3").show();
                        // container.siblings(".jump-box-term-button").show();
                        // container.remove();
                        that.deleteMember(container.parents(".jump-box-term").attr("data-id"));
                    } else {
                        t.saveFixMember({
                            t: t,
                            id: id,
                            container: container
                        });
                    }


                } else if ($(event.target).hasClass("icon-member-add-cancel")) {
                    container.remove();
                    e.parents(".jump-box-term-button").show().siblings("h3").show();
                }
            })
        },
        //保存修改问题...
        saveFixMember: function (param) {
            var container = param.container;
            var t = param.t;
            var text = container.find(".jump-box-member-input").val();
            $.ajax({
                url: t.XHRList.update,
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {
                    common.loading.show();
                },
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        replyContent: text,
                        isValid: "1",
                        id: param.id
                    })
                }
            })
                .done(function (data) {
                    console.log("success");
                    if (data.responseObject.responseStatus) {
                        container.siblings("h3").show().text(text);
                        container.siblings(".jump-box-term-button").show();
                        container.remove();


                        common.loading.hide();
                    }
                })
        }

    };
    return container;

});