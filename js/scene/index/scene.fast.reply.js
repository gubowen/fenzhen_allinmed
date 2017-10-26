/**
 * @Desc：快速回复
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/3/7
 */

define(['jquery', "text!fastReplyTemplate", "text!fastReplyConfigTemplate", "toJSON", "tabView", "common"], function ($, frText, frcText, toJSON, TabsViewChange, common) {


    var container = {
        init: function () {

            var that = this;
            this.templateText = frText;
            this.configTemplate = frcText;
            this.templateUrl();
            this.getFastReplyList();


        },
        templateList: {
            showTerm: function (i, data) {
                return '<figure class="jump-box-tabs-item tabsItem ' + (i === 0 ? 'active' : '') + '" data-role="fr-tabs-' + (i + 1) + '"  data-id="' + data.questionId + '">' + data.questionDesc + '</figure>';

            },
            showInnerList: function (i, data) {
                return '<section class="jump-box-viewers-item viewItem ' + (i === 0 ? 'active' : '') + '" data-role="fr-tabs-' + (i + 1) + '">' +
                    '<ul class="jump-box-list">' +
                    (function (cData) {
                        var result = "";
                        $(cData).each(function (index, element) {
                            result += '<li class="jump-box-list-item" data-id="' + element.questionId + '" data-upload="' + element.isUpload + '"><span>' + element.questionDesc + '</span></li>';
                        });
                        return result;

                    }(data.children)) +
                    '</ul>' +
                    '</section>';
            },
            showConfigList: function (data) {
                return '<section class="jump-box-term" data-id="' + data.questionId + '" data-path="' + data.fullPath + '" data-qtype="' + data.questionType + '">' +
                    '<article class="jump-box-term-title">' +
                    '<i class="icon-term-downArrow"></i>' +
                    '<h3>' + data.questionDesc + '</h3>' +
                    '<figure class="jump-box-term-button">' +
                    '<p class="fix">修改</p>' +
                    '<p class="del">删除</p>' +
                    '</figure>' +
                    '</article>' +
                    '<section class="jump-box-member">' +
                    '<header class="jump-box-member-title">' +
                    '<span>相关问题</span>' +
                    '<p class="jump-box-member-add icon-add-question"><span>添加问题</span></p>' +
                    '</header>' +
                    '<article class="jump-box-member-box">' +
                    '<section class="jump-box-member-config">' +
                    '<input type="text" class="jump-box-member-input" placeholder="请输入快捷提问"/>' +
                    '<figure class="member-add-button">' +
                    '<button class="btn-primary member-add-save">保存</button>' +
                    '<p class="term-add-cancel">取消</p>' +
                    '</figure>' +
                    '</section>' +
                    (function (cData) {
                        var result = "";
                        $(cData).each(function (index, element) {
                            result += '<article class="jump-box-member-item" data-id="' + element.questionId + '">' +
                                '<span>' + element.questionDesc + '</span>' +
                                '<figure class="jump-box-member-item-button">' +
                                '<i class="icon-question-config"></i>' +
                                '<i class="icon-question-delete"></i>' +
                                '</figure>' +
                                '</article>';
                        });
                        return result;
                    }(data.children)) +

                    '</article>' +
                    '</section>' +
                    '</section>';
            },
            term: function (data) {
                return '<section class="jump-box-term" data-id="' + data.questionId + '" data-path="' + data.fullPath + '" data-qtype="' + data.questionType + '">' +
                    '<article class="jump-box-term-title">' +
                    '<i class="icon-term-downArrow"></i>' +
                    '<h3>' + data.name + '</h3>' +
                    '<figure class="jump-box-term-button">' +
                    '<p class="fix">修改</p>' +
                    '<p class="del">删除</p>' +
                    '</figure>' +
                    '</article>' +
                    '<section class="jump-box-member">' +
                    '<header class="jump-box-member-title">' +
                    '<span>相关问题</span>' +
                    '<p class="jump-box-member-add icon-add-question"><span>添加问题</span></p>' +
                    '</header>' +
                    '<article class="jump-box-member-box">' +
                    '   <section class="jump-box-member-config">' +
                    '<input type="text" class="jump-box-member-input" placeholder="请输入快捷提问"/>' +
                    '<figure class="member-add-button">' +
                    '<button class="btn-primary member-add-save">保存</button>' +
                    '<p class="term-add-cancel">取消</p>' +
                    '</figure>' +
                    '</section>' +
                    '</article>' +
                    '</section>' +
                    '</section>';
            },
            listItem: function (data) {
                return '<article class="jump-box-member-item" data-id="' + data.questionId + '">' +
                    '<span>' + data.name + '</span>' +
                    '<figure class="jump-box-member-item-button">' +
                    '<i class="icon-question-config"></i>' +
                    '<i class="icon-question-delete"></i>' +
                    '</figure>' +
                    '</article>';
            },
            addTerm: function () {
                return '<section class="jump-box-term-add">' +
                    '<input type="text" class="add-input" placeholder="请输入分组名称"/>' +
                    '<figure class="term-add-button">' +
                    '<button class="btn-primary term-add-save">保存</button>' +
                    '<p class="term-add-cancel">取消</p>' +
                    '</figure>' +
                    '</section>';
            },
            addMember: function () {
                return '   <section class="jump-box-member-config">' +
                    '<input type="text" class="jump-box-member-input" placeholder="请输入快捷提问"/>' +
                    '<figure class="member-add-button">' +
                    '<button class="btn-primary member-add-save">保存</button>' +
                    '<p class="term-add-cancel">取消</p>' +
                    '</figure>' +
                    '</section>';
            }
        },
        XHRList: {
            deleteTerm: "/call/customer/quick/question/v1/delete/",
            fixTerm: "/call/customer/quick/question/v1/save/",
            getTerm: "/call/customer/quick/question/v1/getMapList/"
        },
        templateUrl: function () {

            $("[data-template='tpl-fastReply']").append(this.templateText);
            this.showConfig();
            this.clickToSendReply();


        },
        tabsChange: function () {
            var that = this;
            new TabsViewChange({
                tabsInner: $(".fast-reply .jump-box-tabs.tabsInner"),
                views: $(".fast-reply .viewInner.jump-box-viewers"),
                changeCallback: function () {

                },
                role: "fr-tabs"
            });

        },

        showConfig: function () {
            var that = this;
            $(".jump-box-config-button").on("click", function () {
                $('[data-template="tpl-inner"]').append(that.configTemplate);

                setTimeout(function () {
                    $(".fast-reply-config").addClass("on");
                });
                that.getConfigList();
                that.closeWindow();

                $(".jump-box-config").on("click", ".jump-box-term-button .fix", function (e) {
                    e.stopPropagation();
                    $(".jump-box-term-box > .jump-box-term-add").hide();
                    $(".jump-box-term-title").find(" > h3, > .jump-box-term-button").show();
                    $(".jump-box-term-title").find(" > .jump-box-term-add").remove();
                    if ($(this).parents(".jump-box-term").attr("data-qtype") == 2) {
                        that.showFixTerm($(this), that);
                    }

                });
                $(".jump-box-config").on("click", ".jump-box-member-item  .icon-question-config", function (e) {
                    e.stopPropagation();
                    $(".jump-box-member-box > .jump-box-member-config").hide();
                    $(".jump-box-member-item").find(".jump-box-member-item-button,span").show();
                    $(".jump-box-member-item").find(".jump-box-member-config").remove()
                    if ($(this).parents(".jump-box-term").attr("data-qtype") == 2) {
                        that.showFixMember($(this), that);
                    }
                })

            })
        },
        //tabs左右轮播按钮...
        transformBtn: function (total, size) {
            var i = 0, num = 0;
            var w = $(".jump-tabs-wrapper .jump-box-tabs-item").eq(i).outerWidth();

            $(".jump-box-prev").on("click", function () {
                if (Math.abs(i) > 0) {
                    i++;
                    num += total / size;
                    $(".jump-tabs-wrapper").css("transform", "translateX(" + (num) + "px)")
                }

            });
            $(".jump-box-next").on("click", function () {
                if (Math.abs(i) < size * 0.7) {
                    i--;
                    num -= total / size;
                    $(".jump-tabs-wrapper").css("transform", "translateX(" + (num) + "px)")
                }

            });
        },
        //获取列表...
        getFastReplyList: function () {
            var that = this;
            $("#ev-show-tabs").children().remove();
            $("#ev-show-inners").children().remove();
            $.ajax({
                url: this.XHRList.getTerm,
                type: 'POST',
                dataType: 'json',
                data: {
                    paramJson: $.toJSON({
                        sessionCustomerId: localStorage.getItem("userId"),
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "1000",
                        sortType: "2",
                        sortPartIdList: ""
                    })
                },
                beforeSend: function () {
                    common.loading.show()
                },
                timeout: 10000
            })
                .done(function (data) {
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            var result = '<button class="jump-box-prev jump-box-tabs-controller">' +
                                '<i class="icon-leftArrow"></i>' +
                                '</button>' +
                                '<article class="jump-tabs-wrapper">';
                            $(dataList).each(function (index, element) {
                                result += that.templateList.showTerm(index, element);
                                $("#ev-show-inners").append(that.templateList.showInnerList(index, element))
                            });
                            result += '</article>' +
                                '<button class="jump-box-next jump-box-tabs-controller">' +
                                '<i class="icon-rightArrow"></i>' +
                                '</button>';

                            $("#ev-show-tabs").append(result);

                            that.tabsChange();
                            var total = 0, size = $(".jump-tabs-wrapper .jump-box-tabs-item").size();
                            $(".jump-tabs-wrapper .jump-box-tabs-item").each(function (index, element) {
                                total += $(element).outerWidth();
                            });
                            $(".jump-tabs-wrapper").width(total + 30 * size + 55);
                            if (total + 30 * size + 55 > 790) {
                                that.transformBtn(total + 30 * size + 55, size);
                            }
                        }
                    }
                    common.loading.hide()
                })
                .fail(function () {

                });
        },
        //获取编辑列表...
        getConfigList: function () {
            var that = this;
            $.ajax({
                url: this.XHRList.getTerm,
                type: 'POST',
                dataType: 'json',
                data: {
                    paramJson: $.toJSON({
                        sessionCustomerId: localStorage.getItem("userId"),
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "1000",
                        sortType: "2",
                        sortPartIdList: ""
                    })
                },
                beforeSend: function () {
                    common.loading.show()
                },
                timeout: 10000
            })
                .done(function (data) {
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;

                        if (dataList && dataList.length !== 0) {
                            $(dataList).each(function (index, element) {
                                $("#ev-fast-reply-box").append(that.templateList.showConfigList(element))
                            });
                        }
                        that.addTermEvent();
                        that.addMemberEvent();
                        that.configTermToggle();
                        that.deleteTermEvent();

                        that.inputLimit();

                        $(".jump-box-term[data-qtype='0'],.jump-box-term[data-qtype='1']").find(".jump-box-term-button,.jump-box-member-item-button").remove();
                    }
                    common.loading.hide()
                })
                .fail(function () {

                });
        },
        //输入限制...
        inputLimit:function () {
            var flag = true;
            $("#ev-fast-reply-box").on("input propertychange", ".jump-box-member-input", function () {
                if (flag) {

                    if (common.getByteLen($(this).val()) > 200) {
                        $(this).val(common.getStrByteLen($(this).val(), 200));
                    }
                }
            });
            $("#ev-fast-reply-box").on("input propertychange", ".add-input", function () {
                if (flag) {

                    if (common.getByteLen($(this).val()) > 40) {
                        $(this).val(common.getStrByteLen($(this).val(), 40));
                    }
                }
            });
            $("#ev-fast-reply-box").on("compositionstart", ".add-input,.jump-box-member-input", function () {
                flag=false;
            });
            $("#ev-fast-reply-box").on("compositionend", ".add-input", function () {
                flag=true;
                if (common.getByteLen($(this).val()) > 40) {
                    $(this).val(common.getStrByteLen($(this).val(), 40));
                }
            });
            $("#ev-fast-reply-box").on("compositionend", ".jump-box-member-input", function () {
                flag=true;
                if (common.getByteLen($(this).val()) > 200) {
                    $(this).val(common.getStrByteLen($(this).val(), 200));
                }
            });
        },
        //点击分组展开...
        configTermToggle: function () {
            $(".fast-reply-config").on("click", ".jump-box-term-title", function (e) {
                if ($(this).parents(".jump-box-term").attr("data-qtype") === 0) {
                    if (!$(this).find(".jump-box-term-button").is(":visible") || $(e.target).hasClass("jump-box-term-button") || $(e.target).parent().hasClass("jump-box-term-button")) {
                        return;
                    }
                    $(this).parent().toggleClass("active");
                } else {
                    $(this).parent().toggleClass("active");
                }
            })
        },

        //点击将一条回复加入输入框...
        clickToSendReply: function () {
            $(".jump-box.fast-reply").on("click", ".jump-box-list-item", function () {
                var text = $(this).text();
                $(".user-controller-input").val(text);
                $(".jump-box.fast-reply").removeClass("show");
                $(".user-controller-fastReply").removeClass("reply-on");

                if (parseInt($(this).attr("data-upload")) === 1 || parseInt($(this).attr("data-upload")) === 2) {
                    $(".user-controller-input").attr("data-upload", $(this).attr("data-upload"));
                } else {
                    $(".user-controller-input").removeAttr("data-upload");
                }
            });
        },
        //编辑快速回复视窗关闭...
        closeWindow: function () {
            var that = this;
            $(".jump-box-config .window-close").on("click", function (e) {
                e.stopPropagation();
                $(".fast-reply-config").removeClass("on");
                $(".fast-reply-config").on("transitionend WebkitTransitionEnd", function () {
                    $(this).remove();
                });


                that.getFastReplyList()
            });

        },
        //添加一条分组...
        addTermEvent: function () {
            var that = this;
            $(".jump-box-config").on("click", ".jump-box-add-term", function (e) {
                e.stopPropagation();
                $(".jump-box-term-title").find(" > h3, > .jump-box-term-button").show();
                $(".jump-box-term-title").find(" > .jump-box-term-add").remove();
                $(".jump-box-term-add").show();
            });
            $(".jump-box-config").on("click", "#ev-fast-reply-box > .jump-box-term-add", function (e) {
                e.stopPropagation();
                if ($(e.target).hasClass("term-add-save")) {
                    that.saveTermAdd($(this));
                } else if ($(e.target).hasClass("term-add-cancel")) {
                    $(".jump-box-term-add").hide();
                    $(".add-input").val("");
                }
            });

        },
        //添加一条问题...
        addMemberEvent: function () {
            var that = this;
            $(".jump-box-term-box").on("click", ".jump-box-member-title > .jump-box-member-add", function (e) {
                $(".jump-box-member-item").find(".jump-box-member-item-button,span").show();
                $(".jump-box-member-item").find(".jump-box-member-config").remove()
                $(this).parents(".jump-box-member").find(".jump-box-member-config").show();
            });
            $(".jump-box-term-box").on("click", ".jump-box-member-box > .jump-box-member-config .member-add-button", function (e) {
                e.stopPropagation();
                if ($(e.target).hasClass("member-add-save")) {
                    that.saveMemberAdd($(this).parents(".jump-box-member-config").find(".jump-box-member-input"), $(this));
                } else if ($(e.target).hasClass("term-add-cancel")) {
                    $(this).parents(".jump-box-member-item").find("span,.jump-box-member-item-button").show();
                    $(this).parents(".jump-box-member-config").hide();

                }
            })
        },
        //保存问题添加
        saveMemberAdd: function (input, t) {
            var content = input.val().trim(),
                path = input.parents(".jump-box-term").attr("data-path"),
                id = input.parents(".jump-box-term").attr("data-id"),
                that = this;
            if (content.length === 0) {
                t.parents(".jump-box-member-config").hide();
                return false;
            } else {
                $.ajax({
                    url: that.XHRList.fixTerm,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON({
                            isValid: "1",
                            customerId: localStorage.getItem("userId"),
                            questionDesc: content,
                            questionType: input.parents(".jump-box-term").attr("data-qtype"),
                            parentId: id,
                            fullPath: path,
                            treeLevel: 2
                        })
                    },
                    beforeSend: function () {
                        common.loading.show()
                    },
                    timeout: 10000
                })
                    .done(function (data) {
                        if (data.responseObject.responseStatus) {
                            var dataList = data.responseObject.responseData.dataList;
                            input.parents(".jump-box-member-config").after(that.templateList.listItem({
                                name: dataList.questionDesc,
                                questionId: dataList.questionId,
                            }));
                            input.parents(".jump-box-member-config").hide();
                            input.val("");
                            if (parseInt(input.parents(".jump-box-term").attr("data-qtype")) !== 2) {
                                input.parents(".jump-box-term").find(".jump-box-term-button,.jump-box-member-item-button").remove();
                            }

                        }
                        common.loading.hide()
                    })
                    .fail(function () {

                    });
            }
        },
//保存分组功能...
        saveTermAdd: function (ele) {
            console.log(ele)
            var content = ele.find(".add-input").val().trim().substring(0, 20),
                that = this;

            if (content.length === 0) {
                ele.hide();
                return false;
            } else {
                $.ajax({
                    url: that.XHRList.fixTerm,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON({
                            isValid: "1",
                            customerId: localStorage.getItem("userId"),
                            questionDesc: content,
                            questionType: "2",
                            treeLevel: 1
                        })
                    },
                    beforeSend: function () {
                        common.loading.show()
                    },
                    timeout: 10000
                })
                    .done(function (data) {
                        if (data.responseObject.responseStatus) {
                            var dataList = data.responseObject.responseData.dataList;
                            if ($("#ev-fast-reply-box [data-qtype='0']")){
                                $("#ev-fast-reply-box [data-qtype='0']").last().after(that.templateList.term({
                                    name: dataList.questionDesc,
                                    questionId: dataList.questionId,
                                    fullPath: dataList.fullPath,
                                    questionType: dataList.questionType
                                }));
                            }else{
                                $("#ev-fast-reply-box").append(that.templateList.term({
                                    name: dataList.questionDesc,
                                    questionId: dataList.questionId,
                                    fullPath: dataList.fullPath,
                                    questionType: dataList.questionType
                                }));
                            }

                            ele.hide();
                            ele.find(".add-input").val("");

                        }
                        common.loading.hide()
                    })
            }
        },
//删除分组事件...
        deleteTermEvent: function () {
            var that = this;
            $(".jump-box-config").on("click", ".jump-box-term-button .del", function (e) {
                e.stopPropagation();
                if ($(this).parents(".jump-box-term").attr("data-qtype") == 2) {
                    var container = $(this).parents(".jump-box-term")
                    var id = container.attr("data-id");

                    common.confirmBox({
                        container: $(this),
                        textList: [{
                            text: "确定删除该分组吗？"
                        },
                            {
                                text: "删除后该分组的相关问题会一起删除"
                            }],
                        ensure: "确定",
                        cancel: "取消",
                        ensureCallback: function () {

                            that.deleteTerm(id, container);
                        }
                    })
                }
            });

            $(".jump-box-config").on("click", ".jump-box-member-item-button .icon-question-delete", function (e) {
                e.stopPropagation();
                if ($(this).parents(".jump-box-term").attr("data-qtype") == 2) {
                    var container = $(this).parents(".jump-box-member-item"),
                        id = container.attr("data-id");
                    common.confirmBox({
                        container: $(this),
                        textList: [{
                            text: "确定删除该问题吗？"
                        }],
                        ensure: "确定",
                        cancel: "取消",
                        ensureCallback: function () {
                            that.deleteMember(id, container);
                        }
                    })
                }
            })

        },
        //删除分组
        deleteTerm: function (id, container) {

            $.ajax({
                url: this.XHRList.deleteTerm,
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {
                    common.loading.show();
                },
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        isValid: "0",
                        questionId: id,
                        isBatch: "1"
                    })
                },
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        container.addClass("delete-item");
                        container.on("transitionend", function () {
                            setTimeout(function () {
                                container.remove();
                            }, 300)
                        });
                        common.loading.hide();
                    }
                })
        },
        //删除问题...
        deleteMember: function (id, container) {
            $.ajax({
                url: this.XHRList.deleteTerm,
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {
                    common.loading.show();
                },
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        isValid: "0",
                        questionId: id,
                    })
                },
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        container.addClass("delete-item");
                        container.on("transitionend", function () {
                            setTimeout(function () {
                                container.remove();
                            }, 300)
                        });
                        common.loading.hide();
                    }
                })
        },
//修改分组UI变化...
        showFixTerm: function (e, t) {
            var that = this;
            var content = e.parents(".jump-box-term-button").hide().siblings("h3").text();

            e.parents(".jump-box-term-button").hide().siblings("h3").hide();
            e.parents(".jump-box-term-title").append(t.templateList.addTerm());
            e.parents(".jump-box-term-title").find(".jump-box-term-add").show();

            var container = e.parents(".jump-box-term-title").find(".jump-box-term-add");

            container.find(".add-input").val(content);

            container.off("click").on("click", function (event) {
                if ($(event.target).hasClass("term-add-save")) {
                    if (container.find(".add-input").val().trim().length === 0) {
                        // container.remove();
                        // e.parents(".jump-box-term-button").show().siblings("h3").show();
                        that.deleteTerm(container.parents(".jump-box-term").attr("data-id"), container.parents(".jump-box-term"))
                        return false;
                    } else {
                        t.saveFixTerm(t, container);
                    }

                } else if ($(event.target).hasClass("term-add-cancel")) {
                    container.remove();
                    e.parents(".jump-box-term-button").show().siblings("h3").show();
                }
            })
        },
//保存修改分组
        saveFixTerm: function (t, container) {

            var text = container.find(".add-input").val();
            var qId = container.parents(".jump-box-term").attr("data-id");

            $.ajax({
                url: t.XHRList.fixTerm,
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {
                    common.loading.show();
                },
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        id: qId,
                        isValid: "1",
                        customerId: localStorage.getItem("userId"),
                        questionDesc: text,
                        questionType: "2",
                        questionId: qId,

                    })
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        container.parents(".jump-box-term-title").find("h3").text(text);
                        container.parents(".jump-box-term-title").find(".jump-box-term-button,h3").show();
                        container.remove();

                        common.loading.hide();
                    }
                })

        },
//修改问题UI变化...
        showFixMember: function (e, t) {
            var that = this;
            var content = e.parents(".jump-box-member-item-button").siblings("span").text();

            e.parents(".jump-box-member-item-button").hide().siblings("span").hide();
            e.parents(".jump-box-member-item").append(t.templateList.addMember());
            e.parents(".jump-box-member-item").find(".jump-box-member-config").show();

            var container = e.parents(".jump-box-member-item").find(".jump-box-member-config");

            container.find(".jump-box-member-input").val(content);

            container.on("click", function (event) {
                if ($(event.target).hasClass("member-add-save")) {
                    if (container.find(".jump-box-member-input").val().trim().length === 0) {
                        // container.remove();
                        // e.parents(".jump-box-member-item-button").show().siblings("span").show();
                        that.deleteMember(container.parents(".jump-box-member-item").attr("data-id"), container.parents(".jump-box-member-item"))
                        return false;
                    } else {
                        t.saveFixMember(t, container);
                    }

                } else if ($(event.target).hasClass("term-add-cancel")) {
                    container.remove();
                    e.parents(".jump-box-member-item-button").show().siblings("span").show();
                }
            })
        },
        //保存修改问题...
        saveFixMember: function (t, container) {
            var text = container.find(".jump-box-member-input").val();


            $.ajax({
                url: t.XHRList.fixTerm,
                type: 'POST',
                dataType: 'json',
                beforeSend: function () {
                    common.loading.show();
                },
                timeout: 10000,
                data: {
                    paramJson: $.toJSON({
                        id: container.parents(".jump-box-member-item").attr("data-id"),
                        isValid: "1",
                        customerId: localStorage.getItem("userId"),
                        questionDesc: text,
                        questionType: "2",
                        questionId: container.parents(".jump-box-member-item").attr("data-id"),
                        fullPath: container.parents(".jump-box-term").attr("data-path"),
                    })
                }
            })
                .done(function (data) {
                    if (data.responseObject.responseStatus) {
                        container.parents(".jump-box-member-item").find("span").text(text).show();
                        container.parents(".jump-box-member-item").find(".jump-box-member-item-button").show();
                        container.remove();


                        common.loading.hide();
                    }
                })
        },
    };
    // container.init();
    return container;
});