<template>
    <div class="userList">
        <header-list @searchCallback="searchPatient"></header-list>
        <div class="center-inner" :class="{'no-content':!noData}">
            <communication
                    :m.message.sync="message"
                    :n.sync="noData"
                    :targetData.sync="targetData"
                    :fastRelyStatus.sync="fastRelyStatusParent"
                    :watingTriage.sync="watingTriage"
                    :userListStatus.sync="userListStatus"
                    :userOnlineActive.sync="userOnlineActive"
                    :userWatingActive.sync="userWatingActive"
            >
            </communication>
            <aside class="center-inner-userlist">
                <article class="search-result-tips" v-if="filterFinish">
                    <p>点击<a href="javascript:void(0)" @click.stop="filterFinish=false">返回全部</a>，为您找到<span>0</span>条信息
                    </p>
                </article>
                <nav class="userlist-status">
                    <ul class="userlist-status-box tabsInner" id="ev-user-tabs">
                        <li class="userlist-status-item tabsItem"
                            data-role="ut-tabs-1"
                            @click="statusChange(1)"
                            v-bind:class="{ 'active': userListStatus.first,'new':newWaitingFlag}"
                        >
                            待分诊


                        </li>
                        <li class="userlist-status-item tabsItem"
                            data-role="ut-tabs-2"
                            @click="statusChange(2)"
                            v-bind:class="{ 'active': userListStatus.second,'new':newPatientFlag}"
                        >沟通中


                        </li>
                    </ul>
                    <i class="userlist-status-right" @click="sortShow()"></i>
                    <div class="userlist-status-sortList" v-show="sortFlag">
                        <ul>
                            <li @click="sort(1)" :class="{'active':sortActive==1}">患者剩余免费沟通时间:少-多</li>
                            <!--<li @click="sort(2)" :class="{'active':sortActive==2}">剩余时间从:多-少</li>-->
                            <!--<li @click="sort(3)" :class="{'active':sortActive==3}">等待时间从:少-多</li>-->
                            <li @click="sort(4)" :class="{'active':sortActive==4}">患者等待沟通时间:多-少</li>
                        </ul>
                    </div>
                    <audio v-if="$store.state.musicPlay" autoplay src="/static/img/audio/warningTone.mp3"
                           style="display: none"></audio> <!--新消息提示音-->
                </nav>
                <section class="userList-inner-content viewInner" :class="{'search-result':filterFinish}"
                         id="ev-user-inner">
                    <section class="userlist-mainList viewItem" data-role="ut-tabs-1"
                             v-show="userListStatus.status == 1">

                        <article v-show="userListWating.length > 0" @click="transformData(items,index)"
                                 :class="[{ active : userWatingActive == index }, 'userlist-mainList-item']"
                                 v-for="(items,index) in userListWating"
                                 :key="index"
                        >
                            <figure class="userlist-item-img">
                                <img v-bind:src="items.logoUrl" alt="">
                                <p v-show="items.messageAlert">{{items.messageAlert}}</p>
                            </figure>
                            <figcaption class="userlist-item-base-msg">
                                <h3>
                                    <span class="name">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span>
                                    <span class="category short"
                                          v-show="items.consultationState==5">重新分诊</span>
                                    <span class="category short"
                                          v-show="items.diagnosisContent == ''&& items.consultationState!=5">{{items.caseType | checkState}}</span>
                                    <span class="category short"
                                          v-show="items.diagnosisContent != ''&& items.consultationState!=5">{{items.diagnosisContent}}</span>
                                </h3>
                                <article>
                                    <span class="text">{{items.returnReason.length > 0 ? `由于${items.returnReason}，该患者被${items.doctorName}医生退回` : (items.patientSex == 1 ? '男' : '女'}}&nbsp;{{items.patientAge}}&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像资料" : "有影像资料"
                                    )}}</span>
                                </article>
                                <button class="get-triage btn-primary-small"
                                        @click.stop="getTriagePatient(items,index)">接诊
                                </button>
                            </figcaption>

                            <span class="time"> {{items.createTime | timeFormat}}</span>
                        </article>
                        <p class="userList-no-data" v-show="userListWating.length == 0">没有找到相应的患者</p>

                    </section>
                    <section class="userlist-mainList viewItem" data-role="ut-tabs-2"
                             v-show="userListStatus.status == 2">
                        <article v-show="userListOnline.length > 0" @click="transformData(items,index)"
                                 :class="[{ active : userOnlineActive == index }, 'userlist-mainList-item']"
                                 v-for="(items,index) in userListOnline"
                                 :key="index"
                        >
                            <figure class="userlist-item-img">
                                <img v-bind:src="items.logoUrl" alt="">
                                <p v-show="items.messageAlert">{{items.messageAlert}}</p>
                            </figure>
                            <figcaption class="userlist-item-base-msg">
                                <h3>
                  <span
                          class="name">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span>
                                    <span class="category short"
                                          v-show="!fixByCurrent(items,index)">{{items.caseType | checkState}}</span>
                                    <span class="category short"
                                          v-show="fixByCurrent(items,index)">{{userOnlineActive == index ? $store.state.currentItem.diagnosisContent : items.diagnosisContent}}</span>
                                </h3>
                                <article>
                                    <span class="text">
                                        {{items.returnReason.length > 0 ? `由于${items.returnReason}，该患者被${items.doctorName}医生退回` : (items.patientSex == 1 ? '男' : '女'}}&nbsp;{{items.patientAge}}&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像资料" : "有影像资料"
                                    )}}</span>
                                </article>
                                <!--<figure class="quit-triage">-->
                                <!--<span class="text">转移患者</span>-->
                                <!--<i class="quit-select" :class="{'off':!items.triageSelect,'on':items.triageSelect}"-->
                                <!--@click="selectQuitItem(items)"></i>-->
                                <!--</figure>-->
                            </figcaption>
                            <span class="time" ref="toTopTime"> {{items.createTime | timeFormat}}</span>
                        </article>
                        <p class="userList-no-data" v-show="userListOnline.length == 0">没有找到相应的患者</p>

                    </section>
                </section>
                <footer class="user-list-footer">
                    <button class="refresh-user-list-btn" @click="refreshList()">
                        <i class="icon-refresh-btn"><span>点击刷新</span></i>
                    </button>
                </footer>
            </aside>
            <record :recodrdData="message" v-if="noData" :watingTriage.sync="watingTriage"
                    :userListStatus.sync="userListStatus"></record>
        </div>
        <footer-list></footer-list>
        <check-history v-if="$store.state.checkHistoryFlag"></check-history>

    </div>
</template>
<script>
    import {common, modules} from "common";
    import api from './common/js/util';
    import TabsViewChange from "tabView";
    import downSelector from "downSelector";
    import ymd from "ymd";
    import record from "./record";
    import communication from "./communication";
    import Vue from "vue";
    import footerList from "./Footer"
    import headerList from "./Header"
    import checkHistory  from './components/CheckHistory'

    import triagePatient from "@/base/triagePatient";

    import store from "@/store/store";

    Vue.filter('timeFormat', function (time, a) {
        let result = "";
        let date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate(),
            h = date.getHours(),
            mm = date.getMinutes();
        let nowFirst = new Date(y + "/" + (m >= 10 ? m : "0" + m) + "/" + (d >= 10 ? d : "0" + d)).getTime(),
            timeFirst = new Date(time.substring(0, 10).replace(/-/g, "/")).getTime();
        let week = new Date(timeFirst).getDay();
        if (nowFirst === timeFirst) {
            result = time.substring(10, 16);
        } else if (parseInt((nowFirst / (60 * 60 * 24 * 1000) + 4) / 7) === parseInt((timeFirst / (60 * 60 * 24 * 1000) + 4) / 7)) {
            result = "星期" + common.numToChinese(week);
        } else {
            result = time.substring(0, 16);
        }
        return result;
    });

    Vue.filter('checkState', function (type, a) {
        let result = "";
        switch (parseInt(type)) {
            case 0:
            case 1:
            case 2:
                result = "咨询";
                break;
            case 3:
                result = "待检查";
                break;
        }
        return result;
    });
    const XHRList = {
        onlineUserList: "/call/customer/case/consultation/v1/getMapListByCustomerId/",
        watingUserList: "/call/customer/case/consultation/v1/getMapListForCase/"
    };
    export  default{
        name: 'userList',
        data(){
            return {
                userListData: "",
                userListOnline: [],
                userListWating: [],
                userWatingActive: -1,
                userOnlineActive: -1,
                questionShow: '',
                userName: "默认",
                message: {},
                userListStatus: {
                    status: "1",
                    first: true,
                    second: false
                },
                noData: false,
                data: '',
                targetData: {
                    account: '',
                    avatar: ''
                },
                filterMethod: {
                    conType: 0
                },
                fastRelyStatusParent: false,  //快捷提问
                watingTriage: false,
                filterFinish: false,
                newWaitingFlag: false,
                newPatientFlag: false,
                sortFlag: false,
                sortActive: '',
                popupShow: false,
                popupContent: {
                    text: "",
                    hasImg: false
                },

            }
        },
        components: {
            record,
            communication,
            headerList,
            footerList,
            checkHistory
        },
        watch: {
            'message.createTime' () {
                this.noData = true;
                this.$router.push({
                    name: "baseInfo",
                    params: {
                        num: this.data
                    }
                });
            },
            '$store.state.patientActiveIndex'(){
                this.userOnlineActive = 0;
            },
            '$store.state.userId'(){
                this.init();
            },
            '$store.state.patientList': {
                handler: (list, oldValue) => {
                    this.userListOnline = list;
                },
                deep: true
            },
            '$store.state.watingList': {
                handler: (list, oldValue) => {
                    this.userListWating = list;
                },
                deep: true
            },
            '$store.state.watingListRefresh'(flag){
                if (flag) {
                    this.getUserList('wating');
                    store.commit("watingListRefreshFlag", false);
                } else {
                    return;
                }
                if (flag) {
                    this.getUserList('wating');
                    store.commit("watingListRefreshFlag", false);
                } else {
                    return;
                }
            },
            '$store.state.newWating'(flag){
                let _this = this;
                this.newWaitingFlag = flag;
            },
            '$store.state.newOnline'(flag){
                let _this = this;
                _this.$store.commit('setMusicPlay', true);
                console.log("music2");
                setTimeout(function () {
                    console.log("music");
                    _this.$store.commit('setMusicPlay', false);

                }, 2000);
                this.newPatientFlag = flag;

            }
        },
        mounted(){
            if (this.$store.state.userId) {
                this.init();
                store.commit("setUsedReplyShow", false);
                store.commit("setFastReplyShow", false);
            }
        },
        activated(){

        },
        methods: {
            init(){
                this.$store.state.searchStatus = true;
                this.getUserList('wating');
                this.getUserList('online');
            },
            fixByCurrent(item, index){
                let flag = false;
                if (index === this.userOnlineActive) {
                    if (this.$store.state.currentItem.diagnosisContent) {
                        flag = true;
                    } else {
                        flag = false;
                    }
                } else {
                    if (item.diagnosisContent) {
                        flag = true;
                    } else {
                        flag = false;
                    }
                }

                return flag;
            },
            //给子组件传值..
            transformData (items, index) {
                store.commit("setUsedReplyShow", false);
                store.commit("setFastReplyShow", false);
                if (this.userListStatus.first) {
                    this.watingTriage = true;
                    this.userWatingActive = index;
                    store.commit("setInputReadOnly", true);

                    let waitingList = this.$store.state.watingList;
                    items.messageAlert = '';
                    waitingList[index] = items;
                    this.$store.commit("setWatingList", waitingList);


                    let waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                    if (waitingAlertList) {
                        delete waitingAlertList["0_" + items.caseId];
                        localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                    }
                    if (localStorage.getItem("waitingAlertList") == "{}") {
                        this.newWaitingFlag = false;
                    }

                } else {
                    this.watingTriage = false;
                    this.userOnlineActive = index;
                    store.commit("setInputReadOnly", false);

                    let patientList = this.$store.state.patientList;
                    items.messageAlert = '';
                    patientList[index] = items;
                    this.$store.commit("setPatientList", patientList);

                    let patientAlertList = JSON.parse(localStorage.getItem("patientAlertList"));
                    if (patientAlertList) {
                        delete patientAlertList["0_" + items.caseId];
                        localStorage.setItem("patientAlertList", JSON.stringify(patientAlertList));
                    }
                    if (localStorage.getItem("patientAlertList") == "{}") {
                        this.newPatientFlag = false;
                    }
                }
                this.message = items;

                this.$store.commit('setPatientId', items.patientId);
                this.$store.commit('setPatientName', items.patientName);
                this.$store.commit('setCaseId', items.caseId);
                localStorage.setItem("caseId", items.caseId);
                this.$store.commit("setConsultationId", items.consultationId);

                this.$store.commit("setCurrentItem", items);

                this.$store.commit('setSBIObject', {});

                let data = JSON.stringify(items);
                this.data = data;
                this.targetData.account = "0_" + items.caseId;
                this.targetData.avatar = items.logoUrl;
                this.fastRelyStatusParent = false;


            },
            //三个状态的点击切换（沟通中、已结束、被退回）
            statusChange (status) {
                //Tab 切换
                this.userListStatus.status = status;
                if (status == 1) {
                    this.userListStatus.first = true;
                    this.userListStatus.second = false;
                    this.message.userController = true;
                } else if (status == 2) {
                    this.userListStatus.first = false;
                    this.userListStatus.second = true;
                    this.message.userController = false;
                }
            },
            //患者列表
            //type:online为沟通中，wating待分诊
            getUserList(type, param){
                let _this = this;
                _this.userListData = '';
                _this.userListLoading = [];
                _this.userListEnd = [];
                _this.userListBack = [];
                let dataValue = Object.assign({
                    customerId: _this.$store.state.userId,
                    conState: type === "online" ? "0" : "2,4,5",
                    conType: 0,
                    sortType: -6

                }, param);
//        if (type==="online"){
//            dataValue=Object.assign(dataValue,{
//              conType: 0
//            })
//        }
//        store.commit("startLoading");
                api.ajax({
                    url: type === "online" ? XHRList.onlineUserList : XHRList.watingUserList,
                    method: "POST",
                    data: dataValue,
                    done(res) {
//            store.commit("stopLoading");
                        if (res.responseObject.responseData && res.responseObject.responseStatus) {
                            let dataList = _this.setSelectValue(res.responseObject.responseData.dataList);

                            let waitingAlertList = {};
                            let patientAlertList = {};
                            waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                            patientAlertList = JSON.parse(localStorage.getItem("patientAlertList"));

                            dataList.forEach(function (item, index) {
                                item.messageAlert = '';
                                if (waitingAlertList && waitingAlertList !== '{}') {
                                    for (let key in waitingAlertList) {
                                        if (key == ("0_" + item.caseId)) {
                                            item.messageAlert = waitingAlertList[key];
                                            _this.newWaitingFlag = true;
                                            _this.$store.commit('setMusicPlay', true);
                                            console.log("music2");
                                            setTimeout(function () {
                                                console.log("music");
                                                _this.$store.commit('setMusicPlay', false);

                                            }, 2000);
                                        }
                                    }
                                }

                                if (patientAlertList && patientAlertList !== '{}') {
                                    for (let key in patientAlertList) {
                                        if (key == ("0_" + item.caseId)) {
                                            item.messageAlert = patientAlertList[key];
                                            _this.newPatientFlag = true;
                                            _this.$store.commit('setMusicPlay', true);
                                            console.log("music2");
                                            setTimeout(function () {
                                                console.log("music");
                                                _this.$store.commit('setMusicPlay', false);

                                            }, 2000);
                                        }
                                    }
                                }
                            });
                            if (type === "online") {
                                _this.$store.commit("setPatientList", dataList);
                                _this.userListOnline = dataList ? dataList : [];
                            } else if (type === "wating") {
                                _this.$store.commit("setWatingList", dataList);
                                _this.userListWating = dataList ? dataList : [];
                            }
                        }
                    },
                    fail(err) {
                        console.log("请求失败：" + err);
                    }
                });
            },
            setSelectValue(dataList){
                let result = [];
                if (dataList) {
                    dataList.forEach((element, index) => {
                        result.push(Object.assign(element, {
                            triageSelect: false
                        }));
                    });
                }
                return result;
            },
            filterTemplateList (data) {
                return '<li class="custom-selector-item secondListTitle ' + (parseInt(data.treeLevel) === 3 ? 'result-item' : '') + '" data-down-role="' + data.regionId + '" data-level="' + data.treeLevel + '"><span>' + data.regionName + '</span></li>';
            },
            //患者搜索...
            searchPatient(content){
                this.filterMethod = Object.assign(this.filterMethod, {
                    selectName: content,
                });
                store.commit("startLoading");
                this.getUserList("wating", this.filterMethod);
                this.getUserList("online", this.filterMethod);
                store.commit("stopLoading");
//        this.filterFinish = true;
            },
            refreshList() {
                this.getUserList("wating", this.filterMethod);
                this.getUserList("online", this.filterMethod);
            },
            //选择退回患者
            selectQuitItem(item){
//        if (!item.triageSelect) {
//          //选中-增加一项待处理
//          item.triageSelect = true;
//          store.commit("setQuitPatientList", {
//            type: "add",
//            data: item
//          })
//        } else {
//          //取消-删除一项待处理
//          item.triageSelect = false;
//          store.commit("setQuitPatientList", {
//            type: "minus",
//            data: item
//          })
//        }
                this.userListOnline.forEach((element, index) => {
                    element.triageSelect = false;
                })
                item.triageSelect = true;

                store.commit("setQuitPatientItem", item)
            },
            //接诊
            getTriagePatient(item, index){
//                let _this = this ;
                store.commit("startLoading");
                triagePatient({
                    consultationId: item.consultationId,
                    customerId: this.$store.state.userId
                }, () => {
                    this.getUserList('wating');
                    store.commit("stopLoading");
                    store.commit("showPopup", {
                        hasImg: false,
                        text: "该患者已被其他分诊医生接诊！"
                    });
                }, (c) => {
                    this.getUserList('wating');
                    store.commit("stopLoading");
                    store.commit("showPopup", {
                        hasImg: false,
                        text: `您最多可以接诊${c}个患者！`
                    });
                }).then((res) => {
                    //患者未被抢单
//                    this.userListWating.removeByValue(item);
//                    this.userListOnline.unshift(item);


//                    let waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
//                    if (waitingAlertList) {
//                        for (let key in waitingAlertList) {
//                            if (key == ("0_" + item.caseId)) {
//                                delete waitingAlertList["0_" + items.caseId];
//                            }
//                        }
//                        localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
//                    }
//                    if (localStorage.getItem("waitingAlertList") == "{}") {
//                        this.newWaitingFlag = false;
//                    }

                    this.getUserList('wating');
                    this.getUserList('online');

                    this.transformData(item, index);

//
                    this.watingTriage = false;

                    this.userListStatus.status = 2;
                    this.userListStatus.first = false;
                    this.userListStatus.second = true;
                    store.commit("setInputReadOnly", false);
                    store.commit("stopLoading");
                }).catch((res) => {
                    console.log("网络异常...")
                });
            },
            sortShow(){
                this.sortFlag = !this.sortFlag;
            },
            sort(index){
                let _this = this;
                _this.sortActive = index;
                _this.sortFlag = false;
                switch (index) {
                    case 1:
                        _this.getUserList('wating', {'sortType': 5});
                        _this.getUserList('online', {'sortType': 5});
                        break;
                    case 2:
                        _this.getUserList('wating', {'sortType': 4});
                        _this.getUserList('online', {'sortType': 4});
                        break;
                    case 3:
                        _this.getUserList('wating', {'sortType': -5});
                        _this.getUserList('online', {'sortType': -5});
                        break;
                    case 4:
                        _this.getUserList('wating', {'sortType': -5});
                        _this.getUserList('online', {'sortType': -5});
                        break;
                    default:
                        _this.getUserList('wating', {'sortType': 6});
                        _this.getUserList('online', {'sortType': 6});
                }
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "./scss/base.scss";

    .userList {
        width: 100%;
        height: 100%;
    }

    .userlist-status {
        background-color: #fff;
        box-sizing: border-box;
        padding: 10px 14px;
        position: relative;
        &-box {
            text-align: center;
            font-size: 0;
            border: 1px solid #ACB1BE;
            border-radius: 4px;
            width: 90%;
            display: inline-block;

        }
        &-right {
            width: 15px;
            height: 35px;
            background: #eceff6 url("./assets/img00/common/vedio_play.png") no-repeat center center;
            background-size: 60% 60%;
            display: inline-block;
            vertical-align: middle;
            padding: 14px;
            border-radius: 4px;
            box-sizing: border-box;
        }
        &-sortList {
            position: absolute;
            top: 12px;
            right: -210px;
            width: 205px;
            z-index: 6;
            text-indent: 5px;
            ul {
                width: 100%;
                border-radius: 4px;
                overflow: hidden;
                box-shadow: 0 0 8px 0 rgba(153, 167, 208, 0.35);
                li {
                    width: 100%;
                    text-align: left;
                    padding: 5px 0 5px 0;
                    height: 20px;
                    line-height: 25px;
                    color: #808080;
                    font-size: 14px;
                    background: #fff;
                    &:hover {
                        background: #f6f9fa;
                    }
                    &.active {
                        background: #eceff6;
                    }
                }
            }
        }
        &-item {
            display: inline-block;
            font-size: 14px;
            color: #808080;
            padding: 12px 0;
            width: 50%;
            box-sizing: border-box;
            border-right: 1px solid #acb1be;
            cursor: pointer;

            &.new {
                position: relative;
                &:after {
                    content: '';
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: rgba(242, 62, 51, .9);
                    box-shadow: 0 1px 1px 0 rgba(45, 17, 14, .15);
                    position: absolute;
                    right: 5px;
                    top: 5px;
                }

            }
            &:nth-last-child(1) {
                border-right: none;
            }
            &.active {
                background-color: #7a8ec1;
                color: #fff;
            }
        }
    }

    .userlist-sortType {
        background-color: #fff;
        text-align: center;
        padding: 40px 0 12px 0;
        i {
            display: inline-block;
            cursor: pointer;
            margin-top: 5px;
        }
        &-item {
            display: inline-block;
            color: #222;
            border-right: 1px solid #e4e4e4;
            width: 90px;
            &:nth-last-child(1) {
                border-right: none;
            }
        }

        .custom-selector {
            display: inline-block;
            cursor: pointer;

            & > h3 {
                font-weight: normal;
                font-size: 16px;
                color: #808080;
                display: inline-block;
                min-width: 30px;
            }
            .time-title {
                font-size: 14px;
                font-weight: normal;
                margin-top: 15px;
            }

            .custom-selector-second-box {
                box-shadow: 0 0 8px 0 rgba(153, 167, 208, 0.35);
                border-radius: 4px;
                background-color: #fff;
                position: absolute;
                z-index: 5;
                text-align: left;
                font-size: 0;
                width: auto;
                margin-left: -20px;
                margin-top: 10px;

            }

        }

        #area-selector {
            h3 {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                width: 65px;
            }
            .custom-selector-second {
                width: auto;
            }
        }

    }

    .custom-selector-second {
        display: none;
        width: 80px;
        font-size: 12px;
        vertical-align: top;
        text-align: left;
        box-sizing: border-box;
        padding: 0 15px;
        max-height: 310px;
        overflow: auto;
        &.custom-selector-second-list {
            right: -100%;
        }
        & > .custom-selector-item {
            margin: 20px 0;
            width: 100%;
            & > span {
                display: block;
            }
            &.active > span {
                color: #2899e6;
            }
        }
    }

    .time-title {
        font-size: 13px;
        color: #909090;
        margin-bottom: 24px;
    }

    .userlist-mainList {
        overflow: auto;
        height: 88%;
    }

    .userlist-mainList-item {
        padding: 25px 20px 25px 40px;
        font-size: 0;
        background-color: #fff;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        display: flex;
        width: 100%;
        .get-triage {
            margin-top: 10px;
        }
        &.active {
            background-color: #f4f6fb;
            box-shadow: 0 0 8px 0 rgba(179, 205, 199, 0.45);
        }
        &:hover {
            background-color: #f4f6fb;
            box-shadow: 0 0 8px 0 rgba(179, 205, 199, 0.45);
            //&:before {
            //  content: '';
            //  display: block;
            //  position: absolute;
            //  top: 0;
            //  left: 0;
            //  bottom: 0;
            //  background-color: #4fc8d5;
            //  width: 5px;
            //}
        }
        .userlist-item-img {
            display: inline-block;
            vertical-align: middle;
            margin-right: 12px;
            position: relative;
            & > p {
                font-size: 15px;
                color: #FFFFFF;
                letter-spacing: 0;
                line-height: 15px;
                background: rgba(242, 62, 51, 0.90);
                box-shadow: 0 1px 1px 0 rgba(45, 17, 14, 0.35);
                border-radius: 10px;
                padding: 2px 6px 3px;
                position: absolute;
                top: 0;
                right: -10px;
            }
            & > img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                vertical-align: top;
            }
        }
        .userlist-item-msg {
            display: table-cell;
            width: 100%;
            vertical-align: top;
            font-size: 0;
            padding-left: 10px;
        }
        & > .time {
            font-size: 12px;
            color: #808080;
            letter-spacing: 0;
            line-height: 12px;
            position: absolute;
            right: 25px;
            top: 32px;
        }

    }

    .userlist-item-base-msg {
        //margin-top: 6px;
        display: inline-block;
        vertical-align: middle;
        width: 255px;
        & > h3 {
            font-size: 16px;
            color: #222222;
            display: inline-block;
            vertical-align: middle;
            padding-right: 5px;

            .name {
                font-size: 18px;
                color: #222222;
                letter-spacing: 0;
                line-height: 18px;
                padding: 0 8px 0 0;
            }

            .category {
                font-size: 13px;
                color: #6b748c;
                letter-spacing: 0;
                line-height: 13px;
                padding-left: 8px;
                border-left: 1px solid #e1e2e7;
                font-weight: 400;
                display: inline-block;
                vertical-align: middle;
                max-width: 125px;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
                overflow: hidden;
                &.short {
                    max-width: 65px;
                }
                span {
                    margin-right: 8px;
                }

            }
        }
        .userlist-item-msg-category {
            //@include clearfix();
            display: inline-block;
            vertical-align: middle;
            color: #222;
            border-left: 1px solid #e1e2e7;
            padding-left: 5px;

            & > span {
                padding-right: 7px;
                font-size: 12px;
            }
        }
        & > .time {
            float: right;
            font-size: 12px;
            color: #666;
        }
        .text {
            font-size: 13px;
            color: #808080;
            letter-spacing: 0;
            line-height: 13px;
            margin-top: 10px;
            display: inline-block;
            @include ellipsis();
            max-width: 250px;
        }
    }

    .userlist-item-msg-item {
        margin-top: 14px;
        font-size: 0;
        & > span {
            font-size: 12px;
            color: #666;
        }
        .sex {
            margin-right: 10px;
        }
        .age {
            margin-right: 10px;
        }
    }

    .user-list-footer {
        background: rgba(255, 255, 255, 0.97);
        box-shadow: 0 2px 6px 0 rgba(153, 167, 208, 0.62);
        border-radius: 4px;
        width: 350px;
        height: 40px;
        text-align: center;
        position: absolute;
        bottom: 50px;
        //opacity: .67;
        left: 20px;
        &:before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            height: 100%;
        }
        .refresh-user-list-btn {
            display: inline-block;
            vertical-align: middle;
        }
        .icon-refresh-btn {
            cursor: pointer;
            span {
                font-size: 16px;
                color: #7A8EC1;
                vertical-align: middle;
                padding-left: 4px;
            }
        }
    }

    .search-result-tips {
        display: block;
        text-align: center;
        background: #E8F6FD;
        height: 33px;
        line-height: 33px;
        padding: 0 15px;
        box-sizing: border-box;
        position: absolute;
        width: 356px;
        margin-left: 14px;
        margin-top: -28px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s linear;
        &.show {
            opacity: 1;
            visibility: visible;
        }
        & > p {
            font-size: 13px;
            color: #6B748C;
            display: inline-block;
            a, span {
                font-size: 13px;
                color: #F23E34;
                display: inline;
            }

        }
    }

    .userList-inner-content {
        overflow: auto;
        height: 100%;
    }

    .userList-no-data {
        font-size: 14px;
        color: #AAAAAA;
        text-align: center;
        margin-top: 52px;
    }

    .medical-record-title-text {
        height: 56px;
        width: 100%;
        box-sizing: border-box;
        padding-left: 20px;
        line-height: 56px;
        & > h2 {
            font-weight: normal;
            font-size: 16px;
            color: #555555;
            height: 100%;
            width: 100%;
            line-height: 56px;
        }
    }

    .medical-record-title {
        font-size: 0;
        padding: 18px 30px 0;
        box-sizing: border-box;
        .medical-record-img {
            display: inline-block;
            vertical-align: middle;
            margin-right: 12px;
            cursor: pointer;
            & > img {
                width: 70px;
                height: 70px;
                vertical-align: top;
            }
        }
        .medical-record-userdata {
            display: inline-block;
            vertical-align: middle;
            & > h3 {
                color: #222;
                font-size: 16px;
                font-weight: normal;
                .name {
                    font-size: 20px;
                    color: #222222;
                    vertical-align: middle;
                    letter-spacing: 0;
                    line-height: 20px;
                    max-width: 168px;
                    display: inline-block;
                }
                & > p {
                    display: inline-block;
                    vertical-align: bottom;

                    .age {
                        font-size: 16px;
                        color: #222222;
                        letter-spacing: 0;
                        line-height: 16px;
                        vertical-align: bottom;
                        margin-left: 12px;
                    }
                }

            }
            .medical-record-userdata-item {
                color: #222;
                font-size: 12px;
                margin-top: 16px;
                .status {
                    font-size: 15px;
                    color: #6B748C;
                    letter-spacing: 0;
                    line-height: 15px;
                    margin-right: 10px;
                }
                .category {
                    font-size: 15px;
                    color: #6B748C;
                    letter-spacing: 0;
                    line-height: 15px;

                }
            }
        }
    }

    .medical-record-detail {
        margin-top: 30px;
    }

    .tabsInner.medical-record-tabs {
        text-align: center;
        border-bottom: 1px solid #E1E2E7;
        font-size: 0;
        margin: 0 14px;
        box-sizing: border-box;
        & > .tabsItem {
            display: inline-block;
            font-size: 15px;
            color: #808080;
            padding: 0 2px;
            margin: 0 2.5px;
            cursor: pointer;
            box-sizing: border-box;
            padding-bottom: 10px;
            &.active {
                border-bottom: 4px solid #7a8ec1;
                color: #323D5E;
            }
        }
    }

    .medical-record-main {
        width: 100%;
        padding: 25px 28px;
        box-sizing: border-box;
        // height: 630px;
        //overflow: auto;
        //overflow-x:hidden;
    }

    .base-title {
        width: 54px;
        font-size: 13px;
        color: #555555;
        letter-spacing: 0;
        line-height: 14px;
        margin-right: 8px;
        text-align: right;
        display: inline-block;
        white-space: nowrap;

    }

    .base-title-long {
        width: 65px;
        margin-left: -12px;
    }

    .base-text {
        font-size: 14px;
        color: #222222;
        letter-spacing: 0;
        line-height: 14px;
        display: inline-block;
        width: 248px;
    }

    .sick-text {
        font-size: 14px;
        color: #808080;
        letter-spacing: 0;
        line-height: 14px;
    }

    .base-info {
        li {
            margin-top: 15px;
        }
        .select-120 {
            min-width: 119px;
        }
        .select-248 {
            min-width: 248px;
        }
        .base-input {
            background: #F9F9F9;
            border: 1px solid #E1E2E7;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 14px;
            line-height: 14px;
            width: 239px;
        }
        header {
            position: relative;
            margin-bottom: 30px;
            margin-top: 50px;
            z-index: 1;
            &:before {
                content: "";
                position: absolute;
                top: 50%;
                width: 216px;
                left: 50%;
                margin-left: -108px;
                border: 1px solid #E1E2E7;
            }
        }
        h2 {
            font-size: 12px;
            color: #AAAAAA;
            letter-spacing: 0;
            line-height: 12px;
            margin: 0 auto;
            width: 56px;
            background: #fff;
            text-align: center;
            position: relative;
            z-index: 10;
        }
        footer {
            .base-saveBtn {
                background: #7A8EC1;
                border-radius: 4px;
                width: 70px;
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                color: #fff;
                text-align: center;
            }
        }

        .userlist-sortType {
            background: #f9f9f9;
            border: 1px solid #e1e2e7;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 14px;
            line-height: 14px;
            height: 18px;
            width: 230px;
            display: inline-block;
            position: relative;
            .userlist-sortType-item {
                border: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                .custom-selector {
                    width: 100%;
                    height: 100%;
                    .custom-selector-title {
                        width: 100%;
                        font-size: 14px;
                        height: 100%;
                        line-height: 18px;
                        text-align: left;
                    }
                    .icon-downArrow:after {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                    }
                    .custom-selector-second-box {
                        margin-left: 0;
                    }
                }
            }
        }
    }

    .main-sick {
        .main-title {
            width: 52px;
            font-size: 13px;
            color: #555;
            letter-spacing: 0;
            line-height: 14px;
            margin-right: 8px;
            text-align: right;
            display: inline-block;
            white-space: nowrap;
        }
        .main-text {
            font-size: 14px;
            color: #808080;
            letter-spacing: 0;
            line-height: 1.5;
        }
        header {
            position: relative;
            margin-bottom: 30px;
            margin-top: 50px;
            &:before {
                content: "";
                position: absolute;
                top: 50%;
                width: 216px;
                left: 50%;
                margin-left: -108px;
                border: 1px solid #E1E2E7;
            }
        }
        li {
            margin-top: 24px;
        }
        h2 {
            font-size: 12px;
            color: #AAAAAA;
            letter-spacing: 0;
            line-height: 12px;
            margin: 0 auto;
            width: 92px;
            background: #fff;
            text-align: center;
            position: relative;
            z-index: 2;
        }
        select {
            background: #F9F9F9;
            border: 1px solid #E1E2E7;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 14px;
            line-height: 14px;
            min-width: 84px;
        }
        .select-120 {
            min-width: 119px;
        }
        .main-sick-input {
            background: #F9F9F9;
            border: 1px solid #E1E2E7;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 14px;
            line-height: 14px;
            width: 235px;
        }
    }

    .old-sick .old-sick-history-list {
        margin-top: 30px;
        textarea {
            height: auto;
            padding: 5px;
        }
    }

    .medical-title {
        white-space: nowrap !important;
    }

    .body-check {
        .select-130 {
            min-width: 118px;
        }
        .medical-title {
            width: 52px;
            font-size: 13px;
            color: #555;
            letter-spacing: 0;
            line-height: 14px;
            margin-right: 8px;
            text-align: right;
            display: inline-block;
            white-space: nowrap;
        }

        select {
            background: #F9F9F9;
            border: 1px solid #E1E2E7;
            border-radius: 4px;
            padding: 5px 0 5px 10px;
            font-size: 14px;
            line-height: 14px;
            min-width: 95px;
        }
    }

    .medical-record-form {
        overflow: auto;
        height: 630px;
        &.on {
            height: 320px;
        }
        .main-speak {
            .operation-name {
                margin-top: 100px;
            }

            header {
                text-align: center;
                margin-bottom: 30px;
                position: relative;
            }

            .sick-img-one {
                display: inline-block;
                position: relative;

            }

            .sick-img {
                width: 150px;
                height: auto;
            }
            .sick-dot {
                width: 25px;
                height: 25px;
                position: absolute;
                background: url("./assets/img00/employee/dot.png") no-repeat;
                background-size: 100% 100%;
            }

            .sick-info {
                font-size: 14px;
                color: #808080;
                letter-spacing: 0;
                line-height: 1.5;
            }
            .J-consult {
                //display: none;
            }

            .J-order-operation {
                //display: none;
            }
            .sick-title {
                width: 78px;
                font-size: 13px;
                color: #555555;
                letter-spacing: 0;
                line-height: 14px;
                margin-right: 15px;
                text-align: right;
                display: inline-block;
            }
            li {
                margin-top: 24px;
            }

        }
        // max-height: 400px;
        .J-order-operation {
            //display: none;
        }
        input[type="text"] {
            background: #F9F9F9;
            border: 1px solid #E1E2E7;
            border-radius: 4px;
            padding: 5px 5px;
            font-size: 14px;
            line-height: 14px;
            height: 18px;
            width: 240px;
        }

        footer {
            text-align: right;
            margin-top: 24px;
            .detail-saveBtn {
                background: #7A8EC1;
                border-radius: 4px;
                width: 70px;
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                color: #fff;
                text-align: center;
                cursor: pointer;
                margin-right: 10px;
            }
        }
        .medical-title {
            width: 52px;
            font-size: 13px;
            color: #555;
            letter-spacing: 0;
            line-height: 14px;
            margin-right: 8px;
            text-align: right;
            display: inline-block;
            white-space: nowrap;
        }
        .medical-text {
            font-size: 14px;
            color: #808080;
            letter-spacing: 0;
            line-height: 14px;
            margin-right: 15px;

        }
        .medical-text-long {
            //margin-left: -28px;

            width: 80px;
        }
        select {
            background: #F9F9F9;
            border: 1px solid #E1E2E7;
            border-radius: 4px;
            padding: 5px 0 5px 0;
            font-size: 14px;
            line-height: 14px;
            min-width: 80px;
            width: 84px;
        }
        .select-100 {
            width: 250px;
        }
        textarea {
            background: #F9F9F9;
            border: 1px solid #E1E2E7;
            border-radius: 4px;
            width: 255px;
            height: 150px;
            vertical-align: top;
            padding: 10px;
            box-sizing: border-box;
        }
        li {
            margin-top: 25px;
        }
        li:first-child {
            margin-top: 15px;
        }
        .body-check {
            .input-95 {
                width: 72px;
            }
        }
        .major-check {
            input[type="text"] {
                margin: 0 auto;
                display: block;
            }
            header {
                position: relative;
                margin-bottom: 30px;
                margin-top: 50px;
                text-align: center;
                &:before {
                    content: "";
                    position: absolute;
                    top: 50%;
                    width: 216px;
                    left: 50%;
                    margin-left: -108px;
                    border: 1px solid #E1E2E7;
                }
                h2 {
                    font-size: 12px;
                    color: #AAAAAA;
                    letter-spacing: 0;
                    line-height: 12px;
                    margin: 0 auto;
                    padding: 0 10px;
                    background: #fff;
                    text-align: center;
                    position: relative;
                    z-index: 2;
                    display: inline-block;
                }
            }
            .img-check {
                ul {
                    li {
                        margin: 0 0 30px 0;
                        width: 104px;
                        height: 107px;
                        float: left;
                        text-align: center;
                        &.noData {
                            width: 100%;
                            height: 20px;
                            float: none;
                            color: #aaa;
                            font-size: 13px;
                        }
                        img {
                            width: 80px;
                            height: 80px;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        p {
                            margin-top: 12px;
                            font-size: 13px;
                            color: #555555;
                            letter-spacing: 0;
                            line-height: 13px;

                        }
                    }
                }
                ul:after {
                    content: "";
                    display: block;
                    clear: both;
                    visibility: hidden;
                }
            }
            .video-check {
                ul {
                    li {
                        margin: 0 0 30px 0;
                        height: 107px;
                        float: left;
                        text-align: center;
                        margin-right: 30px;
                        &.noData {
                            width: 100%;
                            height: 20px;
                            float: none;
                            margin-right: 0;
                            font-size: 13px;
                            line-height: 20px;
                            color: #aaa;
                        }

                        img {
                            width: auto;
                            height: 80px;
                            border-radius: 4px;
                        }
                        p {
                            margin-top: 12px;
                            font-size: 13px;
                            color: #555555;
                            letter-spacing: 0;
                            line-height: 13px;
                        }
                    }
                    &:first-child {
                        margin-left: 12px;
                    }
                }
                ul:after {
                    content: "";
                    display: block;
                    clear: both;
                    visibility: hidden;
                }
            }
            .detail-saveBtn {
                margin-right: 35px;
            }

        }
    }

    .ml20 {
        margin-left: 23px;
    }

    .ml15 {
        margin-left: 15px;
    }

    .mt10 {
        margin-top: 10px;
    }

    .mt20 {
        margin-top: 20px;
    }

    .center-inner-userlist {
        background-color: #fff;
        color: #fff;
        width: 385px;
        float: left;
        margin-left: -100%;
        height: 100%;
        border-right: 1px solid #ededed;
        box-sizing: border-box;
    }

    .quit-triage {
        margin-top: 10px;
        .text {
            vertical-align: middle;
            margin: 0;
        }
        .quit-select {
            width: 24px;
            height: 24px;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            margin-left: 5px;
            &.off {
                background: url("./assets/img00/common/multiplechoice_off@2x.png") no-repeat;
                background-size: contain;
            }
            &.on {
                background: url("./assets/img00/common/multiplechoice_on@2x.png") no-repeat;
                background-size: contain;
            }
        }
    }

    .fadeDown-enter-active,
    .fadeDown-leave-active {
        transition: all ease-in-out .5s
    }

    .fadeDown-enter,
    .fadeDown-leave-to
        /* .fade-leave-active in <2.1.8 */

    {
        opacity: 0;
        transform: translateY(-50%);
    }

</style>
