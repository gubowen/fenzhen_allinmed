<template>
    <div class="userList">
        <header-list @searchCallback="searchPatient" :globeSortFlag.sync="sortFlag"></header-list>
        <div class="center-inner" :class="{'no-content':!noData}">
            <communication
                    :m.message.sync="message"
                    :n.sync="noData"
                    :targetData.sync="targetData"
                    :fastRelyStatus.sync="fastRelyStatusParent"
                    :waitingTriage.sync="waitingTriage"
                    :userListStatus.sync="userListStatus"
                    :userOnlineActive.sync="userOnlineActive"
                    :userWaitingActive.sync="userWaitingActive"
            ></communication>
            <aside class="center-inner-userList">
                <article class="search-result-tips" v-if="filterFinish">
                    <p>点击<a href="javascript:void(0)" @click.stop="filterFinish=false">返回全部</a>，为您找到<span>0</span>条信息
                    </p>
                </article>
                <nav class="userList-status">
                    <ul class="userList-status-box tabsInner" id="ev-user-tabs">
                        <li class="userList-status-item tabsItem"
                            data-role="ut-tabs-1"
                            @click.stop="statusChange(1)"
                            v-bind:class="{ 'active': userListStatus.first,'new':newWaitingFlag}"
                        >
                            待分诊
                        </li>
                        <li class="userList-status-item tabsItem"
                            data-role="ut-tabs-2"
                            @click.stop="statusChange(2)"
                            v-bind:class="{ 'active': userListStatus.second,'new':newPatientFlag}"
                        >沟通中
                        </li>
                        <li class="userList-status-item tabsItem"
                            data-role="ut-tabs-3"
                            @click.stop="statusChange(3)"
                            v-bind:class="{ 'active': userListStatus.third,'new':newResetFlag}">
                            重新分诊
                        </li>
                    </ul>
                    <i class="userList-status-right" @click.stop="sortShow"></i>
                    <div class="userList-status-sortList" v-show="sortFlag">
                        <ul>
                            <li @click.stop="sort(0)" :class="{'active':sortActive==0}">患者最近消息发出时间由近到远</li>
                            <!--<li @click="sort(1)" :class="{'active':sortActive==1}">患者剩余免费沟通时间从少到多</li>-->
                            <!--<li @click="sort(2)" :class="{'active':sortActive==2}">剩余时间从:多-少</li>-->
                            <!--<li @click="sort(3)" :class="{'active':sortActive==3}">等待时间从:少-多</li>-->
                            <li @click.stop="sort(4)" :class="{'active':sortActive==4}">患者等待沟通时间从多到少</li>
                        </ul>
                    </div>
                    <audio v-if="$store.state.musicPlay" autoplay src="/static/image/audio/warningTone.mp3" style="display: none"></audio> <!--新消息提示音-->
                </nav>
                <section class="userList-inner-content viewInner" :class="{'search-result':filterFinish}" id="ev-user-inner">
                    <section class="userList-mainList viewItem" data-role="ut-tabs-1"
                             v-show="userListStatus.status == 1">
                        <!--<transition-group name="list-left" tag="section">-->
                        <article v-show="userListWaiting.length > 0" @click="transformData(items,index)"
                                 :class="[{ active : userWaitingActive == index }, 'userList-mainList-item']"
                                 v-for="(items,index) in userListWaiting"
                                 :key="index"
                        >
                            <figure class="userList-item-img">
                                <img v-bind:src="items.logoUrl" alt="">
                                <p v-show="items.messageAlert">{{items.messageAlert}}</p>
                            </figure>
                            <figcaption class="userList-item-base-msg">
                                <h3>
                                    <span class="name">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span><span
                                        class="category short" v-show="items.consultationState==5">待分诊</span><span
                                        class="category short"
                                        v-show="items.consultationState!=5">{{items| checkState}}</span>
                                    <!--<span class="category short" v-show="items.diagnosisContent != ''&& items.consultationState!=5">{{items.diagnosisContent}}</span>-->
                                </h3>
                                <article><span class="text">{{items.returnReason.length > 0 ? `由于${items.returnReason}，该患者被${items.doctorName}医生退回` : (items.patientSex == 1 ? '男' : '女')}}&nbsp;|&nbsp;{{items.patientAge}}&nbsp;|&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像" : "有影像"}}&nbsp;|&nbsp;{{items.partName}}</span></article>
                                <button class="get-triage btn-primary-small" @click.stop="getTriagePatient(items,index)">接诊
                                </button>
                            </figcaption>

                            <span class="time"> {{items.createTime | timeFormat}}</span>
                        </article>
                        <!--</transition-group>-->
                        <p class="userList-no-data" v-show="userListWaiting.length == 0">没有找到相应的患者</p>
                    </section>
                    <section class="userList-mainList viewItem" data-role="ut-tabs-2"
                             v-show="userListStatus.status == 2">
                        <article v-show="userListOnline.length > 0" @click="transformData(items,index)"
                                 :class="[{ active : userOnlineActive == index }, 'userList-mainList-item']"
                                 v-for="(items,index) in userListOnline"
                                 :key="index"
                        >
                            <figure class="userList-item-img">
                                <img v-bind:src="items.logoUrl" alt="">
                                <p v-show="items.messageAlert">{{items.messageAlert}}</p>
                            </figure>
                            <figcaption class="userList-item-base-msg">
                                <h3>
                                    <span class="name">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span><span
                                        class="category short" v-show="!fixByCurrent(items,index)">{{items | checkState}}</span><span
                                        class="category short" v-show="fixByCurrent(items,index)">{{userOnlineActive == index ? $store.state.currentItem.diagnosisContent : items.diagnosisContent}}</span>
                                </h3>
                                <article>
                                    <span class="text">
                                        {{items.returnReason.length > 0 ? `由于${items.returnReason}，该患者被${items.doctorName}医生退回` : items.patientSex == 1 ? '男' : '女'}}&nbsp;|&nbsp;{{items.patientAge}}&nbsp;|&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像" : "有影像"}}&nbsp;|&nbsp;{{items.partName}}</span>
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
                    <section class="userList-mainList viewItem" data-role="ut-tabs-3" v-show="userListStatus.status == 3">
                        <article v-show="userListReset.length > 0" @click="transformData(items,index)"
                                 :class="[{ active : userResetActive == index }, 'userList-mainList-item']"
                                 v-for="(items,index) in userListReset"
                                 :key="index"
                        >
                            <figure class="userList-item-img">
                                <img v-bind:src="items.logoUrl" alt="">
                                <p v-show="items.messageAlert">{{items.messageAlert}}</p>
                            </figure>
                            <figcaption class="userList-item-base-msg">
                                <h3>
                                    <span class="name">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span><span
                                        class="category short"
                                        v-show="!fixByCurrent(items,index)">{{items | checkState}}</span>
                                    <span class="category short" v-show="fixByCurrent(items,index)">{{userOnlineActive == index ? $store.state.currentItem.diagnosisContent : items.diagnosisContent}}</span>
                                </h3>
                                <article>
                                    <span class="text">
                                        {{items.returnReason.length > 0 ? `由于${items.returnReason}，该患者被${items.doctorName}医生退回` : items.patientSex == 1 ? '男' : '女'}}&nbsp;|&nbsp;{{items.patientAge}}&nbsp;|&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像" : "有影像"}}&nbsp;|&nbsp;{{items.partName}}</span>
                                </article>
                                <button class="get-triage btn-primary-small"
                                        @click.stop="getTriagePatient(items,index)">接诊
                                </button>
                            </figcaption>
                            <span class="time" ref="toTopTime"> {{items.createTime | timeFormat}}</span>
                        </article>
                        <p class="userList-no-data" v-show="userListReset.length === 0">没有找到相应的患者</p>
                    </section>
                </section>
                <footer class="user-list-footer">
                    <button class="refresh-user-list-btn" @click="refreshList()">
                        <i class="icon-refresh-btn"><span>点击刷新</span></i>
                    </button>
                </footer>
            </aside>
            <record :recodrdData="message" v-if="noData" :waitingTriage.sync="waitingTriage" :userListStatus.sync="userListStatus"></record>
        </div>
        <footer-list></footer-list>
        <check-history v-if="$store.state.checkHistoryFlag"></check-history>
    </div>
</template>
<script>
    import {common, modules} from "common";
    import api from "./common/js/util/util";
    import TabsViewChange from "tabView";
    import downSelector from "downSelector";
    import ymd from "ymd";
    import record from "./record";
    import communication from "./communication";
    import Vue from "vue";
    import footerList from "./Footer";
    import headerList from "./Header";
    import checkHistory from "./components/CheckHistory";

    import triagePatient from "@/base/triagePatient";

    import store from "@/store/store";

    Vue.filter("timeFormat", function (time, a) {
        let result = "";
        let date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate(),
            h = date.getHours(),
            mm = date.getMinutes();
        let nowFirst = new Date(
            y + "/" + (m >= 10 ? m : "0" + m) + "/" + (d >= 10 ? d : "0" + d)
            ).getTime(),
            timeFirst = new Date(time.substring(0, 10).replace(/-/g, "/")).getTime();
        let week = new Date(timeFirst).getDay();
        if (nowFirst === timeFirst) {
            result = time.substring(10, 16);
        } else if (
            parseInt((nowFirst / (60 * 60 * 24 * 1000) + 4) / 7) ===
            parseInt((timeFirst / (60 * 60 * 24 * 1000) + 4) / 7)
        ) {
            result = "星期" + common.numToChinese(week);
        } else {
            let windowWidth = $(window).width();
            if(windowWidth <= 1440){
                result = time.substring(5, 16);
            }else{
                result = time.substring(0, 16);
            }
        }
        return result;
    });

    Vue.filter("checkState", function (items, a) {
        let result = "";

        switch (parseInt(items.consultationState)) {
            case -1:
                if (items.consultationType === 0) {
                    result = '待分诊';
                    break;
                } else {
                    result = '待接诊';
                    break;
                }
            case  0:
                result = '沟通中';
                break;
            case  1:
                result = '已结束';
                break;
            case  2:
                result = "拒绝接诊";
                break;
            case  3:
                result = "超时未接诊";
                break;
            case  4:
                result = "待分诊";
                break;  //新用户
            case  5:
                result = "待分诊";
                break;  //释放
            case  6:
                result = "已上传资料";
                break;
            case  7:
                result = "分诊拒绝";
                break;
            case  8:
                result = "分诊完成";
                break;
            case  9:
                result = "待检查";
                break;
            case 10:
                result = "已推荐";
                break;
            case 11:
                result = "超时未回复";
                break;
        }
        return result;
    });
    const XHRList = {
        onlineuserList: "/call/customer/case/consultation/v1/getMapListByCustomerId/",
        waitinguserList: "/call/customer/case/consultation/v1/getMapListForCase/",
        resetuserList: "/call/customer/case/consultation/v1/getMapListForCase/"
    };
    export default {
        name: "userList",
        data() {
            return {
                userListData: "",
                userListOnline: [],
                userListWaiting: [],
                userListReset: [],
                userWaitingActive: -1,
                userOnlineActive: -1,
                userResetActive: -1,
                questionShow: "",
                userName: "默认",
                message: {},
                userListStatus: {
                    status: "1",
                    first: true,
                    second: false,
                    third: false
                },
                noData: false,
                data: "",
                targetData: {
                    account: "",
                    avatar: ""
                },
                filterMethod: {
                    conType: 0
                },
                fastRelyStatusParent: false, //快捷提问
                waitingTriage: false,
                filterFinish: false,
                newWaitingFlag: false,
                newPatientFlag: false,
                newResetFlag: false,
                sortFlag: false,
                sortActive: "",
                popupShow: false,
                popupContent: {
                    text: "",
                    hasImg: false
                }
            };
        },
        components: {
            record,
            communication,
            headerList,
            footerList,
            checkHistory
        },
        watch: {
            "message.createTime"() {
                this.noData = true;
                this.$router.push({
                    name: "mainSpeak",
                    params: {
                        num: this.data
                    }
                });
            },
            "$store.state.patientActiveIndex"() {
                this.userOnlineActive = 0;
            },
            "$store.state.userId"() {
                this.init();
            },
            //列表
            "$store.state.patientList": {
                handler: (list, oldValue) => {
                    this.userListOnline = list;
                },
                deep: true
            },
            "$store.state.waitingList": {
                handler: (list, oldValue) => {
                    this.userListReset = list;
                    this.newResetFlag = true;
                },
                deep: true
            },
            "$store.state.resetList": {
                handler: (list, oldValue) => {
                    this.userListReset = list;
                    this.newResetFlag = true;
                },
                deep: true
            },
            //刷新
            "$store.state.waitingListRefresh"(flag) {
                if (flag) {
                    this.getUserList("waiting", this.filterMethod);
                    store.commit("waitingListRefreshFlag", false);
                } else {
                    return;
                }
            },  //待分诊
            "$store.state.onlineListRefresh"(flag) {
                if (flag) {
                    this.getUserList("online", this.filterMethod);
                    store.commit("onlineListRefresh", false);
                } else {
                    return;
                }
            },   //沟通中
            "$store.state.resetListRefresh"(flag) {
                if (flag) {
                    this.getUserList("reset", this.filterMethod);
                    store.commit("resetListRefreshFlag", false);
                } else {
                    return;
                }
            },    //重新分诊
            //红点
            "$store.state.newWaiting"(flag) {
                let _this = this;
                _this.$store.commit("setMusicPlay", true);
                setTimeout(function () {
                    _this.$store.commit("setMusicPlay", false);
                }, 2000);
                this.newWaitingFlag = flag;
            },
            "$store.state.newOnline"(flag) {
                let _this = this;
                _this.$store.commit("setMusicPlay", true);
                setTimeout(function () {
                    _this.$store.commit("setMusicPlay", false);
                }, 2000);
                this.newPatientFlag = flag;
            },
            "$store.state.newReset"(flag) {
                let _this = this;
                _this.$store.commit("setMusicPlay", true);
                console.log("music2");
                setTimeout(function () {
                    console.log("music");
                    _this.$store.commit("setMusicPlay", false);
                }, 2000);
                this.newResetFlag = flag;
            },


        },
        mounted() {
            if (this.$store.state.userId) {
                this.init();
                store.commit("setUsedReplyShow", false);
                store.commit("setFastReplyShow", false);
            }
        },
        activated() {
        },
        methods: {
            init() {
                this.$store.state.searchStatus = true;
                this.getUserList("waiting");
                this.getUserList("online");
                this.getUserList("reset");
            },
            fixByCurrent(item, index) {
                let flag = false;
//      if (index === this.userOnlineActive) {
//        if (this.$store.state.currentItem.diagnosisContent) {
//          flag = true;
//        } else {
//          flag = false;
//        }
//      } else {
//        if (item.diagnosisContent) {
//          flag = true;
//        } else {
//          flag = false;
//        }
//      }

                return flag;
            },
            //给子组件传值..
            transformData(items, index, getFlag = false, imRefresh = true) {
                store.commit("setUsedReplyShow", false);
                store.commit("setFastReplyShow", false);
                this.noData = true;
                if (this.userListStatus.first) {
                    this.waitingTriage = true;
                    this.userWaitingActive = index;
                    store.commit("setInputReadOnly", true);

                    let waitingList = this.$store.state.waitingList;
                    items.messageAlert = "";
                    waitingList[index] = items;
                    this.$store.commit("setWaitingList", waitingList);

                    let waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                    if (waitingAlertList) {
                        delete waitingAlertList["0_" + items.caseId];
                        localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                    }
                    if (localStorage.getItem("waitingAlertList") == "{}") {
                        this.newWaitingFlag = false;
                    }
                } else if (this.userListStatus.second) {

                    this.waitingTriage = false;
                    this.userOnlineActive = index;
                    store.commit("setInputReadOnly", false);

                    let patientList = this.$store.state.patientList;
                    items.messageAlert = "";
                    if (getFlag) {
                        patientList.removeByValue(items);
                        patientList.unshift(items);
                        this.$store.commit("setPatientList", patientList);
                    } else {
                        patientList[index] = items;
                        this.$store.commit("setPatientList", patientList);
                    }
                    let patientAlertList = JSON.parse(localStorage.getItem("patientAlertList"));
                    if (patientAlertList) {
                        delete patientAlertList["0_" + items.caseId];
                        localStorage.setItem("patientAlertList", JSON.stringify(patientAlertList));
                    }
                    if (localStorage.getItem("patientAlertList") == "{}") {
                        this.newPatientFlag = false;
                    }
                } else if (this.userListStatus.third) {
                    this.waitingTriage = true;
                    this.userResetActive = index;
                    store.commit("setInputReadOnly", true);
                    let resetList = this.$store.state.resetList;
                    items.messageAlert = "";
                    if (getFlag) {
                        resetList.removeByValue(items);
                        resetList.unshift(items);
                        this.$store.commit("setResetList", resetList);
                    } else {
                        resetList[index] = items;
                        this.$store.commit("setResetList", resetList);
                    }
                    let resetAlertList = JSON.parse(
                        localStorage.getItem("resetAlertList")
                    );
                    if (resetAlertList) {
                        delete resetAlertList["0_" + items.caseId];
                        localStorage.setItem(
                            "resetAlertList",
                            JSON.stringify(resetAlertList)
                        );
                    }
                    if (localStorage.getItem("resetAlertList") == "{}") {
                        this.newResetFlag = false;
                    }
                }

                this.message = items;

                this.$store.commit("setPatientId", items.patientId);
                this.$store.commit("setPatientName", items.patientName);
                this.$store.commit("setCaseId", items.caseId);
                localStorage.setItem("caseId", items.caseId);
                this.$store.commit("setConsultationId", items.consultationId);
                this.$store.commit("setConsultationState", items.consultationState);

                this.$store.commit("setCurrentItem", items);
                if (imRefresh) {
                    this.$store.commit("setSBIObject", {});
                    this.$store.commit("videoListObject", {});
                }
                this.$store.commit('setMinBtnFlag', false);


                let data = JSON.stringify(items);
                this.data = data;
                this.targetData.account = "0_" + items.caseId;
                this.targetData.avatar = items.logoUrl;
                this.fastRelyStatusParent = false;

                this.$router.push({name: "mainSpeak"});
                //刷新上传功能
                this.$store.commit("setSendFileShow", false);
            },
            //三个状态的点击切换（沟通中、已结束、被退回）
            statusChange(status) {
                //Tab 切换

                this.userListStatus.status = status;
                switch (status) {
                    case 1 :
                        this.userListStatus.first = true;
                        this.userListStatus.second = false;
                        this.userListStatus.third = false;
                        this.message.userController = true;
                        this.$store.commit("setUserListStatus", {
                            status: "1",
                            first: true,
                            second: false,
                            third: false
                        });
                        break;
                    case 2:

                        this.userListStatus.first = false;
                        this.userListStatus.second = true;
                        this.userListStatus.third = false;
                        this.message.userController = false;
                        this.$store.commit("setUserListStatus", {
                            status: "2",
                            first: false,
                            second: true,
                            third: false
                        });
                        break;
                    case 3:
                        this.userListStatus.first = false;
                        this.userListStatus.second = false;
                        this.userListStatus.third = true;
                        this.message.userController = false;
                        this.$store.commit("setUserListStatus", {
                            status: "3",
                            first: false,
                            second: false,
                            third: true
                        });
                        break;

                }

            },
            //患者列表
            //type:online为沟通中，wating待分诊
            getUserList(type, param, fn) {
                this.$store.commit("startLoading");
                let _this = this;
                _this.userListData = "";
                _this.userListLoading = [];
                _this.userListEnd = [];
                _this.userListBack = [];
                let dataValue = {};
                let url = '';
                //会诊状态-1-待就诊0-沟通中1-已结束2-被退回(拒绝接诊)3-超时接诊退回4-新用户5-释放8-分诊完成9-待检查10-已推荐   7-分诊拒绝    6-已上传资料    11-超时未回复
                switch (type) {
                    case 'online':
                        dataValue = Object.assign(
                            {
                                customerId: _this.$store.state.userId,
                                // conState: "-1,0,9,10",
                                triageType:2,
                                conType: 0,
                                sortType: -6
                            },
                            param
                        );
                        url = XHRList.onlineuserList;
                        break;
                    case 'waiting':
                        dataValue = Object.assign(
                            {
                                // conState: "4,5",
                                conType: 0,
                                triageType:1,
                                sortType: -6
                            },
                            param
                        );
                        url = XHRList.waitinguserList;
                        break;
                    case 'reset':
                        dataValue = Object.assign(
                            {
                                // conState: "2,3,6,11",  //2-被退回(拒绝接诊) 3-超时接诊退回  6-已上传资料 11-超时未回复
                                conType: 0,
                                sortType: -6,
                                triageType:3
                            },
                            param
                        );
                        url = XHRList.resetuserList;
                }
                api.ajax({
                    url: url,
                    method: "POST",
                    data: dataValue,
                    done(res) {
                        _this.$store.commit("startLoading");
                        if (res.responseObject.responseData && res.responseObject.responseStatus) {
                            let dataList = _this.setSelectValue(res.responseObject.responseData.dataList);
                            let waitingAlertList = {};
                            let patientAlertList = {};
                            let resetAlertList = {};
                            waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                            patientAlertList = JSON.parse(localStorage.getItem("patientAlertList"));
                            resetAlertList = JSON.parse(localStorage.getItem("resetAlertList"));
                            if (type === "online") {
                                if (patientAlertList && patientAlertList !== "{}") {
                                    for (let key in patientAlertList) {
                                        let flag = true;
                                        dataList.forEach(function (item, index) {
                                            if (typeof item.messageAlert == "undefined") {
                                                item.messageAlert = "";
                                            }
                                            if (key == "0_" + item.caseId) {
                                                item.messageAlert = patientAlertList[key];

                                                _this.newPatientFlag = true;
                                                _this.$store.commit("setMusicPlay", true);
                                                setTimeout(function () {
                                                    _this.$store.commit("setMusicPlay", false);
                                                }, 2000);
                                                flag = false;
                                            }
                                        });
                                        if (flag) {
                                            delete patientAlertList[key];
                                        }
                                    }
                                    localStorage.setItem("patientAlertList", JSON.stringify(patientAlertList));
                                }
                                _this.$store.commit("setPatientList", dataList);
                                _this.userListOnline = dataList ? dataList : [];
                            } else if (type === "waiting") {
                                if (waitingAlertList && waitingAlertList !== "{}") {
                                    for (let key in waitingAlertList) {
                                        let flag = true;
                                        dataList.forEach(function (item, index) {
                                            if (typeof item.messageAlert == "undefined") {
                                                item.messageAlert = "";
                                            }
                                            if (key == "0_" + item.caseId) {
                                                item.messageAlert = waitingAlertList[key];
                                                _this.newWaitingFlag = true;
                                                _this.$store.commit("setMusicPlay", true);
                                                setTimeout(function () {
                                                    _this.$store.commit("setMusicPlay", false);
                                                }, 2000);
                                                flag = false;
                                            }
                                        });
                                        if (flag) {
                                            delete waitingAlertList[key];
                                        }
                                    }
                                    localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                                }
                                _this.$store.commit("setWaitingList", dataList);
                                _this.userListWaiting = dataList ? dataList : [];
                            } else if (type === 'reset') {
                                if (resetAlertList && resetAlertList !== "{}") {
                                    for (let key in resetAlertList) {
                                        let flag = true;
                                        dataList.forEach(function (item, index) {
                                            if (typeof item.messageAlert == "undefined") {
                                                item.messageAlert = "";
                                            }
                                            if (key == "0_" + item.caseId) {
                                                item.messageAlert = resetAlertList[key];
                                                _this.newResetFlag = true;

                                                _this.$store.commit("setMusicPlay", true);
                                                setTimeout(function () {
                                                    _this.$store.commit("setMusicPlay", false);
                                                }, 2000);
                                                flag = false;
                                            }
                                        });
                                        if (flag) {
                                            delete resetAlertList[key];
                                        }
                                    }
                                    localStorage.setItem("resetAlertList", JSON.stringify(resetAlertList));
                                }
                                _this.$store.commit("setResetList", dataList);
                                _this.userListReset = dataList ? dataList : [];
                            }
                        }
                        fn && fn();
                    },
                    fail(err) {
                        console.log("请求失败：" + err);
                    }
                });
            },
            setSelectValue(dataList) {
                let result = [];
                if (dataList) {
                    dataList.forEach((element, index) => {
                        result.push(
                            Object.assign(element, {
                                triageSelect: false
                            })
                        );
                    });
                }
                return result;
            },
            filterTemplateList(data) {
                return (
                    '<li class="custom-selector-item secondListTitle ' +
                    (parseInt(data.treeLevel) === 3 ? "result-item" : "") +
                    '" data-down-role="' +
                    data.regionId +
                    '" data-level="' +
                    data.treeLevel +
                    '"><span>' +
                    data.regionName +
                    "</span></li>"
                );
            },
            //患者搜索...
            searchPatient(content) {
                this.filterMethod = Object.assign(this.filterMethod, {
                    selectName: content
                });
                store.commit("startLoading");
                this.getUserList("waiting", this.filterMethod);
                this.getUserList("online", this.filterMethod);
                this.getUserList("reset", this.filterMethod);
                store.commit("stopLoading");
                //                this.filterFinish = true;
            },
            refreshList() {
                this.getUserList("waiting", this.filterMethod);
                this.getUserList("online", this.filterMethod);
                this.getUserList("reset", this.filterMethod);
            },
            //选择退回患者
            selectQuitItem(item) {
                this.userListOnline.forEach((element, index) => {
                    element.triageSelect = false;
                });
                item.triageSelect = true;

                store.commit("setQuitPatientItem", item);
            },
            //接诊
            getTriagePatient(item, index) {

                store.commit("startLoading");
                triagePatient(
                    {
                        consultationId: item.consultationId,
                        customerId: this.$store.state.userId
                    },
                    () => {
                        this.getUserList("waiting");
                        store.commit("showPopup", {
                            hasImg: false,
                            text: "该患者已被其他分诊医生接诊！"
                        });
                    },
                    c => {
                        this.getUserList("waiting");
                        store.commit("showPopup", {
                            hasImg: false,
                            text: `您最多可以接诊${c}个患者！`
                        });
                    }
                ).then(res => {
                    store.commit("stopLoading");
                    //患者未被抢单
                    this.getUserList("waiting");
                    this.getUserList("reset");
                    this.statusChange(2);
                    this.getUserList("online", {}, () => {
                        let triageItem = this.getBeTriagePatient(item);
                        if (typeof (triageItem) == 'undefined') {
                            return;
                        }
                        let getFlag = true;

                        this.transformData(triageItem, index, getFlag, false);

                        store.commit("setTriagePatientCaseIdFlag", {
                            caseId: item.caseId,
                            flag: true
                        });
                        this.waitingTriage = false;
                        this.userOnlineActive = 0;
                        store.commit("setInputReadOnly", false);
                        store.commit("stopLoading");
                    });

                    let waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                    if (waitingAlertList) {
                        for (let key in waitingAlertList) {
                            if (key == "0_" + item.caseId) {
                                delete waitingAlertList["0_" + item.caseId];
                            }
                        }
                        localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                    }
                    if (localStorage.getItem("waitingAlertList") == "{}") {
                        this.newWaitingFlag = false;
                    }
                })
                    .catch(res => {
                        console.log("网络异常...");
                    });
            },
            getBeTriagePatient(item) {
                let caseId = item.caseId;
                let result;
                this.userListOnline.forEach((element, index) => {
                    if (element.caseId === caseId) {
                        result = element;
                    }
                });
                return result;
            },
            sortShow() {
                this.sortFlag = !this.sortFlag;
                console.log(this.sortFlag);
            },
            sort(index) {
                let _this = this;
                _this.sortActive = index;
                _this.sortFlag = false;
                switch (index) {
                    case 0:
                        _this.getUserList("waiting", {sortType: -6});
                        _this.getUserList("online", {sortType: -6});
                        _this.getUserList("reset", {sortType: -6});
                        break;
                    case 1:
                        _this.getUserList("waiting", {sortType: 5});
                        _this.getUserList("online", {sortType: 5});
                        _this.getUserList("reset", {sortType: 5});
                        break;
                    case 2:
                        _this.getUserList("waiting", {sortType: 4});
                        _this.getUserList("online", {sortType: 4});
                        _this.getUserList("reset", {sortType: 4});
                        break;
                    case 3:
                        _this.getUserList("waiting", {sortType: -5});
                        _this.getUserList("online", {sortType: -5});
                        _this.getUserList("reset", {sortType: -5});
                        break;
                    case 4:
                        _this.getUserList("waiting", {sortType: -5});
                        _this.getUserList("online", {sortType: -5});
                        _this.getUserList("reset", {sortType: -5});
                        break;
                    default:
                        _this.getUserList("waiting", {sortType: 6});
                        _this.getUserList("online", {sortType: 6});
                        _this.getUserList("reset", {sortType: 6});
                }
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "./scss/base.scss";

    .list-left-enter-active,
    .list-left-leave-active {
        //   transition: all 0.3s;
    }

    .list-left-enter,
    .list-left-leave-to {
        //  opacity: 0;
        //  transform: translateX(-100px);
    }

    .list-right-enter-active,
    .list-right-leave-active {
        //    transition: all 0.3s;
    }

    .list-right-enter,
    .list-right-leave-to {
        //   opacity: 0;
        //   transform: translateX(100px);
    }

    .fadeDown-enter-active,
    .fadeDown-leave-active {
        transition: all ease-in-out 0.5s;
    }

    .fadeDown-enter,
    .fadeDown-leave-to {
        opacity: 0;
        transform: translateY(-50%);
    }

    .userList {
        width: 100%;
        height: 100%;
        .center-inner-userList {
            background-color: #fff;
            color: #fff;
            width: 400px;
            float: left;
            margin-left: -100%;
            height: 100%;
            border-right: 1px solid #ededed;
            box-sizing: border-box;

            .search-result-tips {
                display: block;
                text-align: center;
                background: #e8f6fd;
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
                    color: #6b748c;
                    display: inline-block;
                    a,
                    span {
                        font-size: 13px;
                        color: #f23e34;
                        display: inline;
                    }
                }
            }
            .userList-status {
                background-color: #fff;
                box-sizing: border-box;
                padding: 10px 14px;
                position: relative;
                &-box {
                    text-align: center;
                    font-size: 0;
                    border: 1px solid #acb1be;
                    border-radius: 4px;
                    width: 85%;
                    display: inline-block;
                }
                &-right {
                    width: 47px;
                    height: 16px;
                    background: url("/static/image/img00/common/sorting@2x.png") no-repeat center center;
                    display: inline-block;
                    vertical-align: middle;
                    border-radius: 4px;
                    box-sizing: border-box;
                    background-size: contain;
                    cursor: pointer;
                }
                &-sortList {
                    position: absolute;
                    top: 12px;
                    right: -220px;
                    width: 220px;
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
                    width: 33.3%;
                    box-sizing: border-box;
                    border-right: 1px solid #acb1be;
                    cursor: pointer;

                    &.new {
                        position: relative;
                        &:after {
                            content: "";
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background-color: rgba(242, 62, 51, 0.9);
                            box-shadow: 0 1px 1px 0 rgba(45, 17, 14, 0.15);
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
            .userList-inner-content {
                overflow: hidden;
                height: 100%;
                .userList-mainList {
                    overflow: auto;
                    height: 85%;
                    &-item {
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
                        .userList-item-img {
                            /*display: inline-block;*/
                            /*vertical-align: middle;*/
                            margin-right: 12px;
                            position: relative;
                            display: table-cell;
                            /*width: 100%;*/
                            vertical-align: top;
                            font-size: 0;
                            padding-left: 10px;
                            & > p {
                                font-size: 15px;
                                color: #ffffff;
                                letter-spacing: 0;
                                line-height: 15px;
                                background: rgba(242, 62, 51, 0.9);
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
                        .userList-item-msg {
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
                        .userList-item-base-msg {
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
                            .userList-item-msg-category {
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
                    }
                }
                .userList-no-data {
                    font-size: 14px;
                    color: #aaaaaa;
                    text-align: center;
                    margin-top: 52px;
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
                    content: "";
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
                        color: #7a8ec1;
                        vertical-align: middle;
                        padding-left: 4px;
                    }
                }
            }


            @include query(1440px) {
                width: 315px;
                .userList-status{
                    &-box{
                        width:80%
                    }
                }
                .userList-inner-content{
                    .userList-mainList{
                        &-item {
                            padding: 25px 0 25px 0;
                            .userList-item-img{
                                margin-right: 5px;
                            }
                            & > .time {
                                right: 10px;
                            }
                            .userList-item-base-msg {
                                .text {
                                    max-width: 230px;
                                }
                            }
                        }
                    }

                }
                .user-list-footer {
                    width: 275px;
                }
            }
        }
    }

    .tabsInner.medical-record-tabs {
        text-align: center;
        border-bottom: 1px solid #e1e2e7;
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
                color: #323d5e;
            }
        }
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
                background: url("/static/image/img00/common/multiplechoice_off@2x.png") no-repeat;
                background-size: contain;
            }
            &.on {
                background: url("/static/image/img00/common/multiplechoice_on@2x.png") no-repeat;
                background-size: contain;
            }
        }
    }

    /*.time-title {*/
    /*font-size: 13px;*/
    /*color: #909090;*/
    /*margin-bottom: 24px;*/
    /*}*/

    /*.userList-item-msg-item {*/
        /*margin-top: 14px;*/
        /*font-size: 0;*/
        /*& > span {*/
            /*font-size: 12px;*/
            /*color: #666;*/
        /*}*/
        /*.sex {*/
            /*margin-right: 10px;*/
        /*}*/
        /*.age {*/
            /*margin-right: 10px;*/
        /*}*/
    /*}*/
</style>
