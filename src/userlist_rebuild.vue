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
                    :reTriageShow="reTriageShow"
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
                                v-bind:class="{ 'active': userListStatus.first,'new':newWaiting}"
                        >
                            待分诊
                        </li>
                        <li class="userList-status-item tabsItem"
                            data-role="ut-tabs-2"
                            @click.stop="statusChange(2)"
                            v-bind:class="{ 'active': userListStatus.second,'new':newOnline}"
                        >沟通中
                        </li>
                        <li class="userList-status-item tabsItem"
                            data-role="ut-tabs-3"
                            @click.stop="statusChange(3)"
                            v-bind:class="{ 'active': userListStatus.third,'new':newReset}">
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
                        <article v-show="waitingList.length > 0" @click="transformData(items,index)"
                                 :class="[{ active : userWaitingActive == index }, 'userList-mainList-item']"
                                 v-for="(items,index) in waitingList"
                                 :key="index"
                        >
                            <figure class="userList-item-img">
                                <img v-bind:src="items.logoUrl" alt="">
                                <p v-show="items.messageAlert">{{items.messageAlert}}</p>
                            </figure>
                            <figcaption class="userList-item-base-msg">
                                <h3>
                                    <span class="name" :title="items.patientName">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span><span
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
                        <p class="userList-no-data" v-show="waitingList.length == 0">没有找到相应的患者</p>
                    </section>
                    <section class="userList-mainList viewItem" data-role="ut-tabs-2"
                             v-show="userListStatus.status == 2">
                        <article v-show="onlineList.length > 0" @click="transformData(items,index)"
                                 :class="[{ active : userOnlineActive == index }, 'userList-mainList-item']"
                                 v-for="(items,index) in onlineList"
                                 :key="index"
                        >
                            <figure class="userList-item-img">
                                <img v-bind:src="items.logoUrl" alt="">
                                <p v-show="items.messageAlert">{{items.messageAlert}}</p>
                            </figure>
                            <figcaption class="userList-item-base-msg">
                                <h3>
                                    <span class="name" :title="items.patientName">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span><span
                                        class="category short">{{items | checkState}}</span>
                                    <!--<span class="category short" v-show="fixByCurrent(items,index)">{{userOnlineActive == index ? $store.state.currentItem.diagnosisContent : items.diagnosisContent}}</span>-->
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
                        <p class="userList-no-data" v-show="onlineList.length == 0">没有找到相应的患者</p>
                    </section>
                    <section class="userList-mainList viewItem" data-role="ut-tabs-3" v-show="userListStatus.status == 3">
                        <article v-show="resetList.length > 0" @click="transformData(items,index)"
                                 :class="[{ active : userResetActive == index }, 'userList-mainList-item']"
                                 v-for="(items,index) in resetList"
                                 :key="index"
                        >
                            <figure class="userList-item-img">
                                <img v-bind:src="items.logoUrl" alt="">
                                <p v-show="items.messageAlert">{{items.messageAlert}}</p>
                            </figure>
                            <figcaption class="userList-item-base-msg">
                                <h3>
                                    <span class="name" :title="items.patientName">{{(items.patientName.length > 4 ? items.patientName.substring(0, 3) + '...' : items.patientName)}}</span><span
                                        class="category short" >{{items | checkState}}</span>
                                    <!--<span class="category short" v-show="fixByCurrent(items,index)">{{userOnlineActive == index ? $store.state.currentItem.diagnosisContent : items.diagnosisContent}}</span>-->
                                </h3>
                                <article>
                                    <span class="text">
                                        {{items.returnReason.length > 0 ? `由于${items.returnReason}，该患者被${items.doctorName}医生退回` : items.patientSex == 1 ? '男' : '女'}}&nbsp;|&nbsp;{{items.patientAge}}&nbsp;|&nbsp;{{parseInt(items.isAttachment) === 0 ? "无影像" : "有影像"}}&nbsp;|&nbsp;{{items.partName}}</span>
                                </article>
                                <button class="get-triage btn-primary-small" @click.stop="getTriagePatient(items,index)">接诊</button>
                            </figcaption>
                            <span class="time" ref="toTopTime"> {{items.createTime | timeFormat}}</span>
                        </article>
                        <p class="userList-no-data" v-show="resetList.length === 0">没有找到相应的患者</p>
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
    import Vue from "vue";
    import {mapGetters,mapActions} from "vuex";

    import {common, modules} from "common";
    import api from "./common/js/util/util";
    import triagePatient from "@/base/triagePatient";

    import communication from "./communication";
    import record from "./record";
    import footerList from "./Footer";
    import headerList from "./Header";
    import checkHistory from "./components/CheckHistory";


    Vue.filter("timeFormat", function (time, a) {

        let result = "";
        let date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate(),
            h = date.getHours(),
            mm = date.getMinutes();
        let nowFirst = new Date(y + "/" + (m >= 10 ? m : "0" + m) + "/" + (d >= 10 ? d : "0" + d)).getTime()
        let timeFirst = new Date(time.substring(0, 10).replace(/-/g, "/")).getTime();
        let week = new Date(timeFirst).getDay();
        if (nowFirst === timeFirst) {
            result = time.substring(10, 16);
        } else if (parseInt((nowFirst / (60 * 60 * 24 * 1000) + 4) / 7) === parseInt((timeFirst / (60 * 60 * 24 * 1000) + 4) / 7)) {
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
        onlineUserList: "/call/customer/case/consultation/v1/getMapListByCustomerId/",
        waitingUserList: "/call/customer/case/consultation/v1/getMapListForCase/",
        resetUserList: "/call/customer/case/consultation/v1/getMapListForCase/"
    };
    export default {
        name: "userList",
        data() {
            return {
                userListData: "",
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
                newResetFlag: false,
                sortFlag: false,
                sortActive: "",
                popupShow: false,
                popupContent: {
                    text: "",
                    hasImg: false
                },
                reTriageShow:false
            };
        },
        components: {
            record,
            communication,
            headerList,
            footerList,
            checkHistory
        },
        computed: {
            ...mapGetters(['caseId','waitingList','onlineList','resetList','newWaiting', 'newOnline', 'newReset','waitingListRefresh','onlineListRefresh','resetListRefresh',]),
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
            //刷新
            waitingListRefresh(flag){
                if (flag) {
                    this.getUserList("waiting", this.filterMethod);
                    this.setWaitingListRefresh(false);
                }
            },  //待分诊
            onlineListRefresh(flag) {
                if (flag) {
                    this.getUserList("online", this.filterMethod);
                    this.setOnlineListRefresh( false);
                }
            },   //沟通中
            resetListRefresh(flag) {
                if (flag) {
                    this.getUserList("reset", this.filterMethod);
                    this.setResetListRefresh(false);
                }
            },    //重新分诊
            //红点redPoint
            newWaiting(flag) {
                this.redPoint(flag);
            },
            newOnline(flag) {
                this.redPoint(flag);
            },
            newReset(flag){
                this.redPoint(flag);
            }
        },
        mounted() {
            if (this.$store.state.userId) {
                this.init();
                this.setUsedReplyShow(false);
                this.setFastReplyShow(false);
            }
        },
        methods: {
            ...mapActions(['setCaseId','setPatientId','setPatientName','setWaitingList','setOnlineList','setResetList','setNewWaiting','setNewOnline','setNewReset','startLoading','stopLoading'
                            ,'setFastReplyShow','setUsedReplyShow','setInputReadOnly','setWaitingListRefresh','setOnlineListRefresh','setResetListRefresh']),
            init() {
                this.$store.state.searchStatus = true;
                this.getUserList("waiting");
                this.getUserList("online");
                this.getUserList("reset");
            },
            //给子组件传值..
            transformData(items, index, getFlag = false, imRefresh = true) {
                this.setUsedReplyShow(false);
                this.setFastReplyShow(false);
                this.noData = true;
                this.reTriageShow = false;
                if (this.userListStatus.first)
                {
                    this.waitingTriage = true;
                    this.userWaitingActive = index;
                    this.setInputReadOnly(true);

                    let waitingList = this.waitingList;
                    items.messageAlert = "";
                    waitingList[index] = items;
                    this.setWaitingList(waitingList);

                    let waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                    if (waitingAlertList) {
                        delete waitingAlertList["0_" + items.caseId];
                        localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                    }
                    if (localStorage.getItem("waitingAlertList") == "{}") {
                        this.setNewWaiting(false);
                    }
                } else if (this.userListStatus.second)
                {

                    this.waitingTriage = false;

                    this.userOnlineActive = index;
                    this.setInputReadOnly(false);

                    let patientList = this.onlineList;
                    items.messageAlert = "";

                    if (getFlag) {
                        patientList.removeByValue(items);
                        patientList.unshift(items);
                        this.setOnlineList(patientList);
                    } else {
                        patientList[index] = items;
                        this.setOnlineList(patientList);
                    }
                    let patientAlertList = JSON.parse(localStorage.getItem("patientAlertList"));
                    if (patientAlertList) {
                        delete patientAlertList["0_" + items.caseId];
                        localStorage.setItem("patientAlertList", JSON.stringify(patientAlertList));
                    }
                    if (localStorage.getItem("patientAlertList") == "{}") {
                        this.setNewOnline(false);
                    }
                } else if (this.userListStatus.third)
                {
                    this.waitingTriage = true;
                    this.userResetActive = index;
                    this.setInputReadOnly(true);

                    let resetList = this.resetList;
                    items.messageAlert = "";
                    if (getFlag) {
                        resetList.removeByValue(items);
                        resetList.unshift(items);
                        this.setResetList(resetList);
                    } else {
                        resetList[index] = items;
                        this.setResetList(resetList);
                    }
                    let resetAlertList = JSON.parse(
                        localStorage.getItem("resetAlertList")
                    );
                    if (resetAlertList) {
                        delete resetAlertList["0_" + items.caseId];
                        localStorage.setItem("resetAlertList", JSON.stringify(resetAlertList));
                    }
                    if (localStorage.getItem("resetAlertList") == "{}") {
                        this.setNewReset(false);
                    }
                }

                this.message = items;


                this.setCaseId(items.caseId);
                localStorage.setItem("caseId", items.caseId);
                this.setPatientId(items.patientId);
                this.setPatientName(items.patientName);


                this.$store.commit("setConsultationId", items.consultationId);
                this.$store.commit("setConsultationState", items.consultationState);

                this.$store.commit("setCurrentItem", items);

                if (imRefresh) {
                    this.$store.commit("setSBIObject", {});
                    this.$store.commit("videoListObject", {});
                }

                this.$store.commit('setMinBtnFlag', false);

                this.data = JSON.stringify(items);
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
                switch (status) {
                    case 1 :
                        this.userListStatus={
                            status: "1",
                            first: true,
                            second: false,
                            third: false
                        };
                        this.$store.commit("setUserListStatus",this.userListStatus);
                        break;
                    case 2:
                        this.userListStatus ={
                            status: "2",
                            first: false,
                            second: true,
                            third: false
                        };
                        this.$store.commit("setUserListStatus",  this.userListStatus);
                        break;
                    case 3:
                        this.userListStatus={
                            status: "3",
                            first: false,
                            second: false,
                            third: true
                        };
                        this.$store.commit("setUserListStatus", this.userListStatus);
                        break;
                }
            },
            //患者列表
            //type:online为沟通中，waiting待分诊 reset重新分诊
            getUserList(type, param, fn) {
                let _this = this;
                _this.startLoading();
                _this.userListData = "";
                _this.userListLoading = [];
                _this.userListEnd = [];
                _this.userListBack = [];
                let dataValue = {};
                let url = '';
                //会诊状态-1-待就诊0-沟通中1-已结束2-被退回(拒绝接诊)3-超时接诊退回4-新用户5-释放8-分诊完成9-待检查10-已推荐   7-分诊拒绝    6-已上传资料    11-超时未回复
                switch (type) {
                    case 'online':
                        dataValue = Object.assign({
                                customerId: _this.$store.state.userId,
                                // conState: "-1,0,9,10",
                                triageType:2,
                                conType: 0,
                                sortType: -6
                            },
                            param
                        );
                        url = XHRList.onlineUserList;
                        break;
                    case 'waiting':
                        dataValue = Object.assign({
                                // conState: "4,5",
                                conType: 0,
                                triageType:1,
                                sortType: -6
                            },
                            param
                        );
                        url = XHRList.waitingUserList;
                        break;
                    case 'reset':
                        dataValue = Object.assign({
                                // conState: "2,3,6,11",  //2-被退回(拒绝接诊) 3-超时接诊退回  6-已上传资料 11-超时未回复
                                conType: 0,
                                sortType: -6,
                                triageType:3
                            },
                            param
                        );
                        url = XHRList.resetUserList;
                }
                api.ajax({
                    url: url,
                    method: "POST",
                    data: dataValue,
                    done(res) {
                        _this.startLoading();
                        if (res.responseObject.responseData && res.responseObject.responseStatus) {
                            let dataList = _this.setSelectValue(res.responseObject.responseData.dataList);
                            let waitingAlertList = {},patientAlertList = {},resetAlertList = {};
                            waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                            patientAlertList = JSON.parse(localStorage.getItem("patientAlertList"));
                            resetAlertList = JSON.parse(localStorage.getItem("resetAlertList"));

                            switch(type){
                                case "online":
                                {
                                    if (patientAlertList && patientAlertList !== "{}") {
                                        for (let key in patientAlertList) {
                                            let flag = true;
                                            dataList.forEach(function (item, index) {
                                                if (typeof item.messageAlert == "undefined") {
                                                    item.messageAlert = "";
                                                }
                                                if (key == "0_" + item.caseId) {
                                                    item.messageAlert = patientAlertList[key];
                                                    _this.setNewOnline(true);
                                                    flag = false;
                                                }
                                            });
                                            //列表中没有此人 删除提示消息-1.被其他分诊医生接走刷新列表
                                            if (flag) {
                                                delete patientAlertList[key];
                                            }
                                        }
                                        localStorage.setItem("patientAlertList", JSON.stringify(patientAlertList));
                                    }
                                    //_this.$store.commit("setPatientList", dataList);
                                    _this.setOnlineList(dataList ? dataList : [])

                                }
                                    break;
                                case "waiting":
                                {
                                    if (waitingAlertList && waitingAlertList !== "{}") {
                                        for (let key in waitingAlertList) {
                                            let flag = true;
                                            dataList.forEach(function (item, index) {
                                                if (typeof item.messageAlert == "undefined") {
                                                    item.messageAlert = "";
                                                }
                                                if (key == "0_" + item.caseId) {
                                                    item.messageAlert = waitingAlertList[key];
                                                    _this.$store.commit("newWaiting",true);
                                                    flag = false;
                                                }
                                            });
                                            if (flag) {
                                                delete waitingAlertList[key];
                                            }
                                        }
                                        localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                                    }
                                    _this.setWaitingList( dataList ? dataList : []);
                                }
                                    break;
                                case "reset":
                                {
                                    if (resetAlertList && resetAlertList !== "{}") {
                                        for (let key in resetAlertList) {
                                            let flag = true;
                                            dataList.forEach(function (item, index) {
                                                if (typeof item.messageAlert == "undefined") {
                                                    item.messageAlert = "";
                                                }
                                                if (key == "0_" + item.caseId) {
                                                    item.messageAlert = resetAlertList[key];
                                                    _this.$store.commit("newReset",true);
                                                    flag = false;
                                                }
                                            });
                                            if (flag) {
                                                delete resetAlertList[key];
                                            }
                                        }
                                        localStorage.setItem("resetAlertList", JSON.stringify(resetAlertList));
                                    }
                                    _this.setResetList(dataList ? dataList : []);
                                }
                                    break;
                                default:
                                    console.log("请求哪个列表的数据？");
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
            //患者搜索...
            searchPatient(content) {
                this.filterMethod = Object.assign(this.filterMethod, {
                    selectName: content
                });
                this.startLoading();
                this.getUserList("waiting", this.filterMethod);
                this.getUserList("online", this.filterMethod);
                this.getUserList("reset", this.filterMethod);
                this.stopLoading();
                //this.filterFinish = true;
            },
            //刷新按钮
            refreshList() {
                this.getUserList("waiting", this.filterMethod);
                this.getUserList("online", this.filterMethod);
                this.getUserList("reset", this.filterMethod);
            },
            //接诊
            getTriagePatient(item, index) {

                this.startLoading();
                triagePatient(
                    {
                        consultationId: item.consultationId,
                        customerId: this.$store.state.userId
                    },
                    () => {
                        this.getUserList("waiting");
                        this.$store.commit("showPopup", {
                            hasImg: false,
                            text: "该患者已被其他分诊医生接诊！"
                        });
                    },
                    c => {
                        this.getUserList("waiting");
                        this.$store.commit("showPopup", {
                            hasImg: false,
                            text: `您最多可以接诊${c}个患者！`
                        });
                    }
                ).then(res => {
                    this.stopLoading();
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


                        //如果是选中患者 不清空
                        if(item.caseId == this.$store.state.caseId){
                            this.transformData(triageItem, index, getFlag, false);
                        }else{
                            this.transformData(triageItem, index, getFlag, true);
                        }


                        this.$store.commit("setTriagePatientCaseIdFlag", {
                            caseId: item.caseId,
                            flag: true
                        });
                        this.waitingTriage = false;
                        this.userOnlineActive = 0;
                        this.setInputReadOnly(false);
                        this.stopLoading();
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
                        this.setNewWaiting(false);
                    }
                })
                    .catch(res => {
                        console.log("网络异常...");
                    });
            },
            getBeTriagePatient(item) {
                let caseId = item.caseId;
                let result;
                this.onlineList.forEach((element, index) => {
                    if (element.caseId === caseId) {
                        result = element;
                    }
                });
                return result;
            },
            //选择退回患者
            selectQuitItem(item) {
                this.onlineList.forEach((element, index) => {
                    element.triageSelect = false;
                });
                item.triageSelect = true;

                this.$store.commit("setQuitPatientItem", item);
            },
            //显示排序列表
            sortShow() {
                this.sortFlag = !this.sortFlag;
            },
            //排序- 4:患者等待沟通时间从多到少  -6:患者最近消息发出时间由近到远                  -5:患者等待沟通时间从多到少
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
//                    case 1:
//                        _this.getUserList("waiting", {sortType: 5});
//                        _this.getUserList("online", {sortType: 5});
//                        _this.getUserList("reset", {sortType: 5});
//                        break;
//                    case 2:
//                        _this.getUserList("waiting", {sortType: 4});
//                        _this.getUserList("online", {sortType: 4});
//                        _this.getUserList("reset", {sortType: 4});
//                        break;
//                    case 3:
//                        _this.getUserList("waiting", {sortType: -5});
//                        _this.getUserList("online", {sortType: -5});
//                        _this.getUserList("reset", {sortType: -5});
//                        break;
                    case 4:
                        _this.getUserList("waiting", {sortType: -5});
                        _this.getUserList("online", {sortType: -5});
                        _this.getUserList("reset", {sortType: -5});
                        break;
                    default:
                        _this.getUserList("waiting", {sortType: -6});
                        _this.getUserList("online", {sortType: -6});
                        _this.getUserList("reset", {sortType: -6});
                }
            },
            //消息提醒红点
            redPoint(flag){
                this.$store.commit("setMusicPlay", flag);
                setTimeout( ()=> {
                    this.$store.commit("setMusicPlay", !flag);
                }, 2000);
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
                        padding: 25px 20px 25px 30px;
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
