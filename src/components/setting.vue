<template>
  <transition name="slide-top">
    <div class="setting">
      <header-list></header-list>
      <section class="setting-inner ">
        <section class="center-inner">
          <section class="center-inner-box">
            <section class="setting-center-form">
              <section class="setting-form-item">
                <figure class="setting-form-item-name">
                  <h4>姓名</h4>
                </figure>
                <figcaption class="setting-form-item-input">
                  <input type="text" name="name" v-show="false">
                  <input type="text" class="setting-form-input-item" placeholder="姓名" autocomplete="off" data-validate-info="isNoEmpty" name="name" v-model="userName" maxlength="10" @blur="nameCheck(errors)" @focus="userNameErrorMessage=''"  v-validate="'required|nameSpace|special'">
                </figcaption>
                <p class="error-text icon-errorTips" v-show="userNameErrorMessage.length>0"><span>{{userNameErrorMessage}}</span></p>
              </section>
              <section class="setting-form-item">
                <figure class="setting-form-item-name">
                  <h4>手机号码</h4>
                </figure>
                <figcaption class="setting-form-item-input">
                  <input type="text" name="mobile" v-show="false">
                  <input type="text" class="setting-form-input-item" placeholder="手机" autocomplete="off" data-validate-info="isMobile" name="mobile" v-model="mobile" @blur="nameCheck(errors)" @focus="mobileErrorMessage=''" v-validate="'required|mobile'">
                </figcaption>
                <p class="error-text icon-errorTips mobileTips" v-show="mobileErrorMessage.length>0" ><span>{{mobileErrorMessage}}</span></p>
                <!--<p class="error-text icon-errorTips mobileTips" v-show=" errors.has('mobile')" ><span>{{ errors.first('mobile') }}</span></p>-->
              </section>
              <section class="setting-form-item">
                <figure class="setting-form-item-name">
                  <h4>邮箱</h4>
                </figure>
                <figcaption class="setting-form-item-input">
                  <input type="text" name="mailBox" v-show="false">
                  <input type="text" class="setting-form-input-item" placeholder="邮箱" autocomplete="off" data-validate-info="isMailbox" name="mailBox" v-model="mailBox" @blur="nameCheck(errors)" @focus="mailBoxErrorMessage=''" v-validate="'required|mailBox'">
                </figcaption>
                <p class="error-text icon-errorTips" v-show="mailBoxErrorMessage.length>0"><span>{{mailBoxErrorMessage}}</span></p>
                <!--<p class="error-text icon-errorTips" v-show=" errors.has('mailBox')" ><span>{{errors.first('mailBox') }}</span></p>-->
              </section>
              <section class="setting-form-item">
                <figure class="setting-form-item-name">
                  <h4>原密码</h4>
                </figure>
                <figcaption class="setting-form-item-input">
                  <input type="password" name="passWord" v-show="false">
                  <input type="password" class="setting-form-input-item old-password" placeholder="当前使用的密码" autocomplete="off" data-validate-info="ajax" name="passWord" @blur="passCheck($event,errors)" v-model="oldPassword" @focus="oldPasswordErrorMessage=''" v-validate="'passw'">
                </figcaption>
                <p class="error-text icon-errorTips oldPassTip" v-show="oldPasswordErrorMessage.length>0"><span>{{oldPasswordErrorMessage}}</span></p>
                <!--<p class="error-text icon-errorTips oldPassTip" v-show="errors.has('oldPass')"><span>{{errors.first('oldPass')}}</span></p>-->

              </section>
              <section class="setting-form-item">
                <figure class="setting-form-item-name">
                  <h4>新密码</h4>
                </figure>
                <figcaption class="setting-form-item-input">
                  <input type="password" name="newPassword" v-show="false">
                  <input type="password" class="setting-form-input-item new-password" placeholder="新的密码" autocomplete="off" data-validate-info="newPass" name="newPassword" @blur="passCheck($event,errors)" v-model="newPassword" @focus="newPasswordErrorMessage=''" v-validate="'passw'">
                </figcaption>
                <p class="error-text icon-errorTips newPassTip" v-show="newPasswordErrorMessage.length>0">{{newPasswordErrorMessage}}</p>
                <p class="warn-text" v-show="!newPasswordErrorMessage.length>0"><span>6-20位字符</span></p>
              </section>
              <section class="setting-form-item">
                <figure class="setting-form-item-name">
                  <h4>确认密码</h4>
                </figure>
                <figcaption class="setting-form-item-input">
                  <input type="password" name="newPassword2" v-show="false">
                  <input type="password" class="setting-form-input-item double-password" placeholder="重新输入新密码" autocomplete="off" data-validate-info="double" name="newPassword2" @blur="passCheck($event,errors)" v-model="newPassword2" @focus="newPassword2ErrorMessage=''" v-validate="'passw'">
                </figcaption>
                <p class="error-text icon-errorTips doublePassTip" v-show="newPassword2ErrorMessage.length>0"><span>{{newPassword2ErrorMessage}}</span></p>
              </section>
            </section>
            <figure class="setting-form-btn">
              <button class="btn-primary" @click="save()">保存</button>
            </figure>
          </section>
        </section>
      </section>
    </div>
  </transition>
</template>
<script>
  import axios from  "axios";
  import {common, modules} from "common";
  import headerList from "../Header";
  import store from "@/store/store";

  export default{
    name: 'setting',
    data(){
      return {
        userName: '',
        mobile: '',
        oldMobile:'',
        mailBox: '',
        oldPassword: '',
        newPassword: '',
        newPassword2: '',
        userNameErrorMessage:'',
        mobileErrorMessage:'',
        mailBoxErrorMessage:'',
        oldPasswordErrorMessage:'',
        newPasswordErrorMessage:'',
        newPassword2ErrorMessage:''
      }
    },
    components: {
      headerList
    },
    beforeRouteLeave: (to, from, next) => {
      // ...
      if(to.name==="home"){
        store.commit('enableSearchFn',true);
      }
      next(true);
    },
    methods: {
      init(){
        this.storageGet()
        this.$store.state.searchStatus =false;
        store.commit('enableSearchFn',false);
      },
      storageGet(){
        this.userName = this.$store.state.userName;
        this.mobile = this.$store.state.mobile;
        this.oldMobile = this.$store.state.mobile;
        this.mailBox = this.$store.state.mailBox;
        this.userId = this.$store.state.userId;
      },
      nameCheck(errors){
        if(errors.has('name')){
          this.userNameErrorMessage=errors.first('name')
        }else if(errors.has('mobile')){
          this.mobileErrorMessage=errors.first('mobile')
        }else if(errors.has('mailBox')){
          this.mailBoxErrorMessage=errors.first('mailBox')
        }
      },
      passCheck(e,errors){
        if (e.target.value.length > 0) {
          if (e.target.dataset.validateInfo == "ajax") {
            if (errors.has('passWord')) {
              this.oldPasswordErrorMessage = errors.first('passWord')
            }
          }
          if (e.target.dataset.validateInfo == "newPass") {
            if (errors.has('newPassword')) {
              this.newPasswordErrorMessage = errors.first('newPassword')
            } else if (this.newPassword2.length>0&&this.newPassword !== this.newPassword2) {
              this.newPassword2ErrorMessage = "两次密码输入不一致，请重新输入"
            }
          }
          if (e.target.dataset.validateInfo == "double") {
            if (errors.has('newPassword2')) {
              this.newPassword2ErrorMessage = errors.first('newPassword2')
            } else if (this.newPassword !== this.newPassword2) {
              this.newPassword2ErrorMessage = "两次密码输入不一致，请重新输入"
            }
          }
        }
      },
      save () {
        let _this = this;
        let items = _this.$validator.errors.items;
        if (items.length > 0) {
          return;
        } else if (this.newPassword.length > 0 && this.newPassword2.length > 0 && this.newPassword == this.newPassword2 && this.oldPassword.length == 0) {
          this.oldPasswordErrorMessage = "密码不能为空";
          return;
        } else if (this.oldPassword.length > 0) {
          if (this.newPassword.length == 0) {
            this.newPasswordErrorMessage = "密码不能为空";
            return;
          }
          if (this.newPassword2.length == 0) {
            this.newPassword2ErrorMessage = "确认密码不能为空";
            return;
          }
          if (this.newPassword !== this.newPassword2) {
            return;
          }
        }
        let data = {
          customerId: this.userId,          //	string	是	用户id
          nickname: this.userName,          //	string	是	会员名称
          //sexId:'',                       //	string	是	性别1-男2-女 (产品需求暂时删掉)
          email: this.mailBox,              //	string	是	邮箱
          oldPasswd: this.oldPassword,
          newPasswd: this.newPassword,
          rePasswd: this.newPassword2
        };
        //手机号是否更改（若未修改不传）
        if( this.oldMobile != this.mobile){
            data.mobile = this.mobile;              //	string	是	手机号
        }
        debugger;
        axios({
          method: 'post',
          url: '/call/tocure/web/user/updateUniteInfo/',
          data: data,
          transformRequest: [function (data) {
            return "paramJson=" + JSON.stringify(data);
          }],
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(function (res) {
          if (res.data != null && res.data.responseObject.responseStatus) {
            if (res.data.responseObject.responseCode == '0B0001') {
              _this.mobileErrorMessage = res.data.responseObject.responseMessage;
            } else {
              _this.storageSet();
              common.popup({
                hasImg: "true",
                text: "保存成功"
              });
            }
          } else {
            if (data&&data.responseObject&&data.responseObject.responseCode&&data.responseObject.responseCode.length > 0) {
              _this.mobileErrorMessage = res.data.responseObject.responseMessage;
            } else {
              _this.oldPasswordErrorMessage = "密码错误，请重新输入";
            }
            common.popup({
              hasImg: "true",
              text: "保存失败"
            });
          }
        })
      },
      storageSet(){
        let _this = this;
        localStorage.setItem("mailBox",_this.mailBox);
        localStorage.setItem("mobile",_this.mobile);
        //localStorage.setItem("sex",_t.op.sex);
        localStorage.setItem("userName",_this.userName);
      },
    },
    mounted(){
      if (this.$store.state.userName == '') {
//        window.location.href = "http://localhost:8080/#/login"
        this.$router.push({
          name: "login",
        })
      } else {
        this.init();
      }
    },
    activated(){
       this.init();
    }
  }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
  @import "../scss/base.scss";
  @import "../scss/modules/_popup.scss";
  @import "../scss/modules/_modalBox.scss";
  .slide-top-enter-active,.slide-top-leave-active {
    transition: all 0.5s linear;
  }
  .slide-top-enter,.slide-top-leave-to{
    transform:translateY(-100%);
  }
  .setting-inner {
    height: 100%;
    .center-inner {
      text-align: center;
      overflow: auto;
      .center-inner-box {
        display: inline-block;
        padding-top: 100px;
        text-align: left;
      }
    }
    .setting-form-item {
      font-size: 0;
      margin: 20px 0;
      &-name {
        display: inline-block;
        vertical-align: middle;
        width: 70px;
        text-align: right;
        font-size: 16px;
        margin-right: 20px;
        color: #909090;

        & > h4 {
          font-weight: normal;
        }
      }
      &-input {
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
        color: #222;

        & > input {
          width: 315px;
          height: 40px;
          border-radius: 4px;
          background-color: #fff;
          padding: 12px 16px;
          box-sizing: border-box;
          border: 1px solid #E1E2E7;
          transition: border 0.4s linear;
          &:focus {
            border: 1px solid #7a8ec1;
          }
        }
      }
    }

    .setting-form-item-sex-selector {
      padding-left: 16px;
      font-size: 0;
      .setting-form-item-sex {
        display: inline-block;
        vertical-align: middle;
        margin-right: 62px;
        cursor: pointer;
        color: #222;
        font-size: 16px;
        & > span {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .sex-selector {
        display: inline-block;
        vertical-align: middle;
        @include circle(15px, #f4f6fb);
        margin-right: 15px;
        &-on {
          background-color: #4fc8d5;
        }
      }

    }

    .setting-form-btn {
      padding-left: 90px;
      width: 100%;
      box-sizing: border-box;
      & > button {
        width: 100%;
      }
    }
  }

  .setting-img {
    text-align: center;
    & > img {
      @include circle(98px);
      vertical-align: top;
    }
  }

  .icon-select-normal {
    & > span {
      vertical-align: middle;
      padding-left: 8px;
    }
    .icon-choice {
      display: inline-block;
      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        width: 14px;
        height: 14px;
        background: url("/static/img/img00/login/1_choose_sel_small.png");
        background-size: 100% 100%;
      }
      &.active {
        &:before {
          background: url("/static/img/img00/login/1_choose_nor_small.png");
        }
      }
    }
  }

  .error-text {
    margin-top: 10px;
    font-size: 14px;
    color: #F23E34;
    padding-left: 90px;
    /*display: none;*/
    & > span {
      vertical-align: middle;
      margin-left: 6px;
    }
  }

  .warn-text {
    margin: 10px 0 -10px 0;
    font-size: 14px;
    color: #F23E34;
    padding-left: 90px;
    & > span {
      vertical-align: middle;
      font-size: 10px;
      line-height: 10px;
      color: #CCCCCC;
      letter-spacing: 0;
    }
    &:before {
      content: '';
      @include square(10px);
      display: inline-block;
      vertical-align: middle;
      background: url("/static/img/img00/login/setting_ prompt.png") no-repeat;
      background-size: 100% 100%;
      margin: 0 10px 0 10px;
    }

  }
</style>
