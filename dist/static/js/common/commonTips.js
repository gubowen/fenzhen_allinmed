/**
 * @name:
 * @desc: 提示框方法
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
//菊花图 读取中旋转
common.loading = {
    show: function () {

        if ($(".ev-loading").length == 0) {
            $("body").append('<section class="middle-tip-box ev-loading">' +

                '<figure class="middle-tip-box-text">' +
                '<img src="/static/image/img00/common/save_complete.png" alt="loading...">' +
                '</figure>' +

                '</section>');
        } else {
            $(".ev-loading").show();
        }
    },
    hide: function () {
        //console.log("loading-hide");
        $(".ev-loading").hide();
    }
};
//confirm模态窗
common.confirmBox = function (options) {

    if ($('.modal-confirm').length === 0) {
        var template = '<section class="modal-confirm">' +
            '<article class="modal-confirm-content">' +
            (function (list) {
                var result = "";
                $(list).each(function (index, element) {
                    result += '<p>' + element.text + '</p>';
                });
                return result;
            }(options.textList)) +
            '    </article>' +
            '    <figure class="modal-confirm-button">' +
            '        <button class="btn-ensure modal-confirm-ensure">' + options.ensure + '</button>' +
            '        <button class="btn-primary modal-confirm-cancel">' + options.cancel + '</button>' +
            '    </figure>' +
            '</section>';
        console.log(template);
        options.container.append(template);
        var windowHeight = $(window).height();

        var MCHeight = $(".modal-confirm").offset().top;
        console.log(windowHeight, MCHeight);
        if (MCHeight > (windowHeight - 155)) {
            $(".modal-confirm").addClass("upShow");
        }


        setTimeout(function (e) {
            $(".modal-confirm").addClass('show');
        }, 50);

        $(".modal-confirm-ensure").on("click", function (e) {
            e.stopPropagation();
            options.ensureCallback && options.ensureCallback();
            $(".modal-confirm").removeClass('show');

            return false;
        });
        $(".modal-confirm").on("transitionend", function (e) {
            e.stopPropagation();
            if (!$(".modal-confirm").hasClass("show")) {
                $(".modal-confirm").remove();
            }
        });
        $(".modal-confirm-cancel").on("click", function (e) {
            e.stopPropagation();
            options.cancelCallback && options.cancelCallback();
            $(".modal-confirm").removeClass('show');
            return false;
        });
    } else {
        $(".modal-confirm").addClass('show');
    }
};

//alert模态窗
common.alertBox = function (obj) {
    if ($(".big-confirm").size() === 0) {
        $("body").append('<section class="main-masker big-confirm">' +
            '    <section class="big-confirm-inner">' +
            '        <header class="big-confirm-title">' +
            '<h4>' + (obj.title ? obj.title : '') + '</h4>' +
            '            <i class="icon-close window-close"></i>' +
            '        </header>' +
            (function () {

                var result = "";
                if (obj.input) {
                    result = "<textarea class='big-confirm-input' placeholder='" + obj.placeholder + "'></textarea>";
                } else {
                    result = '        <article class="big-confirm-content" style="text-align:left;padding: 0 40px;line-height: 1.5;;">' +
                        '            <p>' + obj.text + '</p>' +
                        '        </article>';
                }
                return result;
            }()) +

            '        <footer class="big-confirm-btn">' +
            '            <button class="btn-primary ensure">' + obj.ensure + '</button>' +
            '        </footer>' +
            '    </section>' +
            '</section>');

        setTimeout(function () {

            $(".big-confirm").addClass("show");
        }, 30);

        $(".big-confirm-title .window-close").on("click", function () {
            $(".big-confirm").removeClass("show");
            $(".big-confirm").on("transitionend", function () {
                $(this).remove();
            });
        });
        $(".big-confirm-btn .ensure").on("click", function () {
            $(".big-confirm").removeClass("show");
            $(".big-confirm").on("transitionend", function () {
                $(this).remove();
            });
            obj.ensureCallback && obj.ensureCallback();
        })
    }
};
common.btnBox = function (options) {
    if ($('.btnBox-tips').length === 0) {
        var template = '<section class="btnBox-tips maskers " ' + options.direction + '>' +
            '    <section class="' + options.direction + '-box">' +
            '<article>' +
            (options.title ? '<h2>' + (options.title || '') + '</h2>' : '') +
            '</article>' +
            (function (list) {
                var result = "";
                $(list).each(function (index, element) {
                    result += '<a class="btnBox-btn ' + element.className + '" id="' + (element.id ? element.id : "") + '" href="' + element.href + '">' + element.content + '</a>';
                });

                return result;
            }(options.btn)) +
            '    </section>' +
            '</section>';

        $("body").append(template);

        setTimeout(function (e) {
            $(".btnBox-tips").addClass('show');
        }, 50);

        $(".btnBox-tips").on("click", function (e) {
            if ($(e.target).hasClass("btnBox-btn")) {
                return;
            }
            e.stopPropagation();

            $(".btnBox-tips").removeClass('show');
            $(".btnBox-tips").on("transitionend WebkitTransitionEnd", function () {
                $(".btnBox-tips").remove();
            });
        })
    } else {
        $(".btnBox-tips").addClass('show');
    }
};
//黑底提示框
common.popup = function (obj) {
    if ($(".popup").length == 0) {
        $("body").append('<section class="middle-tip-modal popup">' +

            '<figure class="middle-tip-box-text">' +
            (obj.hasImg ? '<img src="/static/image/img00/login/save_loading.png" alt="">' : '') +
            '<p class="popup-text">' + obj.text + '</p> ' +

            '</figure>' +
            '</section>');

        setTimeout(function () {
            $(".popup").addClass('show')
        }, 100);
    } else {
        $(".popup").addClass('show');
        $(".tipText").text(obj.text);
        if (!obj.hasImg) {
            $(".middle-tip-box-text img").hide();
        } else {
            $(".middle-tip-box-text img").show();
        }
    }
    setTimeout(function () {
        // $(".popup").removeClass('show');
        $(".popup").remove();
        obj.fn&&obj.fn();
    }, 3000)
};

//黑底提示框
common.popupRight = function (obj) {
    if ($(".popup").length == 0) {
        $("body").append('<section class="middle-tip-modal popup right">' +

            '<figure class="middle-tip-box-text">' +
            (obj.hasImg ? '<img src="/static/image/img00/login/save_loading.png" alt="">' : '') +
            '<p class="popup-text">' + obj.text + '</p> ' +

            '</figure>' +
            '</section>');

        setTimeout(function () {
            $(".popup").addClass('show')
        }, 100);
    } else {
        $(".popup").addClass('show');
        $(".tipText").text(obj.text);
        if (!obj.hasImg) {
            $(".middle-tip-box-text img").hide();
        } else {
            $(".middle-tip-box-text img").show();
        }
    }
    setTimeout(function () {
        $(".popup").removeClass('show');
    }, 3000)
};


common.bigConfirm = function (obj) {
    if ($(".big-confirm").size() === 0) {
        $("body").append('<section class="main-masker big-confirm">' +
            '    <section class="big-confirm-inner">' +
            '        <header class="big-confirm-title">' +
            '<h4>' + (obj.title ? obj.title : '') + '</h4>' +
            '            <i class="icon-close window-close"></i>' +
            '        </header>' +
            (function () {
                var result = "";
                if (obj.input) {
                    result = "<textarea class='big-confirm-input' placeholder='" + obj.placeholder + "'></textarea>";
                } else {
                    result = '        <article class="big-confirm-content">' +
                        '            <p>' + obj.text + '</p>' +
                        '        </article>';
                }
                return result;
            }()) +

            '        <footer class="big-confirm-btn">' +
            '            <button class="btn-border cancel">' + obj.cancel + '</button>' +
            '            <button class="btn-primary ensure">' + obj.ensure + '</button>' +
            '        </footer>' +
            '    </section>' +
            '</section>');

        setTimeout(function () {
            $(".big-confirm").addClass("show");
        }, 30);

        if (obj.input){
            if ($(".big-confirm-input").val().length===0){
                $(".btn-primary.ensure").addClass("disabled");
            }
        }
        $(".big-confirm-input").on("input propertychange",function () {
           if ($(this).val().length===0){
               $(".btn-primary.ensure").addClass("disabled");
           } else if ($(this).val().length>obj.max){
               $(".btn-primary.ensure").addClass("disabled");
               $(this).val($(this).val().substring(0,obj.max))
           } else{
               $(".btn-primary.ensure").removeClass("disabled");
           }
        });
        $(".big-confirm-title .window-close").on("click", function () {
            $(".big-confirm").removeClass("show");
            $(".big-confirm").on("transitionend", function () {
                $(this).remove();
            });
        });

        $(".big-confirm-btn .cancel").on("click", function () {
            $(".big-confirm").removeClass("show");
            $(".big-confirm").on("transitionend", function () {
                $(this).remove();
            });
            obj.cancelCallback && obj.cancelCallback();
        });
        $(".big-confirm-btn .ensure").on("click", function () {
            if ($(this).hasClass("disabled")){
                return false;
            }
            $(".big-confirm").removeClass("show");
            $(".big-confirm").on("transitionend", function () {
                $(this).remove();
            });
            obj.ensureCallback && obj.ensureCallback();
        })
    }
};