<template>
    <section style="height: 100%;">
        <header class="messageList-targetName">
            <h3>与患者<span>{{$store.state.patientName}}</span>对话</h3>
        </header>
        <section class="messageList">
            <!--v-for="items in messageInfo"-->
            <article class="messageList-box" ref="messageBox" :class="{'waitingBoxStyle':$store.state.inputReadOnly}">
                <!--患者text-->
                <p class="time-stamp" v-if="$store.state.currentItem.returnReason">
                    {{$store.state.currentItem.createTime.substring(0, $store.state.currentItem.createTime.length -
                    2)}}</p>
                <p class="time-stamp" v-if="$store.state.currentItem.returnReason">
                    {{`由于${$store.state.currentItem.returnReason}，该患者被${$store.state.currentItem.doctorName ?
                    $store.state.currentItem.doctorName + '医生' : ''}退回`}}
                </p>
                <transition-group name="fadeDown" tag="article">
                    <article class="messageList-item"
                             :class="[ items.from == '1_doctor00001' ? 'my-message' : 'others-message']"
                             v-for="(items,index) in communicationList" v-if="messageFilter(items)" :key="index">
                        <!--时间戳-->
                        <p class="time-stamp"
                           v-if="!(items.type==='custom'&&(items.custom &&(items.custom.mType==='33'||items.custom.mType==='22')))">
                            {{items.time | transformMessageTime}}</p>
                        <!--文本消息-->
                        <ContentElement v-if="items.type==='text'" :message="items"
                                        @deleteMsg="deleteMsg(items)"></ContentElement>
                        <!--拒绝分诊-->
                        <ContentElement v-if="items.type === 'custom'&& items.content.type === 'refusePatient'"
                                        :message="items" @deleteMsg="deleteMsg(items)"></ContentElement>
                        <!--图片消息-->
                        <ImageElement v-if="(items.type === 'image'||(items.type === 'file'&& getFileType(items.file)))"
                                      :message="items" :nim="nim" @deleteMsg="deleteMsg(items)" :imageList="imageList"></ImageElement>
                        <!--多图片信息-->
                        <multiple-Image v-if="items.type === 'custom'&& items.content.type === 'multipleImage'"
                                        :message="items" :nim="nim" @deleteMsg="deleteMsg(items)"></multiple-Image>
                        <!--视频消息-->
                        <videoElement v-if="items.type === 'video'" :message="items" :nim="nim"
                                      @deleteMsg="deleteMsg(items)"></videoElement>
                        <!--文件信息-->
                        <fileElement v-if="items.type === 'file'&&(!getFileType(items.file))" :message="items"
                                     :nim="nim" @deleteMsg="deleteMsg(items)"></fileElement>
                        <!--检查检验-->
                        <CheckSuggestion
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='checkSuggestion')"
                                :message="items" @deleteMsg="deleteMsg(items)"></CheckSuggestion>
                        <!--问诊单-->
                        <MedicalReport v-if="medicalReport(items)" :message="items" ref="medicalReport"></MedicalReport>
                        <!--视诊-->
                        <VideoTriage v-if="items.type==='custom'&&(items.content&&items.content.type==='videoTriage')"
                                     :message="items" @deleteMsg="deleteMsg(items)"></VideoTriage>
                        <!--初诊建议-->
                        <PreviewSuggestion
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='previewSuggestion')"
                                :message="items" @deleteMsg="deleteMsg(items)"></PreviewSuggestion>
                        <!--视诊上传提示-->
                        <UpdateTips
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='triageSendTips')"
                                :showType="items.content.data.actionType==='image'?'imageTriage':'videoTriage'"
                        ></UpdateTips>
                        <!--检查检验上传提示-->
                        <UpdateTips
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='checkSuggestSendTips')"
                                :showType="'checkSuggestSendTips'"></UpdateTips>
                        <!--消息撤回-->
                        <section v-if="items.type==='custom'&&items.content.type==='deleteMsgTips'"
                                 class="deleteMessage">
                            <span v-show="items.content.data.deleteMsg.from ==='1_doctor00001'">{{items.content.data.doctorName?items.content.data.doctorName:'您'}}撤回了一条消息！</span>
                            <span v-show="ShowFlagDeleteTips(items)">{{items.content.data.from}}撤回了一条消息！</span>
                        </section>
                        <!-- 分诊医生接诊 -->
                        <section v-if="items.type==='custom'&&items.content.type==='triagePatientTips'"
                                 class="deleteMessage">
                            <span v-if="items.content.scene==='triage'">分诊医生“{{items.content.name}}”接诊</span>
                            <span v-if="items.content.scene==='release'">分诊医生“{{items.content.name}}”退诊</span>
                        </section>
                        <!--医生超时未接诊-->
                        <section v-if="items.type==='custom'&& items.content.type==='overtimeTip'"
                                 class="deleteMessage">
                            <span>{{(JSON.parse(items.custom).docName ? JSON.parse(items.custom).docName : '某某')+'医生超时未接诊'}}</span>
                        </section>
                        <!--医生超时未回复-->
                        <section v-if="items.type==='custom'&&items.content.type==='chatOvertimeTip'"
                                 class="deleteMessage">
                            <span>{{(JSON.parse(items.custom).docName?JSON.parse(items.custom).docName:'某某')+'医生接诊后超时未回复'}}</span>
                        </section>
                        <!--医生拒绝-->
                        <section
                                v-if="items.type==='custom'&& items.content.type==='notification'&& items.content.data.actionType == 3"
                                class="deleteMessage">
                            <span>{{'由于'+(JSON.parse(items.custom).reason?JSON.parse(items.custom).reason:'XX')+'，该患者被'+(JSON.parse(items.custom).docName?JSON.parse(items.custom).docName:'某某')+'医生退回'}}</span>
                        </section>
                        <!--医生接诊-->
                        <section
                                v-if="items.type==='custom'&& items.content.type==='notification'&& items.content.data.actionType == 5"
                                class="deleteMessage">
                            <span>{{(JSON.parse(items.custom).docName ? JSON.parse(items.custom).docName:'某某')+'医生接诊'}}</span>
                        </section>
                    </article>
                </transition-group>
            </article>
        </section>
        <div class="percentage popup" v-if="percentage>0">
            <figure class="middle-tip-box-text">
                <p class="popup-text"> {{percentage+'%'}}</p>
                </figure>
           </div>
    </section>
</template>
<script>
    /**
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
    import videoElement from "@/components/imParts/video";
    import fileElement from "@/components/imParts/pdfFile";
    import multipleImage from "@/components/imParts/multipleImage";


    import MedicalReport from "@/components/imParts/medicalReport";
    import PreviewSuggestion from "@/components/imParts/previewSuggestion";
    import VideoTriage from "@/components/imParts/videoTriage";
    import CheckSuggestion from "@/components/imParts/checkSuggestion";
    import UpdateTips from "@/components/imParts/updateTips";

    import store from "@/store/store";
    import api from "@/common/js/util/util";

    import nimEnv from "@/base/nimEnv";
    import releasePatient from "@/base/releasePatient";   //改变患者状态
    import {mapGetters,mapActions} from "vuex";

    Vue.filter("transformMessageTime", function (time) {
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
            day1 =
                normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd,
            day2 =
                normalTime(now).y + "-" + normalTime(now).m + "-" + normalTime(now).dd;
        if (day1 === day2) {
            result = normalTime(time).h + ":" + normalTime(time).mm;
        } else if (normalTime(time).y === normalTime(now).y) {
            result =
                normalTime(time).m +
                "月" +
                normalTime(time).dd +
                "日  " +
                normalTime(time).h +
                ":" +
                normalTime(time).mm;
        } else if (normalTime(time).y !== normalTime(now).y) {
            result =
                normalTime(time).y +
                "年" +
                normalTime(time).m +
                "月" +
                normalTime(time).dd +
                "日  " +
                normalTime(time).h +
                ":" +
                normalTime(time).mm;
        }
        return result;
    });

    export default {
        data() {
            return {
                communicationList: [],
                messageBox: "",
                userData: {
                    account: "1_doctor00001",
                    token: "AllinDoctor00001"
                },
                targetData: {
                    account: ""
                },
                getMessageType: "history",
                historyBeginTime: 0,
                medicalReportImgList: [],
                ShowBigImgList: [],
                diagnosisId: "",
                diagnosisShow: false,
                connectFlag: false,
                allGet: false,
                percentage:0,
                imageList:[]
            };
        },
        components: {
            MedicalReport,
            ContentElement,
            ImageElement,
            videoElement,
            fileElement,
            multipleImage,
            PreviewSuggestion,
            VideoTriage,
            CheckSuggestion,
            UpdateTips
        },
        props: {},
        computed: {
            ...mapGetters(['currentItem', 'userId', 'onlineList', 'waitingList', 'resetList']),
        },
        watch: {
            "$store.state.sendPreviewSuggestionFlag"(obj) {
                if (obj.flag) {
                    this.sendPreviewSuggestion(obj.data);
                    store.commit("previewSuggestionSender", {
                        flag: false,
                        data: {}
                    });
                } else {
                    return;
                }
            },
            "$store.state.sendCheckSuggestionFlag"(obj) {
                if (obj.flag) {
                    this.sendCheckSuggestion(obj.data);
                    store.commit("checkSuggestionSender", {
                        flag: false,
                        data: {}
                    });
                } else {
                    return;
                }
            },
            "$store.state.triagePatientCaseIdFlag"(param) {
                const that = this;
                if (param.flag) {
                    that.startLoading();
                    setTimeout(() => {
                        this.nim.sendCustomMsg({
                            scene: "p2p",
                            to: this.targetData.account,
                            content: JSON.stringify({
                                name: this.$store.state.userName,
                                scene: "triage",
                                type: "triagePatientTips"
                            }),
                            custom: JSON.stringify({
                                cType: "0",
                                cId: this.$store.state.userId,
                                mType: "42",
                                docName: this.$store.state.userName
                            }),
                            done(error, obj) {
                                if (!error) {
                                    that.sendSingleMessage(error, obj);
                                }
                            }
                        });
                        store.commit("setTriagePatientCaseIdFlag", {
                            caseId: "",
                            flag: false
                        });
                    }, 500);
                } else {
                    return;
                }
            },
            "$store.state.releasePatientCaseIdFlag"(param) {
                const that = this;
                if (param.flag) {
                    this.nim.sendCustomMsg({
                        scene: "p2p",
                        to: "0_" + param.caseId,
                        content: JSON.stringify({
                            name: this.$store.state.userName,
                            scene: "release",
                            type: "triagePatientTips"
                        }),
                        custom: JSON.stringify({
                            cType: "0",
                            cId: this.$store.state.userId,
                            mType: "42",
                            docName: this.$store.state.userName
                        }),
                        done(error, obj) {
                            that.startLoading();
                            if (!error) {
                                that.sendSingleMessage(error, obj);
                            }
                        }
                    });
                    store.commit("setReleasePatientCaseIdFlag", {
                        caseId: "",
                        flag: false
                    });

                } else {
                    return;
                }
            },
            "$store.state.sendFileFlag"(obj) {
                const _this = this;
                if (obj.flag) {
                    _this.sendFile(obj);
                    store.commit("setSendFileFlag", {
                        flag: false,
                        data: {},
                        name: '',
                        type: ''
                    });
                } else {
                    return;
                }
            },
            "$store.state.sendVideoTriageFlag"(obj) {
                console.log(obj);
                if (obj.flag) {
                    this.sendVideoTriage(obj.data);
                    store.commit("videoTriageSender", {
                        flag: false,
                        data: {}
                    });
                    store.commit("setFastReply", "");
                    store.commit("setUesdReply", "");
                    store.commit("clearTraigeContent");
                } else {
                    return;
                }
            },
            "$store.state.caseId"(id) {
                if (!id) {
                    this.targetData = {
                        account: "0_" + id
                    };
                    return;
                } else {
                    this.targetData = {
                        account: "0_" + id
                    };
                    this.historyBeginTime = 0;
                    this.allGet = false;
                    this.getMessageType = "history";
                    this.getMessageList();
                }

            },
            "$store.state.refuseReason"(obj) {
                if (obj.flag) {
                    this.sendRefusePatient(obj.data);
                    store.commit("setRefuseReason", {
                        flag: false,
                        text: {}
                    });
                } else {
                    return;
                }
            },
            connectFlag(flag) {
                if (!flag) {
                    return;
                } else {
                    this.targetData = {
                        account: "0_" + this.$store.state.caseId
                    };
//                    console.log("history_2");
                    this.getMessageType = "history";
                    this.getMessageList();
                }
            },
            "$store.state.resendMsgInfo"(obj) {
                this.resendMsg(obj);
            },
            "$store.state.deleteMsgInfo"(obj) {
                this.deleteMsg(obj);
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            ...mapActions(['setCaseId','setOnlineList','setNewWaiting','setNewOnline','setNewReset','startLoading','stopLoading']),
            init() {
                let that = this;
                that.connectFlag = false;
                this.initScroll();
                nimEnv().then(nimKey => {
                    this.nim = nim.getInstance({
                        //debug: true,
                        appKey: nimKey,
                        account: that.userData.account,
                        token: that.userData.token,
                        onconnect(data) {

                            console.log("连接成功");
                          // console.log(data);
                          //  that.connectFlag = true;
                        },
                        onmyinfo(userData) {
                        },
                        onwillreconnect(obj) {
                            console.log("已重连" + obj.retryCount + "次，" + obj.duration + "后将重连...");
                        },
                        ondisconnect(error) {
                            console.log("丢失连接");
                            console.log(error);
                            if(error){
                                switch(error){
                                    case 302 :console.log("账号或密码错误，请转到登录页面并提示错误");break;
                                    case 417 :console.log("重复登录，已经在其他端登录了，请跳转到登录页并提示错误");break;
                                    case 'kicked':console.log("被踢，请提示错误后跳转到登录页面"); break;
                                    default:
                                        break;
                                }
                            }
                        },
                        onerror(error){
                            console.log(error);
                        },
                        onroamingmsgs(obj) {
                           // console.log('收到漫游消息', obj);
                        },
                        onofflinemsgs() {
                           // console.log('收到离线消息', obj);
                        },
                        onmsg(msg) {
                            //console.log(msg);
                            //自定义消息

                            that.getMessageType = '';//清空回去数据类型

                      //      console.log(msg);
                            //由患者端发送-更新时间戳
                            if (msg.from.includes("0_") && that.targetData.account === msg.from) {
                                that.currentItem.createTime = that.transformMessageTime(msg.time);
                            }
                            //自定义消息
                            //新用户:
                            //       1.消息提醒
                            //

                            if (msg.type.toLowerCase() === "custom") {
                                //判断是否为新用户
                                if (JSON.parse(msg.content).type.indexOf("new-") != -1) {
                                    //消息提醒
                                    let waitingAlertList = JSON.parse(localStorage.getItem("waitingAlertList"));
                                    //1.有数据 2.{} 3.undefined

                                    if (!waitingAlertList) {
                                        waitingAlertList = {};
                                    }
                                    waitingAlertList[msg.from] = 1;
                                    localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                                    store.commit("waitingListRefreshFlag", true);
                                    that.setNewWaiting(true);
                                } else if (JSON.parse(msg.content).type == 'checkSuggestSendTips') {
                                    // that.$store.commit("waitingListRefreshFlag", true);
                                    //  that.$store.commit('resetListRefreshFlag', true);

//                                    let flag = false;
                                    that.onlineList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.from) {
                                            item.consultationState = '6';
                                            that.$store.commit("setConsultationState", "6");
                                        }
                                    });
                                    //待分诊
                                    that.waitingList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.from) {
                                            item.consultationState = '6';
                                            that.$store.commit("setConsultationState", "6");
                                        }
                                    });
                                    let resetList = that.resetList;
                                    resetList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.from) {
                                            item.consultationState = '6';
                                            that.$store.commit("setConsultationState", "6");
                                        }
                                    });
//                                    that.$store.commit('onlineListRefresh', flag);
//                                    that.$store.commit("setRefuseUserListFlag", flag);
                                    // that.$emit("update:userCurrentStatus", 3);

                                } else if (JSON.parse(msg.content).type == 'notification' && JSON.parse(msg.content).data.actionType == "5") {
                                    that.onlineList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '1';
                                            that.$store.commit("setConsultationState", "1");
                                        }
                                    });
                                    //待分诊
                                    that.waitingList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '1';
                                            that.$store.commit("setConsultationState", "1");
                                        }
                                    });
                                    let resetList = that.resetList;
                                    resetList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '1';
                                            that.$store.commit("setConsultationState", "1");
                                        }
                                    });
                                }
                                else if (JSON.parse(msg.content).type == 'notification' && JSON.parse(msg.content).data.actionType == "3") {
                                    that.onlineList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '2';
                                            that.$store.commit("setConsultationState", "2");
                                        }
                                    });
                                    //待分诊
                                    that.waitingList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '2';
                                            that.$store.commit("setConsultationState", "2");
                                        }
                                    });
                                    let resetList = that.resetList;
                                    resetList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '2';
                                            that.$store.commit("setConsultationState", "2");
                                        }
                                    });
                                }
                                else if (JSON.parse(msg.content).type == 'overtimeTip') {
                                    that.onlineList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '3';
                                            that.$store.commit("setConsultationState", "3");
                                        }
                                    });
                                    //待分诊
                                    that.waitingList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '3';
                                            that.$store.commit("setConsultationState", "3");
                                        }
                                    });
                                    let resetList = that.resetList;
                                    resetList.forEach(function (item, index) {
                                        if ("0_" + item.caseId == msg.to) {
                                            item.consultationState = '3';
                                            that.$store.commit("setConsultationState", "3");
                                        }
                                    });
                                }
                            }
                            that.receiveMessage(that.targetData.account, msg);
                            if (msg.type==="image"){
                                console.log(msg);
                                that.imageList.push(msg);
                            }
                        }
                    });
                });

            },
            loadCallback(items) {
//                console.log(items);
                if (items.scrollFlag) {
                    console.log(4)
                } else {
                    if (items) {
                        if (items.scrollFlag) {
                        } else {
                            setTimeout(() => {
                                this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
                            }, 120);
                        }
                    } else {
                        setTimeout(() => {
                            this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
                        }, 120);
                    }
                    Object.assign(items, {'scrollFlag': true});
                }
            },
            medicalReport(items) {
                let flag = true;
                if (items.type === "custom" && (items.content && items.content.type === "medicalReport")) {
//                    console.log(flag);
                    setTimeout(() => {
                        if (this.$refs.medicalReport.length === 0) {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    }, 20);
                } else {
                    flag = false;
                }
                return flag;
            },
            messageFilter(items) {
                let flag = false;
                if (items) {
                    if (items.type === "text") {
                        flag = true;
                    } else {
                        if (items.content && (items.content.type === "reTriageTip" || items.content.type === "new-health" || items.content.type === "payFinishTips")) {
                            flag = false;
                        } else {
                            flag = true;
                        }
                    }
                }
                return flag;
            },
            sendMessage(content) {
                const that = this;
                if (!that.$store.state.beingSend) {
                    return false;
                }
                //单条信息发送
                return new Promise((resolve, reject) => {
                    that.$store.commit("setSendStatus", false);

                    this.nim.sendText({
                        scene: "p2p",
                        to: that.targetData.account,
                        text: content,
                        custom: JSON.stringify({
                            cType: "0",
                            cId: that.$store.state.userId,
                            mType: "0",
                            docName: that.$store.state.userName
                        }),
                        done(error, obj) {
//                            console.log(obj);
                            that.$store.commit("setSendStatus", true);
                            if (!error) {
                                resolve(obj);
                                that.sendSingleMessage(error, obj);
                            } else {
                                nim.getInstance();
                                reject(obj);
                            }
                        }
                    });
                });
            },
            //发生拒绝分诊
            sendRefusePatient(content) {

                const that = this;
                if (!that.$store.state.beingSend) {
                    return false;
                }
                const promise = new Promise((resolve, reject) => {
                    that.$store.commit("setSendStatus", false);
                    this.nim.sendCustomMsg({
                        scene: "p2p",
                        to: that.targetData.account,
                        custom: JSON.stringify({
                            cType: "0",
                            cId: that.$store.state.userId,
                            mType: "43",
                            docName: that.$store.state.userName
                        }),
                        content: JSON.stringify({
                            text: content,
                            type: "refusePatient"
                        }),
                        done(error, obj) {
                            that.$store.commit("setSendStatus", true);
                            that.startLoading();
                            if (!error) {
                                resolve(obj);
                                that.sendSingleMessage(error, obj);
                            } else {
                                nim.getInstance();
                                reject(obj);
                            }
                        }
                    });
                });
                promise.then(function () {
                    //改变患者状态 -- 7-分诊拒绝
                    releasePatient({
                        customerId: that.userId,
                        consultationId: that.currentItem.consultationId,
                        consultationState: 7
                    }).then(res => {
                        console.log("7");
//                    let currentItem = that.$store.state.currentItem;
//                    currentItem.consultationState = 1;
//                    that.$store.commit('setCurrentItem',currentItem);
                        that.$store.commit('waitingListRefreshFlag', true);
                        that.$store.commit('onlineListRefresh', true);
                        that.$store.commit('resetListRefreshFlag', true);

                        that.$store.commit("setRefuseUserListFlag", true);


//                        let waitingList = that.$store.state.waitingList;
//                        let patientList = that.$store.state.patientList;
//                        setTimeout(() => {
//                        that.$store.commit("setInputReadOnly", true);
//
//                        that.$store.state.currentItem.triageSelect = false;
//                        that.$store.commit("waitingListRefreshFlag", true);
//                        that.$store.commit("setWaitingList", waitingList);
//
//                        let num = "";
//
//                        if (patientList.length > 0) {
//                            if (this.userOnlineActive <= patientList.length - 1) {
//                                num = this.userOnlineActive;
//                            } else {
//                                num = patientList.length - 1;
//                            }
//                            this.$emit("update:userOnlineActive", num);
//                        } else {
//                            this.$emit("update:userOnlineActive", -1);
//                            this.$emit("update:n", false);
//                            return;
//                        }
//                        this.$emit("update:userWaitingActive", -1);
//                        let items = patientList[parseInt(num)];
//
//                        this.$store.commit("setPatientId", items ? items.patientId : "");
//                        this.$store.commit("setPatientName", items ? items.patientName : "");
//                        this.$store.commit("setCaseId", items ? items.caseId : "");
//                        this.$store.commit("setConsultationId", items ? items.consultationId : "");
//                        this.$store.commit("setCurrentItem", items ? items : {});
//                        this.$store.commit("setSBIObject", "");
//
//                            store.commit("stopLoading");
//                        }, 1000);


                    })
                })
            },
            //发送单条数据...
            sendSingleMessage(error, msg) {
                this.startLoading();
                let patientListArray = this.onlineList;

                //  if (msg.content&&JSON.parse(msg.content).type !== "triagePatientTips") {
                patientListArray.removeByValue(this.$store.state.currentItem);
                patientListArray.unshift(this.$store.state.currentItem);
                //   }
                //this.$store.commit("unshift",this.$store.state.currentItem);
                //this.$store.state.patientList.removeByValue(this.$store.state.currentItem);
                //this.$store.state.patientList.unshift(this.$store.state.currentItem);
                this.setOnlineList( patientListArray);
                this.$store.state.currentItem.lastUpdateTime = this.transformMessageTime(msg.time);
                store.commit("setPatientActiveIndex", this.$store.state.patientActiveIndex + 1);
                let that = this;
                //  console.log(msg);
                console.log("发送" + msg.scene + " " + msg.type + "消息" + (!error ? "成功" : "失败") + ", id=" + msg.idClient);
                if (!error) {
                    that.controllerInput = "";
                    that.mine(msg);
                    that.loadCallback(msg);
//                    setTimeout(() => {
//                        this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
//                    }, 120);
                }
                this.stopLoading();
            },
            //发送检查检验...
            sendCheckSuggestion(data) {
                const that = this;
                return new Promise((resolve, reject) => {
                    that.nim.sendCustomMsg({
                        scene: "p2p",
                        to: that.targetData.account,
                        content: JSON.stringify({
                            data: data,
                            type: "checkSuggestion"
                        }),
                        custom: JSON.stringify({
                            cType: "0",
                            cId: that.$store.state.userId,
                            mType: "35",
                            docName: that.$store.state.userName
                        }),
                        done(error, obj) {
                            if (!error) {
                                that.sendSingleMessage(error, obj);
                                resolve(obj);
                            } else {
                                reject(obj);
                            }
                        }
                    });
                });
            },
            //发送初诊建议...
            sendPreviewSuggestion(data) {
                const that = this;
                let dataList = [{}];
                return new Promise((resolve, reject) => {
                    dataList[0] = data;
                    console.log(dataList);
                    this.nim.sendCustomMsg({
                        scene: "p2p",
                        to: that.targetData.account,
                        content: JSON.stringify({
                            data: dataList,
                            type: "previewSuggestion"
                        }),
                        custom: JSON.stringify({
                            cType: "0",
                            cId: that.$store.state.userId,
                            mType: "36",
                            docName: that.$store.state.userName
                        }),
                        done(error, obj) {
                            if (!error) {
                                that.sendSingleMessage(error, obj);
                                resolve(obj);
                            } else {
                                reject(obj);
                            }
                        }
                    });
                });
            },
            //发送视诊...
            sendVideoTriage(data) {
                const that = this;
                let tType = "";
                if (data.type == 1) {
                    tType = 2;
                } else if (data.type == 2) {
                    tType = 1;
                }
                this.nim.sendCustomMsg({
                    scene: "p2p",
                    to: that.targetData.account,
                    content: JSON.stringify({
                        data: {
                            content: data.content,
                            type: tType
                        },
                        type: "videoTriage"
                    }),
                    custom: JSON.stringify({
                        cType: "0",
                        cId: that.$store.state.userId,
                        mType: "34",
                        docName: that.$store.state.userName
                    }),
                    done(error, obj) {
                        that.sendSingleMessage(error, obj);
                    }
                });
            },
            //发送文件
            sendFile(data) {
                let that = this;
                that.startLoading();
                let promises = [];
                Array.from(data.data).forEach(function (element, index) {
                    promises.push(
                        new Promise((resolve, reject) => {
                            that.nim.previewFile({
                                type: element.type,
                                dataURL: element.data,
                                uploadprogress: function (obj) {
                                  //  console.log('文件总大小: ' + obj.total + 'bytes');
                                //    console.log('已经上传的大小: ' + obj.loaded + 'bytes');
                                  //  console.log('上传进度: ' + obj.percentage);

                                    that.percentage = parseInt(obj.percentage);
                                    console.log( that.percentage);
                                    if(obj.percentage == '100'){
                                        setTimeout(function(){
                                            that.percentage ='';
                                        },300)
                                    }
                                  //  console.log('上传进度文本: ' + obj.percentageText);
                                },
                                done: function (error, file) {
                                    console.log('上传' + element.type + (!error ? '成功' : '失败'));
                                    if (!error) {
                                        element.file = file;
                                        resolve(element);
                                    }
                                }
                            })
                        })
                    )
                });

                Promise.all(promises).then((element) => {

                    element.forEach(function (element, index) {

                        let mType = 0;

                        if (element.type === "file") {
                            element.file.name = element.name;
                            mType = 6
                        } else if (element.type === "video") {
                            element.file.name = element.name;
                            mType = 3
                        } else {
                            mType = 1
                        }
                        let msg = that.nim.sendFile({
                            scene: 'p2p',
                            to: that.targetData.account,
                            custom: JSON.stringify({
                                cType: "0",
                                cId: that.$store.state.userId,
                                mType: mType,
                                name: element.name,
                                docName: that.$store.state.userName
                                //,
//                            conId: that.orderSourceIdorderSourceId
                            }),
                            file: element.file,
                            type: element.type,
                            done(error, msg) {
                                that.stopLoading();
                                that.sendSingleMessage(error, msg);
                            }
                        });
                        console.log('正在发送p2p ' + element.type + '消息, id=' + msg.idClient);
                    });
                });
            },
            //重新发送
            resendMsg(obj) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.nim.resendMsg({
                        msg: obj,
                        done(error, obj) {
                            if (!error) {
                                resolve(obj);
                                console.log(obj);
                                if (data.content) {
                                    data.content = JSON.parse(data.content);
                                }

                                _this.communicationList[idClient] = data;
                                console.log("重新发送成功");
                            } else {
                                reject(obj);
                            }
                        }
                    });
                });
            },
            //撤回
            deleteMsg(item) {
                let _this = this;
                if (!this.$store.state.isDeleteMsg ||(item.custom && JSON.parse(item.custom).cId !== _this.$store.state.userId)) {
                    _this.$store.commit("showPopup", {text: "您无权撤回此消息！"});
                    return false;
                }
                return new Promise((resolve, reject) => {
                    console.log("正在撤回消息", item);
                    this.nim.deleteMsg({
                        msg: item,
                        done(error) {
                            if (!error) {
                                console.log("撤回消息成功.....");
                                _this.communicationList.removeByValue(item);
                                resolve(item);
                            } else {
                                //  _this.$store.commit('showPopup',{'text':'撤回失败，该消息发送时间超过'+_this.$store.state.deleteMsgTime+'分钟'});
                                console.log("撤回失败.....");
                                reject(error, item);
                            }
                        }
                    });
                })
                    .then(msg => {
                        console.log(msg);
                        return new Promise((resolve, reject) => {
                            _this.nim.sendCustomMsg({
                                scene: "p2p",
                                to: _this.targetData.account,
                                custom: JSON.stringify({
                                    cType: "0",
                                    cId: _this.$store.state.userId,
                                    mType: "37",
                                    idClient: msg.idClient
                                }),
                                content: JSON.stringify({
                                    type: "deleteMsgTips",
                                    data: {
                                        from: "分诊医生",
                                        doctorName: _this.$store.state.userName,
                                        deleteMsg: msg || {}
                                    }
                                }),
                                done(error, msg) {
                                    if (msg.type === "custom") {
                                        msg.content = JSON.parse(msg.content);
                                    }

                                    console.log(msg);
                                    _this.communicationList.push(msg);
                                    if (!error) {
                                        resolve(error, msg);
                                    } else {
                                        reject(error, msg);
                                    }
                                }
                            });
                        });
                    })
                    .catch((error, msg) => {
                        console.log(error);
                        if (parseInt(error.code) === 508) {
                            _this.$store.commit("showPopup", {
                                text: "您只能撤回" + _this.$store.state.deleteMsgTime + "分钟内的消息"
                            });
                        }
                    });
            },
            //患者撤回
            ShowFlagDeleteTips(items) {
                let flag = false;
                // console.log(JSON.parse(items.content).data);
                if (items.content.data.deleteMsg.from !== "1_doctor00001") {
                    flag = true;
                    let idClient = items.content.data.deleteMsg.idClient;
                    this.communicationList.forEach((element, index) => {
                        if (element.idClient === idClient) {
                            this.communicationList.removeByValue(element);
                            return flag;
                        }
                    });
                }
                return flag;
            },
            //上滑加载
            initScroll() {
                this.$refs.messageBox.addEventListener("mousewheel", event => {
                    if (!this.allGet) {
                        let delta = event.wheelDelta;
                        clearTimeout(this._scrollTimeout);
                        this.getMessageType = "scrollInit";
                        this._scrollTimeout = setTimeout(() => {
                            if (delta > 0 && this.$refs.messageBox.scrollTop < 20) {
                                this.getMessageList();
                            }
                        }, 200)
                    }
                })
            },
            //获取历史消息……
            getMessageList() {
                let that = this;
                if (this.getMessageType === "history") {
                    that.communicationList = [];
                }
                this.imageList=[];
                // let setSBIObject =  this.$store.state.SBIObject;
                // setSBIObject.IMImage = [];
                // this.$store.commit("setSBIObject",setSBIObject);setSBIObject

                if (this.targetData.account != "0_") {
                    this.nim.getHistoryMsgs({
                        scene: "p2p",
                        to: that.targetData.account,
                        beginTime: 0,
                        endTime: that.historyBeginTime,
                        done(error, obj) {
                         //   console.log(obj);
                            if (obj.msgs.length === 0) {
                                if (that.getMessageType === "scrollInit") {
                                    that.allGet = true;
                                    that.getMessageType = false;
                                }
//                            that.$store.commit("showPopup", {text: "无聊天记录了！"});
                            } else {
                                that.renderHistoryMessage(that.targetData.account, error, obj);
                            }

                            if (error) {
                                nim.getInstance();
                            }
//                        console.log(from);

                        },
                        limit: 20
                    });
                }
            },
            // 新消息提示
            newMessageTips(target, element) {
             //   console.log(element);
                const _this = this;
                //沟通中
                let patientList = this.onlineList;
                patientList.forEach(function (item, index) {
                    if ("0_" + item.caseId == element.from) {
//                        if (typeof (item.messageAlert) == 'undefined' || item.messageAlert == "") {
//                            item.messageAlert = "1";
//                        } else {
//                            item.messageAlert = parseInt(item.messageAlert) + 1;
//                        }
                        let patientAlertList = {};
                        let caseIdInfo = "0_" + item.caseId;
                        if (element.type == 'custom' && JSON.parse(element.content).type == 'deleteMsgTips') {

                            if (typeof (item.messageAlert) == 'undefined' || item.messageAlert == "") {
                                item.messageAlert = "";
                            } else {
                                if (parseInt(item.messageAlert) > 0) {
                                    item.messageAlert = parseInt(item.messageAlert) - 1;
                                }
                            }

                            patientAlertList[caseIdInfo] = item.messageAlert;
                        } else {
                            if (typeof (item.messageAlert) == 'undefined' || item.messageAlert == "") {
                                item.messageAlert = "1";
                            } else {
                                item.messageAlert = parseInt(item.messageAlert) + 1;
                            }
                            patientAlertList[caseIdInfo] = item.messageAlert;
                            patientList.removeByValue(item);
                            patientList.unshift(item);

                        }
                        if (!localStorage.getItem("patientAlertList")) {
                            localStorage.setItem("patientAlertList", JSON.stringify(patientAlertList));
                        } else {
                            localStorage.setItem("patientAlertList", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem("patientAlertList")), patientAlertList)));
                        }
                        _this.setNewOnline(true);
                    }
                });
                this.setOnlineList(patientList);

                //带分诊
                let waitingList = this.waitingList;

                waitingList.forEach(function (item, index) {
                    let waitingAlertList = {};
                    let caseIdInfo = "0_" + item.caseId;
                    if ("0_" + item.caseId == element.from) {

                        if (element.type == 'custom' && JSON.parse(element.content).type == 'deleteMsgTips') {
                            if (typeof (item.messageAlert) == 'undefined' || item.messageAlert == "") {
                                item.messageAlert = "";
                            } else {
                                if (parseInt(item.messageAlert) > 0) {
                                    item.messageAlert = parseInt(item.messageAlert) - 1;
                                }
                            }
                            waitingAlertList[caseIdInfo] = item.messageAlert;
                        } else {
                            if (typeof (item.messageAlert) == 'undefined' || item.messageAlert == "") {
                                item.messageAlert = "1";
                            } else {
                                item.messageAlert = parseInt(item.messageAlert) + 1;
                            }
                            waitingAlertList[caseIdInfo] = item.messageAlert;
                            waitingList.removeByValue(item);
                            waitingList.unshift(item);

                        }
                        if (!localStorage.getItem("waitingAlertList")) {
                            localStorage.setItem("waitingAlertList", JSON.stringify(waitingAlertList));
                        } else {
                            localStorage.setItem("waitingAlertList", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem("waitingAlertList")), waitingAlertList)));
                        }

                        _this.setNewWaiting(true);
                    }
                });
                this.$store.commit("setWaitingList", waitingList);

                //重新分诊
                let resetList = this.resetList;
                resetList.forEach(function (item, index) {
                    if ("0_" + item.caseId == element.from) {
//                        if (typeof (item.messageAlert) == 'undefined' || item.messageAlert == "") {
//                            item.messageAlert = "1";
//                        } else {
//                            item.messageAlert = parseInt(item.messageAlert) + 1;
//                        }
                        let resetAlertList = {};
                        let caseIdInfo = "0_" + item.caseId;
                        if (element.type == 'custom' && JSON.parse(element.content).type == 'deleteMsgTips') {
                            if (typeof (item.messageAlert) == 'undefined' || item.messageAlert == "") {
                                item.messageAlert = "";
                            } else {
                                if (parseInt(item.messageAlert) > 0) {
                                    item.messageAlert = parseInt(item.messageAlert) - 1;
                                }
                            }
                            resetAlertList[caseIdInfo] = item.messageAlert;
                        } else {
                            if (typeof (item.messageAlert) == 'undefined' || item.messageAlert == "") {
                                item.messageAlert = "1";
                            } else {
                                item.messageAlert = parseInt(item.messageAlert) + 1;
                            }
                            resetAlertList[caseIdInfo] = item.messageAlert;
                            resetList.removeByValue(item);
                            resetList.unshift(item);
                        }
                        if (!localStorage.getItem("resetAlertList")) {
                            localStorage.setItem("resetAlertList", JSON.stringify(resetAlertList));
                        } else {
                            localStorage.setItem("resetAlertList", JSON.stringify(Object.assign(JSON.parse(localStorage.getItem("resetAlertList")), resetAlertList)));
                        }


                        _this.setNewReset(true);
                    }
                });
            },
            getImageList(){
                this.communicationList.forEach((element,index)=>{
                    if (element.type==="image"){
                        this.imageList.push(element);
                    }
                })

            },
            //接受消息...
            receiveMessage(targetUser, element, from) {
                //获取当前患者消息
                const _this = this;

                if ((element.from.includes("0_") && targetUser === element.from) || (element.to.includes("0_") && targetUser === element.to)) {
                    if (element.type === "custom") {
                        element.content = JSON.parse(element.content);
                    }


                    if (this.getMessageType === "scrollInit") {
                        this.communicationList.unshift(element);
                    } else if (this.getMessageType === "history") {
                        this.loadCallback(element);
                        this.communicationList.unshift(element);
                        // _this.initScroll();
                    } else {
//                        console.log("11111");
                        this.loadCallback(element);
                        this.communicationList.push(element);
                    }
//                        console.log( this.communicationList);

                } else {
                    //接诊列表
                    this.newMessageTips(targetUser, element);
                }
            },
            //输出历史消息...
            renderHistoryMessage(container, error, obj) {
                let that = this;
                if (!error) {
                    // obj.msgs.reverse();

                    let timeFlag = false;
                    let prvObj = {};
                    for (let i = 0; i < obj.msgs.length; i++) {
                        let data = {
                            dataList: []
                        };
                        if (i == obj.msgs.length - 1) {
                            that.historyBeginTime = obj.msgs[i].time
                        }
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

                        that.receiveMessage(container, obj.msgs[i]);
                    }
//                    console.log(obj.msgs.length);
                    if (this.getMessageType === "scrollInit") {
                        that.startLoading();
                        // setTimeout(() => {
                        //     let allHeight = 0;
                        //     $(".messageList-item-content").each(function (index, item) {
                        //         if (index < obj.msgs.length + 1) {
                        //             allHeight += parseInt(item.offsetHeight)
                        //         }
                        //     });
                        //     this.$refs.messageBox.scrollTop = (allHeight + 210);
                        //     that.$store.commit("stopLoading");
                        // }, 1000);
                        that.stopLoading();
                    }

                    that.getImageList();
                }
            },
            transformMessageTime(time) {
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
                    day1 =
                        normalTime(time).y +
                        "-" +
                        normalTime(time).m +
                        "-" +
                        normalTime(time).dd,
                    day2 =
                        normalTime(now).y +
                        "-" +
                        normalTime(now).m +
                        "-" +
                        normalTime(now).dd;
                if (day1 === day2) {
                    result = normalTime(time).h + ":" + normalTime(time).mm;
                } else if (normalTime(time).y === normalTime(now).y) {
                    result =
                        normalTime(time).m +
                        "月" +
                        normalTime(time).dd +
                        "日  " +
                        normalTime(time).h +
                        ":" +
                        normalTime(time).mm;
                } else if (normalTime(time).y !== normalTime(now).y) {
                    result =
                        normalTime(time).y +
                        "年" +
                        normalTime(time).m +
                        "月" +
                        normalTime(time).dd +
                        "日  " +
                        normalTime(time).h +
                        ":" +
                        normalTime(time).mm;
                }
                return result;
            },
            //消息时间转换...
            transformMessageTime(time) {
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
                    day1 =
                        normalTime(time).y +
                        "-" +
                        normalTime(time).m +
                        "-" +
                        normalTime(time).dd,
                    day2 =
                        normalTime(now).y +
                        "-" +
                        normalTime(now).m +
                        "-" +
                        normalTime(now).dd;
                if (day1 === day2) {
                    result = normalTime(time).h + ":" + normalTime(time).mm;
                } else if (normalTime(time).y === normalTime(now).y) {
                    result =
                        normalTime(time).m +
                        "月" +
                        normalTime(time).dd +
                        "日  " +
                        normalTime(time).h +
                        ":" +
                        normalTime(time).mm;
                } else if (normalTime(time).y !== normalTime(now).y) {
                    result =
                        normalTime(time).y +
                        "年" +
                        normalTime(time).m +
                        "月" +
                        normalTime(time).dd +
                        "日  " +
                        normalTime(time).h +
                        ":" +
                        normalTime(time).mm;
                }
                return result;
            },
            //查看大图
            showBigImgFunction() {
                this.$store.commit("setSBIFlag", true);
            },
            //渲染IM
            mine: function (data) {
                if (data.content) {
                    data.content = JSON.parse(data.content);
                }
//                console.log(data);
                this.communicationList.push(data);
            },
            showNext(type, index) {
                if (type == "FirstIndex") {
                    if (this.FirstIndex == index) {
                        this.FirstIndex = -1;
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1;
                    } else {
                        this.FirstIndex = index;
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1;
                    }
                } else if (type == "SecondIndex") {
                    if (this.SecondIndex == index) {
                        this.SecondIndex = -1;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1;
                    } else {
                        this.SecondIndex = index;
                        this.ThirdIndex = -1;
                        this.FourIndex = -1;
                    }
                } else if (type == "ThirdIndex") {
                    if (this.ThirdIndex == index) {
                        this.ThirdIndex = -1;
                        this.FourIndex = -1;
                    } else {
                        this.ThirdIndex = index;
                        this.FourIndex = -1;
                    }
                } else if (type == "FourIndex") {
                    if (this.FourIndex == index) {
                        this.FourIndex = -1;
                    } else {
                        this.FourIndex = index;
                    }
                }
            },
            //获取文件类型 做旧数据发送图片格式为file的兼容性
            getFileType(file) {
                if (/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.ext)) {
                    return true;
                } else {
                    return false;
                }
            },
            showDate(value) {
                console.log(value);
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "./scss/base.scss";
    @import "./scss/modules/_popup.scss";
    /*@import "./scss/modules/_ImMedicalRecord.scss";*/
    /*@import "./scss/modules/_masker.scss";*/

    .messageList-box {
        padding: 40px 25px;
        height: 82% !important;
        overflow: auto;
        background-color: #f6f9fa;
        margin-left: 1px;
        box-sizing: border-box;
        @include query(1500px) {
            &.waitingBoxStyle {
                height: 105.5% !important;
            }
            height: 81% !important;
        }
        &.waitingBoxStyle {
            height: 105.5%;
        }
        .messageList-item {
            position: relative;
            zoom: 1;
            overflow: hidden;
            margin-bottom: 20px;

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
                        margin-top: 20px;
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
                    position: relative;
                    & > img {
                        width: 100%;
                        height: 100%;
                        vertical-align: top;
                        border-radius: 50%;
                    }
                    &:hover {
                        .deleteMessage {
                            display: block;
                        }
                    }
                    .deleteMessage {
                        display: none;
                        width: 35px;
                        padding: 2px 2px;
                        height: 15px;
                        position: absolute;
                        right: -2px;
                        top: 35px;
                        border-radius: 4px;
                        text-align: center;
                        line-height: 15px;
                        font-size: 14px;
                        background: #fff;
                        color: #000000;
                        box-shadow: 0 0 8px 0 rgba(153, 167, 208, 0.35);
                        cursor: pointer;
                    }
                    .messageList-item-nameTop {
                        position: absolute;
                        top: -5px;
                        height: 20px;
                        display: block;
                        right: 100%;
                        font-size: 14px;
                        line-height: 14px;
                        width: 500px;
                        padding-right: 24px;
                    }
                }
                .messageList-item-multiple {
                    max-width: none !important;
                }
                .messageList-item-text {
                    display: inline-block;
                    vertical-align: top;
                    max-width: 80%;
                    padding: 7px 12px;
                    /*box-sizing: border-box;*/
                    font-size: 14px;
                    box-sizing: content-box;
                    @include query(1500px) {
                        font-size: 16px;
                    }
                    margin: 0 24px;
                    line-height: 1.5;
                    border-radius: 5px;
                    word-break: break-all;
                    @include query(1500px) {
                        margin: 0 12px;
                    }
                }

            }
            .deleteMessage {
                color: #ccc;
                font-size: 14px;
                text-align: center;
            }
        }
        &::-webkit-scrollbar {
            background-color: #f6f9fa;
        }
    }

    .user-controller {
        @include query(1500px) {
            height: 200px;
        }
    }

    .messageList-targetName {
        background: rgba(255, 255, 255, 0.97);
        box-shadow: 0 1px 1px 0 #eceff6;
        position: absolute;
        top: 0;
        height: 5.5%;
        min-height: 55px;
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
                color: #00beaf;
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
        margin: 20px 24px 0 !important;
        overflow: hidden;
        text-align: left;
        @include query(1500px) {
            margin: 20px 12px 0 !important;
        }
        .check-suggestion-message-title {
            background: #a6c7ee;
            font-size: 12px;
            color: #ffffff;
            height: 25px;
            line-height: 25px;
            padding-left: 15px;
            box-sizing: border-box;
            border-radius: 4px 0 0 4px;
            margin-bottom: 10px;
            &.previewSuggestion {
                margin-bottom: 0;
                border-radius: 25px 0 0 0;
            }
            &.videoTriage {
                margin-bottom: 0;
                border-radius: 25px 0 0 0;
            }
        }
        .check-suggestion-content {
            background: #ffffff;
            border: 1px solid #96c0f3;
            padding: 8px 25px;
            box-sizing: border-box;
            border-bottom-right-radius: 20px;
            position: relative;

            &:after {
                content: "上传";
                display: block;
                width: 30px;
                height: 25px;
                position: absolute;
                background: #a6c7ee;
                right: 0;
                bottom: 0;
                border-bottom-right-radius: 20px;
                border-top-left-radius: 20px;
                font-size: 11px;
                color: #ffffff;
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
                    content: "";
                    display: inline-block;
                    vertical-align: middle;
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: #91b0d4;
                    position: absolute;
                    margin-top: 7px;
                }
            }
        }
    }

    .preview-suggestion-content {
        background: #ffffff;
        border: 1px solid #8dc0f9;
        display: table;
        width: 100%;
        box-sizing: border-box;
        .preview-suggestion-img {
            display: table-cell;
            vertical-align: middle;
            padding: 20px 0;
            width: 77px;
            height: 100%;
            background: #e4f0fd;
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

            display: table-cell;
            /*width: 100%;*/
            vertical-align: middle;
            /*max-width: 245px;*/
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
        color: #aaaaaa;
        margin-bottom: 10px;
        /*margin-top: 40px;*/
        text-align: center;
    }

    .fadeDown-enter-active {
        transition: all ease-in-out 0.5s;
    }

    .fadeDown-enter {
        opacity: 0;
        transform: translateY(-50%);
    }
    .percentage{
        z-index: 10;
    }
</style>
