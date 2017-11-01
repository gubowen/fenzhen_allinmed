<template>
    <section style="height: 100%;">
        <header class="messageList-targetName">
            <h3>与患者<span>{{$store.state.patientName}}</span>对话</h3>
        </header>
        <section class="messageList">
            <!--v-for="items in messageInfo"-->
            <article class="messageList-box" ref="messageBox" :class="{'watingBoxStyle':$store.state.inputReadOnly}">
                <!--患者text-->
                <p class="time-stamp" v-if="$store.state.currentItem.returnReason">
                    {{`由于${$store.state.currentItem.returnReason}，该患者被退回`}}</p>
                <transition-group name="fadeDown" tag="article">
                    <article class="messageList-item"
                             :class="[ items.from == '1_doctor00001' ? 'my-message' : 'others-message']"
                             v-for="(items,index) in communicationList" v-if="messageFilter(items)" :key="index">
                        <!--时间戳-->
                        <p class="time-stamp">{{items.time | transformMessageTime}}</p>
                        <!--文本消息-->
                        <ContentElement v-if="items.type==='text'" :message="items"></ContentElement>
                        <!--图片消息-->
                        <ImageElement v-if="items.type === 'file'" :message="items"></ImageElement>
                        <!--检查检验-->
                        <CheckSuggestion
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='checkSuggestion')"
                                :message="items"></CheckSuggestion>
                        <!--问诊单-->
                        <MedicalReport v-if="medicalReport(items)"
                                       :message="items" ref="medicalReport"></MedicalReport>
                        <!--视诊-->
                        <VideoTriage v-if="items.type==='custom'&&(items.content&&items.content.type==='videoTriage')"
                                     :message="items"></VideoTriage>
                        <!--初诊建议-->
                        <PreviewSuggestion
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='previewSuggestion')"
                                :message="items"></PreviewSuggestion>
                        <!--视诊上传提示-->
                        <UpdateTips
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='triageSendTips')"
                                :showType="items.content.data.actionType==='image'?'imageTriage':'videoTriage'"
                        ></UpdateTips>
                        <!--检查检验上传提示-->
                        <UpdateTips
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='checkSuggestSendTips')"
                                :showType="'checkSuggessSendTips'"
                        ></UpdateTips>
                    </article>
                </transition-group>
            </article>
        </section>
    </section>
</template>
<script type="text/ecmascript-6">
    /**
     * @Desc：
     * @Usage:
     * @Notify：
     * @Depend：
     *
     * Created by Qiangkailiang on 17/10/23.
     */

    import nim from "nim";
    import Vue from "vue";

    import ContentElement from "@/components/imParts/content";
    import ImageElement from "@/components/imParts/image";
    import MedicalReport from "@/components/imParts/medicalReport";
    import PreviewSuggestion from "@/components/imParts/previewSuggestion";
    import VideoTriage from "@/components/imParts/videoTriage";
    import CheckSuggestion from "@/components/imParts/checkSuggestion";
    import UpdateTips from "@/components/imParts/updateTips";

    import store from "@/store/store";
    import api from '@/common/js/util';


    Vue.filter('transformMessageTime', function (time) {
        var format = function (num) {
            return num > 9 ? num : "0" + num;
        };
        var normalTime = function (time) {
            var d = new Date(time);
            var obj = {
                y: d.getFullYear(),
                m: d.getMonth() + 1,
                dd: d.getDate(),
                h: d.getHours(),
                mm: format(d.getMinutes())
            };
            return obj;
        };
        var result = "";
        var now = new Date().getTime(),
            day1 = normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd,
            day2 = normalTime(now).y + "-" + normalTime(now).m + "-" + normalTime(now).dd;
        if (day1 === day2) {
            result = normalTime(time).h + ":" + normalTime(time).mm;
        } else if (normalTime(time).y === normalTime(now).y) {
            result = normalTime(time).m + "月" + normalTime(time).dd + "日  " + normalTime(time).h + ":" + normalTime(time).mm;
        } else if (normalTime(time).y !== normalTime(now).y) {
            result = normalTime(time).y + "年" + normalTime(time).m + "月" + normalTime(time).dd + "日  " + normalTime(time).h + ":" + normalTime(time).mm;
        }
        return result;
    });

    const XHRList = {
        watingUserList: "/call/customer/case/consultation/v1/getMapListForCase/"
    };
    export default{
        data(){
            return {
                communicationList: [],
                messageBox: '',
                userData: {
                    account: '1_doctor00001',
                    token: 'AllinDoctor00001'
                },
                targetData: {
                    account: ""
                },
                medicalReportImgList: [],
                ShowBigImgList: [],
                diagnosisId: "",
                diagnosisShow: false,

            }
        },
        components: {
            MedicalReport,
            ContentElement,
            ImageElement,
            PreviewSuggestion,
            VideoTriage,
            CheckSuggestion,
            UpdateTips
        },
        props: {},
        watch: {
            '$store.state.sendPreviewSuggestionFlag'(obj){
                if (obj.flag) {
                    this.sendPreviewSuggestion(obj.data);
                    store.commit("previewSuggestionSender", {
                        flag: false,
                        data: {}
                    })
                } else {
                    return;
                }
            },
            '$store.state.sendCheckSuggestionFlag'(obj){
                if (obj.flag) {
                    this.sendCheckSuggestion(obj.data);
                    store.commit("sendCheckSuggestionFlag", {
                        flag: false,
                        data: {}
                    })
                } else {
                    return;
                }
            },
            '$store.state.sendVideoTriageFlag'(obj){
                console.log(obj)
                if (obj.flag) {
                    this.sendVideoTriage(obj.data);
                    store.commit("videoTriageSender", {
                        flag: false,
                        data: {}
                    })
                } else {
                    return;
                }
            },
            '$store.state.currentItem' (obj) {
                if (!obj) {
                    return;
                } else {
                    this.targetData = {
                        account: "0_" + obj.caseId
                    };
                    this.getMessageList("history");
                }
            },
        },
        computed: {},
        mounted(){
            this.init();
        },
        methods: {
            init(){
                let that = this;
                this.nim = nim.getInstance({
                    // debug: true,
                    appKey: '50c93d2ab7e207fd83231a245c07bfbc',
                    account: that.userData.account,
                    token: that.userData.token,
                    onconnect (data) {
                        console.log('连接成功');
                    },
                    onmyinfo (userData) {

                    },
                    onwillreconnect: this.onWillReconnect,
                    onerror: this.onError,
                    onroamingmsgs: this.onRoamingMsgs,
                    onofflinemsgs: this.onOfflineMsgs,
                    onmsg (msg) {
                        //自定义消息
                        console.log(msg);
                        if (msg.type.toLowerCase() === 'custom') {
                            //判断是否为新用户
                            if (JSON.parse(msg.content).type.indexOf("new-") != -1) {
                                store.commit("watingListRefreshFlag", true);
                                store.commit("setNewWating", true);
                                store.commit("setMusicPlay", true);
                                let dataValue = Object.assign({
                                    customerId: that.$store.state.userId,
                                    conState: "2,4,5",
                                    conType: 0,
                                    sortType: -6
                                });
                                api.ajax({
                                    url: XHRList.watingUserList,
                                    method: "POST",
                                    data: dataValue,
                                    done(res) {
                                        if (res.responseObject.responseData && res.responseObject.responseStatus) {
                                            let dataList = res.responseObject.responseData.dataList;
                                            let waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                                            if (!waitingAlertList) {
                                                waitingAlertList = {};
                                            }
                                            console.log(waitingAlertList);
                                            dataList.forEach(function (item, index) {
                                                if (msg.from == ("0_" + item.caseId)) {
                                                    waitingAlertList[msg.from] = 1;
                                                }
                                            });
                                            localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));

                                        }
                                    },
                                    fail(err) {
                                        console.log("请求失败：" + err);
                                    }
                                });
                            }
                        }
                        that.receiveMessage(that.targetData.account, msg);
                    },
                });
            },
            medicalReport(items){
                let flag = true;
                if (items.type === 'custom' && (items.content && items.content.type === 'medicalReport')) {
                    setTimeout(() => {
                        if (this.$refs.medicalReport.length === 0) {
                            flag = true
                        } else {
                            flag = false;
                        }
                    }, 20)
                } else {
                    flag = false
                }
                return flag;
            },
            messageFilter(items){
                let flag = false;
                if (items) {
                    if (items.type === 'text') {
                        flag = true;
                    } else {
                        if (items.content && (items.content.type === 'reTriageTip' || items.content.type === "new-health" || items.content.type === "notification" || items.content.type === "payFinishTips")) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                    }
                }
                return flag;
            },

            //查看大图
            showBigImgFunction(){
                this.$store.commit("setSBIFlag", true);
            },
            sendMessage (content) {
                const that = this;
                //单条信息发送
                return new Promise((resolve, reject) => {
                    this.nim.sendText({
                        scene: 'p2p',
                        to: that.targetData.account,
                        text: content,
                        done (error, obj) {
                            if (!error) {
                                resolve(obj);
                                that.sendSingleMessage(error, obj)
                            } else {
                                reject(obj)
                            }
                        }
                    });
                });

            },
            //发送检查检验...
            sendCheckSuggestion (data) {
                const that = this;
                return new Promise((resolve, reject) => {
                    that.nim.sendCustomMsg({
                        scene: 'p2p',
                        to: that.targetData.account,
                        content: JSON.stringify({
                            "data": data,
                            "type": "checkSuggestion"
                        }),
                        done (error, obj) {
                            if (!error) {
                                that.sendSingleMessage(error, obj);
                                resolve(obj)

                            } else {
                                reject(obj)
                            }
                        }
                    })
                });

            },
            //发送初诊建议...
            sendPreviewSuggestion (data) {
                const that = this;
                let dataList = [{}];
                return new Promise((resolve, reject) => {
                    dataList[0] = data;
                    console.log(dataList)
                    this.nim.sendCustomMsg({
                        scene: 'p2p',
                        to: that.targetData.account,
                        content: JSON.stringify({
                            "data": dataList,
                            "type": "previewSuggestion"
                        }),
                        done (error, obj) {
                            if (!error) {
                                that.sendSingleMessage(error, obj);
                                resolve(obj)
                            } else {
                                reject(obj)
                            }
                        }
                    });
                });
            },
            //发送视诊...
            sendVideoTriage (data) {
                const that = this;
                let tType = "";
                if (data.type == 1) {
                    tType = 2;
                } else if (data.type == 2) {
                    tType = 1;
                }
                this.nim.sendCustomMsg({
                    scene: 'p2p',
                    to: that.targetData.account,
                    content: JSON.stringify({
                        "data": {
                            content: data.content,
                            type: tType
                        },
                        "type": "videoTriage"
                    }),
                    done (error, obj) {
                        that.sendSingleMessage(error, obj);
                    }
                });
            },
            //获取历史消息……
            getMessageList: function (from) {
                let that = this;
                that.communicationList = [];
                this.nim.getHistoryMsgs({
                    scene: 'p2p',
                    to: that.targetData.account,
                    done(error, obj) {
                        that.renderHistoryMessage(that.targetData.account, error, obj, from);
                    },
                    limit: 100
                });
            },
            transformMessageTime: function (time) {
                var format = function (num) {
                    return num > 9 ? num : "0" + num;
                };
                var normalTime = function (time) {
                    var d = new Date(time);
                    var obj = {
                        y: d.getFullYear(),
                        m: d.getMonth() + 1,
                        dd: d.getDate(),
                        h: d.getHours(),
                        mm: format(d.getMinutes())
                    };
                    return obj;
                };
                var result = "";
                var now = new Date().getTime(),
                    day1 = normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd,
                    day2 = normalTime(now).y + "-" + normalTime(now).m + "-" + normalTime(now).dd;
                if (day1 === day2) {
                    result = normalTime(time).h + ":" + normalTime(time).mm;
                } else if (normalTime(time).y === normalTime(now).y) {
                    result = normalTime(time).m + "月" + normalTime(time).dd + "日  " + normalTime(time).h + ":" + normalTime(time).mm;
                } else if (normalTime(time).y !== normalTime(now).y) {
                    result = normalTime(time).y + "年" + normalTime(time).m + "月" + normalTime(time).dd + "日  " + normalTime(time).h + ":" + normalTime(time).mm;
                }
                return result;
            },
            //发送单条数据...
            sendSingleMessage: function (error, msg) {
                this.$store.state.patientList.removeByValue(this.$store.state.currentItem);
                this.$store.state.patientList.unshift(this.$store.state.currentItem);
                this.$store.state.currentItem.createTime = this.transformMessageTime(msg.time);
                store.commit("setPatientActiveIndex", this.$store.state.patientActiveIndex + 1);
                let that = this;
                console.log(msg);
                console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
                if (!error) {
                    that.controllerInput = "";
                    that.mine(msg);

                    setTimeout(() => {
                        this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
                    }, 120);
                }
            },
            //接收用户信息...
//            //新消息提示机制...
//            newMessageTips: function (account) {
//                if ($(".main-header-toggle-list-item.active").attr("data-id") == 0) {
//                    var element = $(".userlist-mainList-item[data-account='" + account.substring(2) + "']");
//                    // if (localStorage.getItem("ntnCache") && JSON.parse(localStorage.getItem("ntnCache"))[account]) {
//                    //     var ntnCache = JSON.parse(localStorage.getItem("ntnCache")),
//                    //         newTipsNumber = ntnCache[account];
//                    // } else {
//                    //     var ntnCache = {}, newTipsNumber = 0;
//                    // }
//
//                    var newTipsNumber = 0;
//                    var ntnCache = {};
//                    if (localStorage.getItem("ntnCache") && JSON.parse(localStorage.getItem("ntnCache"))[account]) {
//                        var ntnCache = JSON.parse(localStorage.getItem("ntnCache")),
//                            newTipsNumber = ntnCache[account];
//                    }
//
//                    var ntnCacheObject = {};
//                    if (this.ntnCacheList[account] != undefined) {
//                        newTipsNumber = this.ntnCacheList[account];
//                    } else {
//                        ntnCacheObject[account] = 0;
//                        newTipsNumber = ntnCacheObject[account];
//                        this.ntnCacheList[account] = newTipsNumber;
//
//                    }
//                    newTipsNumber++;
//                    ntnCache[account] = newTipsNumber;
//                    this.ntnCacheList[account] = newTipsNumber;
//                    localStorage.setItem("ntnCache", JSON.stringify(ntnCache));
//
//                    if (!element.hasClass("active") && $(".userlist-mainList-item[data-account='" + account.substring(2) + "']").length > 0) {
//                        var _role = element.parents(".userlist-mainList").attr("data-role");
//
//                        element.find(".userlist-item-img p").show().addClass("on").text((newTipsNumber >= 100 ? "..." : newTipsNumber));
//                        if (_role != 'ut-tabs-2') {
//                            $(".userlist-status-item[data-role='" + _role + "']").addClass("new");
//                            $('#music')[0].play();
//                        }
//
//                    }
//                }
//            },
            // 新消息提示
            newMessageTips(target, element){
                const _this = this;
                let patientList = this.$store.state.patientList;
                patientList.forEach(function (item, index) {
                    if (("0_" + item.caseId) == element.from) {

                        if (item.messageAlert == '') {
                            item.messageAlert = "1";
                        } else {
                            item.messageAlert = parseInt(item.messageAlert) + 1;
                        }

                        let caseIdInfo = "0_" + item.caseId;
                        let patientAlertList = {};
                        patientAlertList[caseIdInfo] = item.messageAlert;

                        localStorage.setItem("patientAlertList", JSON.stringify(patientAlertList));
                        _this.$store.commit("setNewOnline", true);
                        _this.$store.commit('setMusicPlay', true);
                        setTimeout(function () {
                            _this.$store.commit('setMusicPlay', false);

                        }, 2000);
                    }
                });
                this.$store.commit("setPatientList", patientList);

                //等待列表
                let watingList = this.$store.state.watingList;
                watingList.forEach(function (item, index) {
                    if (("0_" + item.caseId) == element.from) {
                        if (item.messageAlert == '') {
                            item.messageAlert = "1";
                        } else {
                            item.messageAlert = parseInt(item.messageAlert) + 1;
                        }
                        let caseIdInfo = "0_" + item.caseId;
                        let waitingAlertList = {};
                        waitingAlertList[caseIdInfo] = item.messageAlert;

                        localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                        _this.$store.commit("setNewWating", true);
                        _this.$store.commit('setMusicPlay', true);
                        setTimeout(function () {
                            _this.$store.commit('setMusicPlay', false);

                        }, 2000);
                    }
                });
                this.$store.commit("setWatingList", watingList);
            },
            //接受消息...
            receiveMessage (targetUser, element) {
                //获取当前患者消息
                const _this = this;
                if ((element.from.includes("0_") && targetUser === element.from) || (element.to.includes("0_") && targetUser === element.to)) {
                    if (element.type === "custom") {
                        element.content = JSON.parse(element.content);
                    }

                    this.communicationList.push(element);
                } else {
                    //接诊列表
                    this.newMessageTips(targetUser, element);
                }

                setTimeout(() => {
                    this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
                }, 120);

            },
            //输出历史消息...
            renderHistoryMessage: function (container, error, obj, from) {
                let that = this;
                if (!error) {
                    obj.msgs.reverse();

                    let timeFlag = false;
                    let prvObj = {};
                    for (let i = 0; i < obj.msgs.length; i++) {
                        let data = {
                            dataList: []
                        };
                        obj.msgs[i].data = data;
                        obj.msgs[i].timeFlag = timeFlag;

                        if (i == 0) {
                            prvObj = obj.msgs[0];
                            obj.msgs[0].timeFlag = true;
                        } else {
                            //每超过5分钟打印一次时间戳...
                            if ((obj.msgs[i].time - prvObj.time) / (5 * 60 * 1000) > 1) {
                                prvObj = obj.msgs[i].time;
                                obj.msgs[i].timeFlag = true;
                            }
                        }
                        that.receiveMessage(container, obj.msgs[i], from);
                    }


                }
            },
            //消息时间转换...
            transformMessageTime: function (time) {
                var format = function (num) {
                    return num > 9 ? num : "0" + num;
                };
                var normalTime = function (time) {
                    var d = new Date(time);
                    var obj = {
                        y: d.getFullYear(),
                        m: d.getMonth() + 1,
                        dd: d.getDate(),
                        h: d.getHours(),
                        mm: format(d.getMinutes())
                    };
                    return obj;
                };
                var result = "";
                var now = new Date().getTime(),
                    day1 = normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd,
                    day2 = normalTime(now).y + "-" + normalTime(now).m + "-" + normalTime(now).dd;
                if (day1 === day2) {
                    result = normalTime(time).h + ":" + normalTime(time).mm;
                } else if (normalTime(time).y === normalTime(now).y) {
                    result = normalTime(time).m + "月" + normalTime(time).dd + "日  " + normalTime(time).h + ":" + normalTime(time).mm;
                } else if (normalTime(time).y !== normalTime(now).y) {
                    result = normalTime(time).y + "年" + normalTime(time).m + "月" + normalTime(time).dd + "日  " + normalTime(time).h + ":" + normalTime(time).mm;
                }
                return result;
            },
            mine: function (data) {
                if (data.content) {
                    data.content = JSON.parse(data.content);
                }
                this.communicationList.push(data);
            },
            showNext(type, index){
                if (type == 'FirstIndex') {
                    if (this.FirstIndex == index) {
                        this.FirstIndex = -1;
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    } else {
                        this.FirstIndex = index;
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    }
                } else if (type == 'SecondIndex') {
                    if (this.SecondIndex == index) {
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    } else {
                        this.SecondIndex = index;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    }
                } else if (type == 'ThirdIndex') {
                    if (this.ThirdIndex == index) {
                        this.ThirdIndex = -1;
                        this.FourIndex = -1
                    } else {
                        this.ThirdIndex = index;
                        this.FourIndex = -1
                    }
                } else if (type == 'FourIndex') {
                    if (this.FourIndex == index) {
                        this.FourIndex = -1
                    } else {
                        this.FourIndex = index;
                    }
                }
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "./scss/base.scss";
    /*@import "./scss/modules/_ImMedicalRecord.scss";*/
    /*@import "./scss/modules/_masker.scss";*/
    .messageList-box {
        padding: 40px 50px;
        height: 62%;
        overflow: auto;
        background-color: #f6f9fa;
        margin-left: 1px;
        @include query(1500px){
            height: 45%;
        }
        &.watingBoxStyle {
            height: 85%;
        }
        .messageList-item {
            position: relative;
            zoom: 1;
            overflow: hidden;
            margin-bottom: 40px;

            &.others-message {
                .messageList-item-content {
                    float: left;
                    .messageList-item-text {
                        background-color: #fff;
                        a {
                            font-size: 15px;
                            color: #00beaf;
                            letter-spacing: 0;
                            line-height: 15px;
                            text-decoration: underline;
                        }
                    }
                }
            }
            &.my-message {
                text-align: right;
                .messageList-item-content {
                    float: right;
                    text-align: right;
                    .messageList-item-text {
                        background-color: #d4eff7;
                        text-align: left;
                        & > span {
                            color: #7a8ec1;
                        }
                    }
                }
            }

            &-content {
                font-size: 0;

                .messageList-item-img {
                    display: inline-block;
                    vertical-align: top;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    & > img {
                        width: 100%;
                        height: 100%;
                        vertical-align: top;
                        border-radius: 50%;
                    }
                }
                .messageList-item-text {
                    display: inline-block;
                    vertical-align: top;
                    max-width: 85%;
                    padding: 7px 12px;
                    box-sizing: border-box;
                    font-size: 14px;
                    margin: 0 24px;
                    line-height: 1.5;
                    border-radius: 5px;
                    word-break: break-all;
                    @include query(1500px) {
                        margin: 0 12px;
                    }
                }
            }
        }
    }

    .messageList-targetName {
        background: rgba(255, 255, 255, 0.97);
        box-shadow: 0 1px 1px 0 #ECEFF6;
        position: absolute;
        top: 0;
        height: 55px;
        left: 0;
        right: 0;
        line-height: 55px;
        padding-left: 40px;
        box-sizing: border-box;
        & > h3 {
            font-weight: normal;
            font-size: 16px;
            color: #555555;
            span {
                color: #00BEAF;
            }
        }
    }

    .messageList {
        height: 100%;
    }

    .check-suggestion-message {
        display: inline-block;
        vertical-align: middle;
        width: 327px;
        margin: 0 24px;
        overflow: hidden;
        text-align: left;
        @include query(1500px) {
            margin:0 12px;
        }
        .check-suggestion-message-title {
            background: #A6C7EE;
            font-size: 12px;
            color: #FFFFFF;
            height: 25px;
            line-height: 25px;
            padding-left: 15px;
            box-sizing: border-box;
            border-top-left-radius: 20px;
        }
        .check-suggestion-content {
            background: #FFFFFF;
            border: 1px solid #96C0F3;
            padding: 8px 25px;
            box-sizing: border-box;
            border-bottom-right-radius: 20px;
            position: relative;

            &:after {
                content: '上传';
                display: block;
                width: 30px;
                height: 25px;
                position: absolute;
                background: #A6C7EE;
                right: 0;
                bottom: 0;
                border-bottom-right-radius: 20px;
                border-top-left-radius: 20px;
                font-size: 11px;
                color: #FFFFFF;
                line-height: 25px;
                text-align: center;
            }
            .check-suggestion-item {
                font-size: 14px;
                color: #222222;
                margin: 12px 0;
                & > span {
                    vertical-align: middle;
                    margin-left: 6px;
                    display: inline-block;
                    width: 100%;
                    line-height: 1.5;
                }
                &:before {
                    content: '';
                    display: inline-block;
                    vertical-align: middle;
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: #91B0D4;
                    position: absolute;
                    margin-top: 7px;
                }
            }
        }
    }

    .preview-suggestion-content {
        background: #FFFFFF;
        border: 1px solid #8DC0F9;
        .preview-suggestion-img {
            display: inline-block;
            vertical-align: middle;
            padding: 20px 0;
            width: 77px;
            height: 100%;
            background: #E4F0FD;
            text-align: center;
            &:before {
                content: "";
                display: inline-block;
                vertical-align: middle;
                height: 100%;
            }
            & > img {
                width: 40px;
                height: 46px;
                vertical-align: middle;
            }
        }
        .preview-suggestion-content-text {
            padding: 0 20px;
            box-sizing: border-box;
            display: inline-block;
            vertical-align: middle;
            max-width: 245px;
            line-height: 1.3;

            & > header {
                font-size: 14px;
                color: #222222;
            }
            & > p {
                font-size: 13px;
                color: #909090;
                margin-top: 10px;
            }
        }
    }

    .video-triage-content {

    }

    .time-stamp {
        font-size: 13px;
        color: #AAAAAA;
        margin-bottom: 30px;
        margin-top: 40px;
        text-align: center;
    }

    .fadeDown-enter-active {
        transition: all ease-in-out .5s
    }

    .fadeDown-enter
        /* .fade-leave-active in <2.1.8 */

    {
        opacity: 0;
        transform: translateY(-50%);
    }
</style>
