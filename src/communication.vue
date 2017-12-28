<template>
    <section class="center-inner-message" id="communication">
        <section class="layout-helper">
            <figure class="center-inner-wrapper">
                <img src="./assets/img00/index/logo_empty bg.png" alt="">
            </figure>
            <BaseIm ref="baseImComponent" :userCurrentStatus.sync="userCurrentStatus"></BaseIm>
            <section class="user-controller" v-show="!$store.state.inputReadOnly">
                <nav class="user-controller-fastBtn" data-template="tpl-fastReply">
                    <button class="user-controller-fastReply" @click.stop="fastRely()">
                        <i class="icon-fastReply"></i>
                        <span>快捷提问</span>
                    </button>
                    <button class="user-controller-result" @click.stop="usedRely()">
                        <i class="icon-userReply"></i>
                        <span>常用回复</span>
                    </button>
                    <button class="user-controller-min" @click.stop="minBtnShow()">
                        <i class="icon-userReply"></i><span>更多</span>
                        <div :class="[{'on':!(userCurrentStatus== 3 ?  false: true)},'sendList']" v-show="minBtnFlag">
                            <ul>
                                <li class="min-1" @click="examine()">检查检验</li>
                                <li @click="refuseEvent()" v-show="userCurrentStatus== 3 ?  false: true">拒绝分诊</li>
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
                    <button class="user-controller-end" @click="reTriageShow=true" v-show="userCurrentStatus== 3 ?  false: true">
                        <i class="icon-finish"></i>
                        <span>结束沟通</span>
                    </button>
                    <!--<button class="user-controller-check" @click.stop="sendFile">-->
                        <!--<i class="icon-finish"></i>-->
                        <!--<span>发送视图</span>-->
                    <!--</button>-->

                    <!--快捷提问-->
                    <transition name="fade">
                        <fast-Rely v-if="$store.state.fastReplyShow" :controllerInputStatus.sync="controllerInputStatus"
                                   :fastRelyStatus.sync="fastRelyStatus"></fast-Rely>
                    </transition>
                    <!--常用回复-->
                    <transition name="fade">
                        <used-Rely v-if="$store.state.usedReplyShow" :usedRelyStatus.sync="usedRelyStatus"></used-Rely>
                    </transition>
                    <transition name="fade">
                        <SmallConfirm @ensureCallback="reTriageComfirm" :comfirmContent="reTriageContentTips"
                                      @cancelCallback="reTriageShow=false" v-if="reTriageShow"></SmallConfirm>
                    </transition>
                </nav>
                <article class="user-controller-middle">
                    <textarea name="" id="" cols="" rows="" class="user-controller-input" v-model="controllerInput"
                              @keydown="sendMessage($event)" :readonly="$store.state.inputReadOnly" @input="$store.state.usedReplyContent=controllerInput"></textarea>
                </article>
                <footer class="user-controller-footer" v-if="!waitingTriage">
                    <span class="user-send-message">按下Enter发送</span>
                    <button class="btn-primary user-controller-send-btn" @click="sendMessage">
                        <span>发送</span>
                        <img :class="{'send-loading':!$store.state.beingSend}" v-if="!$store.state.beingSend" src="/static/img/img00/common/save_complete.png" alt="loading...">
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
            <fast-Reply-Config v-if="$store.state.fastReplyConfig"></fast-Reply-Config>
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
        <section :class="{on:$store.state.previewType == 2,'main-masker':$store.state.previewType == 2}"
                 v-if="$store.state.previewShow">
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
import fastRely from "./components/fast_reply";
import usedRely from "./components/used_rely";
import fastReplyConfig from "./components/fast_reply_config";
import UsedReplyConfig from "./components/usedReplyConfig";
import CheckSuggestion from "./components/suggestParts/CheckSuggestion";
import ExamineCheck from "./components/suggestParts/ExamineCheck";
import PreviewSuggestion from "./components/suggestParts/previewSuggestion";
import BaseIm from "./baseIm";
import triagePatient from "@/base/triagePatient";
import releasePatient from "@/base/releasePatient";
import ShowBigImg from "./common/ShowBigImg";
import ShowVideo from "./common/ShowVideo";
import ShowVideoList from "./common/ShowVideoList";
import store from "@/store/store";
import sendFile from "@/components/imParts/sendFile";
import refuse from "@/components/imParts/refuse";

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
      fastRelyStatus: "", //快捷提问是否能点击
      SBIFlag: false,
      usedRelyStatus: false, //常用回复是否能点击
      fastReplyConfig: false,
      reTriageShow: false,
      reTriageContentTips: "确定结束与该患者的沟通吗？",
      inputReadOnly: "",
      sendFlag:false,
      minBtnFlag:false,
      userCurrentStatus:''
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
    refuse
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
    "$store.state.patientId"(content){
          this.userCurrentStatus = this.userListStatus.status;
    },
    userCurrentStatus(content){
        console.log(content);
        if(this.userCurrentStatus == 3){
        this.$emit("update:userListStatus", {
            first: false,
            second: false,
            third: true,
            status:3
        });
        }
      }
  },
  methods: {
    //初始化
    init() {
        console.log(this.userListStatus.status);
        this.userCurrentStatus = this.userListStatus.status;
    },
    sendMessage(e) {
      const that = this;
      let baseFn = function() {
        if (that.controllerInput.trim().length === 0) {
            e.preventDefault();
            return;
        } else {
          if (that.controllerInputStatus == 0) {
            that.$refs.baseImComponent
              .sendMessage(that.controllerInput)
              .then(obj => {
                that.controllerInput = "";
                store.commit("setFastReply", "");
                store.commit("setUesdReply", "");
              });
          } else {
            store.commit("videoTriageSender", {
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
      if (this.$store.state.fastReplyShow) {
        flag = false;
      } else {
        flag = true;
        store.commit("setUsedReplyShow", false);
      }
      store.commit("setFastReplyShow", flag);
    },
    //常用回复
    usedRely() {
      let flag = true;
      if (this.$store.state.usedReplyShow) {
        flag = false;
      } else {
        flag = true;
        store.commit("setFastReplyShow", false);
      }
      store.commit("setUsedReplyShow", flag);
    },

    //患者转移至其他分诊医生：
    reTriageComfirm() {
      let consultationId = [];
      let waitingList = this.$store.state.waitingList;
      let patientList = this.$store.state.patientList;

      store.commit("startLoading");
      releasePatient({
        customerId: this.$store.state.userId,
        consultationId: this.$store.state.currentItem.consultationId,
        consultationState:5
      }).then(res => {
        store.commit("setReleasePatientCaseIdFlag", {
          caseId: this.$store.state.caseId,
          flag: true
        });
        this.reTriageShow = false;
        setTimeout(() => {
          patientList.removeByValue(this.$store.state.currentItem);
          this.$store.state.currentItem.triageSelect = false;
          store.commit("waitingListRefreshFlag", true);
          store.commit("setWaitingList", waitingList);

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
            return;
          }
          this.$emit("update:userWaitingActive", -1);
          let items = patientList[parseInt(num)];

          this.$store.commit("setPatientId", items ? items.patientId : "");
          this.$store.commit("setPatientName", items ? items.patientName : "");
          this.$store.commit("setCaseId", items ? items.caseId : "");
          this.$store.commit("setConsultationId", items ? items.consultationId : "");
          this.$store.commit("setCurrentItem", items ? items : {});
          this.$store.commit("setSBIObject", "");

          store.commit("stopLoading");
        }, 1000);
      });
    },

    //患者接诊
    getPatient() {
      let currentItem = this.$store.state.currentItem;
      let waitingList = this.$store.state.waitingList;
      let patientList = this.$store.state.patientList;
      triagePatient({
        consultationId: this.$store.state.consultationId,
        customerId: this.$store.state.userId
      })
        .then(res => {
          this.$emit("update:waitingTriage", false);

          waitingList.removeByValue(currentItem);
          patientList.unshift(currentItem);

          store.commit("setPatientList", patientList);
          store.commit("setWaitingList", waitingList);
          store.commit("setInputReadOnly", false);
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
    }
  },
  mounted() {
    this.init();
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
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
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
