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
                    {{$store.state.currentItem.createTime.substring(0, $store.state.currentItem.createTime.length - 2)}}</p>
                <p class="time-stamp" v-if="$store.state.currentItem.returnReason">
                    {{`由于${$store.state.currentItem.returnReason}，该患者被${$store.state.currentItem.doctorName ? $store.state.currentItem.doctorName + '医生' : ''}退回`}}
                </p>
                <transition-group name="fadeDown" tag="article">
                    <article class="messageList-item"
                             :class="[ items.from == '1_doctor00001' ? 'my-message' : 'others-message']"
                             v-for="(items,index) in communicationList" v-if="messageFilter(items)" :key="index">
                        <!--时间戳-->
                        <p class="time-stamp"
                           v-if="!(items.type==='custom'&&(items.custom&&(items.custom.mType==='33'||items.custom.mType==='22'||items.custom.mType==='24')))">
                            {{items.time | transformMessageTime}}</p>
                        <!--文本消息-->
                        <ContentElement v-if="items.type==='text'" :message="items" @deleteMsg="deleteMsg(items)"></ContentElement>
                        <!--图片消息-->
                        <ImageElement v-if="items.type === 'file'" :message="items" :nim="nim"
                                      @loadCallback="loadCallback"></ImageElement>
                        <!--检查检验-->

                        <CheckSuggestion
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='checkSuggestion')"
                                :message="items" @deleteMsg="deleteMsg(items)"></CheckSuggestion>
                        <!--问诊单-->
                        <MedicalReport v-if="medicalReport(items)"
                                       :message="items" ref="medicalReport"
                                       @loadCallback="loadCallback"></MedicalReport>
                        <!--视诊-->
                        <VideoTriage v-if="items.type==='custom'&&(items.content&&items.content.type==='videoTriage')"
                                     :message="items"></VideoTriage>
                        <!--初诊建议-->
                        <PreviewSuggestion
                                v-if="items.type==='custom'&&(items.content&&items.content.type==='previewSuggestion')"
                                :message="items"  @deleteMsg="deleteMsg(items)"></PreviewSuggestion>
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
                        <!--消息撤回-->
                        <section v-if="items.type==='custom'&&items.content.type==='deleteMsgTips'" class="deleteMessage">
                                您撤回了一条消息！
                        </section>
                    </article>
                </transition-group>
            </article>
        </section>
    </section>
</template>
<script>
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
    import api from "@/common/js/util";

    import nimEnv from "@/base/nimEnv";

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

    const XHRList = {
        watingUserList: "/call/customer/case/consultation/v1/getMapListForCase/"
    };
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
                medicalReportImgList: [],
                ShowBigImgList: [],
                diagnosisId: "",
                diagnosisShow: false,
                connectFlag: false
            };
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
                    store.commit("sendCheckSuggestionFlag", {
                        flag: false,
                        data: {}
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
                    return;
                } else {
                    this.targetData = {
                        account: "0_" + id
                    };
                    this.getMessageList("history");
                }
            },
            connectFlag(flag) {
                if (!flag) {
                    return;
                } else {
                    this.targetData = {
                        account: "0_" + this.$store.state.caseId
                    };
                    this.getMessageList("history");
                }
            },
            "$store.state.resendMsgInfo"(obj) {
                this.resendMsg(obj);
            },
//            "$store.state.deleteMsgInfo"(obj){
//                this.deleteMsg(obj);
//            }
        },
        computed: {},
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let that = this;
                that.connectFlag = false;
                nimEnv().then((nimKey) => {
                    this.nim = nim.getInstance({
                        //debug: true,
                        appKey: nimKey,
                        account: that.userData.account,
                        token: that.userData.token,
                        onconnect(data) {
                            console.log("连接成功");
                            that.connectFlag = true;
                        },
                        onmyinfo(userData) {
                        },
                        onwillreconnect(obj) {
                            console.log("已重连" + obj.retryCount + "次，" + obj.duration + "后将重连...");
                        },
                        ondisconnect(error) {
                            console.log("丢失连接");
                            console.log(error);
                        },
                        onerror: this.onError,
                        onroamingmsgs(obj){
                            console.log(obj);
                        },
                        onofflinemsgs(){
                             console.log(obj);
                        },
                        onmsg(msg) {
                            //自定义消息
                            console.log(msg);
                            if (msg.from.includes("0_") && that.targetData.account === msg.from) {
                                that.$store.state.currentItem.createTime = that.transformMessageTime(
                                    msg.time
                                );
                            }
                            if (msg.type.toLowerCase() === "custom") {
                                //判断是否为新用户
                                if (JSON.parse(msg.content).type.indexOf("new-") != -1) {
                                    //消息提醒
                                    let waitingAlertList = JSON.parse(
                                        localStorage.getItem("waitingAlertList")
                                    );
                                    if (!waitingAlertList) {
                                        waitingAlertList = {};
                                    }
                                    waitingAlertList[msg.from] = 1;
                                    localStorage.setItem(
                                        "waitingAlertList",
                                        JSON.stringify(waitingAlertList)
                                    );

                                    store.commit("watingListRefreshFlag", true);
                                    store.commit("setNewWating", true);
                                    store.commit("setMusicPlay", true);

                                }
                            }
                            that.receiveMessage(that.targetData.account, msg);
                        }
                    });
                });

            },
            loadCallback() {
                setTimeout(() => {
                    this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
                }, 120);
            },
            medicalReport(items) {
                let flag = true;
                if (
                    items.type === "custom" &&
                    (items.content && items.content.type === "medicalReport")
                ) {
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
                        if (
                            items.content &&
                            (items.content.type === "reTriageTip" ||
                                items.content.type === "new-health" ||
                                items.content.type === "notification" ||
                                items.content.type === "payFinishTips")
                        ) {
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
                            console.log(obj);
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
            //发送单条数据...
            sendSingleMessage(error, msg) {
                let patientListArray = this.$store.state.patientList;
                patientListArray.removeByValue(this.$store.state.currentItem);
                patientListArray.unshift(this.$store.state.currentItem);
                //                this.$store.commit("unshift",this.$store.state.currentItem);
                //this.$store.state.patientList.removeByValue(this.$store.state.currentItem);
                //this.$store.state.patientList.unshift(this.$store.state.currentItem);
                this.$store.commit("setPatientList", patientListArray);
                this.$store.state.currentItem.createTime = this.transformMessageTime(
                    msg.time
                );
                store.commit(
                    "setPatientActiveIndex",
                    this.$store.state.patientActiveIndex + 1
                );
                let that = this;
                console.log(msg);
                console.log(
                    "发送" +
                    msg.scene +
                    " " +
                    msg.type +
                    "消息" +
                    (!error ? "成功" : "失败") +
                    ", id=" +
                    msg.idClient
                );
                if (!error) {
                    that.controllerInput = "";
                    that.mine(msg);
                    setTimeout(() => {
                        this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
                    }, 120);
                }
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
                return new Promise((resolve, reject) => {
                    console.log('正在撤回消息', item);
                    this.nim.deleteMsg({
                        msg: item,
                        done(error) {
                            if (!error) {
                                console.log("撤回消息成功.....");
                                _this.communicationList.removeByValue(item);
                                resolve(item)
                            } else {
                                //_this.$store.commit('showPopup',{'text':'撤回失败，该消息发送时间超过'+_this.$store.state.deleteMsgTime+'分钟'});
                                console.log("撤回失败.....");
                                reject(error,item)

                            }
                        }
                    })
                }).then(msg=>{
                        console.log(msg);
                    return new Promise((resolve,reject)=>{
                        _this.nim.sendCustomMsg({
                            scene:"p2p",
                            to:_this.targetData.account,
                            custom:JSON.stringify({
                                cType: "0",
                                cId: _this.$store.state.userId,
                                mType: "36"
                            }),
                            content:JSON.stringify({
                                type: "deleteMsgTips",
                                data: {
                                    from: "分诊医生",
                                    deleteMsg: msg || {}
                                }
                            }),
                            done(error,msg){
                                if (msg.type === "custom") {
                                    msg.content = JSON.parse(msg.content);
                                }

                                console.log(msg);
                                _this.communicationList.push(msg);
                            if(!error){
                                resolve(error,msg);
                            }else{
                                reject(error,msg)
                            }
                           }
                        })
                    })
                }).catch((error,msg)=>{
                    console.log(error);
                    if(parseInt(error.code)=== 508){
                        _this.$store.commit('showPopup',{'text':'您只能撤回'+_this.$store.state.deleteMsgTime+'分钟内的消息'});
                    }
                });
            },
            //获取历史消息……
            getMessageList(from) {
                let that = this;
                that.communicationList = [];
                this.nim.getHistoryMsgs({
                    scene: "p2p",
                    to: that.targetData.account,
                    done(error, obj) {
                        console.log(error);
                        if (error) {
                            nim.getInstance();
                        }
                        that.renderHistoryMessage(that.targetData.account, error, obj, from);
                    },
                    limit: 100
                });
            },
            // 新消息提示
            newMessageTips(target, element) {
                const _this = this;
                let patientList = this.$store.state.patientList;
                patientList.forEach(function (item, index) {
                    if ("0_" + item.caseId == element.from) {
                        if (item.messageAlert == "") {
                            item.messageAlert = "1";
                        } else {
                            item.messageAlert = parseInt(item.messageAlert) + 1;
                        }

                        let caseIdInfo = "0_" + item.caseId;
                        let patientAlertList = {};
                        patientAlertList[caseIdInfo] = item.messageAlert;
                        patientList.removeByValue(item);
                        patientList.unshift(item);

                        localStorage.setItem(
                            "patientAlertList",
                            JSON.stringify(patientAlertList)
                        );
                        _this.$store.commit("setNewOnline", true);
                        _this.$store.commit("setMusicPlay", true);
                        setTimeout(function () {
                            _this.$store.commit("setMusicPlay", false);
                        }, 2000);
                    }
                });
                this.$store.commit("setPatientList", patientList);

                //等待列表
                let watingList = this.$store.state.watingList;
                watingList.forEach(function (item, index) {
                    if ("0_" + item.caseId == element.from) {
                        if (item.messageAlert == "") {
                            item.messageAlert = "1";
                        } else {
                            item.messageAlert = parseInt(item.messageAlert) + 1;
                        }
                        let caseIdInfo = "0_" + item.caseId;
                        let waitingAlertList = {};
                        waitingAlertList[caseIdInfo] = item.messageAlert;

                        watingList.removeByValue(item);
                        watingList.unshift(item);

                        localStorage.setItem(
                            "waitingAlertList",
                            JSON.stringify(waitingAlertList)
                        );
                        _this.$store.commit("setNewWating", true);
                        _this.$store.commit("setMusicPlay", true);
                        setTimeout(function () {
                            _this.$store.commit("setMusicPlay", false);
                        }, 2000);
                    }
                });
                this.$store.commit("setWaitingList", watingList);
            },
            //接受消息...
            receiveMessage(targetUser, element) {
                //获取当前患者消息
                const _this = this;

                if (
                    (element.from.includes("0_") && targetUser === element.from) ||
                    (element.to.includes("0_") && targetUser === element.to)
                ) {
                    if (element.type === "custom") {
                        element.content = JSON.parse(element.content);
                    }

                    this.communicationList.push(element);
                    setTimeout(() => {
                        this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
                    }, 120);
                } else {
                    //接诊列表
                    this.newMessageTips(targetUser, element);
                }
            },
            //输出历史消息...
            renderHistoryMessage(container, error, obj, from) {
                console.log(obj);
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
                console.log(data);
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
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "./scss/base.scss";
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
            height: 73% !important;;
        }
        &.watingBoxStyle {
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
                    &:hover{
                        .deleteMessage{
                            display:block;
                        }
                    }
                    .deleteMessage{
                        display: none;
                        width:35px;
                        padding:2px 2px;
                        height:15px;
                        position: absolute;
                        right:-2px;
                        top:35px;
                        border-radius: 4px;
                        text-align: center;
                        line-height: 15px;
                        font-size: 14px;
                        background: #fff;
                        color:#000000;
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
                .messageList-item-text {
                    display: inline-block;
                    vertical-align: top;
                    max-width: 80%;
                    padding: 7px 12px;
                    box-sizing: border-box;
                    font-size: 14px;
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
            .deleteMessage{
                color:#ccc;
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
            border-radius: 4px  0  0 4px;
            margin-bottom:10px;
         &.previewSuggestion{
             margin-bottom:0;
             border-radius: 25px 0 0 0 ;
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
</style>
