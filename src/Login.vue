<template>
  <transition name="fade" appear>
    <section class="main-inner test">
      <header class="main-header">
        <article class="main-header-title">
          <i class="icon-logo"></i>
          <h1>唯医互联网骨科医院</h1>
        </article>
      </header>
      <section class="login-content-inner">
        <!--登录盒子-->
        <section class="login-content" id="ev-loginBox" style="display: inline-block;" v-show="loginFlag">
          <header class="login-title">
            用户登录
          </header>
          <section class="login-input-item">
            <h3><span>用户名</span></h3>
            <input type="text" class="login-input-box" v-model="userNameVal" @focus="userNameEvent"
                   v-validate="'required|mobile'" name="userName">
            <i class="icon-loginCancel" v-show="userNameVal.length > 0" @click="userLoginCancelClear()"></i>
            <p class="error-text icon-errorTips" v-show=" userNameError.length > 0 "><span>{{ userNameError }}</span></p>
            <!--<p class="error-text icon-errorTips" v-show=" errors.has('userNameVal')"><span>{{ errors.first('userNameVal') }}</span></p>-->
          </section>
          <section class="login-input-item">
            <h3><span>密码</span></h3>
            <input type="password" class="login-input-box" v-model="passWord" @focus="userNameEvent"
                   @keyup.13="submitEvent" v-validate="'required|passw'" name="passWord">
            <i class="icon-loginCancel" v-show="passWord.length > 0" @click="passWordCancelClear"></i>
            <p class="error-text icon-errorTips" v-show="passWordError.length > 0 "><span>{{passWordError}}</span></p>
            <!--<p class="error-text icon-errorTips" v-show=" errors.has('passWord')"><span>{{ errors.first('passWord') }}</span></p>-->
          </section>
          <button class="login-btn btn-primary" id="user-login-btn" @click="submitEvent()">{{loginStr}}</button>
          <footer class="login-forget-password" id="ev-forget-pwd"><a href="javascript:void(0)"
                                                                      @click="goToFixPassword()">忘记密码</a></footer>
        </section>
        <!--修改密码中的手机验证-->
        <section class="login-content" id="ev-validateCode" v-show="validateCodeFlag">
          <header class="login-title">忘记密码</header>
          <section class="login-input-item" data-path="1">
            <h3><span>手机号</span></h3>
            <input type="text" class="login-input-box" id="ev-validate-mobile" v-model="mobile" @focus="mobileEvent"
                   v-validate="'required|mobile'" name="phone">
            <i class="icon-loginCancel" v-show="mobile.length>0" @click="mobileCancelClear"></i>
            <p class="error-text icon-errorTips" id="ev-validate-mobile-error" v-show="phoneError.length>0"><span>{{phoneError}}</span>
            </p>
            <!--<p class="error-text icon-errorTips" v-show="errors.has('phone')"><span>{{errors.first('phone') }}</span></p>-->
          </section>
          <section class="login-input-item" data-path="1" id="validateCodeBox">
            <h3><span>验证码</span></h3>
            <input type="text" class="login-input-box login-input-validate-code" id="ev-validate-code"
                   @focus="validateCodeEvent" v-model="validateCode" v-validate="'required|num_length:4'"
                   name="validateCode">
            <i class="icon-loginCancel" v-show="validateCode.length > 0" @click="validateCodeCancelClear"></i>
            <button class="login-send-validate-code btn-primary" @click="sendValidateCode()"
                    :class="{ send:loginSendValidateCodeFlag}" :disabled="loginSendValidateCodeFlag">
              {{loginSendValidateCode}}
            </button>
            <p class="error-text icon-errorTips" id="ev-validate-code-error" v-show="validateCodeError.length>0"><span>{{validateCodeError}}</span>
            </p>
            <!--<p class="error-text icon-errorTips" v-show="errors.has('validateCode')"><span>{{errors.first('validateCode')}}</span></p>-->
            <p class="validate-code-tips" :class="{show:validateCodeTips}">获取验证码已超过10次，请明天再试</p>
          </section>
          <button class="login-btn btn-primary" id="ev-validate-submit" @click="validateSubmit()">提交</button>
          <footer class="login-forget-password" id="ev-login"><a href="javascript:void(0)" @click="goToLogin()">登录</a>
          </footer>

        </section>
        <!--确定密码盒子-->
        <section class="login-content" id="ev-fixPwd" v-show="passwordFlag">
          <header class="login-title">忘记密码</header>
          <section class="login-input-item" data-path="2">
            <h3><span>新密码</span></h3>
            <input type="password" class="login-input-box" id="ev-newpwd" v-model="newPassword" @focus="newPasswordEvent"
                   @blur="newPasswordBlur()" v-validate="'required|passw'" name="newPassword">
            <p class="error-text icon-errorTips" id="ev-newpwd-error" v-show="newPasswordError.length > 0"><span>{{newPasswordError}}</span>
            </p>
            <!--<p class="error-text icon-errorTips"  v-show="errors.has('newPassword')"><span>{{errors.first('newPassword')}}</span></p>-->
          </section>
          <section class="login-input-item" data-path="2">
            <h3><span>确认密码</span></h3>
            <input type="password" class="login-input-box" id="ev-requrire-newpwd" v-model="newPassword2"
                   @focus="newPasswordEvent2" name="newPassword2">
            <p class="error-text icon-errorTips" id="ev-requrire-newpwd-error" v-show="newPasswordError2.length > 0 ">
              <span>{{newPasswordError2}}</span></p>
            <!--<p class="error-text icon-errorTips"   v-show="errors.has('newPassword2')"><span>{{errors.first('newPassword2')}}</span></p>-->
          </section>
          <button class="login-btn btn-primary" id="ev-fix-submit" @click="savePassword()">保存</button>
        </section>
        <!--密码修改成功自动登录盒子-->
        <section class="login-content" id="ev-fix-finish" v-show="finishFlag">
          <figure class="login-fix-success-img">
            <img src="./assets/img00/login/login_ modify_finish.png" alt="">
          </figure>
          <figcaption class="login-fix-success-content">
            <h4>
              <span>成功修改密码，<em>{{successfulSecond}}</em>秒后将</span><a id="ev-goToLogin" href="javascript:void(0)"
                                                                     @click="autoLogin()">自动登录</a>
            </h4>
            <p>下次登录请使用新密码</p>
          </figcaption>
        </section>
      </section>
      <loading v-show="loadingShow"></loading>
    </section>
  </transition>
</template>
<script>
  import axios from  "axios";
  import api from '@/common/js/util.js'
  import qs  from "QS"
  import loading from "@/common/loading";
  import store from "./store/store";

  const XHRList = {
    userLoginUrl: "/call/passport/securitycheck",//用户登录
    sendValidate: "/call/customer/send/code/v1/create/",//获取验证码
    vValidate: "/call/customer/send/code/v1/update/",//手机验证码校验信息
    fixSubmit: "/call/tocure/web/user/updatePasswd/",//修改密码中的确认
    getLoginStatus: "/call/customer/status/v1/getMapById/"//当前登录状态
  };

  export default {
    name: 'test',
    data () {
      return {
        userNameVal: '',//用户登录号码
        passWord: '',//用户登录密码
        mobile: '',//用户发送验证码手机号

        loginFlag: true,//登录盒子
        validateCodeFlag: false,//获取验证码盒子
        passwordFlag: false,//确定密码盒子
        finishFlag: false,//密码修改成功自动登录盒子
        loginSubmit: false,
        loginMessage: false,


        newPassword: '',
        newPassword2: '',
        newPasswordError: '',  //新密码提示信息
        newPasswordError2: '', //新密码提示信息2

        userNameError: '',//用户登录号码错误提示语
        passWordError: '',//用户登录密码提示语
        phoneError: '',//用户发送验证码手机号提示语
        validateCodeError: '',

        loginStr: '登录',//登录按钮显示的术语；

        validateCode: '',    //验证码
        validateCodeId: '',  //验证码主键
        loginSendValidateCodeFlag: false, //
        loginSendValidateCode: '获取验证码',
        validateCodeTips: false, //验证提示

        time: null,//倒计时定时器

        customerId: '',

        successfulSecond: 3, //自动跳转秒数
        loadingShow: false,//loading是否显示
      }
    },
    methods: {
      userNameEvent(){
        this.userNameError = "";
        this.passWordError = "";
      },
      mobileEvent(){
        this.phoneError = "";
        this.validateCodeError = "";
      },
      validateCodeEvent(){
        this.validateCodeError = "";
      },
      newPasswordEvent(){
        this.newPasswordError = "";
        this.newPasswordError2 = "";
      },
      newPasswordEvent2(){
        this.newPasswordError2 = "";
      },
      userLoginCancelClear(){
        this.userNameVal = "";
      },
      passWordCancelClear(){
        this.passWord = "";
      },
      mobileCancelClear(){
        this.mobile = '';
      },
      validateCodeCancelClear(){
        this.validateCode = '';
      },
      //每次进入页面获取本地保存的用户手机号
      getUserName: function () {
        var userName = localStorage.getItem("userLoginName");
        if (userName) {
          this.userNameError = userName;
        }
      },
      //是否有name错误封装
      hasError(name){
        if (this.errors.has(name)) {
          this[name + "Error"] = this.errors.first(name);
          return false;
        } else {
          this[name + "Error"] = "";
          return true
        }
      },
      submitEvent(){
        let that = this;
        this.$validator.validateAll();
        this.hasError("userName");
        this.hasError("passWord");
        if (!this.userNameError && !this.passWordError) {
          that.loginStr = "登录中";
          this.loginFun(this.userNameVal, this.passWord, function () {
            that.loginStr = "登录";
            that.$router.push({
              path: "/"
            })
          });
        }
      },
      loginFun: function (userNameVal, passWord, callback) {
        let _this = this;
        _this.loadingShow = true;
        let data = {};
        data.j_username = "website;" + userNameVal + ";" + passWord + ";mobile";
        data.j_password = passWord;
        data.rememberMe = true;
        axios({
          method: 'post',
          url: XHRList.userLoginUrl,
          data: data,
          transformRequest: [function (data) {
            data = qs.stringify({
              j_username: data.j_username,
              j_password: data.j_password,
              rememberMe: data.rememberMe
            });
            return data;
          }]
        }).then(function (res) {
          _this.loadingShow = false;
          if (res.data.responseObject.responseStatus) {
            store.commit("setUserLoginName", userNameVal);
            localStorage.setItem("userLoginName", userNameVal);
            if (callback) {
              callback();
            }
          } else {
            _this.passWordError = res.data.responseObject.responseMessage;
            console.log("失败！");
          }

        }).catch(() => {
          _this.loadingShow = false;
        })
      },
      //点击忘记密码，弹出手机验证
      goToFixPassword(){
        this.loginFlag = false;
        this.validateCodeFlag = true;
        this.userNameEvent();
        this.userLoginCancelClear();
        this.passWordCancelClear();
      },
      //返回登录页
      goToLogin() {
        this.loginFlag = true;
        this.validateCodeFlag = false;
        this.mobileEvent();
        this.mobileCancelClear();
        this.validateCodeCancelClear();
        clearInterval(this.time);
        this.loginSendValidateCodeFlag = false;
        this.loginSendValidateCode = "获取验证码";
      },
      //获取验证码
      sendValidateCode(){
        let _this = this;
        this.$validator.validateAll();
        this.hasError("phone");
        if (this.phoneError.length) {
          return;
        }
        let data = {};//获取验证码的参数
        data.account = this.mobile;
        data.typeId = "1";
        data.codeLength = "4";
        data.accountType = "0";//0-手机 1-邮箱
        axios({
          method: 'post',
          url: XHRList.sendValidate,
          data: data,
          transformRequest: [function (data) {
            data = "paramJson=" + JSON.stringify(data);
            return data;
          }]
        }).then(function (res) {
          console.log(res);
          //发送验证码成功
          let data = res.data.responseObject;
          if (data.responseStatus) {
            _this.validateCodeId = data.responsePk;
            let i = 60;
            _this.loginSendValidateCodeFlag = true;
            _this.loginSendValidateCode = i + "S";
            _this.time = setInterval(function () {
              i--;
              _this.loginSendValidateCode = i + "S";
              if (parseInt(_this.loginSendValidateCode) == 0) {
                clearInterval(_this.time);
                _this.loginSendValidateCodeFlag = false;
                _this.loginSendValidateCode = "获取验证码";
              }
            }, 1000);
          } else if (data.responseCode == "SMS0003") {
            _this.loginSendValidateCodeFlag = false;
            _this.loginSendValidateCode = "重新获取";
            _this.validateCodeTips = true;
            setTimeout(function () {
              _this.validateCodeTips = false;
            }, 3000)
          } else if (data.responseCode == "0B0001") {
            _this.loginSendValidateCodeFlag = false;
            _this.phoneError = data.responseMessage;
          }

        }).catch(function (error) {
          console.log(error);
        })
      },
      //点击提交验证验证码是否正确
      validateSubmit () {
        let _this = this;
        this.$validator.validateAll();
        this.hasError("phone");
        this.hasError("validateCode");
        if (!this.phoneError && !this.validateCodeError) {
          _this.loadingShow = true;
          let data = {
            account: _this.mobile,            //手机号
            validCode: _this.validateCode,    //string	是	验证码CODE
            id: _this.validateCodeId,         //string	是	验证码主键
            isValid: "1"                      //修改验证码信息
          };
          axios({
            method: 'post',
            url: XHRList.vValidate,
            data: data,
            transformRequest: [function (data) {
              data = "paramJson=" + JSON.stringify(data);
              return data;
            }]
          }).then(function (res) {
            _this.loadingShow = false;
            let data = res.data.responseObject;

            if (data.responseStatus) {
              if (data.responseCode == "success") {
                _this.customerId = data.responsePk;
                _this.validateCodeFlag = false;
                _this.passwordFlag = true;
              } else {
                _this.validateCodeError = data.responseMessage;
              }
            } else {
              //验证码失败
              _this.validateCodeError = data.responseMessage;
            }
          }).catch(function (error) {
            _this.loadingShow = false;
            console.log("失败:" + error);
          })


        }
      },
      newPasswordBlur(){
        this.$validator.validateAll();
        this.hasError("newPassword");
      },
      savePassword () {
        let _this = this;
        this.$validator.validateAll();
        this.hasError("newPassword");
        if (_this.newPassword2 === "") {
          _this.newPasswordError2 = "请确认新密码";
          return false;
        }
        if (_this.newPasswordError2 || _this.newPasswordError) {
          return false;
        }
        if (_this.newPassword === _this.newPassword2) {
          _this.loadingShow = true;
          let data = {
            customerId: _this.customerId,
            passwd: _this.newPassword
          };
          axios({
            method: "post",
            url: XHRList.fixSubmit,
            data: data,
            transformRequest: [function (data) {
              data = "paramJson=" + JSON.stringify(data);
              return data;
            }]
          }).then(function (res) {
            if (res.data.responseObject.responseStatus) {
              _this.loadingShow = false;
              _this.loginFun(_this.mobile, _this.newPassword, function () {
                //用户使用新密码登录，返回cookie,下次实现用户自动登录
                _this.passwordFlag = false;
                _this.finishFlag = true;
                let time, i = 3;
                _this.successfulSecond = i + "S";
                time = setInterval(function () {
                  i--;
                  _this.successfulSecond = i + "S";
                  if (parseInt(_this.successfulSecond) == 0) {
                    clearInterval(time);
                    _this.$router.push({
                      path: "/"
                    })
                  }
                }, 1000)
              })
            }
          }).catch(function (error) {
            console.log("更新代码失败！");
            console.log(error);
          })
        } else {
          _this.newPasswordError2 = "两次密码不一致";
        }
      },
      //自动登录按钮
      autoLogin: function () {
        let that = this;
        that.loginFun(that.mobile, that.newPassword, function () {
          //用户使用新密码登录，返回cookie，下次实现用户自动登录
          that.$router.push({
            path: "/"
          })
        });
      },
    },
    mounted(){
    },
    components: {
      loading
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" lang="scss" rel="stylesheet/scss" scoped>
  @import "./scss/base.scss";
  @import "scss/library/_common-modules";

  .main-inner {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }

  //头部
  .main-header {
    width: 100%;
    height: 70px;
    text-align: center;
    padding-left: 13px;
    padding-right: 40px;;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    line-height: 70px;
    z-index: 5;
    box-shadow: 0 2px 8px 0 #E5E9F4;
  }

  .main-header-title > h1 {
    display: inline-block;
    font-size: 20px;
    font-weight: 400;
    color: #6b748c;
    padding-left: 10px;
  }

  //登录内容框
  .login-content-inner {
    height: 100%;
    text-align: center;
    background-color: #f6f9fa;
    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
    }
  }

  .login-content {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    width: 500px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 70px 50px 50px;
    .login-title {
      text-align: center;
      font-size: 18px;
      color: #555;
      padding-bottom: 8px;

    }
  }

  .login-input-item {
    margin: 32px 0;
    position: relative;
    & > h3 {
      font-size: 14px;
      color: #909090;
      @include clearfix();
      margin-bottom: 10px;
      font-weight: normal;
    }
    .login-input-box {
      width: 100%;
      border-radius: 4px;
      border: 1px solid #E1E2E7;
      padding: 13.5px 16px;
      box-sizing: border-box;
      font-size: 16px;
      transition: border 0.4s linear;
      display: inline-block;
      vertical-align: middle;
      &:focus {
        border: 1px solid #7A8EC1;
      }
      &.login-input-validate-code {
        width: 298px;
      }
    }
    .save-password {
      float: right;
      cursor: pointer;
    }
    .error-text {
      margin-top: 10px;
      font-size: 14px;
      color: #F23E34;
      & > span {
        vertical-align: middle;
        margin-left: 6px;
      }
    }
  }

  .icon-select-normal {
    & > span {
      vertical-align: middle;
      padding-left: 8px;
    }
    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      width: 14px;
      height: 14px;
      background: url("assets/img00/login/1_choose_sel_small.png");
      background-size: 100% 100%;
    }
    &.active {
      &:before {
        background: url("assets/img00/login/1_choose_nor_small.png");
      }
    }
  }

  .login-btn.btn-primary {
    width: 100%;
  }

  .login-forget-password {
    text-align: center;
    margin-top: 24px;
    position: relative;
    & > a {
      font-size: 14px;
      color: #7A8EC1;
    }
    &:before, &:after {
      content: "";
      position: absolute;
      width: 158px;
      height: 1px;
      background: #E1E2E7;
      top: 50%;
      margin-top: -0.5px;
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }

  .login-send-validate-code {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    .send {
      background: #E1E2E7;
      color: #7A8EC1;
    }
  }

  .login-fix-success-img {
    text-align: center;
    & > img {
      width: 120px;
      height: 120px;
      vertical-align: top;
    }
  }

  .login-fix-success-content {
    text-align: center;
    margin-top: 80px;
    & > h4 {
      font-weight: normal;
      color: #555;
      font-size: 18px;
      em {
        font-style: normal;
      }
      a {
        color: #7A8EC1;
      }
    }
    & > p {
      font-size: 14px;
      margin-top: 16px;
      color: #808080;
    }
  }

  /*登录弹层样式*/
  .warpMarsk {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 2;

  }

  .loginMain {
    position: absolute;
    top: 180px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 3;
    width: 704px;
    padding-bottom: 82px;
    background-color: #fff;
  }

  .loginMain .loginClose {
    float: right;
    margin: 10px 10px 0 0;
  }

  .loginMain .loginClose a img {
    display: block;
  }

  .loginMain .loginLogo {
    width: 131px;
    height: 34px;
    background: url("//www.medplus.net/img/login/logo.png") no-repeat center center;
    margin: 0 auto;
    margin-top: 52px;
    margin-bottom: 35px;
  }

  .loginMain .loginInput {
    width: 348px;
    height: 48px;
    border: 1px solid #e5e5e5;
    margin: 0 auto;
    margin-top: 15px;
  }

  .loginMain .loginInput input {
    width: 332px;
    height: 46px;
    border: none;
    line-height: 48px;
    padding-left: 16px;
    font-size: 14px;
  }

  .loginMain .loginBtn {
    width: 350px;
    height: 50px;
    margin: 0 auto;
    line-height: 50px;
    background-color: #00aa66;
    text-align: center;
    margin-top: 30px;
  }

  .loginMain .loginBtn a {
    display: block;
    color: #fff;
    font-size: 18px;
  }

  .loginMain .loginBot {
    width: 220px;
    margin: 0 auto;
    margin-top: 50px;
  }

  .loginMain .loginBot p {
    float: left;
    font-size: 16px;
  }

  .loginMain .loginBot p a {
    color: #666666;
  }

  .loginMain .loginBot p a:hover {
    color: #00aa66;
  }

  .loginMain .loginBot .loginBotText {
    color: #e5e5e5;
    margin: 2px 10px 0 10px;
  }

  /*注册弹层样式*/
  .loginMain .loginText {
    font-size: 14px;
    color: #989898;
    line-height: 14px;
    text-align: center;
    margin-top: 30px;
  }

  .loginMain .loginText a {
    color: #363636;
  }

  .loginMain .loginBot div {
    text-align: center;
    font-size: 16px;
    color: #666666;
  }

  .loginMain .loginBot div a {
    color: #666666;
  }

  .loginMain .loginBot div a:hover {
    color: #00aa66;
  }

  /*注册报错弹层*/
  .loginMain .loginError {
    width: 350px;
    margin: 0 auto;
    margin-top: 12px;
    font-size: 14px;
    color: #45b780;
  }

  .loginMain .loginError span {
    float: left;
    width: 18px;
    height: 18px;
    margin-right: 7px;
    background: url("//www.medplus.net/img/login/erro.png") no-repeat center center;
  }

  .EV-close {
    height: 80px;
  }

  .icon-loginCancel {
    position: absolute;
    right: 20px;
    margin-top: -28px;
    display: block;
    font-size: 0;
    cursor: pointer;
    &:before {
      content: '';
      display: block;
      font-size: 13px;
      width: 8px;
      height: 8px;
      background: url("./assets/img00/login/login_cancel.png") no-repeat center;
    }
  }

  .login-input-validate-code ~ .icon-loginCancel {
    display: block;
    right: 30%;
    margin-top: -30px;
  }

  .login-send-validate-code.send {
    background: #E1E2E7;
    color: #7A8EC1;
  }

  .login-send-validate-code.disabled {
    background: #E1E2E7;
    color: #ffffff;
  }

  .login-send-validate-code.btn-primary {
    width: 86px;
    height: 50px;
  }

  .btn-primary {
    height: 50px;
  }

  //验证码次数超过限制的提示框
  .login-input-item .validate-code-tips {
    opacity: 0;
    z-index: -1;
    transition: opacity 0.5s;
    height: 50px;
    width: 246px;
    background-color: #ffffff;
    box-shadow: 0 0 20px 0 rgba(153, 167, 208, 0.35);
    position: absolute;
    font-size: 13px;
    line-height: 50px;
    text-align: center;
    color: #F23E34;
    left: 154px;
    top: 94px;
    border-radius: 4px;
    &::after {
      display: block;
      content: "";
      width: 11px;
      height: 11px;
      position: absolute;
      right: 36px;
      top: -4px;
      transform: rotate(45deg);
      background-color: #ffffff;
    }
    &.show {
      opacity: 1;
      z-index: 2
    }
  }
</style>
