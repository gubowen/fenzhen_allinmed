/**
 * @Desc：个人设置
 * @Usage:
 * @Notify：
 * @Depend：jQuery toJson common
 *
 * Created by qiangkailiang on 2017/3/2 Extend by JuKun on 2017/3/27
 */
define([
    'jquery',
    "text!selfSettingTemplate",
    "common",
    "toJSON",
    "tabView"
], function ($, selfText,common,toJSON, TabsViewChange) {

    var container = {
        op:{

        },
        path:{
            saveSet:'/call/tocure/web/user/updateUniteInfo/',   //保存个人设置
            getPass:'/call/tocure/web/user/getWebUser/'          //获取用户密码
        },
        init:function(){
            var _t = this;
            $('.main-header').on("click",".ev-selfSetting",function(){
                $('.main-inner').append(selfText);
                $($('.center-inner')[0]).hide();
                _t.storageGet();
                _t.pageClick();
            });
        },
        storageGet:function(){
            var _t = this;
            _t.op.mailBox=localStorage.getItem("mailBox");
            _t.op.mobile = localStorage.getItem("mobile");
            //_t.op.sex=localStorage.getItem("sex");              //性别暂时不处理
            _t.op.userName=localStorage.getItem("userName");
            _t.op.userId=localStorage.getItem("userId");
            if(_t.op.userName.length>0){
                $('.setting-form-input-item[data-validate-info=isNoEmpty]').val(_t.op.userName).attr("data-validate","true");
            }
            if(_t.op.mobile.length>0){
                $('.setting-form-input-item[data-validate-info=isMobile]').val(_t.op.mobile).attr("data-validate","true");
            }
            if(_t.op.mailBox.length>0){
                $('.setting-form-input-item[data-validate-info=isMailbox]').val($.trim(_t.op.mailBox)).attr("data-validate","true");
            }
            //if(_t.op.sex == "男"){
            //    $('.setting-form-item-sex-selector .setting-man').addClass('active').siblings().removeClass('active');
            //}else if(_t.op.sex == "女"){
            //    $('.setting-form-item-sex-selector .setting-women').addClass('active').siblings().removeClass('active');
            //}
        },
        storageSet:function(){
            var _t = this;
            localStorage.setItem("mailBox",_t.op.mailBox);
            localStorage.setItem("mobile",_t.op.mobile);
            //localStorage.setItem("sex",_t.op.sex);
            localStorage.setItem("userName",_t.op.userName);
        },
        pageClick:function(){
            var _t = this;
            //搜索输入框禁止输入
            $("input",".main-header-search").attr("readonly",true);
            //input失去焦点事件
            $("input", ".center-inner").blur(function () {
                var validateType = $(this).attr("data-validate-info");
                _t.validateCheck(validateType, this);
            });
            //保存
            $(".btn-primary").on('click', function () {
                var _nickname = '',
                    _nicknameStatus = '',   //姓名验证状态
                    _mobile = '',
                    _mobileStatus = '',     //手机验证状态
                    _email = '',
                    _emailStatus = '',      //邮箱验证状态
                    _oldPasswd = '',
                    _newPasswd = '',
                    _rePasswd = '',
                    _nameEle = $('.setting-form-input-item[data-validate-info=isNoEmpty]'),
                    _mobileEle = $('.setting-form-input-item[data-validate-info=isMobile]'),
                    _mailEle = $('.setting-form-input-item[data-validate-info=isMailbox]');
                $("input", ".setting-center-form").each(function () {
                    var validateType = $(this).attr("data-validate-info");
                    switch (validateType){
                        case "isNoEmpty":
                             _nickname = $(this).val();
                            _nicknameStatus = $(this).attr("data-validate");
                            if(_nickname.length>0){
                                _t.op.userName = _nickname;
                            }else{
                                return false;
                            }
                            break;
                        case "isMobile":
                             _mobile = $(this).val();
                            _mobileStatus = $(this).attr("data-validate");
                            if(_mobile.length>0){
                                _t.op.mobile = _mobile;
                            }else{
                                return false;
                            }
                            break;
                        case "isMailbox":
                             _email = $(this).val();
                            _emailStatus = $(this).attr("data-validate");
                            if(_email.length>0){
                                _t.op.mailBox = _email;
                            }else{
                                _t.op.mailBox = "";
                            }
                            break;
                        case "ajax":
                             _oldPasswd = $(this).val();
                            break;
                        case "newPass":
                             _newPasswd = $(this).val();
                            break;
                        case "double":
                             _rePasswd = $(this).val();
                            break;
                    }
                });
                var _data={
                    customerId:_t.op.userId,     //	string	是	用户id
                    nickname:_nickname,          //	string	是	会员名称
                    //sexId:$('.setting-form-item-sex.active').children("span").text(),       //	string	是	性别1-男2-女
                    //mobile:_mobile,              //	string	是	手机号
                    email:_email                 //	string	是	邮箱
                };
                //手机号未修改时不传
                if(_t.op.mobile == localStorage.getItem("mobile")){}else {
                    _data.mobile = _mobile;              //	string	是	手机号
                }
                if(_newPasswd.length>0){
                    _data.newPasswd = _newPasswd;     //新密码
                }
                if(_rePasswd.length>0){
                    _data.rePasswd = _rePasswd;       //确认密码
                }
                if(_oldPasswd.length>0){
                    _data.oldPasswd = _oldPasswd;     //原密码
                    if($('.setting-form-input-item.new-password').val().length ==0 || $('.setting-form-input-item.new-password').attr("data-validate") == "false"){
                        if($('.setting-form-input-item.new-password').val().length ==0){
                            $('.error-text.newPassTip').text("密码不能为空").show();
                        }else {
                            $('.error-text.newPassTip').text("密码长度应在6-20位之间").show();
                        }
                        $('.warn-text').hide();       //新密码为空
                    }else if($('.setting-form-input-item.double-password').val().length ==0 || $('.setting-form-input-item.double-password').attr("data-validate")== "false"){
                        if($('.setting-form-input-item.double-password').val().length ==0){
                            $('.error-text.doublePassTip').text("确认密码不能为空").show();                              //确认密码为空
                        }else {
                            $('.error-text.doublePassTip').text("密码长度应在6-20位之间").show();                              //确认密 码为空
                        }
                    }else if($('.setting-form-input-item.new-password').val()==$('.setting-form-input-item.double-password').val()){
                        //baseInfo and pass
                        _t.callAjax({
                            data:_data,
                            path:_t.path.saveSet,
                            callBack:function(data){
                                if(data!==null&&data.responseObject.responseStatus){
                                    _t.storageSet();
                                    common.popup({
                                        hasImg:"true",
                                        text:"保存成功"
                                    })
                                }else if(data==null){
                                    $('.error-text.oldPassTip').text("密码错误，请重新输入");
                                    $('.error-text.oldPassTip').show();
                                }else {

                                }
                            }
                        });
                    }else {
                        $('.error-text.doublePassTip').text("两次密码输入不一致，请重新输入").show();                              //确认密 码为空
                    }
                }else{
                    if($('.setting-form-input-item.new-password').val().length >0 ||$('.setting-form-input-item.double-password').val().length >0){
                        $('.error-text.oldPassTip').text("密码不能为空").show();
                    }else{
                        if(_nameEle.val().length>0&&_nameEle.attr("data-validate") =="true" ){
                            if(_mobileEle.val().length>0&&_mobileEle.attr("data-validate") =="true" ){
                                if(_mailEle.val().length>0&&_mailEle.attr("data-validate") =="true" ){
                                    _t.callAjax({
                                        data:_data,
                                        path:_t.path.saveSet,
                                        callBack:function(data){
                                            if(data!==null&&data.responseObject.responseStatus){
                                                _t.storageSet();
                                                common.popup({
                                                    hasImg:"true",
                                                    text:"保存成功"
                                                })
                                            }else{
                                                if(data.responseObject.responseCode.length>0){
                                                    $('.error-text.mobileTips').children().text(data.responseObject.responseMessage);
                                                    $('.error-text.mobileTips').show();
                                                }else{
                                                    $('.error-text.oldPassTip').text("密码错误，请重新输入");
                                                    $('.error-text.oldPassTip').show();
                                                }
                                            }
                                        }
                                    })
                                }else if(!_mailEle.val().length>0){
                                    _t.callAjax({
                                        data: _data,
                                        path: _t.path.saveSet,
                                        callBack: function (data) {
                                            if (data !== null && data.responseObject.responseStatus) {
                                                _t.storageSet();
                                                common.popup({
                                                    hasImg: "true",
                                                    text: "保存成功"
                                                })
                                            } else {
                                                if (data.responseObject.responseCode.length > 0) {
                                                    $('.error-text.mobileTips').children().text(data.responseObject.responseMessage);
                                                    $('.error-text.mobileTips').show();
                                                } else {
                                                    $('.error-text.oldPassTip').text("密码错误，请重新输入");
                                                    $('.error-text.oldPassTip').show();
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            });
            //复选框切换 //性别暂时不处理
            //$(".icon-select-normal",".setting-form-item-sex-selector").on("click",function(){
            //    $(this).addClass("active").siblings().removeClass("active");
            //    _t.op.sex = $(this).find('span').text();
            //});
            //返回首页
            $('.main-header-title.ev-goHomeBtn').on('click',function(){
                $('.setting-inner').remove();
                $($('.center-inner')[0]).show();
                $("input",".main-header-search").attr("readonly",false);
            })
        },
        validateCheck:function(validateType, _this) {
            switch (validateType) {
                case 'isNoEmpty': {
                    $(_this).validate({
                        errorEle: $(_this).parents(".setting-form-item").find('.error-text'),
                        rules: [{
                            rule: "isNoEmpty",
                            msg: "姓名不能为空！"
                        },{
                            rule: "nameSpace",
                            msg: "姓名不能有空格！"
                        },{
                            rule: "getCodeNum",
                            msg: "最多可输入10个字！"
                        }]
                    });
                break;
            }
                case 'isMobile':{
                    $(_this).validate({
                        errorEle: $(_this).parents(".setting-form-item").find('.error-text'),
                        rules: [{
                            rule: "isMobile",
                            msg: "手机号码输入有误，请重新输入"
                        }]
                    });
                    break;
                }
                case 'isMailbox': {
                    if($(_this).val().length>0){
                        $(_this).validate({
                            errorEle: $(_this).parents(".setting-form-item").find('.error-text'),
                            rules: [{
                                rule: "isMailbox",
                                msg: "邮箱输入有误，请重新输入"
                            }]
                        });
                    }else {
                        $(_this).attr("data-validate","true");
                        $(_this).parents(".setting-form-item").find('.error-text').hide();
                    }
                break;
                }
                case 'ajax': {
                    var _t = this,
                        _oldPass = $(_this).val(),
                        _data={};
                    if($(_this).val().length>0){
                        $(_this).validate({
                            errorEle: $(".oldPassTip"),
                            rules: [{
                                rule: "maxLength:20",
                                msg: "密码长度应在6-20位之间"
                            }, {
                                rule: "minLength:6",
                                msg: "密码长度应在6-20位之间"
                            },{
                                rule: "passwordRule",
                                msg: "密码格式不正确"
                            }]
                        });
                    }else{
                        $(_this).parents(".setting-center-form").find('.error-text').hide();
                    }
                    break;
                }
                case 'newPass':{
                    if($('.setting-form-input-item.old-password').val().length>0){
                        $(_this).validate({
                            errorEle: $(".newPassTip"),
                            rules: [{
                                rule: "isNoEmpty",
                                msg: "密码不能为空"
                            }, {
                                rule: "maxLength:20",
                                msg: "密码长度应在6-20位之间"
                            }, {
                                rule: "minLength:6",
                                msg: "密码长度应在6-20位之间"
                            },{
                                rule: "passwordRule",
                                msg: "密码格式不正确"
                            }]
                        });

                        if($('.setting-form-input-item.new-password').attr("data-validate")=="false"){
                            $('.warn-text').hide();
                        }else{
                            $('.warn-text').show();
                        }
                    }else{
                        $('.warn-text').show();           //6-20位原密码提示
                        $(_this).parents(".setting-center-form").find('.error-text')
                    }
                    break;
                }
                case 'double': {
                    if($('.setting-form-input-item.old-password').val().length>0){
                        var oldPassword = $('.new-password').val();
                        var newPassword = $('.double-password').val();
                        if (newPassword == "" || newPassword == null) {
                            $(_this).attr("data-validate", "false");
                            $(_this).parents(".setting-form-item").find('.error-text').css("display", "block").text("新密码不能为空，请重新输入");
                        } else if (oldPassword == newPassword) {
                            $(_this).attr("data-validate", "true");
                            $(_this).parents(".setting-form-item").find('.error-text').css("display", "none");
                        } else {
                            $(_this).attr("data-validate", "false");
                            $(_this).parents(".setting-form-item").find('.error-text').css("display", "block").text("两次密码输入不一致，请重新输入");
                        }
                    }
                    break;
                }
            }
        },
        checkPass:function(pv){
            if (pv.data.responseObject.responseStatus){
                var _md5 = pv.data.responseObject.responseMessage.userId+pv.oldPass,
                    _hash = hex_hmac_md5(pv.data.responseObject.responseMessage.userId,pv.oldPass);
                if(_hash==pv.data.responseObject.responseMessage.password){
                    $(pv.element).attr("data-validate", "true");
                    $(pv.element).parents(".setting-form-item").find('.error-text').hide();
                }else{
                    $(pv.element).attr("data-validate", "false");
                    $(pv.element).parents(".setting-form-item").find('.error-text').show().text("密码错误，请重新输入");
                }
            }else{
                $(pv.element).attr("data-validate", "false");
                $(pv.element).parents(".setting-form-item").find('.error-text').show().text("密码错误，请重新输入");
            }
        },
        callAjax:function(Dv){
            var _t = this,
                params = {paramJson: $.toJSON(Dv.data)};
            common.loading.show();
            $.ajax({
                url: Dv.path,
                data:params,
                type:'POST',
                dataType:'json',
                success:function(data){
                    Dv.callBack(data);
                    common.loading.hide();
                },
                error:function(){
                    common.loading.hide();
                }
            })
        }
    };
    container.init();
});