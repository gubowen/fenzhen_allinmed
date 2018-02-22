<template>

    <section class="center-inner-message" id="communication">
        <section class="layout-helper">
            <figure class="center-inner-wrapper">
                <img src="/static/image/img00/index/logo_empty bg.png" alt="">
            </figure>
            <BaseIm ref="baseImComponent"></BaseIm>
            <section class="user-controller" v-show="!inputReadOnly">
                <nav class="user-controller-fastBtn" data-template="tpl-fastReply">
                    <button class="user-controller-fastReply" @click.stop="fastRely()">
                        <i class="icon-fastReply"></i>
                        <span>快捷提问</span>
                    </button>
                    <button class="user-controller-result" @click.stop="usedRely()" v-show="$store.state.isTalk">
                        <i class="icon-userReply"></i>
                        <span>常用回复</span>
                    </button>
                    <button class="user-controller-min" @click.stop="minBtnShow()">
                        <i class="icon-userReply"></i>
                        <span>更多</span>
                        <div class="sendList" v-show="minBtnFlag">
                            <ul>
                                <li class="min-1" @click="examine()">检查检验</li>
                                <li @click="refuseEvent()">拒绝分诊</li>
                                <li @click="sendFile()">发送视图</li>
                            </ul>
                        </div>

                    </button>
                    <button class="user-controller-end" @click="suggestion()">
                        <i class="icon-suggestion"></i>
                        <span>初诊建议</span>
                    </button>
                    <button class="user-controller-check" @click="examine()">
                        <i class="icon-checkout"></i>
                        <span>检查检验</span>
                    </button>

                    <!--结束沟通-->
                    <button class="user-controller-end" @click="reTriageShowFlag=true">
                        <i class="icon-finish"></i>
                        <span>结束沟通</span>
                    </button>
                    <!--<button class="user-controller-check" @click.stop="sendFile">-->
                    <!--<i class="icon-finish"></i>-->
                    <!--<span>发送视图</span>-->
                    <!--</button>-->

                    <!--快捷提问-->
                    <transition name="fade">
                        <fast-Rely v-if="fastReplyShow" :controllerInputStatus.sync="controllerInputStatus" :fastRelyStatus.sync="fastRelyStatus"></fast-Rely>
                    </transition>
                    <!--常用回复-->
                    <transition name="fade"><used-Rely v-if="usedReplyShow" :usedRelyStatus.sync="usedRelyStatus"></used-Rely>
                    </transition>
                    <!--结束沟通-->
                    <transition name="fade">
                        <SmallConfirm @ensureCallback="reTriageConfirm"   :comfirmContent="reTriageContentTips" @cancelCallback="reTriageShowFlag=false" v-if="reTriageShowFlag && $store.state.consultationState!='1'&&$store.state.consultationState!='3'"></SmallConfirm>
                    </transition>
                    <transition name="fade">
                        <doctor-Receive @ensureCallback="doctorReceiveFn" :confirmContent="doctorReceive"  v-if="reTriageShowFlag && ($store.state.consultationState=='1'||$store.state.consultationState=='3')"></doctor-Receive>
                    </transition>
                </nav>
                <article class="user-controller-middle">
                    <textarea name="" id="" cols="" rows="" class="user-controller-input" v-model="controllerInput"
                              @keydown="sendMessage($event)" :readonly="inputReadOnly" @input="$store.state.usedReplyContent=controllerInput"></textarea>
                </article>
                <footer class="user-controller-footer" v-if="!waitingTriage">
                    <span class="user-send-message">按下Enter发送</span>
                    <button class="btn-primary user-controller-send-btn" @click="sendMessage">
                        <span>发送</span>
                        <img :class="{'send-loading':!$store.state.beingSend}" v-if="!$store.state.beingSend" src="/static/image/img00/common/save_complete.png" alt="loading...">
                    </button>
                </footer>
                <!--文件上传-->
                <send-file></send-file>
            </section>
        </section>
        <!--编辑常用回复-->
        <transition name="fade">
            <UsedReplyConfig v-if="$store.state.usedReplyConfig"></UsedReplyConfig>
        </transition>
        <!--编辑快捷提问-->
        <transition name="fade">
            <fast-Reply-Config v-if="fastReplyConfig"></fast-Reply-Config>
        </transition>
        <!--检查检验-->
        <transition name="fade">
            <examine-check v-if="$store.state.examineFlag"></examine-check>
        </transition>
        <!--初诊建议-->
        <transition name="fade">
            <Check-Suggestion v-if="$store.state.checkSuggestionFlag"></Check-Suggestion>
        </transition>
        <!--显示大图-->
        <transition name="fade">
            <show-big-Img :showBigImgFlag.sync="$store.state.SBIFlag" v-if="$store.state.SBIFlag"></show-big-Img>
        </transition>
        <!--显示视频-->
        <show-video-List  v-if="$store.state.videoListFlag"></show-video-List>
        <show-video :showBigImgFlag.sync="$store.state.videoFlag" v-if="$store.state.videoFlag"></show-video>
        <!---->
        <section :class="{on:$store.state.previewType == 2,'main-masker':$store.state.previewType == 2}" v-if="$store.state.previewShow">
            <transition name="fade">
                <PreviewSuggestion></PreviewSuggestion>
            </transition>
        </section>
        <!--拒绝分诊-->
        <refuse v-if="$store.state.refuseFlag"></refuse>
    </section>
</template>
<script>
    import SmallConfirm from "@/common/smallConfirm";
    import doctorReceive from "./common/DoctorReceive";
    import fastRely from "@/components/fast_reply";
    import usedRely from "@/components/used_rely";
    import fastReplyConfig from "@/components/fast_reply_config";
    import UsedReplyConfig from "@/components/usedReplyConfig";
    import CheckSuggestion from "@/components/suggestParts/CheckSuggestion";
    import ExamineCheck from "@/components/suggestParts/ExamineCheck";
    import PreviewSuggestion from "@/components/suggestParts/previewSuggestion";
    import BaseIm from "@/baseIm";
    import triagePatient from "@/base/triagePatient";
    import releasePatient from "@/base/releasePatient";
    import ShowBigImg from "@/common/ShowBigImg";
    import ShowVideo from "@/common/ShowVideo";
    import ShowVideoList from "@/common/ShowVideoList";
    import sendFile from "@/components/imParts/sendFile";
    import refuse from "@/components/imParts/refuse";
    import {mapGetters,mapActions} from "vuex";

    export default {
        name: "communication",
        data() {
            return {
                controllerInput: "",
                controllerInputStatus: 0,
                examineSuggest: "",
                FirstIndex: -1,
                SecondIndex: -1,
                ThirdIndex: -1,
                FourIndex: -1,
                testSuggest: "",
                examineFlag: false, //检查检验
                suggestionFlag: false,
                checkSuggestionFlag: false, //初诊建议
                tabActive: true,
                fastRelyStatus: "",    //快捷提问是否能点击
                usedRelyStatus: false, //常用回复是否能点击
                SBIFlag: false,
                fastReplyConfig: false,
                reTriageShowFlag: '',
                reTriageContentTips: "确定结束与该患者的沟通吗？",
                doctorReceive:"该患者已被接诊",
                sendFlag:false,
                minBtnFlag:false,
            };
        },
        components: {
            fastRely,
            usedRely,
            fastReplyConfig,
            CheckSuggestion,
            ExamineCheck,
            ShowBigImg,
            ShowVideo,
            ShowVideoList,
            BaseIm,
            SmallConfirm,
            PreviewSuggestion,
            UsedReplyConfig,
            sendFile,
            refuse,
            doctorReceive
        },
        computed: {
            ...mapGetters(['currentItem', 'userId', 'patientList', 'waitingList', 'resetList','onlineList','fastReplyShow','usedReplyShow','inputReadOnly']),
        },
        props: {
            m: {
                type: Object
            },
            n: {
                type: Boolean
            },

            waitingTriage: {
                type: Boolean
            },
            userListStatus: {
                type: Object
            },
            userWaitingActive: {
                type: Number
            },
            userOnlineActive: {
                type: Number
            },
            reTriageShow:{
                type:Boolean
            }
        },
        watch: {
            "$store.state.fastReplyContent"(content) {
                this.controllerInput = content;
            },
            "$store.state.usedReplyContent"(content) {
                this.controllerInput = content;
            },
            "$store.state.minBtnFlag"(content){
                this.minBtnFlag = this.$store.state.minBtnFlag;
            },
            "$store.state.refuseUserListFlag"(content){
                if(content){
                    this.userListChange();
                }
            }

        },
        mounted() {
            this.init();
        },
        methods: {
            ...mapActions(['setCaseId','setCurrentItem','setPatientId','setPatientName','setWaitingList','setOnlineList','setResetList',
                'startLoading','stopLoading','setFastReplyShow','setUsedReplyShow','setInputReadOnly']),
            //初始化
            init() {
                this.reTriageShowFlag = this.reTriageShow;
            },
            sendMessage(e) {
                const that = this;
                let baseFn = function() {
                    if (that.controllerInput.trim().length === 0) {
                        e.preventDefault();
                        return;
                    } else {
                        if (that.controllerInputStatus == 0) {
                            that.$refs.baseImComponent.sendMessage(that.controllerInput).then(obj => {
                                    that.controllerInput = "";
                                    that.$store.commit("setFastReply", "");
                                    that.$store.commit("setUesdReply", "");
                                });
                        } else {
                            that.$store.commit("videoTriageSender", {
                                flag: true,
                                data: {
                                    content: that.controllerInput,
                                    type: that.controllerInputStatus
                                }
                            });
                            that.controllerInput = "";
                            that.controllerInputStatus = 0;
                        }
                    }
                };
                if (e.keyCode) {
                    if (e.keyCode == 13) {
                        baseFn();
                    }
                } else {
                    baseFn();
                }
            },
            //出诊建议按钮
            suggestion() {
                this.$store.commit(
                    "setCheckSuggestionFlag",
                    !this.$store.state.checkSuggestionFlag
                );
            },
            //检查检验
            examine() {
                this.$store.commit("setExamineFlag", !this.$store.state.examineFlag);
            },
            //快捷提问按钮
            fastRely() {
                let flag = true;
                if (this.fastReplyShow) {
                    flag = false;
                } else {
                    flag = true;
                    this.setUsedReplyShow(false);
                }
                this.setFastReplyShow(flag);
            },
            //常用回复
            usedRely() {
                let flag = true;
                if (this.usedReplyShow) {
                    flag = false;
                } else {
                    flag = true;
                    this.setFastReplyShow(false);
                }
                this.setUsedReplyShow(flag);
            },
            //患者转移至其他分诊医生：
            reTriageConfirm() {
                releasePatient({
                    customerId: this.userId,
                    consultationId: this.currentItem.consultationId,
                    consultationState:5
                }).then(res => {
                    this.startLoading();

                    this.reTriageShowFlag = false;
                    this.$store.commit("setReleasePatientCaseIdFlag", {
                        caseId: this.caseId,
                        flag: true
                    });

                    this.userListChange();
                    this.$store.commit("setResetListRefresh", true);


                });

            },
            doctorReceiveFn(){
                this.reTriageShowFlag = false;
                this.$emit("update:n",false);
                this.$store.commit("waitingListRefreshFlag", true);
                this.$store.commit("onlineListRefresh", true);
                this.$store.commit("setResetListRefresh", true);

                this.setCurrentItem({});
                this.setPatientId("");
                this.setPatientName("");
                this.setCaseId("");
                this.$store.commit("setConsultationId","");
                this.$store.commit("setConsultationState", "");
                this.$store.commit("setSBIObject", {});
            },
            //患者接诊
            getPatient() {
                let currentItem = this.currentItem;
                let waitingList = this.waitingList;
                let patientList = this.onlineList;
                triagePatient({
                    consultationId: this.$store.state.consultationId,
                    customerId: this.userId
                })
                    .then(res => {
                        this.$emit("update:waitingTriage", false);
                        waitingList.removeByValue(currentItem);
                        patientList.unshift(currentItem);
                        this.setOnlineList(patientList);
                        this.setWaitingList(waitingList);
                        this.setInputReadOnly(false);
                        this.$emit("update:userListStatus", {
                            first: false,
                            second: true,
                            status: 2
                        });
                    })
                    .catch(res => {
                        console.log("网络异常...");
                    });
            },
            //发送文件
            sendFile(){
                this.sendFlag = !this.sendFlag;
                this.$store.commit("setSendFileShow",true);
            },
            minBtnShow(){
                this.minBtnFlag = !this.minBtnFlag;
                this.$store.commit("setMinBtnFlag",this.minBtnFlag);
            } ,
            //拒绝分诊
            refuseEvent(){
                this.$store.commit("setRefuseFlag",true);
            },
            userListChange(){
                this.startLoading();
                setTimeout(() => {this.startLoading();},100);
                setTimeout(() => {this.startLoading();},500);
                setTimeout(() => {
                    this.startLoading();
                    let patientList = this.onlineList;
                    patientList.removeByValue(this.currentItem);
                    this.setOnlineList(patientList);
                    this.$store.state.currentItem.triageSelect = false;
                    this.$store.commit("setWaitingListRefresh", true);
                    let num = "";
                    if (patientList.length > 0) {
                        if (this.userOnlineActive <= patientList.length - 1) {
                            num = this.userOnlineActive;
                        } else {
                            num = patientList.length - 1;
                        }
                        this.$emit("update:userOnlineActive", num);
                    } else {
                        this.$emit("update:userOnlineActive", -1);
                        this.$emit("update:n", false);
                        this.setCurrentItem({});
                        this.setCaseId("");
                        this.setPatientId("");
                        this.setPatientName("");
                        return;
                    }
                    this.$emit("update:userWaitingActive", -1);
                    let items = patientList[parseInt(num)];

                    this.setPatientId(items ? items.patientId : "");
                    this.setPatientName(items ? items.patientName : "");
                    this.setCaseId(items ? items.caseId : "");
                    this.$store.commit("setConsultationId", items ? items.consultationId : "");
                    this.setCurrentItem( items ? items : {});
                    this.$store.commit("setSBIObject", []);

                    this.stopLoading();
                    this.$store.commit("setRefuseUserListFlag",false);
                }, 1500);

            }
        }

    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "./scss/base.scss";
    @import "./scss/modules/_bottomBtns.scss";
    @import "./scss/modules/_middleMessageBox.scss";
    @import "./scss/modules/_ImMedicalRecord.scss";
    @import "./scss/modules/_masker.scss";
    @import "./scss/modules/_checkSuggestion.scss";
    @import "./scss/modules/_configSuggestion.scss";

    @keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    .center-inner-message {
        float: left;
        width: 100%;
        height: 100%;
        & > .layout-helper {
            margin: 0 385px 0 400px;
            position: relative;
            padding-top: 55px;
            padding-bottom: 40px;
            height: 100%;
            box-sizing: border-box;
        }
        .center-inner-wrapper {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 2px;
            background-color: #fff;
            z-index: 3;
            text-align: center;
            display: none;

            &:before {
                content: "";
                display: inline-block;
                vertical-align: middle;
                height: 100%;
            }
            & > img {
                width: 170px;
                height: 170px;
                vertical-align: middle;
            }
        }

        @include query(1440px) {
                & > .layout-helper{
                    margin: 0 385px 0 315px;
                }
        }

    }

    .no-content {
        .layout-helper {
            margin-right: 0;
        }
        .medical-record {
            display: none;
        }
        .center-inner-wrapper {
            display: block;
        }
    }

</style>
