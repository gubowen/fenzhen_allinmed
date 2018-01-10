<template>
    <section>
        <transition name="fade" appear>
            <div id="header" class="main-header">
                <section class="main-header-search">
                    <input class="main-search" type="text" placeholder="请输入患者姓名" v-show="$store.state.enableSearch"
                           v-model="searchContent"
                           @keyup="searchPatient($event)" maxlength="20">
                    <i class="icon-header-search" v-show="this.enableSearch" @click="clickToSearch"></i>
                </section>
                <article class="main-header-title" @click="refresh()">
                    <i class="icon-logo"></i>
                    <h1>唯医互联网骨科医院</h1>
                </article>
                <article class="main-header-base-msg">
                    <article class="main-header-tips">
                        您好，<span>{{$store.state.userName}}</span>医生



                    </article>
                    <ul class="main-header-config">
                        <li class="main-header-config-item">
                            <router-link to="/setting" tag="a">个人设置</router-link>
                        </li>
                        <hr class="main-header-line">
                        <li class="main-header-config-item" @click="confirmShow = !confirmShow">退出</li>
                    </ul>
                </article>
            </div>
        </transition>
        <transition name="fade">
            <confirm :comfirmData="{content:'你确定要退出平台吗？'}" v-if="confirmShow" @ensureCallback="exitLogin"
                     @cancelCallback="cancelLogin"></confirm>
        </transition>
    </section>
</template>
<script>
    import axios from "axios";
    import ajax from "@/common/js/ajax";
    import confirm from "./common/bigConfim";
    export  default{
        name: 'header',
        data(){
            return {
                isActive: false,
                confirmShow: false,
                isActiveMessage: '在线',
                searchStatus: true,
                enableSearch: true,
                searchContent: "",
                globeSortFlag: false
            }
        },
        watch: {
            '$store.state.searchStatus': function () {
                this.searchStatus = this.$store.state.searchStatus;
            },
            '$store.state.enableSearch': function () {
                this.enableSearch = this.$store.state.enableSearch;
            }
        },
        methods: {
            init(){
                this.getUserStatus();
                this.getBaseMessage();
            //    this.searchStatus = this.$store.state.searchStatus;
                this.globeClick();
                this.getDeleteMsg();
            },
            searchPatient(e) {
                let that = this;

                clearTimeout(this.time);

                this.time = setTimeout(() => {
                    if (this.searchContent.length > 20) {
                        this.searchContent.substring(0, 20);
                    }
                    else if (this.searchContent.length === 0) {
                        this.$emit("searchCallback", "");
                    }
                    if (e.keyCode == 13) {
                        this.$emit("searchCallback", this.searchContent);
                    }
                }, 300);
            },
            clickToSearch(){
                this.$emit("searchCallback", this.searchContent);
//        if (this.searchContent.length === 0) {
//          return;
//        } else {
//
//        }
            },
            active(){
                this.isActive = !this.isActive;
            },
            changeStatus(){
                if (this.isActiveMessage == '休息') {
                    this.isActiveMessage = '在线';
                    this.isActive = false;
                    this.toggleStatus();
                } else {
                    this.isActiveMessage = '休息';
                    this.isActive = false;
                    this.toggleStatus();
                }
            },
            getUserStatus(){
                let _this = this;
                let data = {
                    customerId: _this.$store.state.userId,
                    firstResult: "0",
                    maxResult: "9999",
                    isValid: "1"
                };
                axios({
                    method: "post",
                    url: "/call/customer/status/v1/getMapById/",
                    data: data,
                    responseType: 'json',
                    transformRequest: [function (data) {
                        data = "paramJson=" + JSON.stringify(data);
                        return data;
                    }],
                    before: function () {
                        // common.loading.show();
                    }
                }).then(function (res) {
                    if (res.data.responseObject.responseData) {
                        var dataList = res.data.responseObject.responseData.dataList;

                        if (dataList && dataList.length) {

                            for (let i = 0; i < dataList.length; i++) {
                                switch (dataList[i].status) {
                                    case '0' :
                                        _this.isActiveMessage = '在线';
                                        break;
                                    case '1' :
                                        _this.isActiveMessage = '休息';
                                        break;
                                }
                                ;
                                //  common.loading.hide();
                            }
                        }
                    }
                })
            },
            toggleStatus(){
                let id = '';
                if (this.isActiveMessage == '在线') {
                    id = 0;
                } else {
                    id = 1;
                }

                let data = {
                    customerId: that.$store.state.userId,
                    status: id
                };
                axios({
                    method: "post",
                    url: "/call/customer/status/v1/update/",
                    data: data,
                    responseType: 'json',
                    transformRequest: [function (data) {
                        data = "paramJson=" + JSON.stringify(data);
                        return data;
                    }],
                    before: function () {
                        // common.loading.show();
                    }
                }).then(function (res) {
                    // common.loading.hide();
                })
            },
            getBaseMessage(){
                //检测登录状态 获取基本信息
                let _this = this;
                axios({
                    method: "post",
                    url: "/call/tocure/web/user/getWebUser/",
                    responseType: 'json',
//          transformRequest: [function (data) {
//            data = "paramJson=" + JSON.stringify(data);
//            return data;
//          }],
                    before: function () {
                        // common.loading.show();
                    }
                }).then(function (res) {
                    if (res.data.responseObject.responseStatus) {
                        if (res.data.responseObject.responseMessage) {
                            let dataList = res.data.responseObject.responseMessage;
                            _this.$store.state.userName = dataList.nickName;
                            _this.$store.state.mobile = dataList.mobile;
                            _this.$store.state.userId = dataList.uniteUserId;
                            _this.$store.state.mailBox = dataList.email;
                            _this.$store.state.sex = dataList.sex;

                            if (_this.$route.name === "setting") {
                                return;
                            } else {
                                _this.$router.push({
                                    path: "/"
                                })
                            }
                        }
                    } else {
                        _this.$router.push({
                            path: "/login"
                        })
                    }
                })
            },
            refresh(){

                if (window.location.href.indexOf("setting") != -1) {
//          this.$router.push({
//            name: "home"
//          })
                    this.$store.commit('enableSearchFn',true);    
                    if (window.location.origin.includes("triage.allinmed.cn")) {
                        this.$router.push({
                            path: "/"
                        })
                    }
                    if (!window.location.hostname.includes("triage.allinmed.cn")) {
                        this.$router.push({
                            path: "/"
                        })
                    }
                }
            },
            cancelLogin(){
                this.confirmShow = false;
            },
            exitLogin(){
                let _this =this;
                ajax({
                    url:"/call/tocure/web/user/logout/",
                    method: "POST",
                    done(res){
                        window.location.reload();
                        _this.confirmShow = false;
                    }
                });
                localStorage.removeItem('patientAlertList');
                localStorage.removeItem('waitingAlertList');
            },
            globeClick(){
                document.addEventListener('click', (e) => {
                    if (e.target.className != 'userlist-status-right' && e.target.className != 'userlist-status-sortList') {
                        this.globeSortFlag = false;
                        this.$emit('update:globeSortFlag', this.globeSortFlag);
                    }
                })
            },
            getDeleteMsg(){
                let _this =this;
                ajax({
                        url:"/call/comm/data/tool/v1/getMapList/",
                        method: "POST",
                        data: {
                            deviceType: 'PC',
                            sortType: 1,
                            visitSiteId:18
                        },
                        done(res){
                            if( res.responseObject.responseData){
                                res.responseObject.responseData.dataList.forEach(function(element,index){
                                        if(element.toolType == 4){
                                            _this.$store.commit('setDeleteMsgTime',element.toolConfig/100);
                                            console.log( _this.$store.state.deleteMsgTime);
                                        }
                                })
                            }

                        }
                })
            }
        },
        components: {
            confirm
        },
        mounted(){
            this.init();
        }

    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "./scss/base.scss";

    .fade-enter-active, .fade-leave-active {
        transition: all 0.5s linear;
    }

    .fade-enter, .fade-leave-to {
    }

    /**
     * @name: 主头部
     * @desc:
     * @example:
     * @depend:
     * @date: 2017/03/05
     * @author: qiangkailiang
     */
    .main-inner {
        width: 100%;
        height: 100%;
        background-color: #fff;
        overflow: hidden;
    }

    //头部
    .main-header {
        width: 100%;
        height: 50px;
        text-align: center;
        padding-left: 13px;
        padding-right: 40px;;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        line-height: 50px;
        z-index: 5;
        box-shadow: 0 2px 8px 0 #E5E9F4;
    }

    .main-header-search {
        float: left;
        position: relative;
        width: 386px;
        height: 70px;
        & > .main-search {
            background-color: #eceff6;
            width: 372px;
            height: 32px;
            line-height: 32px;
            padding-left: 14px;
            & > input {
                border-radius: 4px;
            }
        }

    }

    .main-header-title {
        display: inline-block;
        text-align: center;
        font-size: 0;
        & > h1 {
            display: inline-block;
            font-size: 16px;
            font-weight: normal;
            color: #6B748C;
            cursor: pointer;
            padding-left: 6px;
        }
    }

    .main-header-base-msg {
        float: right;
        text-align: left;
        font-size: 0;
        & > * {
            display: inline-block;

        }
        .main-header-tips {
            font-size: 16px;
            margin-right: 30px;
            color: #323D5E;
        }
        .main-header-config {
            text-align: center;
            font-size: 0;
            &-item {
                font-size: 16px;
                display: inline-block;
                position: relative;
                cursor: pointer;
                &.main-header-toggle {
                    a {
                        color: #00BEAF;
                    }
                    &:after {
                        transition: all 0.2s linear;
                    }
                    &.on {
                        &:after {
                            transform: rotate(180deg);
                        }
                        .main-header-toggle-list {
                            opacity: 1;
                            visibility: visible;
                        }
                    }
                }
                &.icon-downArrow:after {
                    margin-left: 10px;

                }
                a {
                    color: #808080;
                    display: inline-block;
                }
                //&:after{
                //  content: '';
                //  width:1px;
                //  height: 20px;
                //  background-color: #e1e2e7;
                //  position: absolute;
                //  right: 0;
                //  top: 50%;
                //  margin-top:-10px;
                //}
            }
        }
        .main-header-line {
            height: 18px;
            width: 1px;
            background: #E1E2E7;
            border: none;
            display: inline-block;
            vertical-align: -3px;
            margin: 0 15px;

        }
    }

    .main-header-toggle-list {
        background: #FFFFFF;
        box-shadow: 0 0 8px 0 rgba(153, 167, 208, 0.35);
        border-radius: 4px;
        width: 80px;;
        position: absolute;
        margin-top: -10px;
        margin-left: -10px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s linear;
        &-item {
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            color: #222222;
            display: block;
            &.active {
                display: none;
            }
        }
    }

    .icon-logo {
        display: inline-block;
        background: url("./assets/img00/header/logo_top.png") no-repeat;
        background-size: 100% 100%;
        width: 30px;
        height: 30px;
        vertical-align: middle;
        margin-top:-7px;
    }
</style>
